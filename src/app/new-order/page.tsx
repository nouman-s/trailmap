"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  Globe,
  Laptop,
  Mail,
  MapPin,
  Mic,
  Phone,
  Save,
  Send,
  Sparkles,
  Target,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn, formatCurrency, generateId } from "@/lib/utils";
import { targetingProfiles } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { EventType, NewOrderFormData, Order } from "@/lib/types";

const STEPS = [
  { title: "Order Details", description: "Type, budget & schedule" },
  { title: "Targeting", description: "Define your audience" },
  { title: "Campaign", description: "Name & details" },
  { title: "Assets", description: "Marketing materials" },
  { title: "Review", description: "Confirm & submit" },
];

const EVENT_TYPES: { type: EventType; icon: React.ElementType; desc: string }[] = [
  { type: "Workshop", icon: BookOpen, desc: "In-person educational workshop" },
  { type: "Webinar", icon: Laptop, desc: "Virtual online presentation" },
  { type: "Seminar", icon: Mic, desc: "Formal in-person seminar" },
  { type: "Dinner Event", icon: UtensilsCrossed, desc: "Exclusive dinner event" },
  { type: "Lunch & Learn", icon: Users, desc: "Casual lunch presentation" },
];

const ASSET_OPTIONS = [
  "Direct Mail",
  "Facebook Ads",
  "Google Ads",
  "LinkedIn Ads",
  "Instagram Ads",
  "Landing Page",
  "Email Sequence",
  "Phone Follow-up",
  "Premium Mailer",
  "Personal Invitation",
  "Email Invitation",
];

const initialFormData: NewOrderFormData = {
  orderType: "",
  budget: 10000,
  dateRangeStart: "",
  dateRangeEnd: "",
  numberOfEvents: 1,
  targetingProfileId: "",
  targetAge: "",
  targetIncome: "",
  targetRadius: "",
  targetZipCodes: "",
  campaignName: "",
  campaignDescription: "",
  location: "",
  specialInstructions: "",
  assetPreferences: [],
  emailTemplate: "professional",
  landingPageStyle: "modern",
};

export default function NewOrderPage() {
  const router = useRouter();
  const { addOrder, addNotification } = useAppStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewOrderFormData>(initialFormData);

  const progressPercent = ((step + 1) / STEPS.length) * 100;

  const updateForm = (updates: Partial<NewOrderFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleTargetingProfileSelect = (profileId: string) => {
    const profile = targetingProfiles.find((p) => p.id === profileId);
    if (profile) {
      updateForm({
        targetingProfileId: profileId,
        targetAge: profile.ageRange,
        targetIncome: profile.incomeRange,
        targetRadius: profile.radius,
        targetZipCodes: profile.zipCodes.join(", "),
      });
    }
  };

  const toggleAsset = (asset: string) => {
    setForm((prev) => ({
      ...prev,
      assetPreferences: prev.assetPreferences.includes(asset)
        ? prev.assetPreferences.filter((a) => a !== asset)
        : [...prev.assetPreferences, asset],
    }));
  };

  const handleSubmit = (asDraft: boolean) => {
    const order: Order = {
      id: `ord-${generateId()}`,
      title: form.campaignName || `${form.orderType} Campaign`,
      type: form.orderType as EventType,
      status: asDraft ? "Draft" : "Submitted",
      budget: form.budget,
      dateRangeStart: form.dateRangeStart,
      dateRangeEnd: form.dateRangeEnd,
      numberOfEvents: form.numberOfEvents,
      targetingProfile:
        targetingProfiles.find((p) => p.id === form.targetingProfileId)?.name || "Custom",
      targetAge: form.targetAge,
      targetIncome: form.targetIncome,
      targetRadius: form.targetRadius,
      campaignDetails: form.campaignDescription,
      assetPreferences: form.assetPreferences,
      advisor: "Sarah Mitchell",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    addOrder(order);
    addNotification({
      id: generateId(),
      title: asDraft ? "Draft Saved" : "Order Submitted",
      message: `Your order "${order.title}" has been ${asDraft ? "saved as draft" : "submitted for review"}.`,
      type: "success",
      read: false,
      archived: false,
      link: `/orders/${order.id}`,
      createdAt: new Date().toISOString(),
    });

    toast.success(
      asDraft ? "Order saved as draft!" : "Order submitted successfully!",
      {
        description: asDraft
          ? "You can continue editing later."
          : "Your order is now being reviewed.",
      }
    );

    router.push("/orders");
  };

  const canGoNext = () => {
    switch (step) {
      case 0:
        return form.orderType && form.budget > 0 && form.dateRangeStart && form.dateRangeEnd;
      case 1:
        return form.targetAge && form.targetIncome && form.targetRadius;
      case 2:
        return form.campaignName;
      case 3:
        return form.assetPreferences.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Order</h1>
            <p className="text-sm text-muted-foreground">
              Set up your marketing campaign in just a few steps.
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {step + 1} of {STEPS.length}: {STEPS[step].title}
          </span>
          <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((s, idx) => (
          <div key={s.title} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => idx < step && setStep(idx)}
              className={cn(
                "flex flex-col items-center",
                idx < step && "cursor-pointer"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                  idx < step
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : idx === step
                    ? "border-primary bg-primary text-primary-foreground scale-110"
                    : "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {idx < step ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium",
                  idx === step ? "text-primary" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-0.5 flex-1",
                  idx < step ? "bg-emerald-500" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          {/* Step 1: Order Details */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Choose Event Type</h2>
                <p className="text-sm text-muted-foreground">
                  Select the type of event for your marketing campaign.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EVENT_TYPES.map(({ type, icon: Icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => updateForm({ orderType: type })}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:border-primary/50 hover:shadow-md",
                      form.orderType === type
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-2.5 transition-colors",
                        form.orderType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-medium text-sm">{type}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </button>
                ))}
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      value={form.budget}
                      onChange={(e) =>
                        updateForm({ budget: parseInt(e.target.value) || 0 })
                      }
                      className="pl-9"
                      placeholder="10,000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numEvents">Number of Events</Label>
                  <Input
                    id="numEvents"
                    type="number"
                    min={1}
                    max={20}
                    value={form.numberOfEvents}
                    onChange={(e) =>
                      updateForm({ numberOfEvents: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.dateRangeStart}
                    onChange={(e) => updateForm({ dateRangeStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={form.dateRangeEnd}
                    onChange={(e) => updateForm({ dateRangeEnd: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Targeting */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Define Your Audience</h2>
                <p className="text-sm text-muted-foreground">
                  Select a targeting profile or customize your audience criteria.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Quick Select: Targeting Profile</Label>
                <Select
                  value={form.targetingProfileId}
                  onValueChange={handleTargetingProfileSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a pre-built profile..." />
                  </SelectTrigger>
                  <SelectContent>
                    {targetingProfiles.map((tp) => (
                      <SelectItem key={tp.id} value={tp.id}>
                        {tp.name} ({tp.ageRange}, {tp.incomeRange})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or customize below
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAge">Age Range</Label>
                  <Input
                    id="targetAge"
                    value={form.targetAge}
                    onChange={(e) => updateForm({ targetAge: e.target.value })}
                    placeholder="e.g., 55-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetIncome">Income Range</Label>
                  <Input
                    id="targetIncome"
                    value={form.targetIncome}
                    onChange={(e) => updateForm({ targetIncome: e.target.value })}
                    placeholder="e.g., $100K+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetRadius">Target Radius</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="targetRadius"
                      value={form.targetRadius}
                      onChange={(e) => updateForm({ targetRadius: e.target.value })}
                      className="pl-9"
                      placeholder="e.g., 25 miles"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCodes">Zip Codes</Label>
                  <Input
                    id="zipCodes"
                    value={form.targetZipCodes}
                    onChange={(e) => updateForm({ targetZipCodes: e.target.value })}
                    placeholder="e.g., 60601, 60602"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Campaign Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Campaign Details</h2>
                <p className="text-sm text-muted-foreground">
                  Provide the details for your marketing campaign.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    value={form.campaignName}
                    onChange={(e) => updateForm({ campaignName: e.target.value })}
                    placeholder="e.g., Spring Retirement Workshop Campaign"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.campaignDescription}
                    onChange={(e) =>
                      updateForm({ campaignDescription: e.target.value })
                    }
                    placeholder="Describe the campaign goals and approach..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Event Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                      className="pl-9"
                      placeholder="e.g., Hilton Downtown, Chicago"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={form.specialInstructions}
                    onChange={(e) =>
                      updateForm({ specialInstructions: e.target.value })
                    }
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Asset Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Marketing Assets</h2>
                <p className="text-sm text-muted-foreground">
                  Select the marketing channels and materials you&apos;d like to use.
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Channels & Materials</Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {ASSET_OPTIONS.map((asset) => {
                    const isSelected = form.assetPreferences.includes(asset);
                    return (
                      <button
                        key={asset}
                        onClick={() => toggleAsset(asset)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition-all hover:border-primary/50",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        )}
                      >
                        <Checkbox checked={isSelected} />
                        <span className={cn("font-medium", isSelected && "text-primary")}>
                          {asset}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email Template Style</Label>
                  <Select
                    value={form.emailTemplate}
                    onValueChange={(val) => updateForm({ emailTemplate: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Landing Page Style</Label>
                  <Select
                    value={form.landingPageStyle}
                    onValueChange={(val) => updateForm({ landingPageStyle: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Review Your Order</h2>
                  <p className="text-sm text-muted-foreground">
                    Please review all details before submitting.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Order Details */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="text-sm font-medium">Order Details</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        <span className="font-medium">{form.orderType || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Budget:</span>{" "}
                        <span className="font-medium">{formatCurrency(form.budget)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dates:</span>{" "}
                        <span className="font-medium">
                          {form.dateRangeStart || "—"} to {form.dateRangeEnd || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Events:</span>{" "}
                        <span className="font-medium">{form.numberOfEvents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Targeting */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="text-sm font-medium">Targeting</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Age:</span>{" "}
                        <span className="font-medium">{form.targetAge || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Income:</span>{" "}
                        <span className="font-medium">{form.targetIncome || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Radius:</span>{" "}
                        <span className="font-medium">{form.targetRadius || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zip Codes:</span>{" "}
                        <span className="font-medium">{form.targetZipCodes || "—"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="text-sm font-medium">Campaign</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-medium">{form.campaignName || "—"}</span>
                      </div>
                      {form.campaignDescription && (
                        <div>
                          <span className="text-muted-foreground">Description:</span>{" "}
                          <span>{form.campaignDescription}</span>
                        </div>
                      )}
                      {form.location && (
                        <div>
                          <span className="text-muted-foreground">Location:</span>{" "}
                          <span className="font-medium">{form.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Assets */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="text-sm font-medium">Assets</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {form.assetPreferences.map((a) => (
                        <Badge key={a} variant="secondary">
                          {a}
                        </Badge>
                      ))}
                      {form.assetPreferences.length === 0 && (
                        <span className="text-sm text-muted-foreground">No assets selected</span>
                      )}
                    </div>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        <span className="capitalize font-medium">{form.emailTemplate}</span>
                      </span>
                      <span>
                        <span className="text-muted-foreground">Landing Page:</span>{" "}
                        <span className="capitalize font-medium">{form.landingPageStyle}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => (step === 0 ? router.push("/orders") : setStep(step - 1))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canGoNext()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => handleSubmit(false)} className="min-w-32">
              <Send className="mr-2 h-4 w-4" />
              Submit Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
