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
import { menuItems } from "@/utils/sidebarMenuItems";
import { UserRole } from "@/types/common";

const SidebarItem = ({ isOpen }: { isOpen: boolean }) => {
  const renderMenuItems = (items: any[]) => {
    return items.map((item) => (
      <div key={item.title}>
        {item.child ? (
          <Collapsible defaultOpen={false} className="group">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className="h-10 px-3 flex items-center justify-between gap-3 hover:bg-accent/30"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {isOpen && <span>{item.title}</span>}
                  </div>
                  <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 space-y-1">
                <SidebarMenuSub>{renderMenuItems(item.child)}</SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 px-3 flex items-center gap-3 hover:bg-accent/30"
            >
              <Link href={item.path} className="flex items-center gap-3">
                {item.icon && <item.icon className="h-5 w-5" />}
                {isOpen && <span>{item.title}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </div>
    ));
  };

  return (
    <SidebarMenu className="space-y-1">
      {renderMenuItems(menuItems("admin" as UserRole))}
    </SidebarMenu>
  );
};

export default SidebarItem;
