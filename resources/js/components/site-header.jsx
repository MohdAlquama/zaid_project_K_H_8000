import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationCenter } from "@/components/notification-center"

export function SiteHeader() {
  return (
    <header
      className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center gap-2 border-b bg-white/70 backdrop-blur transition-[width,height] ease-linear dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium text-slate-900 dark:text-slate-100">Enterprise Operations</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}
