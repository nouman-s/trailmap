"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  PlusCircle,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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

const statusOptions = [
  "All",
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "In Progress",
  "Completed",
  "Cancelled",
];

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
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your marketing orders.
          </p>
        </div>
        <Button onClick={() => router.push("/new-order")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
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
        {filtered.length} order{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Orders */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No orders found</p>
            <p className="mt-1 text-sm text-muted-foreground/75">
              Try adjusting your search or filter.
            </p>
            <Button className="mt-4" onClick={() => router.push("/new-order")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Budget</th>
                    <th className="px-6 py-3 font-medium">Date Range</th>
                    <th className="px-6 py-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 font-medium">{order.title}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{order.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={getStatusColor(order.status)}
                          variant="secondary"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{formatCurrency(order.budget)}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(order.dateRangeStart)} - {formatDate(order.dateRangeEnd)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(order.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{order.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {order.id}
                      </p>
                    </div>
                    <Badge
                      className={cn("shrink-0", getStatusColor(order.status))}
                      variant="secondary"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{order.type}</span>
                    <span>{formatCurrency(order.budget)}</span>
                    <span>{formatDate(order.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
