"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Target,
  Users,
  CheckCircle2,
  Circle,
  FileText,
  Send,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, getStatusColor, cn, generateId } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { OrderStatus } from "@/lib/types";

const STATUS_FLOW: OrderStatus[] = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "In Progress",
  "Completed",
];

function StatusStepper({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-w-[500px] items-center justify-between">
        {STATUS_FLOW.map((status, idx) => {
          const isComplete = !isCancelled && idx < currentIndex;
          const isCurrent = !isCancelled && idx === currentIndex;

          return (
            <div key={status} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    isComplete
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isCurrent
                      ? "border-primary bg-primary text-primary-foreground scale-110"
                      : "border-muted-foreground/30 bg-background text-muted-foreground/50"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[10px] font-medium whitespace-nowrap",
                    isComplete
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                      ? "text-primary font-semibold"
                      : "text-muted-foreground/50"
                  )}
                >
                  {status}
                </span>
              </div>
              {idx < STATUS_FLOW.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1",
                    !isCancelled && idx < currentIndex
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="mt-3 flex items-center justify-center gap-2 text-destructive">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">This order has been cancelled</span>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, updateOrderStatus, addNotification, role } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold">Order Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The order you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button className="mt-4" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    addNotification({
      id: generateId(),
      title: "Order Status Updated",
      message: `Order "${order.title}" status changed to ${newStatus}.`,
      type: "success",
      read: false,
      archived: false,
      link: `/orders/${order.id}`,
      createdAt: new Date().toISOString(),
    });
    toast.success(`Order status updated to "${newStatus}"`);
  };

  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const canAdvance =
    order.status !== "Completed" &&
    order.status !== "Cancelled" &&
    currentIndex < STATUS_FLOW.length - 1;
  const nextStatus = canAdvance ? STATUS_FLOW[currentIndex + 1] : null;

  const canSubmit = role === "client" && order.status === "Draft";
  const canReview = (role === "internal" || role === "admin") && order.status === "Submitted";
  const canApprove = (role === "internal" || role === "admin") && order.status === "Under Review";
  const canStart = (role === "internal" || role === "admin") && order.status === "Approved";
  const canComplete = (role === "internal" || role === "admin") && order.status === "In Progress";
  const canCancel =
    order.status !== "Completed" &&
    order.status !== "Cancelled" &&
    (role === "admin" || (role === "client" && order.status === "Draft"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3"
          onClick={() => router.push("/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{order.title}</h1>
              <Badge
                className={cn("shrink-0", getStatusColor(order.status))}
                variant="secondary"
              >
                {order.status}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{order.id}</p>
          </div>
          <div className="flex gap-2">
            {canSubmit && (
              <Button onClick={() => handleStatusChange("Submitted")}>
                <Send className="mr-2 h-4 w-4" />
                Submit Order
              </Button>
            )}
            {canReview && (
              <Button onClick={() => handleStatusChange("Under Review")}>
                <ChevronRight className="mr-2 h-4 w-4" />
                Start Review
              </Button>
            )}
            {canApprove && (
              <Button variant="success" onClick={() => handleStatusChange("Approved")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
            {canStart && (
              <Button onClick={() => handleStatusChange("In Progress")}>
                <ChevronRight className="mr-2 h-4 w-4" />
                Start Production
              </Button>
            )}
            {canComplete && (
              <Button variant="success" onClick={() => handleStatusChange("Completed")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("Cancelled")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Stepper */}
      <Card>
        <CardContent className="p-6">
          <StatusStepper currentStatus={order.status} />
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Event Type</p>
                <p className="font-medium">{order.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Budget</p>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{formatCurrency(order.budget)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date Range</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {formatDate(order.dateRangeStart)} - {formatDate(order.dateRangeEnd)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Number of Events</p>
                <p className="font-medium">{order.numberOfEvents}</p>
              </div>

              <Separator className="sm:col-span-2" />

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Targeting Profile</p>
                <div className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{order.targetingProfile}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Target Age</p>
                <p className="font-medium">{order.targetAge}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Target Income</p>
                <p className="font-medium">{order.targetIncome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Target Radius</p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{order.targetRadius}</p>
                </div>
              </div>

              <Separator className="sm:col-span-2" />

              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Campaign Details</p>
                <p className="text-sm leading-relaxed">{order.campaignDetails}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Asset Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {order.assetPreferences.map((asset) => (
                  <Badge key={asset} variant="secondary">
                    {asset}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{formatDate(order.updatedAt)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Advisor</span>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{order.advisor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
