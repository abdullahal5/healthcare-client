"use client";

import Link from "next/link";
import {
  Home,
  Settings,
  Users,
  FileText,
  Calendar,
  Mail,
  PieChart,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Home", icon: Home, href: "/" },
  { name: "Projects", icon: FileText, href: "/dashboard/super_admin/project" },
  { name: "Team", icon: Users, href: "/team" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Messages", icon: Mail, href: "/messages" },
  { name: "Analytics", icon: PieChart, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isOpen = state === "expanded";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-0">
        <div className="flex h-16 items-center mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              H
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="whitespace-nowrap text-lg font-bold tracking-tight">
                  Health Care
                </span>
                <span className="text-xs text-muted-foreground">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className="h-10 px-3"
              >
                <Link href={item.href} className="gap-3">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-0 py-2">
        <div className="px-2">
          <SidebarTrigger
            className={cn(
              "flex h-10 w-full items-center rounded-md p-2 hover:bg-accent",
              isOpen ? "justify-start gap-3" : "justify-center"
            )}
          >
            <Settings className="h-5 w-5" />
            {isOpen && <span className="truncate">Toggle Sidebar</span>}
          </SidebarTrigger>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
