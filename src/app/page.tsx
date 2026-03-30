"use client";

import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  ClipboardCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Eye,
  BarChart3,
  DollarSign,
  Target,
  FileText,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  colorClass,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  colorClass: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn("rounded-xl p-3 transition-transform group-hover:scale-110 duration-300", colorClass)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        {trend && (
          <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium", trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            <TrendingUp className={cn("h-3 w-3", !trendUp && "rotate-180")} />
            {trend}
          </div>
        )}
      </CardContent>
      <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300", colorClass.replace("p-3", ""))} />
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { campaigns, orders, notifications, role } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "Active" || c.status === "Scheduled");
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const pendingOrders = orders.filter((o) => o.status === "Submitted" || o.status === "Under Review");
  const upcomingCampaigns = campaigns
    .filter((c) => c.status === "Active" || c.status === "Scheduled")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your marketing campaigns.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/reporting")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button onClick={() => router.push("/new-order")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Events"
          value={activeCampaigns.length}
          subtitle={`${campaigns.length} total campaigns`}
          icon={CalendarDays}
          trend="+2 this month"
          trendUp={true}
          colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <KPICard
          title="Total Leads"
          value={totalLeads}
          subtitle="Across all campaigns"
          icon={Users}
          trend="+23% vs last month"
          trendUp={true}
          colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <KPICard
          title="Pending Approvals"
          value={pendingOrders.length}
          subtitle={`${orders.length} total orders`}
          icon={ClipboardCheck}
          colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <KPICard
          title="Upcoming Deadlines"
          value={3}
          subtitle="In the next 14 days"
          icon={Clock}
          colorClass="bg-gradient-to-br from-violet-500 to-violet-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/campaigns")}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-medium text-muted-foreground">No upcoming events</p>
                <p className="mt-1 text-sm text-muted-foreground/75">
                  Create a new order to get started
                </p>
              </div>
            ) : (
              upcomingCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{campaign.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(campaign.startDate)}</span>
                      <span>&middot;</span>
                      <span className="truncate">{campaign.location}</span>
                    </div>
                  </div>
                  <Badge className={cn("ml-3 shrink-0", getStatusColor(campaign.status))} variant="secondary">
                    {campaign.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/orders")}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{order.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatCurrency(order.budget)}</span>
                    <span>&middot;</span>
                    <span>{formatDate(order.updatedAt)}</span>
                  </div>
                </div>
                <Badge className={cn("ml-3 shrink-0", getStatusColor(order.status))} variant="secondary">
                  {order.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals + Quick Actions Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Approvals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
            {pendingOrders.length > 0 && (
              <Badge variant="warning">{pendingOrders.length} pending</Badge>
            )}
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardCheck className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-medium text-muted-foreground">All caught up!</p>
                <p className="mt-1 text-sm text-muted-foreground/75">
                  No orders waiting for approval
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Order</th>
                      <th className="pb-3 font-medium hidden sm:table-cell">Type</th>
                      <th className="pb-3 font-medium">Budget</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pendingOrders.map((order) => (
                      <tr key={order.id} className="group">
                        <td className="py-3">
                          <p className="font-medium">{order.title}</p>
                          <p className="text-xs text-muted-foreground">{order.id}</p>
                        </td>
                        <td className="py-3 hidden sm:table-cell">{order.type}</td>
                        <td className="py-3">{formatCurrency(order.budget)}</td>
                        <td className="py-3">
                          <Badge className={getStatusColor(order.status)} variant="secondary">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/new-order")}
            >
              <PlusCircle className="h-4 w-4 text-primary" />
              Create New Order
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/campaigns")}
            >
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              View Campaigns
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/reporting")}
            >
              <BarChart3 className="h-4 w-4 text-violet-600" />
              Run Reports
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/notifications")}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                {unreadNotifications.length}
              </span>
              Notifications
            </Button>
            {(role === "internal" || role === "admin") && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => router.push("/profiles")}
              >
                <Users className="h-4 w-4 text-amber-500" />
                Manage Profiles
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
