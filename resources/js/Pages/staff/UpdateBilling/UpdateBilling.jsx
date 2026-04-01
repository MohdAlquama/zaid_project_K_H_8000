import { useEffect, useState } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'

import InputError from '@/Components/InputError'
import StaffLayout from '@/Layouts/StaffLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CalendarDays, Loader2, Save, Search, UserRound } from 'lucide-react'

const normalizeDateInput = (value) => (value ? String(value).slice(0, 10) : '')

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }

  const text = `${value}`.trim()
  return text === '' ? '-' : text
}

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return formatValue(value)
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const formatDateDisplay = (value) => {
  if (!value) {
    return '-'
  }

  return String(value).slice(0, 10)
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{formatValue(value)}</p>
    </div>
  )
}

function BillingUpdateForm({ billing }) {
  const [forceUpdateEnabled, setForceUpdateEnabled] = useState(false)
  const isFormVisible = billing.can_edit || forceUpdateEnabled
  const { data, setData, put, processing, errors } = useForm({
    customer_name: billing.customer_name ?? '',
    mobile_number: billing.mobile_number ?? '',
    delivery_date: normalizeDateInput(billing.delivery_date),
    force_update: false,
  })

  const handleForceUpdate = () => {
    const confirmed = window.confirm(
      'This will bypass the edit window and force the billing update. Continue?',
    )

    if (!confirmed) {
      return
    }

    setForceUpdateEnabled(true)
    setData('force_update', true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    put(route('staff.billing.update', billing.id), {
      preserveScroll: true,
    })
  }

  if (!isFormVisible) {
    return (
      <Card className="overflow-hidden border-slate-200/80 shadow-xl shadow-slate-900/5">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Locked billing</p>
              <CardTitle className="text-2xl">Order {billing.order_number}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6">
                The edit window is closed, so the form stays hidden until you force the update.
              </CardDescription>
            </div>

            <Badge variant="destructive" className="w-fit">
              Edit window closed
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50 text-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Force update required</AlertTitle>
            <AlertDescription>
              To change this billing record, use the force billing update button below.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-3">
            <DetailItem label="Order Number" value={billing.order_number} />
            <DetailItem label="Customer Name" value={billing.customer_name} />
            <DetailItem label="Mobile Number" value={billing.mobile_number} />
            <DetailItem label="Order Date" value={formatDateDisplay(billing.order_date)} />
            <DetailItem label="Delivery Date" value={formatDateDisplay(billing.delivery_date)} />
            <DetailItem label="Created At" value={formatDateTime(billing.created_at)} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleForceUpdate}>
              Force Billing Update
            </Button>

            <p className="text-sm text-slate-500">
              This will unlock the form and submit the update with a force flag.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-xl shadow-slate-900/5">
      <div className={`h-1 ${forceUpdateEnabled ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 via-sky-500 to-cyan-500'}`} />

      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Loaded billing</p>
            <CardTitle className="text-2xl">Order {billing.order_number}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">
              Update the customer name, mobile number, or delivery date for this billing record.
            </CardDescription>
          </div>

          <Badge variant={forceUpdateEnabled ? 'destructive' : 'default'} className="w-fit">
            {forceUpdateEnabled ? 'Force mode' : 'Editable'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DetailItem label="Order Number" value={billing.order_number} />
          <DetailItem label="Order Date" value={formatDateDisplay(billing.order_date)} />
          <DetailItem label="Created At" value={formatDateTime(billing.created_at)} />
        </div>

        {forceUpdateEnabled && (
          <Alert className="border-amber-200 bg-amber-50 text-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Force update enabled</AlertTitle>
            <AlertDescription>
              This update will bypass the edit window restriction.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-slate-500" />
                Customer Name
              </Label>
              <Input
                id="customer_name"
                value={data.customer_name}
                onChange={(event) => setData('customer_name', event.target.value)}
                placeholder="Enter customer name"
              />
              <InputError message={errors.customer_name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                value={data.mobile_number}
                onChange={(event) => setData('mobile_number', event.target.value)}
                placeholder="Enter mobile number"
                maxLength={15}
              />
              <InputError message={errors.mobile_number} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                Delivery Date
              </Label>
              <Input
                id="delivery_date"
                type="date"
                value={data.delivery_date}
                onChange={(event) => setData('delivery_date', event.target.value)}
              />
              <InputError message={errors.delivery_date} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={processing}>
              {processing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>

            <p className="text-sm text-slate-500">
              Only the name, mobile number, and delivery date are updated from this screen.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function UpdateBilling({
  billing = null,
  search_order_number: searchOrderNumberProp = '',
  not_found: notFound = false,
}) {
  const { props: pageProps } = usePage()
  const flashSuccess = pageProps.success
  const flashError = pageProps.error
  const currentOrderNumber = billing?.order_number ?? ''
  const [searchOrderNumber, setSearchOrderNumber] = useState(
    searchOrderNumberProp || currentOrderNumber,
  )
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setSearchOrderNumber(searchOrderNumberProp || currentOrderNumber)
  }, [searchOrderNumberProp, currentOrderNumber])

  const handleSearch = (event) => {
    event.preventDefault()

    const normalizedOrderNumber = searchOrderNumber.trim()

    if (!normalizedOrderNumber) {
      setSearchError('Please enter an order number.')
      return
    }

    setSearchError('')
    setSearchOrderNumber(normalizedOrderNumber)

    router.get(
      route('staff.update-billing'),
      { order_number: normalizedOrderNumber },
      {
        replace: true,
        preserveScroll: true,
        preserveState: true,
        onStart: () => setIsSearching(true),
        onFinish: () => setIsSearching(false),
      },
    )
  }

  return (
    <div className="mx-auto  space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 px-6 py-6 md:grid-cols-2 md:items-center md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
              Billing update
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
              Update customer details
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Search by order number. If the billing is locked, use the force update button to
              unlock the form.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <Search className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                <p>Look up a record with the order number.</p>
              </div>
              <div className="flex gap-3">
                <UserRound className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                <p>Edit name, mobile number, or delivery date.</p>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                <p>Force update only when the edit window is closed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {flashSuccess && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{flashSuccess}</AlertDescription>
        </Alert>
      )}

      {flashError && (
        <Alert className="border-red-200 bg-red-50 text-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>{flashError}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-900/5">
        <div className="h-1 bg-gradient-to-r from-slate-900 via-sky-500 to-cyan-500" />
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-sky-600 text-white shadow-lg shadow-sky-500/20">
              <Search className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Find billing</p>
              <CardTitle className="text-xl">Load a billing record</CardTitle>
            </div>
          </div>

          <CardDescription className="max-w-2xl text-sm leading-6">
            Enter the order number to load the billing record.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order_number">Order Number</Label>
              <Input
                id="order_number"
                type="search"
                value={searchOrderNumber}
                onChange={(event) => {
                  setSearchOrderNumber(event.target.value)
                  if (searchError) {
                    setSearchError('')
                  }
                }}
                placeholder="OP/MEC/OR/0001"
                autoComplete="off"
              />
              <InputError message={searchError} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {isSearching ? 'Searching...' : 'Load Billing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {notFound && (
        <Alert className="border-red-200 bg-red-50 text-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>No billing found</AlertTitle>
          <AlertDescription>
            We could not find a billing record for order number "{searchOrderNumber.trim()}".
          </AlertDescription>
        </Alert>
      )}

      {billing ? (
        <BillingUpdateForm key={billing.id} billing={billing} />
      ) : (
        <Card className="border-dashed border-slate-300 bg-white/70 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Waiting for a record
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Search an order number to open the update form
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Once a billing is loaded, you can edit the customer name, mobile number, and
                delivery date from the form above.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UpdateBilling

UpdateBilling.layout = (page) => <StaffLayout>{page}</StaffLayout>
