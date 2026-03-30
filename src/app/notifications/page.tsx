"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Archive,
  Eye,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-l-blue-500",
  },
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "border-l-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-l-amber-500",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-l-red-500",
  },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, archiveNotification } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read && !n.archived);
  const read = notifications.filter((n) => n.read && !n.archived);
  const archived = notifications.filter((n) => n.archived);

  const handleMarkAllRead = () => {
    unread.forEach((n) => markNotificationRead(n.id));
    toast.success("All notifications marked as read");
  };

  const handleGoTo = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link) {
      router.push(link);
    }
  };

  const renderNotification = (n: (typeof notifications)[0]) => {
    const config = typeConfig[n.type];
    const Icon = config.icon;
    const timeAgo = formatDistanceToNow(new Date(n.createdAt), { addSuffix: true });

    return (
      <div
        key={n.id}
        className={cn(
          "group rounded-lg border border-l-4 p-4 transition-all hover:shadow-md",
          !n.read ? "bg-muted/30" : "bg-background",
          config.border
        )}
      >
        <div className="flex gap-3">
          <div className={cn("shrink-0 rounded-lg p-2", config.bg)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={cn("font-medium text-sm", !n.read && "font-semibold")}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                  {n.message}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground/75">{timeAgo}</p>
              </div>
              {!n.read && (
                <div className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              {!n.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => {
                    markNotificationRead(n.id);
                    toast.success("Marked as read");
                  }}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Mark Read
                </Button>
              )}
              {!n.archived && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => {
                    archiveNotification(n.id);
                    toast.success("Notification archived");
                  }}
                >
                  <Archive className="mr-1 h-3 w-3" />
                  Archive
                </Button>
              )}
              {n.link && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-primary"
                  onClick={() => handleGoTo(n.id, n.link)}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const emptyState = (icon: React.ElementType, message: string, sub: string) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
        <p className="mt-1 text-sm text-muted-foreground/75">{sub}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">
            Stay up to date with your campaign activity.
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="unread">
        <TabsList>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unread.length > 0 && (
              <Badge className="ml-1 h-5 min-w-5 px-1.5" variant="default">
                {unread.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read" className="gap-2">
            Read
            <Badge className="ml-1 h-5 min-w-5 px-1.5" variant="secondary">
              {read.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-2">
            Archived
            <Badge className="ml-1 h-5 min-w-5 px-1.5" variant="secondary">
              {archived.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3 mt-4">
          {unread.length === 0
            ? emptyState(Bell, "All caught up!", "No unread notifications.")
            : unread.map(renderNotification)}
        </TabsContent>

        <TabsContent value="read" className="space-y-3 mt-4">
          {read.length === 0
            ? emptyState(CheckCircle2, "No read notifications", "Notifications you've read will appear here.")
            : read.map(renderNotification)}
        </TabsContent>

        <TabsContent value="archived" className="space-y-3 mt-4">
          {archived.length === 0
            ? emptyState(Archive, "No archived notifications", "Archived notifications will appear here.")
            : archived.map(renderNotification)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
