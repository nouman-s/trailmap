"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Campaign, Notification, Order, Role } from "./types";
import {
  campaigns as initialCampaigns,
  notifications as initialNotifications,
  orders as initialOrders,
} from "./mock-data";

interface AppState {
  // Role
  role: Role;
  setRole: (role: Role) => void;

  // Campaigns
  campaigns: Campaign[];
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  archiveNotification: (id: string) => void;
  addNotification: (notification: Notification) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Role
      role: "client",
      setRole: (role) => set({ role }),

      // Campaigns
      campaigns: initialCampaigns,
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      // Orders
      orders: initialOrders,
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      updateOrder: (id, updates) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString().split("T")[0] } : o
          ),
        })),

      // Notifications
      notifications: initialNotifications,
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      archiveNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, archived: true, read: true } : n
          ),
        })),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "trailmap-store",
    }
  )
);
