import { Link, router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StaffLayout from '@/Layouts/StaffLayout'

const emptyFilters = {
  customer_name: "",
  order_number: "",
  mobile_number: "",
  order_date: "",
  delivery_date: "",
}

const emptyBillings = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: null,
  to: null,
}

const defaultVisibleColumns = {
  customer_name: true,
  order_number: true,
  mobile_number: true,
  order_date: true,
  delivery_date: true,
  discount: true,
  advance_paid: true,
  balance: true,
  net_total: true,
}

const lockedVisibleColumns = {
  order_number: true,
}

const columnOptions = [
  { key: "customer_name", label: "Customer Name" },
  { key: "order_number", label: "Order Number" },
  { key: "mobile_number", label: "Mobile Number" },
  { key: "order_date", label: "Order Date" },
  { key: "delivery_date", label: "Delivery Date" },
  { key: "discount", label: "Discount" },
  { key: "advance_paid", label: "Advance Paid" },
  { key: "balance", label: "Due Balance" },
  { key: "net_total", label: "Net Balance" },
]

const formatValue = (value) => value && `${value}`.trim() !== "" ? value : "-"
const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`
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

const compactFilters = (values) => Object.fromEntries(
  Object.entries(values).filter(([, value]) => `${value}`.trim() !== ""),
)

const buildPageItems = (currentPage, lastPage) => {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-right", lastPage]
  }

  if (currentPage >= lastPage - 3) {
    return [1, "ellipsis-left", lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage]
  }

  return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", lastPage]
}

function ViewBilling({ billings = emptyBillings, filters = emptyFilters }) {
  const [filterData, setFilterData] = useState({
    ...emptyFilters,
    ...filters,
  })
  const [now, setNow] = useState(() => Date.now())
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns)
  const [selectedBilling, setSelectedBilling] = useState(null)
  const paymentForm = useForm({
    amount: "",
  })

  const billingList = Array.isArray(billings?.data) ? billings.data : []
  const currentPage = Number(billings?.current_page || 1)
  const lastPage = Number(billings?.last_page || 1)
  const totalBillings = Number(billings?.total || 0)
  const fromRecord = billings?.from
  const toRecord = billings?.to
  const pageItems = buildPageItems(currentPage, lastPage)
  const visibleColumnCount = columnOptions.filter((column) => visibleColumns[column.key]).length

  useEffect(() => {
    setFilterData({
      ...emptyFilters,
      ...filters,
    })
  }, [filters])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const savedColumns = window.localStorage.getItem("billing-view-visible-columns")

    if (!savedColumns) {
      return
    }

    try {
      const parsedColumns = JSON.parse(savedColumns)

      setVisibleColumns({
        ...defaultVisibleColumns,
        ...parsedColumns,
        ...lockedVisibleColumns,
      })
    } catch (error) {
      window.localStorage.removeItem("billing-view-visible-columns")
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      "billing-view-visible-columns",
      JSON.stringify(visibleColumns),
    )
  }, [visibleColumns])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 15000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      router.reload({
        only: ['billings', 'filters'],
        preserveScroll: true,
        preserveState: true,
      })
    }, 300000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const handleFilterChange = (field, value) => {
    setFilterData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const toggleColumnVisibility = (columnKey) => {
    if (columnKey in lockedVisibleColumns) {
      return
    }

    setVisibleColumns((current) => ({
      ...current,
      [columnKey]: !current[columnKey],
    }))
  }

  const resetVisibleColumns = () => {
    setVisibleColumns(defaultVisibleColumns)
  }

  const applyFilters = (event) => {
    event.preventDefault()

    const payload = compactFilters(filterData)

    router.get(route('staff.billing.view'), payload, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  const resetFilters = () => {
    setFilterData({ ...emptyFilters })
    router.get(route('staff.billing.view'), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  const navigateToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return
    }

    router.get(route('staff.billing.view'), {
      ...compactFilters(filters),
      page,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const openPaymentDialog = (billing) => {
    setSelectedBilling(billing)
    paymentForm.setData('amount', Number(billing.balance || 0).toFixed(2))
    paymentForm.clearErrors()
  }

  const closePaymentDialog = () => {
    setSelectedBilling(null)
    paymentForm.reset()
    paymentForm.clearErrors()
  }

  const submitPaymentCollection = (event) => {
    event.preventDefault()

    if (!selectedBilling) {
      return
    }

    paymentForm.post(route('staff.billing.collect-payment', selectedBilling.id), {
      preserveScroll: true,
      onSuccess: () => {
        closePaymentDialog()
      },
    })
  }

  const deleteBilling = (billing) => {
    if (!window.confirm(`Delete billing ${billing.order_number}?`)) {
      return
    }

    router.delete(route('staff.billing.destroy', billing.id), {
      preserveScroll: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Billing Management
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              View Billings
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Search unpaid billing records by customer name, order number, mobile number, order date, or delivery date.
            </p>
          </div>

          <Button asChild>
            <Link href={route('staff.billing.create')}>Create Billing</Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={applyFilters} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={filterData.customer_name}
                  onChange={(event) => handleFilterChange('customer_name', event.target.value)}
                  placeholder="Search customer"
                />
              </div>

              <div className="space-y-2">
                <Label>Order Number</Label>
                <Input
                  value={filterData.order_number}
                  onChange={(event) => handleFilterChange('order_number', event.target.value)}
                  placeholder="Search order number"
                />
              </div>

              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  value={filterData.mobile_number}
                  onChange={(event) => handleFilterChange('mobile_number', event.target.value)}
                  placeholder="Search mobile"
                />
              </div>

              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input
                  type="date"
                  value={filterData.order_date}
                  onChange={(event) => handleFilterChange('order_date', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Input
                  type="date"
                  value={filterData.delivery_date}
                  onChange={(event) => handleFilterChange('delivery_date', event.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit">Filter</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline">
                    Customize Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Show / Hide Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columnOptions.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      checked={visibleColumns[column.key]}
                      disabled={column.key in lockedVisibleColumns}
                      onCheckedChange={() => toggleColumnVisibility(column.key)}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={resetVisibleColumns}
                    className="text-slate-600"
                  >
                    Reset Columns
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.customer_name && <TableHead>Customer Name</TableHead>}
                  {visibleColumns.order_number && <TableHead>Order Number</TableHead>}
                  {visibleColumns.mobile_number && <TableHead>Mobile Number</TableHead>}
                  {visibleColumns.order_date && <TableHead>Order Date</TableHead>}
                  {visibleColumns.delivery_date && <TableHead>Delivery Date</TableHead>}
                  {visibleColumns.discount && <TableHead>Discount</TableHead>}
                  {visibleColumns.advance_paid && <TableHead>Advance Paid</TableHead>}
                  {visibleColumns.balance && <TableHead>Due Balance</TableHead>}
                  {visibleColumns.net_total && <TableHead>Net Balance</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {billingList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumnCount + 1} className="py-10 text-center text-sm text-gray-500">
                      No unpaid billing records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  billingList.map((billing) => {
                    const canEdit = (billing.can_edit ?? true) && isWithinWindow(billing.created_at, 3, now)
                    const canDelete = (billing.can_delete ?? true) && isWithinWindow(billing.created_at, 2, now)

                    return (
                      <TableRow key={billing.id}>
                        {visibleColumns.customer_name && <TableCell>{formatValue(billing.customer_name)}</TableCell>}
                        {visibleColumns.order_number && <TableCell>{formatValue(billing.order_number)}</TableCell>}
                        {visibleColumns.mobile_number && <TableCell>{formatValue(billing.mobile_number)}</TableCell>}
                        {visibleColumns.order_date && <TableCell>{formatValue(billing.order_date)}</TableCell>}
                        {visibleColumns.delivery_date && <TableCell>{formatValue(billing.delivery_date)}</TableCell>}
                        {visibleColumns.discount && <TableCell>{formatCurrency(billing.discount)}</TableCell>}
                        {visibleColumns.advance_paid && <TableCell>{formatCurrency(billing.advance_paid)}</TableCell>}
                        {visibleColumns.balance && (
                          <TableCell className={Number(billing.balance || 0) > 0 ? "text-amber-700 font-medium" : "text-emerald-700 font-medium"}>
                            {formatCurrency(billing.balance)}
                          </TableCell>
                        )}
                        {visibleColumns.net_total && <TableCell>{formatCurrency(billing.net_total)}</TableCell>}
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <Button asChild size="sm" variant="outline">
                                <Link href={route('staff.billing.edit', billing.id)}>Edit Billing</Link>
                              </Button>
                            )}
                            <Button asChild size="sm" variant="outline">
                              <Link href={route('staff.billing.invoice', billing.id)}>Invoice</Link>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openPaymentDialog(billing)}
                              disabled={Number(billing.balance || 0) <= 0}
                            >
                              {Number(billing.balance || 0) > 0 ? "Collect Payment" : "Paid"}
                            </Button>
                            {canDelete && (
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteBilling(billing)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 border-t px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">
              {totalBillings === 0
                ? "No unpaid billing records available."
                : `Showing ${fromRecord} to ${toRecord} of ${totalBillings} unpaid billing records.`}
            </p>

            {lastPage > 1 ? (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        navigateToPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {pageItems.map((item, index) => (
                    <PaginationItem key={`${item}-${index}`}>
                      {typeof item === "number" ? (
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          onClick={(event) => {
                            event.preventDefault()
                            navigateToPage(item)
                          }}
                        >
                          {item}
                        </PaginationLink>
                      ) : (
                        <PaginationEllipsis />
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        navigateToPage(currentPage + 1)
                      }}
                      className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedBilling !== null} onOpenChange={(open) => {
        if (!open) {
          closePaymentDialog()
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>
              Update the collected amount for this billing and reduce the pending due balance.
            </DialogDescription>
          </DialogHeader>

          {selectedBilling && (
            <form onSubmit={submitPaymentCollection} className="space-y-4">
              <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
                <p><span className="font-semibold">Order:</span> {formatValue(selectedBilling.order_number)}</p>
                <p><span className="font-semibold">Customer:</span> {formatValue(selectedBilling.customer_name)}</p>
                <p><span className="font-semibold">Mobile:</span> {formatValue(selectedBilling.mobile_number)}</p>
                <p><span className="font-semibold">Discount:</span> {formatCurrency(selectedBilling.discount)}</p>
                <p><span className="font-semibold">Net Total:</span> {formatCurrency(selectedBilling.net_total)}</p>
                <p><span className="font-semibold">Collected:</span> {formatCurrency(selectedBilling.advance_paid)}</p>
                <p><span className="font-semibold">Current Due:</span> {formatCurrency(selectedBilling.balance)}</p>
              </div>

              <div className="space-y-2">
                <Label>Collection Amount</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paymentForm.data.amount}
                  onChange={(event) => paymentForm.setData('amount', event.target.value)}
                  placeholder="Enter amount received"
                />
                {paymentForm.errors.amount && (
                  <p className="text-sm text-red-600">{paymentForm.errors.amount}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closePaymentDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={paymentForm.processing}>
                  {paymentForm.processing ? "Saving..." : "Collect Payment"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ViewBilling

ViewBilling.layout = page => <StaffLayout children={page} />
