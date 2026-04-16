import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const itemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  purchaseDate: z.string().optional(),
  cost: z.coerce.number().min(0).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().max(2000).optional(),
  categoryId: z.string().min(1, "Category is required"),
  familyMemberId: z.string().optional(),
  reminderDays: z.array(z.number()).optional(),
  isEmergency: z.boolean().optional(),
});

export const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  relation: z.enum(["Self", "Spouse", "Child", "Parent", "Other"]),
  email: z.string().email().optional().or(z.literal("")),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ItemFormValues = z.infer<typeof itemSchema>;
export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
