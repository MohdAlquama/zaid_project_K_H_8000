"use client"

import { MailIcon, PlusCircleIcon } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }) {
  const { url } = usePage() // for active highlighting

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        
        {/* Quick Create */}
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground"
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>

            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}

        {/* Main Navigation */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={
                  url === item.url
                    ? "bg-muted font-semibold"
                    : ""
                }
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>

            </SidebarMenuItem>
          ))}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}
