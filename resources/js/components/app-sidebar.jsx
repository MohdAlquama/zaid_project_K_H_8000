"use client"

import * as React from "react"
import { Link } from "@inertiajs/react"
import {
  ArrowUpCircleIcon,
  LayoutDashboardIcon,
  FolderIcon,
  UsersIcon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  DatabaseIcon,
  ClipboardListIcon,
  FileIcon,
  IdCard,
  BookText,
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  FileTextIcon,
  MessageSquareIcon,
  CalendarDays,
} from "lucide-react"


import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain2 } from "./nav-main2"

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Create Billing",
      url: "/admin/create__/billing",
      icon: Bot,
    },
    {
      title: "View Billing",
      url: "/admin/view__/billing",
      icon: FileTextIcon,
    },
      {
      title: "Create Subjects",
      url: "/admin/subjects",
      icon: BookText,
    },
    {
      title: "Academic",
      url: "/admin/academic-year",
      icon: FolderIcon,
    },
    {
      title: "Teachers",
      url: "/admin/teachers",
      icon: UsersIcon,
    },
 {
  title: "User / Staff Management",
  url: "/admin/create__/user/staff",
  icon: UsersIcon,
},
    {
      title: "IdCard Settings",
      url: "/admin/i-card-settings",
      icon: IdCard,
    },
  ],




  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
    {
      title: "Help",
      url: "/admin/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/admin/search",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Library",
      url: "/admin/library",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: ClipboardListIcon,
    },
    {
      name: "Assistant",
      url: "/admin/assistant",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">
                  ERP System
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
      <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

    </Sidebar>
  )
}
