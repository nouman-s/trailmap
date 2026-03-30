"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { strategies, targetingInsights } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const performanceColors = {
  excellent: "text-emerald-600 dark:text-emerald-400",
  good: "text-blue-600 dark:text-blue-400",
  average: "text-amber-600 dark:text-amber-400",
  poor: "text-red-600 dark:text-red-400",
};

const performanceBg = {
  excellent: "bg-emerald-100 dark:bg-emerald-900/30",
  good: "bg-blue-100 dark:bg-blue-900/30",
  average: "bg-amber-100 dark:bg-amber-900/30",
  poor: "bg-red-100 dark:bg-red-900/30",
};

const channelIcons: Record<string, React.ElementType> = {
  "Direct Mail": Mail,
  "Premium Direct Mail": Mail,
  "Facebook Ads": Globe,
  "Google Ads": Globe,
  "LinkedIn Ads": Globe,
  "Instagram Ads": Globe,
  "Email Sequence": Mail,
  "Email Invitation": Mail,
  "Landing Page": Globe,
  "Phone Follow-up": Phone,
  "Personal Invitation": Users,
  "Corporate Partnerships": Users,
  "Community Partnerships": Users,
};

export default function StrategyPage() {
  const [search, setSearch] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [savedStrategies, setSavedStrategies] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredInsights = targetingInsights.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchesPerformance = performanceFilter === "all" || i.performance === performanceFilter;
    return matchesSearch && matchesPerformance;
  });

  const toggleSaved = (id: string) => {
    setSavedStrategies(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    toast.success(
      savedStrategies.includes(id) ? "Strategy removed from saved" : "Strategy saved!"
    );
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Marketing Strategy</h1>
          <p className="text-muted-foreground mt-1">
            Strategic insights and targeting recommendations for your campaigns.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Strategies</p>
                <p className="text-3xl font-bold">{strategies.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Avg. ROI</p>
                <p className="text-3xl font-bold">4.5x</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm">Targeting Profiles</p>
                <p className="text-3xl font-bold">{targetingInsights.length}</p>
              </div>
              <Users className="h-8 w-8 text-violet-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Avg. Success Rate</p>
                <p className="text-3xl font-bold">62%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="strategies">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="insights">Targeting Insights</TabsTrigger>
        </TabsList>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {strategies.map((strategy) => {
              const isSaved = savedStrategies.includes(strategy.id);
              return (
                <Card key={strategy.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {strategy.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => toggleSaved(strategy.id)}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{strategy.expectedROI}</p>
                        <p className="text-xs text-muted-foreground">Expected ROI</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-2xl font-bold text-primary">{strategy.successRate}%</p>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{strategy.conversionRate}</p>
                        <p className="text-xs text-muted-foreground">Conversion</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Target Audience */}
                    <div>
                      <p className="text-sm font-medium mb-2">Target Audience</p>
                      <p className="text-sm text-muted-foreground">{strategy.targetAudience}</p>
                    </div>

                    {/* Recommended Channels */}
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Channels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {strategy.recommendedChannels.map((channel) => {
                          const Icon = channelIcons[channel] || Globe;
                          return (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              <Icon className="mr-1 h-3 w-3" />
                              {channel}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Avg. Budget:</span>
                      <span className="font-medium">{strategy.avgBudget}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Apply Strategy
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Targeting Insights Tab */}
        <TabsContent value="insights" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search targeting profiles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Insights Grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{insight.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                    <div className={cn("rounded-full px-2.5 py-1 text-xs font-medium", performanceBg[insight.performance], performanceColors[insight.performance])}>
                      {insight.performance}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Demographics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{insight.data.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Income:</span>
                      <span className="font-medium">{insight.data.income}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Interests */}
                  <div>
                    <p className="text-sm font-medium mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.data.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Behaviors */}
                  <div>
                    <p className="text-sm font-medium mb-2">Behaviors</p>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.data.behaviors.map((behavior) => (
                        <Badge key={behavior} variant="outline" className="text-xs">
                          {behavior}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Recommendation */}
                  <div className="rounded-lg bg-primary/5 p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm">{insight.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Use This Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredInsights.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Target className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-lg font-medium text-muted-foreground">No targeting profiles found</p>
                <p className="mt-1 text-sm text-muted-foreground/75">
                  Try adjusting your search or filter.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
