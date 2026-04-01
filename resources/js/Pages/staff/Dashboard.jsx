import React from "react"
import { Link } from "@inertiajs/react"
import { useAuth } from "@/context/AuthContext"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { FileText, ReceiptText, Search , DatabaseBackup , LogOut} from "lucide-react"
import StaffAdminLayout from "@/Layouts/StaffAdminLayout"

export default function SubAdmin() {
  const { user } = useAuth()

  if (!user) return null

  // Modules (You can later filter by permission)
  const modules = [
    {
      label: "Create Bill",
      path: route("staff.billing.create"),
      icon: <ReceiptText className="h-6 w-6" />,
    },
    {
      label: "View Billings",
      path: route("staff.billing.view"),
      icon: <FileText className="h-6 w-6" />,
    },
    {
     label: "Search Billings",
      path: route("staff.find-billing"),
      icon: <Search className="h-6 w-6" />,
    },
    {
     label: " Billings Update",
      path: route("staff.update-billing"),
      icon: <DatabaseBackup className="h-6 w-6" />,
    },
  ]

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.name?.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Staff Dashboard
            </p>
          </div>
           
          <Badge variant="default" className="px-4 py-1">
            {user.role}
          </Badge>
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Quick Access
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

            {modules.map((module) => (
              <Link key={module.label} href={module.path}>
                <Card className="group flex flex-col items-center justify-center p-6 rounded-xl border hover:border-primary hover:bg-muted/40 hover:shadow-lg transition-all cursor-pointer text-center">

                  <CardContent className="flex flex-col items-center gap-4 p-0">

                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      {module.icon}
                    </div>

                    <span className="text-sm font-medium">
                      {module.label}
                    </span>

                  </CardContent>

                </Card>
              </Link>
            ))}

          </div>
        </div>
 
      </div>
      
    </div>
  )
}

/* Layout */
SubAdmin.layout = (page) => (
  <StaffAdminLayout>
    {page}
  </StaffAdminLayout>
)
