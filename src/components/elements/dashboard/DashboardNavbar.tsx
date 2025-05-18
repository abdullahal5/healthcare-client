"use client";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const DashboardNavbar = () => {
  return (
    <div className="w-full border-b bg-background shadow-sm">
      <header className="h-16 flex items-center justify-between px-6 max-w-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="rounded-md p-2 hover:bg-accent"></SidebarTrigger>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          <Avatar>
            <AvatarImage
              width={40}
              height={40}
              className="rounded-full"
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
};

export default DashboardNavbar;
