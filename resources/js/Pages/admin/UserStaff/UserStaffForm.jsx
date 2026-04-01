import { Link, useForm } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formatOptionLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1)

function FieldError({ message }) {
  if (!message) {
    return null
  }

  return <p className="text-sm text-red-600">{message}</p>
}

function UserStaffForm({
  mode = "create",
  user = null,
  roleOptions = [],
  statusOptions = [],
  currentUserId = null,
}) {
  const isEdit = mode === "edit"
  const isCurrentUser = Number(user?.id) === Number(currentUserId)

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "staff",
    status: user?.status ?? "active",
    password: "",
    password_confirmation: "",
  })

  const submit = (event) => {
    event.preventDefault()

    if (isEdit) {
      put(route("admin.user-staff.update", user.id))
      return
    }

    post(route("admin.user-staff.store"))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              User / Staff Management
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {isEdit ? "Edit User / Staff" : "Create User / Staff"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {isEdit
                ? "Update account details, access role, and status from the admin panel."
                : "Create a new admin or staff account for system access."}
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href={route("admin.user-staff.index")}>Back To List</Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>{isEdit ? "Account Details" : "New Account"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Leave password blank if you do not want to change it."
              : "Fill in the account information below to create a new user."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(event) => setData("name", event.target.value)}
                  placeholder="Enter full name"
                />
                <FieldError message={errors.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(event) => setData("email", event.target.value)}
                  placeholder="Enter email address"
                />
                <FieldError message={errors.email} />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={data.role}
                  onValueChange={(value) => setData("role", value)}
                  disabled={isCurrentUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatOptionLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.role} />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={data.status}
                  onValueChange={(value) => setData("status", value)}
                  disabled={isCurrentUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatOptionLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.status} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(event) => setData("password", event.target.value)}
                  placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
                />
                <FieldError message={errors.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(event) => setData("password_confirmation", event.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {isCurrentUser ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your own account must stay as an active admin, so those changes are protected.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={processing}>
                {processing
                  ? (isEdit ? "Updating..." : "Creating...")
                  : (isEdit ? "Update User" : "Create User")}
              </Button>
              <Button asChild variant="outline">
                <Link href={route("admin.user-staff.index")}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserStaffForm
