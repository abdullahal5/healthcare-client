"use client";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/elements/dashboard/AppSidebar";
import DashboardNavbar from "@/components/elements/dashboard/DashboardNavbar";
import { isLoggedIn } from "@/services/auth.services";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const authenticated = isLoggedIn();
    setIsAuthenticated(authenticated as boolean);

    if (!authenticated) {
      router.push("/login");
    }
  }, [router]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <DashboardNavbar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
