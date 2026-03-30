"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn, formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Campaign } from "@/lib/types";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  ClipboardList,
  Link2,
  Copy,
  Check,
  Save,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  ExternalLink,
  Megaphone,
} from "lucide-react";

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { campaigns, updateCampaign } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // Confirmation tab state
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSavingConfirmation, setIsSavingConfirmation] = useState(false);

  // Settings tab state
  const [settingsName, setSettingsName] = useState("");
  const [settingsType, setSettingsType] = useState("");
  const [settingsLocation, setSettingsLocation] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Clipboard state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const found = campaigns.find((c) => c.id === id);
    if (found) {
      setCampaign(found);
      setConfirmationMessage(found.confirmationMessage || "");
      setSettingsName(found.name);
      setSettingsType(found.type);
      setSettingsLocation(found.location || "");
    }
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [campaigns, id]);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSaveConfirmation = async () => {
    if (!campaign) return;
    setIsSavingConfirmation(true);
    try {
      updateCampaign(campaign.id, {
        confirmationMessage,
      });
      toast.success("Confirmation message updated successfully.");
    } catch {
      toast.error("Failed to update confirmation message.");
    } finally {
      setIsSavingConfirmation(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!campaign) return;
    if (!settingsName.trim()) {
      toast.error("Campaign name is required.");
      return;
    }
    setIsSavingSettings(true);
    try {
      updateCampaign(campaign.id, {
        name: settingsName.trim(),
        type: settingsType.trim() as Campaign["type"],
        location: settingsLocation.trim(),
      });
      toast.success("Campaign settings updated successfully.");
    } catch {
      toast.error("Failed to update campaign settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Not found
  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-1">Campaign not found</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The campaign you are looking for does not exist or may have been
          removed.
        </p>
        <Button variant="outline" onClick={() => router.push("/campaigns")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  const statusColor = getStatusColor(campaign.status);
  const budgetPercent =
    campaign.budget > 0
      ? Math.min(Math.round((campaign.spent / campaign.budget) * 100), 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/campaigns")}
        className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {campaign.name}
            </h1>
            <Badge variant="secondary" className={cn("text-xs shrink-0", statusColor)}>
              {campaign.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(campaign.startDate)} &ndash;{" "}
              {formatDate(campaign.endDate)}
            </span>
            {campaign.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {campaign.location}
              </span>
            )}
            {campaign.advisor && (
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {campaign.advisor}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="confirmation" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Confirmation</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="gap-1.5">
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Links</span>
          </TabsTrigger>
        </TabsList>

        {/* ======================== Overview Tab ======================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Budget Card */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Budget
                </p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(campaign.budget)}
              </p>
            </Card>

            {/* Spent Card */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-orange-500/10 p-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Spent
                </p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(campaign.spent)}
              </p>
            </Card>

            {/* Leads Card */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Leads
                </p>
              </div>
              <p className="text-2xl font-bold">{campaign.leads}</p>
            </Card>

            {/* Registrations Card */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <ClipboardList className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Registrations
                </p>
              </div>
              <p className="text-2xl font-bold">{campaign.registrations}</p>
            </Card>
          </div>

          {/* Budget Progress */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Budget Utilization</h3>
              <span
                className={cn(
                  "text-sm font-semibold",
                  budgetPercent >= 90
                    ? "text-destructive"
                    : budgetPercent >= 70
                    ? "text-yellow-600"
                    : "text-primary"
                )}
              >
                {budgetPercent}%
              </span>
            </div>
            <Progress value={budgetPercent} className="h-2.5" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Spent: {formatCurrency(campaign.spent)}</span>
              <span>Remaining: {formatCurrency(campaign.budget - campaign.spent)}</span>
            </div>
          </Card>

          {/* Description */}
          {campaign.description && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Description</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </Card>
          )}

          {/* Campaign Details */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Campaign Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-muted-foreground shrink-0">Type</span>
                <Badge variant="outline" className="text-xs">
                  {campaign.type}
                </Badge>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-muted-foreground shrink-0">Status</span>
                <Badge variant="secondary" className={cn("text-xs", statusColor)}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-muted-foreground shrink-0">Start Date</span>
                <span className="font-medium">
                  {formatDate(campaign.startDate)}
                </span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-muted-foreground shrink-0">End Date</span>
                <span className="font-medium">
                  {formatDate(campaign.endDate)}
                </span>
              </div>
              {campaign.location && (
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span className="text-muted-foreground shrink-0">Location</span>
                  <span className="font-medium">{campaign.location}</span>
                </div>
              )}
              {campaign.advisor && (
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span className="text-muted-foreground shrink-0">Advisor</span>
                  <span className="font-medium">{campaign.advisor}</span>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ===================== Confirmation Tab ===================== */}
        <TabsContent value="confirmation" className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Confirmation Message</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This message is shown to attendees after they successfully register
              for the campaign.
            </p>
            <Separator className="mb-4" />
            <Textarea
              value={confirmationMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setConfirmationMessage(e.target.value)
              }
              placeholder="Enter confirmation message shown after registration..."
              rows={6}
              className="mb-4 resize-y"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSaveConfirmation}
                disabled={isSavingConfirmation}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSavingConfirmation ? "Saving..." : "Save Message"}
              </Button>
            </div>
          </Card>

          {/* Preview */}
          {confirmationMessage && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Preview</h3>
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {confirmationMessage}
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* ======================= Settings Tab ======================= */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Campaign Settings</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Update the core details for this campaign.
            </p>
            <Separator className="mb-4" />
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Campaign Name
                </label>
                <Input
                  value={settingsName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettingsName(e.target.value)
                  }
                  placeholder="Campaign name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Campaign Type
                </label>
                <Input
                  value={settingsType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettingsType(e.target.value)
                  }
                  placeholder="e.g., Webinar, Seminar, Workshop"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Location
                </label>
                <Input
                  value={settingsLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettingsLocation(e.target.value)
                  }
                  placeholder="Event location or 'Virtual'"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSavingSettings ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ======================== Links Tab ======================== */}
        <TabsContent value="links" className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Campaign Links</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share these links with your prospects and attendees.
            </p>
            <Separator className="mb-4" />
            <div className="space-y-5">
              {/* Landing Page URL */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Landing Page URL
                </label>
                {campaign.landingPageUrl ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 rounded-md border bg-muted/50 px-3 py-2 text-sm truncate">
                      {campaign.landingPageUrl}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() =>
                        handleCopy(campaign.landingPageUrl!, "landing")
                      }
                    >
                      {copiedField === "landing" ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedField === "landing" ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      asChild
                    >
                      <a
                        href={campaign.landingPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Open</span>
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No landing page URL configured.
                  </p>
                )}
              </div>

              {/* Registration URL */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Registration URL
                </label>
                {campaign.registrationUrl ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 rounded-md border bg-muted/50 px-3 py-2 text-sm truncate">
                      {campaign.registrationUrl}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() =>
                        handleCopy(campaign.registrationUrl!, "registration")
                      }
                    >
                      {copiedField === "registration" ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedField === "registration" ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      asChild
                    >
                      <a
                        href={campaign.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Open</span>
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No registration URL configured.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
