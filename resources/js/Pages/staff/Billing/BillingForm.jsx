import InputError from '@/Components/InputError'
import { Link, useForm } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const createEmptyFrame = () => ({ name: "", price: "" })
const PREVIOUS_DUE_FRAME_NAME = "Previous Due Carry"
const emptyDueSummary = { total_due: 0, billings: [] }

const createEmptyLens = () => ({
  lensType: "",
  add: "",
  price: "",
  linkedLensIndex: "",
  right: { sph: "", cyl: "", axis: "", va: "" },
  left: { sph: "", cyl: "", axis: "", va: "" },
})

const parseAmount = (value) => Number(value || 0)
const isDueCarryFrame = (frame = {}) => `${frame.name ?? ""}`.trim() === PREVIOUS_DUE_FRAME_NAME
const removeDueCarryFrame = (frames = []) => frames.filter((frame) => !isDueCarryFrame(frame))
const getDueCarryAmount = (frames = []) => frames.reduce(
  (sum, frame) => sum + (isDueCarryFrame(frame) ? parseAmount(frame.price) : 0),
  0,
)
const isWithinWindow = (createdAt, minutes, currentTime) => {
  if (!createdAt) {
    return false
  }

  const createdAtMs = new Date(createdAt).getTime()

  if (Number.isNaN(createdAtMs)) {
    return false
  }

  return currentTime - createdAtMs < minutes * 60 * 1000
}
const upsertDueCarryFrame = (frames = [], amount = 0) => {
  const regularFrames = removeDueCarryFrame(frames)

  if (Number(amount || 0) <= 0) {
    return regularFrames
  }

  return [
    ...regularFrames,
    {
      name: PREVIOUS_DUE_FRAME_NAME,
      price: Number(amount).toFixed(2),
    },
  ]
}

const normalizeEyeValues = (eye = {}) => ({
  sph: `${eye.sph ?? ""}`.trim(),
  cyl: `${eye.cyl ?? ""}`.trim(),
  axis: `${eye.axis ?? ""}`.trim(),
  va: `${eye.va ?? ""}`.trim(),
})

const hasPrescriptionValue = (eye = {}) =>
  Object.values(normalizeEyeValues(eye)).some((value) => value !== "")

const normalizeLinkedLensIndex = (value) => {
  if (value === null || value === undefined || value === "" || value === "none") {
    return null
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const areLensEyesSame = (lens) => {
  const right = normalizeEyeValues(lens.right)
  const left = normalizeEyeValues(lens.left)
  const hasAnyValue = hasPrescriptionValue(right) || hasPrescriptionValue(left)

  if (!hasAnyValue) {
    return false
  }

  return Object.keys(right).every((key) => right[key] === left[key])
}

const getEffectiveLens = (lenses, index) => {
  const lens = lenses[index]

  if (!lens) {
    return createEmptyLens()
  }

  const linkedLensIndex = normalizeLinkedLensIndex(lens.linkedLensIndex)

  if (linkedLensIndex === null || linkedLensIndex - 1 >= index) {
    return lens
  }

  const sourceLens = getEffectiveLens(lenses, linkedLensIndex - 1)

  return {
    ...lens,
    right: { ...sourceLens.right },
    left: { ...sourceLens.left },
  }
}

const buildFormData = (billing = null) => ({
  customer_name: billing?.customer_name ?? "",
  mobile_number: billing?.mobile_number ?? "",
  order_date: billing?.order_date ?? "",
  delivery_date: billing?.delivery_date ?? "",
  discount: billing?.discount ?? "0",
  advance_paid: billing?.advance_paid ?? "0",
  frames: billing?.frames?.length
    ? billing.frames.map((frame) => ({
        name: frame.name ?? "",
        price: frame.price ?? "",
      }))
    : [],
  lenses: billing?.lenses?.length
    ? billing.lenses.map((lens) => ({
        lensType: lens.lensType ?? "",
        add: lens.add ?? "",
        price: lens.price ?? "",
        linkedLensIndex: lens.linkedLensIndex ?? "",
        right: {
          sph: lens.right?.sph ?? "",
          cyl: lens.right?.cyl ?? "",
          axis: lens.right?.axis ?? "",
          va: lens.right?.va ?? "",
        },
        left: {
          sph: lens.left?.sph ?? "",
          cyl: lens.left?.cyl ?? "",
          axis: lens.left?.axis ?? "",
          va: lens.left?.va ?? "",
        },
      }))
    : [],
})

const normalizePhoneSettings = (phoneSettings = {}) => {
  const required = Boolean(phoneSettings?.required)
  const configuredLength = Number.parseInt(phoneSettings?.length, 10)
  const length = required && configuredLength > 0 ? configuredLength : 10

  return { required, length }
}

const addDaysToDate = (dateValue, days) => {
  const [year, month, day] = `${dateValue}`.split('-').map(Number)

  if (!year || !month || !day) {
    return ""
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)

  return date.toISOString().slice(0, 10)
}

export default function BillingForm({
  mode = "create",
  billing = null,
  phoneSettings = {},
  deliverySettings = {},
}) {
  const isEditMode = mode === "edit"
  const autoDeliveryEnabled = !isEditMode && Boolean(deliverySettings?.enabled)
  const deliveryDays = Math.min(99, Math.max(0, Number(deliverySettings?.days) || 0))
  const mobileSettings = normalizePhoneSettings(phoneSettings)
  const mobilePattern = `[0-9]{${mobileSettings.length}}`
  const initialDueCarryAmount = getDueCarryAmount(buildFormData(billing).frames)
  const { data, setData, post, put, processing, errors, reset } = useForm(
    buildFormData(billing),
  )
  const [now, setNow] = useState(() => Date.now())
  const [dueSummary, setDueSummary] = useState(emptyDueSummary)
  const [dueLoading, setDueLoading] = useState(false)
  const [includePreviousDue, setIncludePreviousDue] = useState(initialDueCarryAmount > 0)
  const framesRef = useRef(data.frames)
  const includePreviousDueRef = useRef(includePreviousDue)
  const editWindowOpen = !isEditMode || isWithinWindow(billing?.created_at, 3, now)

  useEffect(() => {
    framesRef.current = data.frames
  }, [data.frames])

  useEffect(() => {
    includePreviousDueRef.current = includePreviousDue
  }, [includePreviousDue])

  useEffect(() => {
    if (isEditMode) {
      return
    }

    if (`${data.order_date ?? ""}`.trim() !== "") {
      return
    }

    setData('order_date', new Date().toISOString().slice(0, 10))
  }, [data.order_date, isEditMode, setData])

  useEffect(() => {
    if (!autoDeliveryEnabled || !data.order_date) {
      return
    }

    setData('delivery_date', addDaysToDate(data.order_date, deliveryDays))
  }, [autoDeliveryEnabled, data.order_date, deliveryDays, setData])

  useEffect(() => {
    if (!isEditMode || !billing?.created_at) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 15000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [billing?.created_at, isEditMode])

  const addFrame = () => {
    setData('frames', [...data.frames, createEmptyFrame()])
  }

  const removeFrame = (index) => {
    setData(
      'frames',
      data.frames.filter((_, currentIndex) => currentIndex !== index),
    )
  }

  const handleFrameChange = (index, field, value) => {
    const updatedFrames = [...data.frames]
    updatedFrames[index] = {
      ...updatedFrames[index],
      [field]: value,
    }

    setData('frames', updatedFrames)
  }

  const addLens = () => {
    setData('lenses', [...data.lenses, createEmptyLens()])
  }

  const removeLens = (index) => {
    const nextLenses = data.lenses
      .filter((_, currentIndex) => currentIndex !== index)
      .map((lens, currentIndex) => {
        const previousIndex = currentIndex >= index ? currentIndex + 1 : currentIndex
        const linkedLensIndex = normalizeLinkedLensIndex(lens.linkedLensIndex)

        if (linkedLensIndex === null) {
          return lens
        }

        if (linkedLensIndex === index + 1) {
          const effectiveLens = getEffectiveLens(data.lenses, previousIndex)

          return {
            ...lens,
            linkedLensIndex: "",
            right: { ...effectiveLens.right },
            left: { ...effectiveLens.left },
          }
        }

        if (linkedLensIndex > index + 1) {
          return {
            ...lens,
            linkedLensIndex: String(linkedLensIndex - 1),
          }
        }

        return lens
      })

    setData('lenses', nextLenses)
  }

  const handleLensChange = (index, section, field, value) => {
    const updatedLenses = [...data.lenses]
    let nextLens = { ...updatedLenses[index] }

    if (section === "right" || section === "left") {
      nextLens = {
        ...nextLens,
        [section]: {
          ...nextLens[section],
          [field]: value,
        },
      }
    } else {
      nextLens = {
        ...nextLens,
        [section]: value,
      }
    }

    updatedLenses[index] = nextLens
    setData('lenses', updatedLenses)
  }

  const handleLinkedLensChange = (index, value) => {
    const updatedLenses = [...data.lenses]
    const previousLinkedLensIndex = normalizeLinkedLensIndex(updatedLenses[index].linkedLensIndex)
    const effectiveLens = getEffectiveLens(data.lenses, index)

    updatedLenses[index] = {
      ...updatedLenses[index],
      linkedLensIndex: value === "none" ? "" : value,
      right: value === "none" && previousLinkedLensIndex !== null
        ? { ...effectiveLens.right }
        : updatedLenses[index].right,
      left: value === "none" && previousLinkedLensIndex !== null
        ? { ...effectiveLens.left }
        : updatedLenses[index].left,
    }

    setData('lenses', updatedLenses)
  }

  const handleIncludePreviousDue = () => {
    setIncludePreviousDue(true)
    setData('frames', upsertDueCarryFrame(data.frames, dueSummary.total_due))
  }

  const handleSkipPreviousDue = () => {
    setIncludePreviousDue(false)
    setData('frames', removeDueCarryFrame(data.frames))
  }

  useEffect(() => {
    if (isEditMode) {
      return undefined
    }

    const normalizedMobileNumber = `${data.mobile_number ?? ""}`.trim()

    if (normalizedMobileNumber.length < 5) {
      setDueSummary(emptyDueSummary)
      setDueLoading(false)

      if (includePreviousDueRef.current) {
        setIncludePreviousDue(false)
      }

      if (getDueCarryAmount(framesRef.current) > 0) {
        setData('frames', removeDueCarryFrame(framesRef.current))
      }

      return undefined
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setDueLoading(true)

      try {
        const searchParams = new URLSearchParams({
          mobile_number: normalizedMobileNumber,
        })

        const response = await fetch(`${route('staff.billing.due-summary')}?${searchParams.toString()}`, {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to fetch due summary.')
        }

        const result = await response.json()
        const nextSummary = {
          total_due: parseAmount(result.total_due),
          billings: Array.isArray(result.billings) ? result.billings : [],
        }

        setDueSummary(nextSummary)

        if (nextSummary.total_due <= 0) {
          if (includePreviousDueRef.current) {
            setIncludePreviousDue(false)
          }

          setData('frames', removeDueCarryFrame(framesRef.current))
          return
        }

        if (includePreviousDueRef.current) {
          setData('frames', upsertDueCarryFrame(framesRef.current, nextSummary.total_due))
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setDueSummary(emptyDueSummary)
        }
      } finally {
        if (!controller.signal.aborted) {
          setDueLoading(false)
        }
      }
    }, 400)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [data.mobile_number, isEditMode, setData])

  const carriedDueAmount = getDueCarryAmount(data.frames)
  const frameTotal = removeDueCarryFrame(data.frames).reduce(
    (sum, frame) => sum + parseAmount(frame.price),
    0,
  )

  const lensTotal = data.lenses.reduce(
    (sum, lens) => sum + parseAmount(lens.price),
    0,
  )

  const grossTotal = frameTotal + lensTotal
  const discountAmount = parseAmount(data.discount)
  const netTotal = grossTotal + carriedDueAmount - discountAmount
  const balance = netTotal - parseAmount(data.advance_paid)

  const handleSubmit = (event) => {
    event.preventDefault()

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        if (!isEditMode) {
          reset()
          setDueSummary(emptyDueSummary)
          setIncludePreviousDue(false)
        }
      },
    }

    if (isEditMode) {
      put(route('staff.billing.update', billing.id), options)
      return
    }

    post(route('staff.billing.store'), options)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Billing Management
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {isEditMode ? "View & Edit Billing" : "Create Billing"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage customer billing, generate invoices, track payments, and maintain records efficiently.
            </p>
            <p className="mt-3 text-sm font-medium text-slate-500">
              {isEditMode
                ? `Order number: ${billing?.order_number ?? ''}`
                : "Order number will be created automatically in the format OP/MEC/OR/0001."}
            </p>
          </div>

          <div className="flex gap-3">
            <Button asChild type="button" variant="outline">
              <Link href={route('staff.billing.view')}>View Billings</Link>
            </Button>
            {isEditMode && (
              <>
                <Button asChild type="button" variant="outline">
                  <Link href={route('staff.billing.invoice', billing.id)}>Invoice</Link>
                </Button>
                <Button asChild type="button">
                  <Link href={route('staff.billing.create')}>Create New</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditMode && !editWindowOpen && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Editing window expired. This billing can no longer be updated.
        </div>
      )}

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-5">
          {isEditMode && (
            <div className="space-y-2">
              <Label>Order Number</Label>
              <Input value={billing?.order_number ?? ''} readOnly className="bg-gray-100 font-semibold" />
            </div>
          )}

          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input
              value={data.customer_name}
              onChange={(event) => setData('customer_name', event.target.value)}
              placeholder="Enter customer name"
            />
            <InputError message={errors.customer_name} />
          </div>

          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input
              value={data.mobile_number}
              onChange={(event) => {
                const onlyNums = event.target.value
                  .replace(/[^0-9]/g, '')
                  .slice(0, mobileSettings.length)
                setData('mobile_number', onlyNums)
              }}
              placeholder="Enter mobile number"
              maxLength={mobileSettings.length}
              required={mobileSettings.required}
              pattern={mobilePattern}
              title={`Enter exactly ${mobileSettings.length} digits.`}
            />
            <InputError message={errors.mobile_number} />
          </div>

          <div className="space-y-2">
            <Label>Order Date</Label>
            <Input
              type="date"
              value={data.order_date}
              onChange={(event) => setData('order_date', event.target.value)}
              readOnly={!isEditMode}
              className={!isEditMode ? "bg-gray-100 font-medium" : ""}
            />
            <InputError message={errors.order_date} />
          </div>

          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <Input
              type="date"
              value={data.delivery_date}
              onChange={(event) => setData('delivery_date', event.target.value)}
            />
            <InputError message={errors.delivery_date} />
          </div>

          {!isEditMode && (dueLoading || dueSummary.total_due > 0) && (
            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 md:col-span-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-900">Previous Due Found For This Mobile Number</p>
                  <p className="text-sm text-amber-800">
                    {dueLoading
                      ? "Checking previous unpaid billings..."
                      : `Customer has Rs. ${dueSummary.total_due.toFixed(2)} pending from earlier billing.`}
                  </p>
                </div>

                {!dueLoading && dueSummary.total_due > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleIncludePreviousDue}
                    >
                      Add Due To Billing
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleSkipPreviousDue}
                    >
                      Do Not Add
                    </Button>
                  </div>
                )}
              </div>

              {!dueLoading && dueSummary.billings.length > 0 && (
                <div className="space-y-2 text-sm text-amber-900">
                  {dueSummary.billings.map((dueBilling) => (
                    <p key={dueBilling.id}>
                      {dueBilling.order_number || `Billing #${dueBilling.id}`}:
                      {" "}Rs. {parseAmount(dueBilling.balance).toFixed(2)}
                    </p>
                  ))}
                </div>
              )}

              {!dueLoading && dueSummary.total_due > 0 && (
                <p className="text-xs text-amber-800">
                  {includePreviousDue
                    ? "Previous due will be added into this billing as a locked carry item."
                    : "You can choose whether to include the previous due in this new billing."}
                </p>
              )}
            </div>
          )}

          {isEditMode && carriedDueAmount > 0 && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 md:col-span-5">
              <p className="text-sm font-semibold text-sky-900">Previous Due Already Included</p>
              <p className="mt-1 text-sm text-sky-800">
                This billing already includes carried previous due of Rs. {carriedDueAmount.toFixed(2)}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Frames</h2>
              <InputError message={errors.frames} className="mt-1" />
            </div>
            <Button type="button" onClick={addFrame}>+ Add Frame</Button>
          </div>

          {data.frames.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No frames added yet
            </p>
          )}

          {data.frames.map((frame, index) => (
            <div key={index} className="grid items-end gap-4 rounded-xl border p-4 md:grid-cols-3">
              <div>
                <Label>{isDueCarryFrame(frame) ? "Carry Due Item" : "Frame Name"}</Label>
                <Input
                  value={frame.name}
                  readOnly={isDueCarryFrame(frame)}
                  className={isDueCarryFrame(frame) ? "bg-gray-100 font-medium" : ""}
                  onChange={(event) =>
                    handleFrameChange(index, "name", event.target.value)
                  }
                />
                <InputError message={errors[`frames.${index}.name`]} className="mt-1" />
              </div>

              <div>
                <Label>{isDueCarryFrame(frame) ? "Due Amount" : "Price"}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={frame.price}
                  readOnly={isDueCarryFrame(frame)}
                  className={isDueCarryFrame(frame) ? "bg-gray-100 font-medium" : ""}
                  onChange={(event) =>
                    handleFrameChange(index, "price", event.target.value)
                  }
                />
                <InputError message={errors[`frames.${index}.price`]} className="mt-1" />
              </div>

              {isDueCarryFrame(frame) ? (
                <p className="text-sm text-slate-500">
                  Managed automatically from previous due.
                </p>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeFrame(index)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Lens</h2>
              <InputError message={errors.lenses} className="mt-1" />
            </div>
            <Button type="button" onClick={addLens}>+ Add Lens</Button>
          </div>

          {data.lenses.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No lenses added yet
            </p>
          )}

          {data.lenses.map((lens, index) => {
            const effectiveLens = getEffectiveLens(data.lenses, index)
            const linkedLensIndex = normalizeLinkedLensIndex(lens.linkedLensIndex)
            const linkedToAnotherLens = linkedLensIndex !== null
            const sameLens = areLensEyesSame(effectiveLens)

            return (
            <div key={index} className="relative space-y-4 rounded-xl border p-5">
              <div className="absolute right-4 top-4">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeLens(index)}
                >
                  Delete
                </Button>
              </div>

              <div className="flex flex-col gap-3 pr-20 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold">Lens #{index + 1}</h3>
                  {linkedToAnotherLens && (
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Linked To Lens #{linkedLensIndex}
                    </span>
                  )}
                  {!linkedToAnotherLens && sameLens && (
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Linked / Same Lens
                    </span>
                  )}
                </div>

                {index > 0 && (
                  <div className="w-full md:w-64">
                    <Label className="mb-2 block text-sm">Link Prescription To</Label>
                    <Select
                      value={linkedToAnotherLens ? String(linkedLensIndex) : "none"}
                      onValueChange={(value) => handleLinkedLensChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose lens" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Link</SelectItem>
                        {data.lenses.slice(0, index).map((_, sourceIndex) => (
                          <SelectItem key={`link-option-${sourceIndex}`} value={String(sourceIndex + 1)}>
                            Lens #{sourceIndex + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {linkedToAnotherLens && (
                <p className="text-xs text-slate-500">
                  Prescription values for this lens are reused from Lens #{linkedLensIndex}, so you do not need to type them again.
                </p>
              )}

              {!linkedToAnotherLens && sameLens && (
                <p className="text-xs text-slate-500">
                  Both eyes have the same values, so this lens is linked automatically.
                </p>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Right Eye (OD)</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="SPH"
                      value={linkedToAnotherLens ? effectiveLens.right.sph : lens.right.sph}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "right", "sph", event.target.value)
                      }
                    />
                    <Input
                      placeholder="CYL"
                      value={linkedToAnotherLens ? effectiveLens.right.cyl : lens.right.cyl}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "right", "cyl", event.target.value)
                      }
                    />
                    <Input
                      placeholder="AXIS"
                      value={linkedToAnotherLens ? effectiveLens.right.axis : lens.right.axis}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "right", "axis", event.target.value)
                      }
                    />
                    <Input
                      placeholder="VA"
                      value={linkedToAnotherLens ? effectiveLens.right.va : lens.right.va}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "right", "va", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Left Eye (OS)</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="SPH"
                      value={linkedToAnotherLens ? effectiveLens.left.sph : lens.left.sph}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "left", "sph", event.target.value)
                      }
                    />
                    <Input
                      placeholder="CYL"
                      value={linkedToAnotherLens ? effectiveLens.left.cyl : lens.left.cyl}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "left", "cyl", event.target.value)
                      }
                    />
                    <Input
                      placeholder="AXIS"
                      value={linkedToAnotherLens ? effectiveLens.left.axis : lens.left.axis}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "left", "axis", event.target.value)
                      }
                    />
                    <Input
                      placeholder="VA"
                      value={linkedToAnotherLens ? effectiveLens.left.va : lens.left.va}
                      disabled={linkedToAnotherLens}
                      className={linkedToAnotherLens ? "bg-gray-100" : ""}
                      onChange={(event) =>
                        handleLensChange(index, "left", "va", event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Lens Type</Label>
                  <Input
                    placeholder="e.g. Single Vision"
                    value={lens.lensType}
                    onChange={(event) =>
                      handleLensChange(index, "lensType", null, event.target.value)
                    }
                  />
                  <InputError message={errors[`lenses.${index}.lensType`]} className="mt-1" />
                </div>

                <div>
                  <Label>ADD</Label>
                  <Input
                    placeholder="e.g. +1.50"
                    value={lens.add}
                    onChange={(event) =>
                      handleLensChange(index, "add", null, event.target.value)
                    }
                  />
                  <InputError message={errors[`lenses.${index}.add`]} className="mt-1" />
                </div>

                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={lens.price}
                    onChange={(event) =>
                      handleLensChange(index, "price", null, event.target.value)
                    }
                  />
                  <InputError message={errors[`lenses.${index}.price`]} className="mt-1" />
                </div>
              </div>
            </div>
          )})}
        </CardContent>
      </Card>

      <div className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <hr className="mt-2 border-gray-200" />
        </div>

        <div className="grid items-end gap-6 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Previous Due Added</Label>
            <Input
              value={carriedDueAmount.toFixed(2)}
              readOnly
              className="bg-gray-100 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label>Discount</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.discount}
              onChange={(event) => setData('discount', event.target.value)}
              placeholder="Enter discount amount"
            />
            <InputError message={errors.discount} />
          </div>

          <div className="space-y-2">
            <Label>Advance Paid</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.advance_paid}
              onChange={(event) => setData('advance_paid', event.target.value)}
              placeholder="Enter advance amount"
            />
            <InputError message={errors.advance_paid} />
          </div>

          <div className="space-y-2">
            <Label>Balance Payable</Label>
            <Input
              value={balance.toFixed(2)}
              readOnly
              className="bg-gray-100 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label>Net Total</Label>
            <Input
              value={netTotal.toFixed(2)}
              readOnly
              className="bg-gray-100 font-bold text-green-600"
            />
          </div>
        </div>

        <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-5">
          <p>Frames Total: Rs. {frameTotal.toFixed(2)}</p>
          <p>Lenses Total: Rs. {lensTotal.toFixed(2)}</p>
          <p>Gross Total: Rs. {grossTotal.toFixed(2)}</p>
          <p>Previous Due: Rs. {carriedDueAmount.toFixed(2)}</p>
          <p>Discount: Rs. {discountAmount.toFixed(2)}</p>
        </div>

          <div className="flex justify-end">
          <Button type="submit" disabled={processing || (isEditMode && !editWindowOpen)}>
            {processing
              ? (isEditMode ? "Updating..." : "Saving...")
              : (isEditMode && !editWindowOpen
                ? "Edit Window Expired"
                : (isEditMode ? "Update Billing" : "Create Billing"))}
          </Button>
        </div>
      </div>
    </form>
  )
}
