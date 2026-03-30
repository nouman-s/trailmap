"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  Shield,
  Users,
  Briefcase,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { users } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/lib/types";

const roleConfig: Record<Role, { label: string; icon: React.ElementType; color: string }> = {
  client: { label: "Client", icon: Briefcase, color: "text-blue-600" },
  internal: { label: "Internal", icon: Users, color: "text-violet-600" },
  admin: { label: "Admin", icon: Shield, color: "text-amber-600" },
};

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { role, setRole, setSidebarOpen, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentUser = users.find((u) => u.role === role) || users[0];
  const currentRoleConfig = roleConfig[role];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Role Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <currentRoleConfig.icon className={`h-4 w-4 ${currentRoleConfig.color}`} />
            <span className="hidden sm:inline">{currentRoleConfig.label} View</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.keys(roleConfig) as Role[]).map((r) => {
            const config = roleConfig[r];
            return (
              <DropdownMenuItem key={r} onClick={() => setRole(r)} className="gap-2 cursor-pointer">
                <config.icon className={`h-4 w-4 ${config.color}`} />
                {config.label}
                {role === r && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => router.push("/notifications")}
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profiles")} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profiles")} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
