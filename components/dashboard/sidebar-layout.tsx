"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { logout } from "@/store/slices/auth-slice";
import {
  Home,
  LayoutDashboard,
  ListOrderedIcon,
  LogOut,
  Package,
  Settings,
  ShoppingBasket,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Item = { title: string; href: string; icon: React.ElementType };

const adminItems: Item[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  {
    title: "Custom Orders",
    href: "/dashboard/custom-orders",
    icon: ShoppingBasket,
  },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const distributorItems: Item[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Assigned Orders", href: "/dashboard/distributor", icon: Truck },
];

const customerItems: Item[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/dashboard/my-order", icon: Package },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const role = useAppSelector((s) => s.auth.user?.role);
  const name = useAppSelector((s) => s.auth.user?.name);
  const email = useAppSelector((s) => s.auth.user?.email);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname(); // ✅ Active route track

  const items =
    role === "DISTRIBUTOR"
      ? distributorItems
      : role === "CUSTOMER"
      ? customerItems
      : adminItems;

  const title =
    role === "DISTRIBUTOR"
      ? "Distributor"
      : role === "CUSTOMER"
      ? "Customer"
      : "Admin";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <SidebarProvider>
      <Sidebar className="">
        <SidebarHeader />
        <div className="w-24 ml-2">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="cursor-pointer" />
          </Link>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((i) => {
                  const isActive = pathname === i.href; // ✅ Active check
                  return (
                    <SidebarMenuItem key={i.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={i.href}
                          className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
                            isActive
                              ? "bg-zinc-200 text-black font-medium"
                              : "text-zinc-600 hover:bg-zinc-100"
                          }`}
                        >
                          <i.icon
                            className={`h-4 w-4 ${
                              isActive ? "text-black" : "text-zinc-500"
                            }`}
                          />
                          <span>{i.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Info */}
        <SidebarFooter>
          {name && email && (
            <div className="flex flex-col p-3 border-t">
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-zinc-500">{email}</div>
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-1 text-red-600 hover:underline"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <div className="text-sm text-zinc-600">FurniX Dashboard</div>
        </div>
        <main className="flex-1 p-3 sm:p-6">{children}</main>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </SidebarProvider>
  );
}
