"use client";

import {
  Bell,
  LogOut,
  Settings,
  UserIcon,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
  const { isLoading, data } = useGetSingleUserQuery({});
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "USER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  }

  return (
    <div className="w-full sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <header className="h-16 flex items-center justify-between px-6 max-w-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="rounded-md p-2 hover:bg-accent transition-colors" />
          <div className="flex flex-col">
            {isLoading ? (
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-foreground">
                  Welcome back, {data?.name || "User"}!
                </h1>
                <p className="text-xs text-muted-foreground">
                  {getTimeGreeting()}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center animate-pulse">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-accent transition-colors"
              >
                {isLoading ? (
                  <Skeleton className="h-10 w-10 rounded-full" />
                ) : (
                  <>
                    <Avatar className="h-10 w-10 border-2 border-border">
                      {data?.profilePhoto ? (
                        <AvatarImage
                          src={data.profilePhoto || "/placeholder.svg"}
                          alt={data.name}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {data?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 bg-white"
              align="end"
              forceMount
            >
              {isLoading ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-border">
                        {data?.profilePhoto ? (
                          <AvatarImage
                            src={data.profilePhoto || "/placeholder.svg"}
                            alt={data.name}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                            {data?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">
                          {data?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {data?.email || "email@example.com"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className={getRoleColor(data?.role || "")}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {data?.role || "USER"}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(data?.status || "")}
                          >
                            {data?.status || "UNKNOWN"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t space-y-2">
                      {data?.createdAt && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-2" />
                          Member since {formatDate(data.createdAt)}
                        </div>
                      )}
                      {data?.needPasswordChange && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          ⚠️ Password change required
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors">
                    <UserIcon className="mr-3 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default DashboardNavbar;
