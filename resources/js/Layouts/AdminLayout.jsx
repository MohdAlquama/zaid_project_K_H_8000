import { AuthProvider, useAuth } from "@/context/AuthContext"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

function LayoutContent({ children }) {
  const { user } = useAuth()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        <AppSidebar variant="inset" />

        <SidebarInset className="flex flex-col flex-1">
          <SiteHeader />

          <main className="flex-1 p-6 bg-gray-50 flex flex-col">

            {/* Page Content */}
            <div className="flex-1">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-10 border-t pt-4">
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border rounded-xl p-4 text-center shadow-sm">
               

                <p className="text-xs text-gray-600 leading-relaxed">
                   System updates are regularly deployed for better performance.  
                   For queries, contact support.  
                   Support is available for all users.  
                   New upgrades contact me .
                </p>
              </div>

           {/* Developer Credit */}
<p className="text-center text-xs text-gray-400 mt-3">
  © 2026 • Developed by{" "}
  <span className="font-bold text-gray-600">Mohd Alquama</span>
  {" "}• 📞 9026226199
</p>

            </footer>

          </main>
        </SidebarInset>

      </div>
    </SidebarProvider>
  )
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  )
}