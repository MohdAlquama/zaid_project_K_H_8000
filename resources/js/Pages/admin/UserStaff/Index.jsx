import AdminLayout from "@/Layouts/AdminLayout"
import { Link, router } from "@inertiajs/react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const emptyFilters = {
  name: "",
  email: "",
  role: "",
  status: "",
}

const emptyUsers = {
  data: [],
  current_page: 1,
  last_page: 1,
  total: 0,
  from: null,
  to: null,
}

const formatOptionLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1)

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  return new Date(value).toLocaleDateString()
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

function Index({
  users = emptyUsers,
  filters = emptyFilters,
  roleOptions = [],
  statusOptions = [],
  currentUserId = null,
}) {
  const [filterData, setFilterData] = useState({
    ...emptyFilters,
    ...filters,
  })

  const userList = Array.isArray(users?.data) ? users.data : []
  const currentPage = Number(users?.current_page || 1)
  const lastPage = Number(users?.last_page || 1)
  const totalUsers = Number(users?.total || 0)
  const fromRecord = users?.from
  const toRecord = users?.to
  const pageItems = buildPageItems(currentPage, lastPage)

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

    router.get(route("admin.user-staff.index"), compactFilters(filterData), {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  const resetFilters = () => {
    setFilterData({ ...emptyFilters })

    router.get(route("admin.user-staff.index"), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  const navigateToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return
    }

    router.get(route("admin.user-staff.index"), {
      ...compactFilters(filters),
      page,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const deleteUser = (user) => {
    if (Number(user.id) === Number(currentUserId)) {
      return
    }

    if (!window.confirm(`Delete user ${user.name}?`)) {
      return
    }

    router.delete(route("admin.user-staff.destroy", user.id), {
      preserveScroll: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Admin Management
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              User / Staff Management
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create, edit, filter, and delete admin or staff accounts from one place.
            </p>
          </div>

          <Button asChild>
            <Link href={route("admin.user-staff.create")}>Create User / Staff</Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={applyFilters} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={filterData.name}
                  onChange={(event) => handleFilterChange("name", event.target.value)}
                  placeholder="Search name"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={filterData.email}
                  onChange={(event) => handleFilterChange("email", event.target.value)}
                  placeholder="Search email"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={filterData.role || "all"}
                  onValueChange={(value) => handleFilterChange("role", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatOptionLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filterData.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatOptionLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit">Filter</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset
              </Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {userList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                      No user or staff records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  userList.map((user) => {
                    const isCurrentUser = Number(user.id) === Number(currentUserId)

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{user.name}</span>
                            {isCurrentUser ? <Badge variant="secondary">You</Badge> : null}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{formatOptionLabel(user.role || "staff")}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "secondary" : "outline"}
                            className={user.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                          >
                            {formatOptionLabel(user.status || "inactive")}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={route("admin.user-staff.edit", user.id)}>Edit</Link>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteUser(user)}
                              disabled={isCurrentUser}
                            >
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

          <div className="flex flex-col gap-4 border-t px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">
              {totalUsers === 0
                ? "No user or staff records available."
                : `Showing ${fromRecord} to ${toRecord} of ${totalUsers} user or staff records.`}
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
