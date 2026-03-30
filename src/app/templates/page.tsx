"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  ShoppingCart,
  Palette,
  Star,
  Clock,
  ArrowRight,
  BookOpen,
  Laptop,
  UtensilsCrossed,
  Mic,
  Users,
  Copy,
  Eye,
  TrendingUp,
} from "lucide-react";
import { templates } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { toast } from "sonner";

const typeIcons = {
  campaign: FileText,
  order: ShoppingCart,
  asset: Palette,
};

const eventTypeIcons: Record<string, React.ElementType> = {
  Workshop: BookOpen,
  Webinar: Laptop,
  "Dinner Event": UtensilsCrossed,
  Seminar: Mic,
  "Lunch & Learn": Users,
};

const typeColors = {
  campaign: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  order: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  asset: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const popularTemplates = templates.filter((t) => t.isPopular);
  const recentTemplates = [...templates]
    .sort((a, b) => new Date(b.lastUsed || b.createdAt).getTime() - new Date(a.lastUsed || a.createdAt).getTime())
    .slice(0, 4);

  const handleUseTemplate = (templateId: string) => {
    toast.success("Template selected!", {
      description: "Redirecting to create new order with this template.",
    });
    router.push("/new-order");
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Reusable campaign templates and marketing assets.
          </p>
        </div>
        <Button onClick={() => router.push("/new-order")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create from Template
        </Button>
      </div>

      {/* Featured Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Popular Templates */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Popular Templates</CardTitle>
            </div>
            <CardDescription>Most frequently used by advisors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {popularTemplates.slice(0, 3).map((template) => {
              const Icon = typeIcons[template.type];
              return (
                <div
                  key={template.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm cursor-pointer"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div className={cn("shrink-0 rounded-lg p-2", typeColors[template.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Used {template.usageCount} times
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Templates */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Recently Used</CardTitle>
            </div>
            <CardDescription>Your most recent template selections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentTemplates.map((template) => {
              const EventIcon = template.eventType ? eventTypeIcons[template.eventType] : typeIcons[template.type];
              return (
                <div
                  key={template.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm cursor-pointer"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div className="shrink-0 rounded-lg bg-muted p-2">
                    <EventIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last used {formatDate(template.lastUsed || template.createdAt)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="campaign">Campaigns</SelectItem>
            <SelectItem value="order">Orders</SelectItem>
            <SelectItem value="asset">Assets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Templates ({filteredTemplates.length})</TabsTrigger>
          <TabsTrigger value="campaign">Campaigns ({templates.filter(t => t.type === 'campaign').length})</TabsTrigger>
          <TabsTrigger value="order">Orders ({templates.filter(t => t.type === 'order').length})</TabsTrigger>
          <TabsTrigger value="asset">Assets ({templates.filter(t => t.type === 'asset').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaign" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.filter(t => t.type === 'campaign').map((template) => (
              <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="order" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.filter(t => t.type === 'order').map((template) => (
              <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="asset" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.filter(t => t.type === 'asset').map((template) => (
              <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No templates found</p>
            <p className="mt-1 text-sm text-muted-foreground/75">
              Try adjusting your search or filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: (typeof templates)[0];
  onUse: (id: string) => void;
}) {
  const Icon = typeIcons[template.type];
  const EventIcon = template.eventType ? eventTypeIcons[template.eventType] : null;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className={cn("rounded-lg p-2.5", typeColors[template.type])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1">
            {template.isPopular && (
              <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                <Star className="mr-1 h-3 w-3" />
                Popular
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-base leading-tight mt-3">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {template.eventType && (
            <Badge variant="outline" className="text-xs">
              {EventIcon && <EventIcon className="mr-1 h-3 w-3" />}
              {template.eventType}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {template.type}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{template.usageCount} uses</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(template.lastUsed || template.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => toast.info("Preview coming soon")}
        >
          <Eye className="mr-2 h-3.5 w-3.5" />
          Preview
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onUse(template.id)}
        >
          <Copy className="mr-2 h-3.5 w-3.5" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
