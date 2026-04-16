export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface FamilyMember {
  _id: string;
  name: string;
  relation: "Self" | "Spouse" | "Child" | "Parent" | "Other";
  email?: string;
  avatarUrl?: string;
}

export interface Item {
  _id: string;
  name: string;
  description?: string;
  expiryDate: string;
  purchaseDate?: string;
  cost?: number;
  status: "active" | "expired" | "renewed" | "archived";
  notes?: string;
  documentUrl?: string;
  documentPublicId?: string;
  reminderDays: number[];
  isEmergency: boolean;
  userId: string;
  categoryId: Category;
  familyMemberId?: FamilyMember;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnalyticsData {
  total: number;
  active: number;
  expired: number;
  renewed: number;
  archived: number;
  expiringThisMonth: number;
  byCategory: { name: string; color: string; count: number }[];
  byMonth: { month: string; count: number }[];
  byMember: { name: string; relation: string; count: number }[];
}

export interface Notification {
  _id: string;
  type: "reminder" | "expired" | "follow_up";
  sentAt: string;
  channel: "email" | "in_app";
  daysLeft: number;
  itemId: { name: string; expiryDate: string };
}
