"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn, formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { CampaignStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ClipboardList,
  Megaphone,
  Filter,
} from "lucide-react";

const statusFilters: { label: string; value: string }[] = [
  { label: "All Campaigns", value: "all" },
  { label: "Active", value: "active" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Paused", value: "paused" },
  { label: "Ended", value: "ended" },
];

function CampaignCardSkeleton() {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </Card>
  );
}

export default function CampaignsPage() {
  const router = useRouter();
  const { campaigns } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor all your marketing campaigns.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Megaphone className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No campaigns found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "There are no campaigns to display yet."}
          </p>
        </div>
      )}

      {/* Campaign Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((campaign) => {
            const statusColor = getStatusColor(campaign.status);
            const budgetPercent =
              campaign.budget > 0
                ? Math.min(
                    Math.round((campaign.spent / campaign.budget) * 100),
                    100
                  )
                : 0;

            return (
              <Card
                key={campaign.id}
                className="p-5 cursor-pointer hover:shadow-md transition-shadow border hover:border-primary/30"
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
              >
                {/* Name + Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {campaign.name}
                  </h3>
                  <Badge variant="secondary" className={cn("shrink-0 text-xs", statusColor)}>
                    {campaign.status}
                  </Badge>
                </div>

                {/* Type Badge */}
                <Badge variant="outline" className="text-xs mb-4">
                  {campaign.type}
                </Badge>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {formatDate(campaign.startDate)} &ndash;{" "}
                      {formatDate(campaign.endDate)}
                    </span>
                  </div>
                  {campaign.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{campaign.location}</span>
                    </div>
                  )}
                </div>

                {/* Budget Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Budget used</span>
                    <span className="font-medium">{budgetPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        budgetPercent >= 90
                          ? "bg-destructive"
                          : budgetPercent >= 70
                          ? "bg-yellow-500"
                          : "bg-primary"
                      )}
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Budget / Spent
                      </p>
                      <p className="text-xs font-medium">
                        {formatCurrency(campaign.budget)} /{" "}
                        {formatCurrency(campaign.spent)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Leads / Reg.
                      </p>
                      <p className="text-xs font-medium">
                        {campaign.leads} / {campaign.registrations}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
