"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Edit,
  Plus,
  Target,
  MessageSquare,
  Users,
  MapPin,
  Clock,
  BellRing,
  Send,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
  contactProfiles,
  personas,
  targetingProfiles,
  communicationProfiles,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProfilesPage() {
  const { role } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-80" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const canEdit = role === "internal" || role === "admin";
  const canAdd = role === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Profiles & Preferences
        </h1>
        <p className="text-muted-foreground">
          Manage contacts, personas, targeting, and communication settings.
        </p>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="contacts" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="personas" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Personas
          </TabsTrigger>
          <TabsTrigger value="targeting" className="gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Targeting
          </TabsTrigger>
          <TabsTrigger value="communication" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Communication
          </TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Contact Profiles</h2>
            {canAdd && (
              <Button size="sm" onClick={() => toast.success("Add contact dialog would open")}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Contact
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactProfiles.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toast.success(`Contact "${contact.name}" updated`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <h3 className="mt-3 font-semibold">{contact.name}</h3>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {contact.role}
                  </Badge>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-3.5 w-3.5" />
                      {contact.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Personas Tab */}
        <TabsContent value="personas" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Audience Personas</h2>
            {canAdd && (
              <Button size="sm" onClick={() => toast.success("Add persona dialog would open")}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Persona
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {personas.map((persona) => (
              <Card key={persona.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{persona.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {persona.description}
                      </p>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => toast.success(`Persona "${persona.name}" updated`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span>{" "}
                      <span className="font-medium">{persona.ageRange}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Income:</span>{" "}
                      <span className="font-medium">{persona.incomeRange}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {persona.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Targeting Tab */}
        <TabsContent value="targeting" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Targeting Profiles</h2>
            {canAdd && (
              <Button size="sm" onClick={() => toast.success("Add targeting profile dialog would open")}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Profile
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {targetingProfiles.map((tp) => (
              <Card key={tp.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{tp.name}</h3>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toast.success(`Profile "${tp.name}" updated`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Radius: <span className="font-medium text-foreground">{tp.radius}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      Age: <span className="font-medium text-foreground">{tp.ageRange}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Income: <span className="font-medium text-foreground">{tp.incomeRange}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Assets: <span className="font-medium text-foreground">{tp.investableAssets}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tp.zipCodes.map((zip) => (
                      <Badge key={zip} variant="outline" className="text-xs font-mono">
                        {zip}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Communication Profiles</h2>
            {canAdd && (
              <Button size="sm" onClick={() => toast.success("Add communication profile dialog would open")}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Profile
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communicationProfiles.map((cp) => (
              <Card key={cp.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{cp.name}</h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {cp.emailTemplate}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Send className="h-3.5 w-3.5 text-muted-foreground" />
                        SMS Enabled
                      </div>
                      <Switch
                        checked={cp.smsEnabled}
                        onCheckedChange={() =>
                          toast.success(`SMS ${cp.smsEnabled ? "disabled" : "enabled"} for "${cp.name}"`)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <BellRing className="h-3.5 w-3.5 text-muted-foreground" />
                        Reminders
                      </div>
                      <Switch
                        checked={cp.reminderEnabled}
                        onCheckedChange={() =>
                          toast.success(
                            `Reminders ${cp.reminderEnabled ? "disabled" : "enabled"} for "${cp.name}"`
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        Follow-up Days
                      </div>
                      <span className="font-semibold text-sm">{cp.followUpDays}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => toast.success(`Communication profile "${cp.name}" saved`)}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
