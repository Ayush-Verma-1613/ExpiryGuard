const { z } = require("zod");

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
});

module.exports = { categorySchema };
