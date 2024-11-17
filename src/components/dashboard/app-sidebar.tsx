"use client"

import * as React from "react"
import {
  BotIcon,
  ChartLineIcon,
  IdCardIcon,
  Settings2Icon,
  SquareTerminalIcon,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User } from "@prisma/client"

const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  header:
  {
    name: "Attendify",
    logo: IdCardIcon,
    plan: "shironism",
  },
  navMain: [
    {
      title: "Monitor",
      url: "monitor",
      icon: SquareTerminalIcon,
      isActive: true,
    },
    {
      title: "Stats",
      url: "stats",
      icon: ChartLineIcon,
    },
    {
      title: "Control",
      url: "control",
      icon: BotIcon,
    },
    {
      title: "Setting",
      url: "setting",
      icon: Settings2Icon,
    },
  ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
  data.user = {
    name: user.name,
    email: user.email,
    avatar: "/avatars/shadcn.jpg"
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <data.header.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {data.header.name}
            </span>
            <span className="truncate text-xs">{data.header.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
