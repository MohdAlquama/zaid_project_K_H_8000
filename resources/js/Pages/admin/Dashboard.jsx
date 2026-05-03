import AdminLayout from "@/Layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import { ArrowRight, CalendarDays, ClipboardList, Wallet } from "lucide-react"

import { ChartAreaInteractive } from "./chart/ChartAreaInteractive"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const formatCount = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0))

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

function StatCard({ title, value, helper, icon: Icon, accentClass }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
      <CardContent className="relative p-6">
        <div className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
            <p className="text-sm text-slate-500">{helper}</p>
          </div>
          <div className="rounded-2xl bg-slate-950 p-3 text-white shadow-lg">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Dashboard({
  auth,
  metrics = {},
  rangeSummary = {},
  dashboardFilters = {},
  chartData = [],
  recentBillings = [],
  dueBillings = [],
  generatedAt = null,
}) {
  const userName = auth?.user?.name || "Admin"
  const selectedRangeLabel = dashboardFilters.range_label || "Today"

  const primaryStats = [
    {
      title: "Total Billings",
      value: formatCount(metrics.total_billings),
      helper: "All optical bills created in the system",
      icon: ClipboardList,
      accentClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
    },
    {
      title: "Today's Orders",
      value: formatCount(metrics.today_billings),
      helper: "Orders created for today",
      icon: CalendarDays,
      accentClass: "bg-gradient-to-r from-emerald-500 to-lime-400",
    },
    {
      title: "Pending Balance",
      value: formatCurrency(metrics.pending_balance),
      helper: "Outstanding amount to collect",
      icon: Wallet,
      accentClass: "bg-gradient-to-r from-rose-500 to-pink-400",
    },
  ]

  const dueItems = Array.isArray(dueBillings) ? dueBillings : []
  const recentRows = Array.isArray(recentBillings) ? recentBillings : []

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-5">
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
              Admin billing dashboard
            </Badge>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                Welcome back, {userName}. Track collection, discount, and due balance in one place.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Today is the default view. Use the range picker in the chart to load yesterday or a custom period, then review the recent records and outstanding dues below.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-slate-100">
                <Link href={route("admin.create-billing")}>
                  Create Billing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={route("admin.billing.view")}>
                  View Billings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Open due balance</p>
              <p className="mt-3 text-2xl font-semibold text-white">{formatCurrency(metrics.pending_balance)}</p>
              <p className="mt-2 text-sm text-slate-300">
                {formatCount(metrics.open_due_billings)} open invoices waiting for collection
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">This month revenue</p>
              <p className="mt-3 text-2xl font-semibold text-white">{formatCurrency(metrics.month_revenue)}</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">Previous month revenue</p>
                <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(metrics.previous_month_revenue)}</p>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <span>Deliveries due today</span>
                  <span className="text-lg font-semibold text-white">{formatCount(metrics.deliveries_due_today)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Last refresh</span>
                  <span className="font-medium text-white">{formatDateTime(generatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <ChartAreaInteractive
          chartData={chartData}
          filters={dashboardFilters}
          summary={rangeSummary}
          generatedAt={generatedAt}
          title={`Collection trend for ${selectedRangeLabel}`}
          description="Collection, discount, and due balance grouped by order date. Change the date range above to refresh the same dashboard data."
        />

        <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
            <div className="space-y-2">
              <Badge className="rounded-full bg-rose-600 px-3 py-1 text-white hover:bg-rose-600">
                Due balance
              </Badge>
              <CardTitle className="text-2xl text-slate-950">Outstanding invoices</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-500">
                Only records with balance remaining are shown here, so the team can focus on collection first.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6 py-6">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Total due balance</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{formatCurrency(metrics.pending_balance)}</p>
              <p className="mt-2 text-sm text-slate-300">
                {formatCount(metrics.open_due_billings)} open invoice{Number(metrics.open_due_billings || 0) === 1 ? "" : "s"} are still pending.
              </p>
            </div>

            <div className="space-y-4">
              {dueItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No open due balances right now.
                </div>
              ) : (
                dueItems.map((billing, index) => {
                  const balance = Number(billing.balance || 0)
                  const netTotal = Number(billing.net_total || 0)
                  const progressWidth = netTotal > 0 ? Math.min(100, Math.max(10, Math.round((balance / netTotal) * 100))) : 100

                  return (
                    <div key={billing.id}>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-medium text-slate-950">{billing.customer_name || "-"}</p>
                            <p className="text-sm text-slate-500">{billing.order_number || "-"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-amber-700">{formatCurrency(balance)}</p>
                            <p className="text-xs text-slate-500">Due balance</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                          <span>Order {formatDate(billing.order_date)}</span>
                          <span>Delivery {formatDate(billing.delivery_date)}</span>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                      </div>

                      {index !== dueItems.length - 1 ? <Separator className="mt-4" /> : null}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-col gap-3 border-b border-slate-200/70 bg-slate-50/80 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-950">Recent billing records</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-500">
              Latest orders captured in the system. Collection and due columns stay visible for quick follow-up.
            </CardDescription>
          </div>

          <Button asChild variant="outline" className="rounded-full">
            <Link href={route("admin.billing.view")}>Open billing list</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Due Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                      No billing records available yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentRows.map((billing) => (
                    <TableRow key={billing.id}>
                      <TableCell className="font-medium text-slate-900">{billing.customer_name || "-"}</TableCell>
                      <TableCell>{billing.order_number || "-"}</TableCell>
                      <TableCell>{formatDate(billing.order_date)}</TableCell>
                      <TableCell>{formatCurrency(billing.advance_paid)}</TableCell>
                      <TableCell className={Number(billing.balance) > 0 ? "text-amber-700" : "text-emerald-700"}>
                        {formatCurrency(billing.balance)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
Dashboard.layout = (page) => <AdminLayout children={page} />
