export type Role = "client" | "internal" | "admin";

export type OrderStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Pending"
  | "Processing"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export type CampaignStatus = "Active" | "Scheduled" | "Paused" | "Ended";

export type EventType = "Workshop" | "Webinar" | "Seminar" | "Dinner Event" | "Lunch & Learn";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  company: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: EventType;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  location: string;
  budget: number;
  spent: number;
  leads: number;
  registrations: number;
  advisor: string;
  description: string;
  confirmationMessage: string;
  landingPageUrl: string;
  registrationUrl: string;
}

export interface Order {
  id: string;
  title: string;
  type: EventType;
  status: OrderStatus;
  budget: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  numberOfEvents: number;
  targetingProfile: string;
  targetAge: string;
  targetIncome: string;
  targetRadius: string;
  campaignDetails: string;
  assetPreferences: string[];
  advisor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  archived: boolean;
  link?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
  campaignId: string;
  createdAt: string;
}

export interface ContactProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  incomeRange: string;
  interests: string[];
}

export interface TargetingProfile {
  id: string;
  name: string;
  radius: string;
  ageRange: string;
  incomeRange: string;
  investableAssets: string;
  zipCodes: string[];
}

export interface CommunicationProfile {
  id: string;
  name: string;
  emailTemplate: string;
  smsEnabled: boolean;
  followUpDays: number;
  reminderEnabled: boolean;
}

export interface NewOrderFormData {
  // Step 1
  orderType: EventType | "";
  budget: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  numberOfEvents: number;
  // Step 2
  targetingProfileId: string;
  targetAge: string;
  targetIncome: string;
  targetRadius: string;
  targetZipCodes: string;
  // Step 3
  campaignName: string;
  campaignDescription: string;
  location: string;
  specialInstructions: string;
  // Step 4
  assetPreferences: string[];
  emailTemplate: string;
  landingPageStyle: string;
  // Step 5 - review
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: "campaign" | "order" | "asset";
  eventType?: EventType;
  thumbnail?: string;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  isPopular?: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  recommendedChannels: string[];
  expectedROI: string;
  successRate: number;
  avgBudget: string;
  conversionRate: string;
  metrics: {
    leads: number;
    conversion: number;
    retention: number;
  };
}

export interface TargetingInsight {
  id: string;
  name: string;
  category: string;
  data: {
    age: string;
    income: string;
    interests: string[];
    behaviors: string[];
  };
  performance: "excellent" | "good" | "average" | "poor";
  recommendation: string;
}
