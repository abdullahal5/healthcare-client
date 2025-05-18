"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Patients", icon: Users, href: "/dashboard/patients" },
  { name: "Doctors", icon: Stethoscope, href: "/dashboard/doctors" },
  { name: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
  { name: "Medical Records", icon: FileText, href: "/dashboard/records" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    subItems: [
      { name: "Profile", href: "/dashboard/settings/profile" },
      { name: "Security", href: "/dashboard/settings/security" },
      { name: "Notifications", href: "/dashboard/settings/notifications" },
    ],
  },
];

const SidebarItem = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <SidebarMenu className="space-y-1">
      {navItems.map((item) => (
        <div key={item.name}>
          {item.subItems ? (
            <Collapsible defaultOpen={false} className="group">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.name}
                    className="h-10 px-3 cursor-pointer transition-all duration-300 hover:bg-accent/50"
                  >
                    <motion.div
                      className="flex items-center justify-between gap-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200" />
                        {isOpen && (
                          <motion.span
                            className="truncate"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </motion.div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
                  <SidebarMenuSub className="space-y-1 ml-4">
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.name}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SidebarMenuButton
                            asChild
                            className="h-8 px-3 transition-all duration-200 hover:bg-accent/30"
                          >
                            <Link href={subItem.href} className="gap-2">
                              {isOpen && (
                                <span className="truncate">{subItem.name}</span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </motion.div>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem>
              <motion.div whileHover={{ scale: 1.02 }}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  className="h-10 px-3 cursor-pointer transition-all duration-300 hover:bg-accent/50"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200" />
                    {isOpen && (
                      <motion.span
                        className="truncate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
          )}
        </div>
      ))}
    </SidebarMenu>
  );
};

export default SidebarItem;
