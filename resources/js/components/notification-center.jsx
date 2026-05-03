import { useEffect, useMemo, useState } from "react"
import { Link } from "@inertiajs/react"
import {
  Bell,
  Database,
  FileText,
  ShieldCheck,
  UserCog,
} from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const buildNotifications = (displayName) => [
  {
    id: 1,
    title: `Welcome back, ${displayName}`,
    body: "Your admin dashboard is ready. Billing, staff, and session tools are available now.",
    time: "Just now",
    unread: true,
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Billing saved",
    body: "A new optical billing record was created successfully.",
    time: "12m ago",
    unread: true,
    icon: FileText,
  },
  {
    id: 3,
    title: "Session cleanup ready",
    body: "Review stale login sessions in System Logs before they pile up.",
    time: "1h ago",
    unread: false,
    icon: Database,
  },
  {
    id: 4,
    title: "Staff access updated",
    body: "User and staff permissions were refreshed for the latest account changes.",
    time: "2h ago",
    unread: false,
    icon: UserCog,
  },
]

export function NotificationCenter() {
  const { user } = useAuth()
  const displayName = user?.name?.trim() || "Admin"

  const initialNotifications = useMemo(
    () => buildNotifications(displayName),
    [displayName],
  )
  const [notifications, setNotifications] = useState(initialNotifications)

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  )

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => (item.unread ? { ...item, unread: false } : item)),
    )
  }

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
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle>Notifications</SheetTitle>
              <p className="mt-1 text-sm text-slate-500">
                Signed in as {displayName}
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              Live
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[70vh] pr-4">
          <div className="space-y-4">
            {notifications.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 shadow-sm ${
                    item.unread
                      ? "border-sky-200 bg-sky-50/70 dark:border-sky-800/60 dark:bg-sky-900/20"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-xl p-2 ${
                        item.unread
                          ? "bg-white/80 dark:bg-slate-900/60"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                        <span className="text-xs text-slate-500">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={markAllRead} disabled={unreadCount === 0}>
            Mark all read
          </Button>
          <Button asChild className="flex-1">
            <Link href={route("admin.system-logs.index")}>
              Open logs
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
