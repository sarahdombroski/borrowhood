import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, "Max 60 characters"),
  description: z.string().trim().max(250).optional(),
  conditionNotes: z.string().trim().max(250).optional(),
  category: z.string().trim().max(40).optional(),
  replacementValue: z.string().trim().max(250).optional()
});

export const updateItemSchema = createItemSchema.extend({
  expectedUpdatedAt: z.coerce.date(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;

// setVisibilitySchema(groupIds: string[])

// photoUploadSchema