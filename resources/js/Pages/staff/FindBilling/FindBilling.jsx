import { useEffect, useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CalendarDays,
  CalendarRange,
  Clock3,
  ReceiptText,
  Search,
  UserRoundSearch,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import StaffLayout from '@/Layouts/StaffLayout'

const emptyFilters = {
  active_tab: 'customer',
  customer_name: '',
  mobile_number: '',
  order_number: '',
  single_date_field: 'delivery_date',
  single_date: '',
  date_from: '',
  date_to: '',
  order_date: '',
}

const emptyBillings = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 8,
  total: 0,
  from: null,
  to: null,
}

const cleanObject = (values) =>
  Object.fromEntries(
    Object.entries(values).filter(([, value]) => `${value}`.trim() !== ''),
  )

const formatValue = (value) => value && `${value}`.trim() !== '' ? value : '-'
const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`

const buildSearchSummary = (filters, hasFilters) => {
  if (!hasFilters) {
    return 'Billing records stay hidden until you search. Choose a tab and submit a query to load results.'
  }

  const parts = []

  if (filters.customer_name) {
    parts.push(`Customer: ${filters.customer_name}`)
  }

  if (filters.mobile_number) {
    parts.push(`Mobile: ${filters.mobile_number}`)
  }

  if (filters.order_number) {
    parts.push(`Order #: ${filters.order_number}`)
  }

  if (filters.single_date) {
    const label = filters.single_date_field === 'delivery_date' ? 'Delivery date' : 'Order date'
    parts.push(`${label}: ${filters.single_date}`)
  }

  if (filters.date_from || filters.date_to) {
    parts.push(`Order date range: ${filters.date_from || '...'} to ${filters.date_to || '...'}`)
  }

  if (filters.order_date) {
    parts.push(`Order date: ${filters.order_date}`)
  }

  return parts.join(' · ')
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-300">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function SearchPanel({ icon: Icon, eyebrow, title, description, accent, children }) {
  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-900/5">
      <div className={`h-1 bg-gradient-to-r ${accent}`} />
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </div>

        <CardDescription className="max-w-2xl text-sm leading-6">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}

function CustomerNameTab({ filters, onSearch, onReset }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSearch({
      customer_name: formData.get('customer_name'),
      mobile_number: formData.get('mobile_number'),
      order_number: formData.get('order_number'),
    })
  }

  return (
    <SearchPanel
      icon={UserRoundSearch}
      eyebrow="Customer search"
      title="Search by customer name"
      description="Look up a customer quickly by name, mobile number, or order number."
      accent="from-sky-500 to-cyan-500"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              defaultValue={filters.customer_name}
              placeholder="Type customer name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input
              id="mobile_number"
              name="mobile_number"
              defaultValue={filters.mobile_number}
              placeholder="Search by mobile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_number">Order Number</Label>
            <Input
              id="order_number"
              name="order_number"
              defaultValue={filters.order_number}
              placeholder="Search by order number"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </SearchPanel>
  )
}

function SingleDateTab({ filters, onSearch, onReset }) {
  const [singleDateField, setSingleDateField] = useState(
    filters.single_date_field || 'delivery_date',
  )

  useEffect(() => {
    setSingleDateField(filters.single_date_field || 'delivery_date')
  }, [filters.single_date_field])

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSearch({
      single_date: formData.get('single_date'),
      single_date_field: singleDateField,
    })
  }

  return (
    <SearchPanel
      icon={Clock3}
      eyebrow="Single date search"
      title="Find billings on one exact day"
      description="Search for billings by a single delivery date or order date."
      accent="from-emerald-500 to-teal-500"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="single_date">Date</Label>
            <Input
              id="single_date"
              name="single_date"
              type="date"
              defaultValue={filters.single_date}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="single_date_field">Search By</Label>
            <Select value={singleDateField} onValueChange={setSingleDateField}>
              <SelectTrigger id="single_date_field">
                <SelectValue placeholder="Select date field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery_date">Delivery Date</SelectItem>
                <SelectItem value="order_date">Order Date</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="single_date_field" value={singleDateField} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            <CalendarDays className="mr-2 h-4 w-4" />
            Search Date
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </SearchPanel>
  )
}

function DateRangeTab({ filters, onSearch, onReset }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSearch({
      date_from: formData.get('date_from'),
      date_to: formData.get('date_to'),
    })
  }

  return (
    <SearchPanel
      icon={CalendarRange}
      eyebrow="Date range search"
      title="Find billings between two dates"
      description="Search an order date window when you need a precise range instead of a single day."
      accent="from-violet-500 to-fuchsia-500"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date_from">From Date</Label>
            <Input
              id="date_from"
              name="date_from"
              type="date"
              defaultValue={filters.date_from}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_to">To Date</Label>
            <Input
              id="date_to"
              name="date_to"
              type="date"
              defaultValue={filters.date_to}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            <CalendarRange className="mr-2 h-4 w-4" />
            Search Range
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </SearchPanel>
  )
}

function OrderDateTab({ filters, onSearch, onReset }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSearch({
      order_date: formData.get('order_date'),
    })
  }

  return (
    <SearchPanel
      icon={ReceiptText}
      eyebrow="Order date search"
      title="Find billings by order date"
      description="This tab is useful when you know the exact order date and want a narrow lookup."
      accent="from-amber-500 to-orange-500"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="order_date">Order Date</Label>
            <Input
              id="order_date"
              name="order_date"
              type="date"
              defaultValue={filters.order_date}
            />
          </div>

          <div className="space-y-2">
            <Label>Quick Tip</Label>
            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Use this tab when the billing was created on a known date.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search Order Date
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </SearchPanel>
  )
}

function ResultsTable({ billings, filters, hasFilters, currentPage, lastPage, onPageChange, onResetSearch }) {
  const rows = Array.isArray(billings?.data) ? billings.data : []
  const totalBillings = Number(billings?.total || 0)
  const fromRecord = billings?.from
  const toRecord = billings?.to
  const searchSummary = buildSearchSummary(filters, hasFilters)
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= lastPage

  if (!hasFilters) {
    return (
      <Card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-900/5">
        <CardHeader className="border-b bg-slate-50/80">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Search results</p>
          <CardTitle className="mt-2 text-2xl">No billing records loaded yet</CardTitle>
          <CardDescription className="mt-2 max-w-3xl">
            {searchSummary}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-14">
          <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 rounded-3xl border border-dashed bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Search className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-semibold text-slate-900">Search to reveal billing records</p>
              <p className="text-sm leading-6 text-slate-600">
                Use any tab above to search by customer, mobile number, order number, or date. Results will appear here after you submit a search.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={onResetSearch}>
              Clear Search
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-900/5">
      <CardHeader className="border-b bg-slate-50/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Search results</p>
            <CardTitle className="mt-2 text-2xl">
              {totalBillings > 0
                ? `${totalBillings} billing record${totalBillings === 1 ? '' : 's'} found`
                : 'No billing records found'}
            </CardTitle>
            <CardDescription className="mt-2 max-w-3xl">
              {searchSummary}
            </CardDescription>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HeroStat label="Current Page" value={`${currentPage}/${lastPage}`} />
            <HeroStat label="Showing" value={rows.length > 0 ? `${fromRecord} - ${toRecord}` : '0'} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead className="text-right">Net Total</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
                    <div className="mx-auto max-w-md space-y-3">
                      <p className="text-base font-semibold text-slate-900">No matches yet</p>
                      <p className="text-sm text-slate-600">
                        Try a broader search, clear the current filters, or switch to another tab.
                      </p>
                      <Button type="button" variant="outline" onClick={onResetSearch}>
                        Reset Search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((billing) => (
                  <TableRow key={billing.id}>
                    <TableCell className="font-medium text-slate-900">
                      {formatValue(billing.customer_name)}
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700">
                        {formatValue(billing.order_number)}
                      </span>
                    </TableCell>
                    <TableCell>{formatValue(billing.mobile_number)}</TableCell>
                    <TableCell>{formatValue(billing.order_date)}</TableCell>
                    <TableCell>{formatValue(billing.delivery_date)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(billing.net_total)}</TableCell>
                    <TableCell className={`text-right font-medium ${Number(billing.balance || 0) > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {formatCurrency(billing.balance)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {billing.can_edit && (
                          <Button asChild size="sm" variant="outline">
                            <Link href={route('staff.billing.update-page', billing.id)}>Edit</Link>
                          </Button>
                        )}

                        <Button asChild size="sm" variant="outline">
                          <Link href={route('staff.billing.invoice', billing.id)}>Invoice</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 border-t px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-600">
            {totalBillings === 0
              ? 'Use the tabs above to search for a billing record.'
              : `Showing ${fromRecord} to ${toRecord} of ${totalBillings} matching billing records.`}
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isFirstPage}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-slate-600">
              Page {currentPage} of {lastPage}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLastPage}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FindBilling({
  billings = emptyBillings,
  filters = emptyFilters,
  active_tab = 'customer',
  has_filters = false,
}) {
  const [activeTab, setActiveTab] = useState(active_tab || 'customer')

  useEffect(() => {
    setActiveTab(active_tab || 'customer')
  }, [active_tab])

  const currentPage = Number(billings?.current_page || 1)
  const lastPage = Number(billings?.last_page || 1)
  const totalBillings = Number(billings?.total || 0)

  const goToSearch = (tab, payload = {}) => {
    router.get(
      route('staff.find-billing'),
      cleanObject({
        active_tab: tab,
        ...payload,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    )
  }

  const goToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return
    }

    goToSearch(activeTab, {
      ...filters,
      page,
    })
  }

  const searchSummary = buildSearchSummary(filters, has_filters)

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-2xl sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.18),transparent_34%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-sky-200">
              <Search className="h-3.5 w-3.5" />
              Find Billing
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Search billing records with focused tabs and quick results.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Switch between customer, date, and range searches. Each tab calls its own component and keeps the search flow simple.
              </p>
            </div>

            <p className="text-sm text-slate-300">
              {searchSummary}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HeroStat label="Matches" value={totalBillings} />
            <HeroStat label="Page" value={`${currentPage}/${lastPage}`} />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-3xl bg-white p-2 shadow-sm md:grid-cols-4">
          <TabsTrigger
            value="customer"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium data-[state=active]:bg-slate-950 data-[state=active]:text-white"
          >
            <UserRoundSearch className="h-4 w-4" />
            Customer
          </TabsTrigger>
          <TabsTrigger
            value="single-date"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium data-[state=active]:bg-slate-950 data-[state=active]:text-white"
          >
            <Clock3 className="h-4 w-4" />
            Single Date
          </TabsTrigger>
          <TabsTrigger
            value="date-range"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium data-[state=active]:bg-slate-950 data-[state=active]:text-white"
          >
            <CalendarRange className="h-4 w-4" />
            Date Range
          </TabsTrigger>
          <TabsTrigger
            value="order-date"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium data-[state=active]:bg-slate-950 data-[state=active]:text-white"
          >
            <CalendarDays className="h-4 w-4" />
            Order Date
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="mt-0">
          <CustomerNameTab
            key={`customer-${filters.customer_name}-${filters.mobile_number}-${filters.order_number}`}
            filters={filters}
            onSearch={(payload) => goToSearch('customer', payload)}
            onReset={() => goToSearch('customer')}
          />
        </TabsContent>

        <TabsContent value="single-date" className="mt-0">
          <SingleDateTab
            key={`single-${filters.single_date_field}-${filters.single_date}`}
            filters={filters}
            onSearch={(payload) => goToSearch('single-date', payload)}
            onReset={() => goToSearch('single-date')}
          />
        </TabsContent>

        <TabsContent value="date-range" className="mt-0">
          <DateRangeTab
            key={`range-${filters.date_from}-${filters.date_to}`}
            filters={filters}
            onSearch={(payload) => goToSearch('date-range', payload)}
            onReset={() => goToSearch('date-range')}
          />
        </TabsContent>

        <TabsContent value="order-date" className="mt-0">
          <OrderDateTab
            key={`order-${filters.order_date}`}
            filters={filters}
            onSearch={(payload) => goToSearch('order-date', payload)}
            onReset={() => goToSearch('order-date')}
          />
        </TabsContent>
      </Tabs>

      <ResultsTable
        billings={billings}
        filters={filters}
        hasFilters={has_filters}
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={goToPage}
        onResetSearch={() => goToSearch(activeTab)}
      />
    </div>
  )
}

FindBilling.layout = page => <StaffLayout children={page} />
