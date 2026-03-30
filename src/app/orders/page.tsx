"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  PlusCircle,
  ShoppingCart,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  XCircle,
  FileText,
  Users,
  DollarSign,
  Target,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const statusOptions = [
  "All",
  "Draft",
  "Submitted",
  "Under Review",
  "Pending",
  "Processing",
  "Approved",
  "In Progress",
  "Completed",
  "Cancelled",
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; description: string }> = {
  "Under Review": {
    label: "In Review",
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    description: "Orders waiting for internal team review"
  },
  "Pending": {
    label: "Pending",
    icon: Clock,
    color: "text-orange-600 dark:text-orange-400",
    description: "Orders awaiting client approval or confirmation"
  },
  "Processing": {
    label: "Processing",
    icon: PlayCircle,
    color: "text-cyan-600 dark:text-cyan-400",
    description: "Orders currently being executed"
  },
  "In Progress": {
    label: "Active",
    icon: CheckCircle2,
    color: "text-violet-600 dark:text-violet-400",
    description: "Active campaigns in production"
  },
  "Completed": {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    description: "Successfully delivered campaigns"
  },
};

function OrderCard({ order, onClick }: { order: (typeof import("@/lib/mock-data").orders)[0]; onClick: () => void }) {
  // Gradient based on status
  const getGradient = (status: string) => {
    switch (status) {
      case "Draft": return "from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/20 border-slate-200 dark:border-slate-700";
      case "Submitted": return "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800";
      case "Under Review": return "from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800";
      case "Pending": return "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800";
      case "Processing": return "from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/10 border-cyan-200 dark:border-cyan-800";
      case "Approved": return "from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800";
      case "In Progress": return "from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/10 border-violet-200 dark:border-violet-800";
      case "Completed": return "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800";
      case "Cancelled": return "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 border-red-200 dark:border-red-800";
      default: return "from-muted/50 to-muted/30 border-border";
    }
  };

  const gradientClass = getGradient(order.status);

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br border",
        gradientClass
      )} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{order.title}</h3>
              <Badge className={cn("shrink-0 text-xs", getStatusColor(order.status))}>
                {order.status}
              </Badge>
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-1">{order.id}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        
        <Separator className="my-3" />
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Event:</span>
            <span className="font-medium truncate">{order.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium">{formatCurrency(order.budget)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium truncate">{order.targetAge}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Events:</span>
            <span className="font-medium">{order.numberOfEvents}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {formatDate(order.updatedAt)}</span>
          <span className="truncate max-w-[200px]">{order.campaignDetails.substring(0, 60)}...</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.campaignDetails.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for each category
  const draftOrders = orders.filter(o => o.status === "Draft");
  const submittedOrders = orders.filter(o => o.status === "Submitted");
  const inReviewOrders = orders.filter(o => o.status === "Under Review");
  const pendingOrders = orders.filter(o => o.status === "Pending");
  const processingOrders = orders.filter(o => o.status === "Processing");
  const approvedOrders = orders.filter(o => o.status === "Approved");
  const inProgressOrders = orders.filter(o => o.status === "In Progress");
  const completedOrders = orders.filter(o => o.status === "Completed");
  const cancelledOrders = orders.filter(o => o.status === "Cancelled");
  const totalBudget = orders.reduce((sum, o) => sum + o.budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all your marketing campaign orders.
          </p>
        </div>
        <Button onClick={() => router.push("/new-order")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Quick Stats Cards - Dashboard Style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-slate-500 to-slate-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold tracking-tight">{orders.length}</p>
                <p className="text-xs text-slate-300 mt-1">All campaigns</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Drafts</p>
                <p className="text-3xl font-bold tracking-tight">{draftOrders.length}</p>
                <p className="text-xs text-blue-200 mt-1">In creation</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-amber-500 to-amber-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">In Review</p>
                <p className="text-3xl font-bold tracking-tight">{inReviewOrders.length}</p>
                <p className="text-xs text-amber-200 mt-1">Awaiting approval</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-violet-500 to-violet-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold tracking-tight">{processingOrders.length + inProgressOrders.length + approvedOrders.length}</p>
                <p className="text-xs text-violet-200 mt-1">Active campaigns</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <PlayCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold tracking-tight">{completedOrders.length}</p>
                <p className="text-xs text-green-200 mt-1">Delivered</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(totalBudget)}</p>
                <p className="text-xs text-emerald-200 mt-1">All campaigns</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-cyan-500 to-cyan-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">Pending Approval</p>
                <p className="text-2xl font-bold tracking-tight">{inReviewOrders.length + pendingOrders.length + submittedOrders.length}</p>
                <p className="text-xs text-cyan-200 mt-1">Awaiting review</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all bg-gradient-to-br from-rose-500 to-rose-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold tracking-tight">{cancelledOrders.length}</p>
                <p className="text-xs text-rose-200 mt-1">Not proceeding</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders by title or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Tabs for Categorized View */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="gap-1.5">
            All Orders <Badge variant="secondary" className="ml-1.5">{orders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-1.5">
            Drafts <Badge variant="secondary" className="ml-1.5">{draftOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="review" className="gap-1.5">
            In Review <Badge variant="secondary" className="ml-1.5">{inReviewOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5">
            Pending <Badge variant="secondary" className="ml-1.5">{pendingOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-1.5">
            Active <Badge variant="secondary" className="ml-1.5">{processingOrders.length + inProgressOrders.length + approvedOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5">
            Completed <Badge variant="secondary" className="ml-1.5">{completedOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => router.push(`/orders/${order.id}`)} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-3">
          {draftOrders.length === 0 ? (
            <EmptyState message="No drafts" sub="Orders in draft will appear here" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {draftOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => router.push(`/orders/${order.id}`)} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-3">
          {inReviewOrders.length === 0 ? (
            <EmptyState message="No orders in review" sub="Orders under review will appear here" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {inReviewOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => router.push(`/orders/${order.id}`)} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          {pendingOrders.length === 0 ? (
            <EmptyState message="No pending orders" sub="Orders pending approval will appear here" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pendingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => router.push(`/orders/${order.id}`)} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {processingOrders.length + inProgressOrders.length + approvedOrders.length === 0 ? (
            <EmptyState message="No active orders" sub="Orders in production will appear here" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...processingOrders, ...approvedOrders, ...inProgressOrders].map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => router.push(`/orders/${order.id}`)} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedOrders.length === 0 ? (
            <EmptyState message="No completed orders" sub="Delivered campaigns will appear here" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {completedOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => router.push(`/orders/${order.id}`)} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message = "No orders found", sub = "Try adjusting your search or filter." }: { message?: string; sub?: string }) {
  const router = require("next/navigation").useRouter();
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
        <p className="mt-1 text-sm text-muted-foreground/75">{sub}</p>
        <Button className="mt-4" onClick={() => router.push("/new-order")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Order
        </Button>
      </CardContent>
    </Card>
  );
}
