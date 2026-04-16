const { z } = require("zod");

const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  relation: z.enum(["Self", "Spouse", "Child", "Parent", "Other"]),
  email: z.string().email().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

module.exports = { familyMemberSchema };
