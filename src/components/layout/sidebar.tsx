"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  ShoppingCart,
  PlusCircle,
  BarChart3,
  Bell,
  UserCog,
  X,
  Mountain,
  FileText,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/strategy", label: "Strategy", icon: Lightbulb },
  { href: "/reporting", label: "Reporting", icon: BarChart3 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profiles", label: "Profiles & Prefs", icon: UserCog },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mountain className="h-4.5 w-4.5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Trailmap</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Separator />

        {/* New Order CTA */}
        <div className="px-4 py-4">
          <Link href="/new-order" onClick={() => setSidebarOpen(false)}>
            <Button className="w-full gap-2 shadow-md" size="lg">
              <PlusCircle className="h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-primary/5 p-3">
            <p className="text-xs font-medium text-primary">Need Help?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Contact your account manager or visit our help center.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
