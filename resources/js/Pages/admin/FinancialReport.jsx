import AdminLayout from "@/Layouts/AdminLayout"
import { router } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { CalendarDays, CircleDollarSign, ClipboardList, Wallet } from "lucide-react"

import FinancialReportExport from "@/components/financial-report-export"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const emptyFilters = {
  from_date: "",
  to_date: "",
  customer_name: "",
  mobile_number: "",
  order_number: "",
  payment_status: "",
}

const emptySummary = {
  total_billings: 0,
  gross_amount: 0,
  discount_amount: 0,
  collected_amount: 0,
  due_amount: 0,
  net_amount: 0,
}

const emptyReportRows = {
  data: [],
  current_page: 1,
  last_page: 1,
  total: 0,
  from: null,
  to: null,
}

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value

  return new Date(normalizedValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const formatDateTime = (value) => {
  if (!value) {
    return "-"
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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

function StatCard({ title, value, helper, icon: Icon, accentClass, loading = false }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-sm ring-1 ring-slate-200">
      <CardContent className="relative p-6">
        <div className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="min-h-[2.75rem] flex items-center">
              {loading ? <LoadingLine label="Refreshing report..." /> : <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>}
            </div>
            <p className="text-sm text-slate-500">
              {loading ? "Fetching matching billing data from the backend." : helper}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950 p-3 text-white shadow-lg">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingLine({ label = "Loading report data..." }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
      <Spinner className="size-5 text-slate-400" />
      {label}
    </span>
  )
}

function DetailCard({ title, value, helper, loading = false }) {
  return (
    <Card className="rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="mt-3 min-h-[2.75rem] flex items-center">
          {loading ? (
            <LoadingLine label="Refreshing report..." />
          ) : (
            <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {loading ? "Waiting for fresh summary numbers from the backend." : helper}
        </p>
      </CardContent>
    </Card>
  )
}

function FinancialReport({
  filters = emptyFilters,
  summary = emptySummary,
  reportRows = emptyReportRows,
  exportRows = [],
  paymentStatusOptions = [],
  generatedAt = null,
  reportInitialized = false,
}) {
  const [filterData, setFilterData] = useState({
    ...emptyFilters,
    ...filters,
  })
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)
  const downloadableRows = Array.isArray(exportRows) ? exportRows : []

  const rows = Array.isArray(reportRows?.data) ? reportRows.data : []
  const currentPage = Number(reportRows?.current_page || 1)
  const lastPage = Number(reportRows?.last_page || 1)
  const pageItems = buildPageItems(currentPage, lastPage)

  const visitReport = (params) => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)

    router.get(route("admin.reports.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onFinish: () => {
        if (requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      },
      onCancel: () => {
        if (requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      },
    })
  }

  useEffect(() => {
    setFilterData({
      ...emptyFilters,
      ...filters,
    })
  }, [filters])

  const handleFilterChange = (field, value) => {
    setFilterData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const applyFilters = (event) => {
    event.preventDefault()

    visitReport(compactFilters(filterData))
  }

  const resetFilters = () => {
    setFilterData({ ...emptyFilters })

    visitReport({})
  }

  const navigateToPage = (page) => {
    if (isLoading || page < 1 || page > lastPage || page === currentPage) {
      return
    }

    visitReport({
      ...compactFilters(filterData),
      page,
    })
  }

  const reportHeaderDescription = (() => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center gap-2">
          <Spinner className="h-4 w-4 text-slate-500" />
          Loading the report rows from the backend.
        </span>
      )
    }

    if (!reportInitialized) {
      return "No report loaded yet. Use Search now to fetch billing data from the backend."
    }

    return <>Showing {reportRows?.from ?? 0} to {reportRows?.to ?? 0} of {reportRows?.total ?? 0} billing records.</>
  })()

  const stats = [
    {
      title: "Total Orders",
      value: summary.total_billings ?? 0,
      helper: "Orders matching the current report filters",
      icon: ClipboardList,
      accentClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
    },
    {
      title: "Gross Amount",
      value: formatCurrency(summary.gross_amount),
      helper: "Frame total plus lens total before discount",
      icon: CircleDollarSign,
      accentClass: "bg-gradient-to-r from-emerald-500 to-lime-400",
    },
    {
      title: "Collected Amount",
      value: formatCurrency(summary.collected_amount),
      helper: "Advance plus later payment collection",
      icon: Wallet,
      accentClass: "bg-gradient-to-r from-amber-500 to-orange-400",
    },
    {
      title: "Due Balance",
      value: formatCurrency(summary.due_amount),
      helper: "Open balance still pending collection",
      icon: CalendarDays,
      accentClass: "bg-gradient-to-r from-rose-500 to-pink-400",
    },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-7 text-white shadow-2xl md:px-8">
        <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
              Reports
            </Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                Financial report for billing, collection, discount, and due balance.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Keep the report idle until you click Search now. The backend will return the matching rows, and then you can paginate or download the same report in PDF, CSV, or Excel format.
              </p>
            </div>
            <p className="text-sm text-slate-300">
              {reportInitialized
                ? <>Generated at {formatDateTime(generatedAt)}</>
                : "No report is loaded yet. Start with a filter to fetch matching records."}
            </p>
          </div>

          <FinancialReportExport
            rows={downloadableRows}
            summary={summary}
            filters={filters}
            generatedAt={generatedAt}
            loading={isLoading}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} loading={isLoading} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailCard
          title="Net Amount"
          value={formatCurrency(summary.net_amount)}
          helper="Final billing amount after discount."
          loading={isLoading}
        />

        <DetailCard
          title="Discount Total"
          value={formatCurrency(summary.discount_amount)}
          helper="Total discount given across filtered billings."
          loading={isLoading}
        />

        <DetailCard
          title="Current Filter"
          value={reportInitialized
            ? (filterData.payment_status ? `${filterData.payment_status} orders` : "All payment status")
            : "No report loaded yet"}
          helper={reportInitialized
            ? "Customer, mobile, order number, and date range filters stay in pagination and export."
            : "Use the search fields above and click Search now to load the report from the backend."}
          loading={isLoading}
        />
      </section>

      <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader>
          <CardTitle className="text-xl">Filter Financial Report</CardTitle>
          <CardDescription>
            Search billing data and click Search now to load the matching backend results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={applyFilters} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
              <div className="space-y-2">
                <Label htmlFor="from_date">From Date</Label>
                <Input
                  id="from_date"
                  type="date"
                  value={filterData.from_date}
                  onChange={(event) => handleFilterChange("from_date", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to_date">To Date</Label>
                <Input
                  id="to_date"
                  type="date"
                  value={filterData.to_date}
                  onChange={(event) => handleFilterChange("to_date", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={filterData.customer_name}
                  onChange={(event) => handleFilterChange("customer_name", event.target.value)}
                  placeholder="Search customer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  id="mobile_number"
                  value={filterData.mobile_number}
                  onChange={(event) => handleFilterChange("mobile_number", event.target.value)}
                  placeholder="Search mobile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_number">Order Number</Label>
                <Input
                  id="order_number"
                  value={filterData.order_number}
                  onChange={(event) => handleFilterChange("order_number", event.target.value)}
                  placeholder="Search order"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={filterData.payment_status || "all"}
                  onValueChange={(value) => handleFilterChange("payment_status", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {paymentStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={applyFilters} disabled={isLoading}>
                {isLoading ? <Spinner className="h-4 w-4" /> : null}
                {isLoading ? "Loading..." : "Search now"}
              </Button>
              <Button type="button" variant="outline" onClick={resetFilters} disabled={isLoading}>
                {isLoading ? <Spinner className="h-4 w-4" /> : null}
                {isLoading ? "Loading..." : "Clear"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">Report Rows</CardTitle>
            <CardDescription>{reportHeaderDescription}</CardDescription>
          </div>

          <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
            {isLoading ? "Loading" : reportInitialized ? "Filtered Data" : "Idle"}
          </Badge>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className={`overflow-x-auto ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
            {rows.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
                <p className="text-lg font-semibold text-slate-950">
                  {isLoading
                    ? "Loading report data..."
                    : reportInitialized
                      ? "No billing records found for the current filters."
                      : "No report loaded yet."}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {isLoading
                    ? "The backend response is on the way now."
                    : reportInitialized
                      ? "Try widening the date range or clearing a filter to see matching billing records."
                      : "Use the search fields above and click Search now to fetch billing records from the backend."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-slate-900">{row.customer_name || "-"}</TableCell>
                      <TableCell>{row.order_number || "-"}</TableCell>
                      <TableCell>{row.mobile_number || "-"}</TableCell>
                      <TableCell>{formatDate(row.order_date)}</TableCell>
                      <TableCell>{formatDate(row.delivery_date)}</TableCell>
                      <TableCell>{formatCurrency(row.gross_amount)}</TableCell>
                      <TableCell>{formatCurrency(row.discount)}</TableCell>
                      <TableCell>{formatCurrency(row.advance_paid)}</TableCell>
                      <TableCell className={Number(row.balance) > 0 ? "text-amber-700" : "text-emerald-700"}>
                        {formatCurrency(row.balance)}
                      </TableCell>
                      <TableCell>{formatCurrency(row.net_total)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.payment_status === "due" ? "outline" : "secondary"}
                          className={row.payment_status === "due" ? "border-amber-300 text-amber-700" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"}
                        >
                          {row.payment_status === "due" ? "Due" : "Paid"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {isLoading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/75 backdrop-blur-sm">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg">
                <Spinner className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Loading report rows...</span>
              </div>
            </div>
          ) : null}

          {lastPage > 1 ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-500">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-slate-500" />
                    Loading report pages...
                  </span>
                ) : (
                  <>Page {currentPage} of {lastPage}</>
                )}
              </p>

              <Pagination className="md:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={isLoading || currentPage <= 1}
                      onClick={(event) => {
                        event.preventDefault()
                        if (isLoading) {
                          return
                        }
                        navigateToPage(currentPage - 1)
                      }}
                      className={(currentPage <= 1 || isLoading) ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {pageItems.map((item) => (
                    <PaginationItem key={item}>
                      {`${item}`.includes("ellipsis") ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={Number(item) === currentPage}
                          onClick={(event) => {
                            event.preventDefault()
                            if (isLoading) {
                              return
                            }
                            navigateToPage(Number(item))
                          }}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={isLoading || currentPage >= lastPage}
                      onClick={(event) => {
                        event.preventDefault()
                        if (isLoading) {
                          return
                        }
                        navigateToPage(currentPage + 1)
                      }}
                      className={(currentPage >= lastPage || isLoading) ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default FinancialReport

FinancialReport.layout = (page) => <AdminLayout children={page} />
