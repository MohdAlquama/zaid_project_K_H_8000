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
  LogsIcon,
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
import { useAuth } from "@/context/AuthContext"


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
  title: "User / Staff Management",
  url: "/admin/create__/user/staff",
  icon: UsersIcon,
},{
title: "Invoice Settings",
url: "/admin/invoice-control",
icon: Settings2,
}

  ],




  navSecondary: [
   
    {
      title: "Help",
      url: "/admin/help",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Reports",
      url: "/admin/reports",
      icon: ClipboardListIcon,
    },
    {
  name: "System Logs",
  url: "/admin/system.logs",
  icon: LogsIcon,
}
  ,
  ],
}

export function AppSidebar(props) {
    const { user } = useAuth()
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
                  Eye Care System
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
        <NavUser user={user} />
      </SidebarFooter>

    </Sidebar>
  )
}
