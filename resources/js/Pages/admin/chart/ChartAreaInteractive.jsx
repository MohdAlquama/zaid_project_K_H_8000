"use client"

import * as React from "react"
import { router } from "@inertiajs/react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { BadgePercent, CalendarDays, CircleDollarSign, ClipboardList, Wallet } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "Billing collection, discount, and due balance trend"

const defaultFilters = {
  range: "today",
  from_date: "",
  to_date: "",
  range_label: "Today",
}

const defaultSummary = {
  total_billings: 0,
  gross_amount: 0,
  discount_amount: 0,
  collected_amount: 0,
  due_amount: 0,
  net_amount: 0,
}

const chartConfig = {
  collection: {
    label: "Collection",
    color: "hsl(var(--chart-2))",
  },
  discount: {
    label: "Discount",
    color: "hsl(var(--chart-4))",
  },
  due_balance: {
    label: "Due balance",
    color: "hsl(var(--chart-5))",
  },
}

const rangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
]

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

const compactFilters = (values) => Object.fromEntries(
  Object.entries(values).filter(([, value]) => `${value}`.trim() !== ""),
)

function SummaryCard({ title, value, helper, icon: Icon, accentClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <p className="text-lg font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="text-xs leading-5 text-slate-500">
            {helper}
          </p>
        </div>
        <div className={`rounded-2xl ${accentClass} p-3 text-white shadow-lg`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

export function ChartAreaInteractive({
  chartData = [],
  filters = defaultFilters,
  summary = defaultSummary,
  generatedAt = null,
  title = "Collection Trend",
  description = "Collection, discount, and due balance for the selected order-date range.",
}) {
  const [formData, setFormData] = React.useState({
    ...defaultFilters,
    ...filters,
  })

  React.useEffect(() => {
    setFormData({
      ...defaultFilters,
      ...filters,
    })
  }, [filters])

  const fallbackDate = generatedAt ? generatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
  const isCustomRange = formData.range === "custom"
  const activeRangeLabel = filters.range_label || rangeOptions.find((option) => option.value === formData.range)?.label || "Today"

  const summaryCards = [
    {
      title: "Orders",
      value: formatCount(summary.total_billings),
      helper: "Bills in the selected range",
      icon: ClipboardList,
      accentClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
    },
    {
      title: "Collection",
      value: formatCurrency(summary.collected_amount),
      helper: "Advance collected in the selected range",
      icon: CircleDollarSign,
      accentClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
    },
    {
      title: "Discount",
      value: formatCurrency(summary.discount_amount),
      helper: "Discount granted in the selected range",
      icon: BadgePercent,
      accentClass: "bg-gradient-to-r from-amber-500 to-orange-400",
    },
    {
      title: "Due balance",
      value: formatCurrency(summary.due_amount),
      helper: "Outstanding balance in the selected range",
      icon: Wallet,
      accentClass: "bg-gradient-to-r from-rose-500 to-pink-400",
    },
  ]

  const submitRange = (payload) => {
    router.get(route("admin.dashboard"), compactFilters(payload), {
      preserveScroll: true,
      replace: true,
    })
  }

  const handleRangeChange = (value) => {
    if (value === "custom") {
      setFormData((current) => ({
        ...current,
        range: value,
        from_date: current.from_date || current.to_date || fallbackDate,
        to_date: current.to_date || current.from_date || fallbackDate,
      }))
      return
    }

    setFormData((current) => ({
      ...current,
      range: value,
    }))

    submitRange({ range: value })
  }

  const handleCustomSubmit = (event) => {
    event.preventDefault()

    submitRange({
      range: "custom",
      from_date: formData.from_date,
      to_date: formData.to_date,
    })
  }

  const resetToToday = () => {
    const nextFilters = {
      range: "today",
    }

    setFormData({
      ...defaultFilters,
    })

    submitRange(nextFilters)
  }

  return (
    <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
      <CardHeader className="space-y-5 border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950">
              Billing chart
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-2xl text-slate-950">
                {title}
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-slate-500">
                {description}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
                <CalendarDays className="h-4 w-4 text-slate-700" />
                {activeRangeLabel}
              </span>
              <span>
                Last refresh {formatDateTime(generatedAt)}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleCustomSubmit}
            className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-2">
                <Label htmlFor="dashboard-range">Date range</Label>
                <Select value={formData.range} onValueChange={handleRangeChange}>
                  <SelectTrigger id="dashboard-range" className="rounded-xl">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {rangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="rounded-lg">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-from-date">From</Label>
                  <Input
                    id="dashboard-from-date"
                    type="date"
                    value={formData.from_date}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      from_date: event.target.value,
                    }))}
                    disabled={!isCustomRange}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dashboard-to-date">To</Label>
                  <Input
                    id="dashboard-to-date"
                    type="date"
                    value={formData.to_date}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      to_date: event.target.value,
                    }))}
                    disabled={!isCustomRange}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {isCustomRange ? (
                <Button type="submit" className="rounded-full">
                  Apply custom range
                </Button>
              ) : (
                <Button type="button" variant="secondary" disabled className="rounded-full">
                  Live data synced
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={resetToToday}
                className="rounded-full"
              >
                Reset to today
              </Button>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Today is the default view. Pick yesterday, a rolling window, or a custom date range, then the dashboard refreshes with the same filters.
            </p>
          </form>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <SummaryCard key={item.title} {...item} />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-5 sm:px-6">
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDueBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-due_balance)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--color-due_balance)" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="fillDiscount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-discount)" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="var(--color-discount)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillCollection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-collection)" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="var(--color-collection)" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                tickFormatter={(value) => formatDate(value)}
              />
              <ChartTooltip
                cursor={false}
                content={(
                  <ChartTooltipContent
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {chartConfig[name]?.label || name}
                        </span>
                        <span className="font-mono text-foreground tabular-nums">
                          {formatCurrency(value)}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                  />
                )}
              />
              <Area
                dataKey="due_balance"
                type="monotone"
                fill="url(#fillDueBalance)"
                stroke="var(--color-due_balance)"
                strokeWidth={2}
              />
              <Area
                dataKey="discount"
                type="monotone"
                fill="url(#fillDiscount)"
                stroke="var(--color-discount)"
                strokeWidth={2}
              />
              <Area
                dataKey="collection"
                type="monotone"
                fill="url(#fillCollection)"
                stroke="var(--color-collection)"
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>

          {chartData.length === 0 ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-500">
              No billing data found for the selected range.
            </div>
          ) : null}
        </div>

        <p className="text-xs leading-5 text-slate-500">
          The chart is grouped by order date so the dashboard stays aligned with billing activity and the recent record list below.
        </p>
      </CardContent>
    </Card>
  )
}
