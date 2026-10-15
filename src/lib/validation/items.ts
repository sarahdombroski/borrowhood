import { Reservation } from "@/app/generated/prisma/client";
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

export const ReserveInput = z
  .object({
    itemId: z.number().int().positive(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }).refine((d) => d.endDate > d.startDate, {
    message: "End must be after start",
    path: ["endDate"],
  }).refine((d) => d.startDate.getTime() > Date.now() - 60_000, {
    message: "Start can't be in the past",
    path: ["startDate"],
});

export type ReserveResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; error: "INVALID_INPUT" | "NOT_FOUND" | "OWN_ITEM" | "TOO_LONG" | "ALREADY_BOOKED" };

// photoUploadSchema