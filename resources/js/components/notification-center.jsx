import { useMemo } from "react"
import { Bell, CheckCircle2, Clock3, MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "Emergency leave auto-approved",
    body: "Sick leave for Asha Mehta escalated and approved.",
    time: "Just now",
    unread: true,
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Approval pending",
    body: "3 leave requests awaiting your review.",
    time: "12m ago",
    unread: true,
    icon: Clock3,
  },
  {
    id: 3,
    title: "Bulk notification sent",
    body: "WhatsApp alerts delivered to 42 recipients.",
    time: "1h ago",
    unread: false,
    icon: MessageSquareText,
  },
]

export function NotificationCenter() {
  const unreadCount = useMemo(
    () => SAMPLE_NOTIFICATIONS.filter((item) => item.unread).length,
    []
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-2 top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <Badge variant="secondary" className="rounded-full">Live</Badge>
          </div>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[70vh] pr-4">
          <div className="space-y-4">
            {SAMPLE_NOTIFICATIONS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 shadow-sm ${item.unread ? "border-indigo-200 bg-indigo-50/60 dark:border-indigo-800/60 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-800"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2 ${item.unread ? "bg-white/80 dark:bg-slate-900/60" : "bg-slate-100 dark:bg-slate-800"}`}>
                      <Icon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <span className="text-xs text-slate-500">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1">Mark all read</Button>
          <Button className="flex-1">Bulk notify</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
