"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings, User } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarItem from "./SidebarItem";
import assets from "@/assets";

export function AppSidebar() {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const isOpen = state === "expanded";

  console.log({ isMobile, openMobile });

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        "sm:w-64 sm:block",
        isMobile ? "bg-white" : ""
      )}
    >
      {/* Sidebar Header */}
      <SidebarHeader className={`border-b h-16 ${isOpen ? "w-full" : "w-16"}`}>
        <div
          className={`flex h-full items-center ${
            isOpen ? "justify-between px-4" : "justify-center"
          }`}
        >
          {isOpen ? (
            <Link
              href="/"
              className="flex items-center gap-3 w-full max-w-[calc(100%-40px)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md">
                <Image
                  src={assets.svgs.logo ?? "/default-logo.svg"}
                  width={24}
                  height={24}
                  alt="Logo"
                  className="text-primary-foreground"
                />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="whitespace-nowrap text-lg font-bold tracking-tight">
                  Health Care
                </span>
                <span className="text-xs text-muted-foreground">
                  Admin Portal
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex h-full items-center justify-center w-full">
              <div className="flex pr-3 items-center justify-center rounded-md">
                <Image
                  src={assets.svgs.logo ?? "/default-logo.svg"}
                  width={24}
                  height={24}
                  alt="Logo"
                />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-4 overflow-y-auto">
        <SidebarItem isOpen={isOpen} />
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t px-2 py-3">
        <div
          className={cn(
            "flex items-center justify-between",
            isOpen ? "gap-3" : "justify-center"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            {isOpen && (
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">
                  admin@healthcare.com
                </span>
              </div>
            )}
          </div>

          {isOpen && (
            <SidebarTrigger className="rounded-md p-2 hover:bg-accent">
              <Settings className="h-5 w-5" />
            </SidebarTrigger>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
