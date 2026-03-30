"use client";

import { useState, useEffect } from "react";
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { performanceData, channelPerformance } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ReportingPage() {
  const { campaigns } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalLeads = performanceData.reduce((s, d) => s + d.leads, 0);
  const totalRegistrations = performanceData.reduce((s, d) => s + d.registrations, 0);
  const totalConversions = performanceData.reduce((s, d) => s + d.conversions, 0);
  const totalSpend = performanceData.reduce((s, d) => s + d.spend, 0);
  const conversionRate =
    totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : "0";

  const handleExport = () => {
    toast.success("Report exported successfully!", {
      description: "Your CSV file has been downloaded.",
    });
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reporting</h1>
          <p className="text-muted-foreground">
            Analyze your marketing campaign performance.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                +31%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-3xl font-bold tracking-tight">{totalLeads}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                +28%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Registrations</p>
              <p className="text-3xl font-bold tracking-tight">{totalRegistrations}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 p-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                +5.2%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-3xl font-bold tracking-tight">{conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-3 group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Spend</p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalSpend)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Avg CPL: {formatCurrency(Math.round(totalSpend / totalLeads))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads & Registrations</TabsTrigger>
          <TabsTrigger value="spend">Spend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                    name="Leads"
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRegistrations)"
                    name="Registrations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leads & Registrations (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ fill: "#2563eb", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 3 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spend">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="spend"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Spend ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Channel</th>
                  <th className="pb-3 font-medium text-right">Leads</th>
                  <th className="pb-3 font-medium text-right">Cost</th>
                  <th className="pb-3 font-medium text-right">CPL</th>
                  <th className="pb-3 font-medium text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {channelPerformance
                  .sort((a, b) => b.leads - a.leads)
                  .map((ch) => (
                    <tr key={ch.channel} className="hover:bg-muted/50">
                      <td className="py-3 font-medium">{ch.channel}</td>
                      <td className="py-3 text-right">{ch.leads}</td>
                      <td className="py-3 text-right">{formatCurrency(ch.cost)}</td>
                      <td className="py-3 text-right">
                        {ch.cpl > 0 ? formatCurrency(ch.cpl) : "—"}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={ch.conversion >= 20 ? "success" : ch.conversion >= 15 ? "info" : "secondary"}
                        >
                          {ch.conversion}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium text-right">Leads</th>
                  <th className="pb-3 font-medium text-right">Registrations</th>
                  <th className="pb-3 font-medium text-right">Budget</th>
                  <th className="pb-3 font-medium text-right">Spent</th>
                  <th className="pb-3 font-medium text-right">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {campaigns.map((c) => {
                  const usage =
                    c.budget > 0
                      ? Math.round((c.spent / c.budget) * 100)
                      : 0;
                  return (
                    <tr key={c.id} className="hover:bg-muted/50">
                      <td className="py-3">
                        <p className="font-medium">{c.name}</p>
                        <Badge
                          className={cn("mt-1", getStatusColor(c.status))}
                          variant="secondary"
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3">{c.type}</td>
                      <td className="py-3 text-right">{c.leads}</td>
                      <td className="py-3 text-right">{c.registrations}</td>
                      <td className="py-3 text-right">{formatCurrency(c.budget)}</td>
                      <td className="py-3 text-right">{formatCurrency(c.spent)}</td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={
                            usage > 90
                              ? "destructive"
                              : usage > 70
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {usage}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ended: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700";
}
