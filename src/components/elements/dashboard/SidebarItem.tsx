"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { IRoleMenus, menuItems } from "@/utils/sidebarMenuItems";
import { UserRole } from "@/types/common";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getUserInfo } from "@/services/auth.services";
import { useEffect, useState } from "react";

const SidebarItem = ({ isOpen }: { isOpen: boolean }) => {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const { role } = getUserInfo();

    setUserRole(role);
  }, []);

  const isActive = (path: string) => {
    if (path === `/dashboard/${userRole}`) {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const renderMenuItems = (items: IRoleMenus[], parentPath = "") => {
    return items.map((item: IRoleMenus) => {
      const fullPath = parentPath
        ? `${parentPath}/${item.path}`
        : `/dashboard/${item.path}`;
      const active = isActive(fullPath);

      return (
        <div key={item.title}>
          {item.child ? (
            <Collapsible defaultOpen={active} className="group">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 px-3 flex items-center justify-between gap-3 hover:bg-accent/30 transition-all duration-300",
                      active
                        ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg rounded-lg"
                        : ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            active ? "text-white scale-105" : "text-gray-500"
                          )}
                        />
                      )}
                      {isOpen && (
                        <span
                          className={cn(
                            "transition-opacity duration-300",
                            active ? "font-semibold" : "font-normal"
                          )}
                        >
                          {item.title}
                        </span>
                      )}
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        active && "rotate-90"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 space-y-1">
                  <SidebarMenuSub>
                    {renderMenuItems(item.child, fullPath)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "h-10 px-3 flex items-center gap-3 hover:bg-accent/30 transition-all duration-300",
                  active
                    ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg rounded-lg"
                    : "border-2"
                )}
              >
                <Link href={fullPath} className="flex items-center gap-3">
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-300",
                        active ? "text-white scale-105" : "text-gray-500"
                      )}
                    />
                  )}
                  {isOpen && (
                    <span
                      className={cn(
                        "transition-opacity duration-300",
                        active ? "font-semibold" : "font-normal"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </div>
      );
    });
  };

  return (
    <SidebarMenu className="space-y-1">
      {renderMenuItems(menuItems(userRole as UserRole))}
    </SidebarMenu>
  );
};

export default SidebarItem;
