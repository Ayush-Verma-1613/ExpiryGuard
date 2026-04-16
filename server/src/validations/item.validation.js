const { z } = require("zod");

const itemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  expiryDate: z.coerce.date(),
  purchaseDate: z.coerce.date().optional().nullable(),
  cost: z.coerce.number().min(0).optional().nullable(),
  status: z.enum(["active", "expired", "renewed", "archived"]).optional(),
  notes: z.string().max(2000).optional(),
  categoryId: z.string().min(1, "Category is required"),
  familyMemberId: z.string().optional().nullable(),
  reminderDays: z.array(z.number().int().min(1).max(365)).optional(),
  documentUrl: z.string().url().optional().nullable(),
  documentPublicId: z.string().optional().nullable(),
  isEmergency: z.boolean().optional(),
});

const itemUpdateSchema = itemSchema.partial();

module.exports = { itemSchema, itemUpdateSchema };
