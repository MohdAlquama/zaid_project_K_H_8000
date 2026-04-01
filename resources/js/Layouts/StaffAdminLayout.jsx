import { AuthProvider } from "@/context/AuthContext"

export default function StaffAdminLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar / Header here */}

        <main className="">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
