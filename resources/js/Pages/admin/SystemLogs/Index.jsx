import AdminLayout from "@/Layouts/AdminLayout"
import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { Database, ShieldCheck, Trash2, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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

const emptyFilters = {
  search: "",
  session_id: "",
  ip_address: "",
}

const emptySessions = {
  data: [],
  current_page: 1,
  last_page: 1,
  total: 0,
  from: null,
  to: null,
}

const emptySummary = {
  total_sessions: 0,
  authenticated_sessions: 0,
  guest_sessions: 0,
}

const formatCount = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0))

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

const formatSessionId = (value) => {
  if (!value) {
    return "-"
  }

  const sessionId = `${value}`

  if (sessionId.length <= 16) {
    return sessionId
  }

  return `${sessionId.slice(0, 8)}…${sessionId.slice(-4)}`
}

const formatLabel = (value) => {
  if (!value) {
    return "-"
  }

  return `${value}`.charAt(0).toUpperCase() + `${value}`.slice(1)
}

const getDeviceLabel = (userAgent) => {
  if (!userAgent) {
    return "Unknown device"
  }

  const normalized = `${userAgent}`.toLowerCase()

  if (normalized.includes("tablet") || normalized.includes("ipad")) {
    return "Tablet"
  }

  if (normalized.includes("mobile") || normalized.includes("android") || normalized.includes("iphone")) {
    return "Mobile"
  }

  return "Desktop"
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

function Index({
  sessions = emptySessions,
  filters = emptyFilters,
  summary = emptySummary,
}) {
  const [filterData, setFilterData] = useState({
    ...emptyFilters,
    ...filters,
  })
  const [selectedSessionIds, setSelectedSessionIds] = useState([])

  const sessionRows = Array.isArray(sessions?.data) ? sessions.data : []
  const currentPage = Number(sessions?.current_page || 1)
  const lastPage = Number(sessions?.last_page || 1)
  const totalSessions = Number(sessions?.total || 0)
  const fromRecord = sessions?.from
  const toRecord = sessions?.to
  const pageItems = buildPageItems(currentPage, lastPage)
  const hasActiveFilters = Object.values(filters).some((value) => `${value}`.trim() !== "")
  const visibleDeletableSessionIds = sessionRows
    .filter((session) => !session.is_current)
    .map((session) => `${session.id}`)
  const selectedCount = selectedSessionIds.length
  const visibleSelectionCount = visibleDeletableSessionIds.filter((id) => selectedSessionIds.includes(id)).length
  const allVisibleSelected = visibleDeletableSessionIds.length > 0 && visibleSelectionCount === visibleDeletableSessionIds.length
  const someVisibleSelected = visibleSelectionCount > 0 && !allVisibleSelected
  const emptyMessage = hasActiveFilters
    ? "No session logs match the current filters."
    : totalSessions === 0
      ? "No session logs are available yet."
      : "This page has no visible session logs after the latest update."

  const summaryCards = [
    {
      title: "Total Sessions",
      value: formatCount(summary?.total_sessions),
      helper: "Every row currently stored in the sessions table.",
      icon: Database,
      accentClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
    },
    {
      title: "Authenticated",
      value: formatCount(summary?.authenticated_sessions),
      helper: "Sessions tied to registered users.",
      icon: ShieldCheck,
      accentClass: "bg-gradient-to-r from-emerald-500 to-lime-400",
    },
    {
      title: "Guest Sessions",
      value: formatCount(summary?.guest_sessions),
      helper: "Anonymous browser sessions without a user account.",
      icon: UserRound,
      accentClass: "bg-gradient-to-r from-amber-500 to-orange-400",
    },
  ]

  useEffect(() => {
    setFilterData({
      ...emptyFilters,
      ...filters,
    })
  }, [filters])

  useEffect(() => {
    setSelectedSessionIds([])
  }, [currentPage, sessionRows, filters.search, filters.session_id, filters.ip_address])

  const handleFilterChange = (field, value) => {
    setFilterData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const applyFilters = (event) => {
    event.preventDefault()

    router.get(route("admin.system-logs.index"), compactFilters(filterData), {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  const resetFilters = () => {
    setFilterData({ ...emptyFilters })

    router.get(route("admin.system-logs.index"), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  const navigateToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return
    }

    router.get(route("admin.system-logs.index"), {
      ...compactFilters(filters),
      page,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const toggleSessionSelection = (sessionId, checked) => {
    setSelectedSessionIds((current) => (
      checked
        ? Array.from(new Set([...current, sessionId]))
        : current.filter((id) => id !== sessionId)
    ))
  }

  const toggleVisibleSelection = (checked) => {
    setSelectedSessionIds(checked ? visibleDeletableSessionIds : [])
  }

  const deleteSession = (session) => {
    if (session.is_current) {
      return
    }

    if (!window.confirm(`Delete session ${formatSessionId(session.id)}?`)) {
      return
    }

    router.delete(route("admin.system-logs.destroy", session.id), {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedSessionIds((current) => current.filter((id) => id !== `${session.id}`))
      },
    })
  }

  const deleteSelectedSessions = () => {
    if (selectedCount === 0) {
      return
    }

    if (!window.confirm(`Delete ${selectedCount} selected session${selectedCount === 1 ? "" : "s"}?`)) {
      return
    }

    router.post(route("admin.system-logs.destroy-selected"), {
      session_ids: selectedSessionIds,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedSessionIds([])
      },
    })
  }

  const deleteAllSessions = () => {
    if (!window.confirm("Delete all sessions except your current admin session?")) {
      return
    }

    router.delete(route("admin.system-logs.destroy-all"), {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedSessionIds([])
      },
    })
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.95fr]">
          <div className="space-y-5">
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
              Database session logs
            </Badge>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                Session Logs
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Review stored Laravel sessions from the admin side, search by user, email, session ID, or IP address,
                and clear stale access without leaving this page.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/5">
                Current session protected
              </Badge>
              <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/5">
                Bulk delete supported
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {summaryCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
          <CardTitle className="text-2xl text-slate-950">Filter Sessions</CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            Search by user, email, session ID, device string, or IP address.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={applyFilters} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-3">
                <Label>Search</Label>
                <Input
                  value={filterData.search}
                  onChange={(event) => handleFilterChange("search", event.target.value)}
                  placeholder="Search user, email, or device"
                />
              </div>

              <div className="space-y-2">
                <Label>Session ID</Label>
                <Input
                  value={filterData.session_id}
                  onChange={(event) => handleFilterChange("session_id", event.target.value)}
                  placeholder="Filter by session ID"
                />
              </div>

              <div className="space-y-2">
                <Label>IP Address</Label>
                <Input
                  value={filterData.ip_address}
                  onChange={(event) => handleFilterChange("ip_address", event.target.value)}
                  placeholder="Filter by IP address"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">Session records</p>
              <p className="text-sm text-slate-500">
                {selectedCount > 0
                  ? `${selectedCount} session${selectedCount === 1 ? "" : "s"} selected on this page.`
                  : "Use the checkboxes to select rows for bulk deletion."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={deleteSelectedSessions}
                disabled={selectedCount === 0}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={deleteAllSessions}
                disabled={Number(summary?.total_sessions || 0) <= 1}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete All Sessions
              </Button>
            </div>
          </div>

          <div className="px-6 pb-3 text-xs text-slate-500">
            Your current admin session stays active so you can keep managing the system.
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={allVisibleSelected ? true : (someVisibleSelected ? "indeterminate" : false)}
                        onCheckedChange={(value) => toggleVisibleSelection(!!value)}
                        disabled={visibleDeletableSessionIds.length === 0}
                        aria-label="Select all sessions on this page"
                      />
                    </div>
                  </TableHead>
                  <TableHead>Session ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sessionRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-slate-500">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  sessionRows.map((session) => {
                    const sessionId = `${session.id}`
                    const isSelectable = !session.is_current
                    const isSelected = selectedSessionIds.includes(sessionId)
                    const userLabel = session.user_name || session.user_email || (session.user_id ? "Former user" : "Guest session")
                    const accessLabel = session.user_id ? "Authenticated" : "Guest"

                    return (
                      <TableRow
                        key={sessionId}
                        className={session.is_current ? "bg-amber-50/60 hover:bg-amber-50/60" : ""}
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(value) => toggleSessionSelection(sessionId, !!value)}
                              disabled={!isSelectable}
                              aria-label={`Select session ${sessionId}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-700" title={session.id}>
                          {formatSessionId(session.id)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-slate-950">{userLabel}</span>
                              {session.is_current ? (
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  Current
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-xs text-slate-500">
                              {session.user_email || (session.user_id ? "No email available" : "Guest session")}
                            </p>
                            {session.user_role ? (
                              <Badge variant="outline" className="w-fit text-xs">
                                {formatLabel(session.user_role)}
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>{session.ip_address || "-"}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-slate-950">{getDeviceLabel(session.user_agent)}</p>
                            <p
                              className="max-w-[22rem] truncate text-xs text-slate-500"
                              title={session.user_agent || "Unknown user agent"}
                            >
                              {session.user_agent || "Unknown user agent"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(session.last_activity_at)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={session.user_id
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"}
                          >
                            {accessLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSession(session)}
                              disabled={!isSelectable}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200/70 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">
              {totalSessions === 0
                ? "No session records available."
                : `Showing ${fromRecord} to ${toRecord} of ${totalSessions} matching session records.`}
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
    </div>
  )
}

export default Index

Index.layout = (page) => <AdminLayout children={page} />
