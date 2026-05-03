import AdminLayout from "@/Layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import {
  ArrowRight,
  CreditCard,
  Database,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  ClipboardList,
  FileText,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const quickLinks = [
  {
    title: "Dashboard",
    description: "Open the admin overview to see today’s activity, due balances, and trends.",
    href: route("admin.dashboard"),
    icon: LayoutDashboard,
    accentClass: "from-sky-500 to-cyan-400",
  },
  {
    title: "Create Billing",
    description: "Start a new billing entry for a customer, frame, and lens combination.",
    href: route("admin.create-billing"),
    icon: CreditCard,
    accentClass: "from-emerald-500 to-lime-400",
  },
  {
    title: "View Billings",
    description: "Search, edit, invoice, collect payment, or delete existing bills.",
    href: route("admin.billing.view"),
    icon: FileText,
    accentClass: "from-amber-500 to-orange-400",
  },
  {
    title: "User / Staff",
    description: "Create or manage staff accounts and keep access under control.",
    href: route("admin.user-staff.index"),
    icon: Users,
    accentClass: "from-fuchsia-500 to-pink-400",
  },
  {
    title: "System Logs",
    description: "Review active sessions, filter records, and clear stale sessions safely.",
    href: route("admin.system-logs.index"),
    icon: Database,
    accentClass: "from-violet-500 to-indigo-400",
  },
  {
    title: "Reports",
    description: "Open financial reporting for exports and filtered business summaries.",
    href: route("admin.reports.index"),
    icon: ClipboardList,
    accentClass: "from-slate-700 to-slate-900",
  },
]

const workflowSteps = [
  {
    title: "1. Sign in",
    description: "Admins log in first. The sidebar and routes are protected by auth and role checks.",
  },
  {
    title: "2. Review the dashboard",
    description: "Use the dashboard to understand today’s billings, due balances, and collections.",
  },
  {
    title: "3. Manage billing",
    description: "Create, edit, invoice, and collect payments from the billing pages.",
  },
  {
    title: "4. Manage staff access",
    description: "Create admins or staff, set their status, and keep the account list clean.",
  },
  {
    title: "5. Check system logs",
    description: "Inspect Laravel session records whenever you need to troubleshoot access or remove old sessions.",
  },
]

const systemLogTips = [
  "Search by user name, email, session ID, user agent, or IP address.",
  "Pagination happens on the backend, so each page loads only a small set of records.",
  "Select rows with checkboxes to delete them in bulk.",
  "Use Delete All Sessions to remove every session except the one you are currently using.",
  "The current admin session is protected so you do not lock yourself out by accident.",
]

const supportChecklist = [
  "If a record is missing, clear the filters and try again.",
  "If a payment looks wrong, open the billing record and review the invoice or edit page.",
  "If a staff account cannot log in, check status and role first.",
  "If the site feels stale, refresh the page after deleting sessions so the latest table data loads.",
]

function GradientCard({ title, description, href, icon: Icon, accentClass }) {
  return (
    <Card className="group overflow-hidden rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className={`rounded-2xl bg-gradient-to-r ${accentClass} p-3 text-white shadow-lg`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="rounded-full">
            Ready
          </Badge>
        </div>

        <div className="space-y-2">
          <CardTitle className="text-xl text-slate-950">{title}</CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <Button asChild variant="outline" className="w-full justify-between">
          <Link href={href}>
            Open {title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function StepCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-semibold text-white">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Index() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-5">
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
              Admin Help Center
            </Badge>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                Learn the system, module by module.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                This help page explains how the admin side works, how to move through the main modules,
                and how to use session logs, billing, staff management, and reporting safely.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-slate-100">
                <Link href={route("admin.dashboard")}>
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={route("admin.system-logs.index")}>
                  View System Logs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">How it works</p>
              <p className="mt-3 text-2xl font-semibold text-white">Protected admin workflow</p>
              <p className="mt-2 text-sm text-slate-300">
                Each admin route checks authentication and the admin role before showing data or actions.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Best use</p>
              <p className="mt-3 text-2xl font-semibold text-white">Fast navigation</p>
              <p className="mt-2 text-sm text-slate-300">
                Use the sidebar to move between billing, reports, staff, and session cleanup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <Workflow className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">System flow</p>
                <p className="text-xl font-semibold text-slate-950">Dashboard to logs</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Start on the dashboard, work on billing, manage staff, and end with session review when needed.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Search</p>
                <p className="text-xl font-semibold text-slate-950">Filter first</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Every major admin list supports filtering so you can find the right record before deleting or editing.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Safety</p>
                <p className="text-xl font-semibold text-slate-950">Protected actions</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The current session is protected in the logs screen so you do not accidentally lock yourself out.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
          <div className="space-y-2">
            <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950">
              How the system works
            </Badge>
            <CardTitle className="text-2xl text-slate-950">Admin workflow overview</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-500">
              Use this sequence when training a new admin or when you want a quick reminder of the process.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {workflowSteps.map((step) => (
              <StepCard key={step.title} {...step} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
          <div className="space-y-2">
            <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950">
              Module guide
            </Badge>
            <CardTitle className="text-2xl text-slate-950">Where to go for each task</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-500">
              These cards show the main admin pages and what each page is for.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 p-6 lg:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <GradientCard key={item.title} {...item} />
          ))}
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
            <div className="space-y-2">
              <Badge className="rounded-full bg-violet-600 px-3 py-1 text-white hover:bg-violet-600">
                System logs help
              </Badge>
              <CardTitle className="text-2xl text-slate-950">How to use session logs</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-500">
                This is the page you use when you want to inspect, filter, or delete stored Laravel sessions.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6 py-6">
            <BulletList items={systemLogTips} />

            <Separator className="my-2" />

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-900">Typical session-log actions</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-medium text-slate-900">Search</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Find users, emails, IPs, or devices quickly.</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-medium text-slate-900">Select</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Tick rows to delete only the sessions you want.</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-medium text-slate-900">Delete</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Remove one record or clear all other sessions safely.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-200/70 bg-slate-50/80 px-6 py-6">
            <div className="space-y-2">
              <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-600">
                Support tips
              </Badge>
              <CardTitle className="text-2xl text-slate-950">What to do when something feels off</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-500">
                These notes are useful when training staff or fixing a data issue.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6 py-6">
            <BulletList items={supportChecklist} />

            <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/10 p-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Short version</p>
                  <p className="text-sm leading-6 text-slate-300">
                    Use the sidebar to move around, use filters before deleting, and use the logs page when you want
                    to inspect or clear session records.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Need a quick start?</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Go straight to the area you need.
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              The help center is here for training and reference, but the app pages are always one click away.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={route("admin.dashboard")}>Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={route("admin.system-logs.index")}>System Logs</Link>
            </Button>
            <Button asChild>
              <Link href={route("admin.billing.view")}>Billing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index

Index.layout = (page) => <AdminLayout children={page} />
