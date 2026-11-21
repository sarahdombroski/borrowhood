import z from "zod";

export const notificationPayloadSchemas = {
  EARLY_RETURN_REQUESTED: z.object({
    itemName: z.string(),
    owner: z.string(),
    message: z.string().nullable(),
  }),

  RESERVATION_PREEMPTED: z.object({
    itemName: z.string(),
    originalStart: z.string(),
    originalEnd: z.string(),
    preemptedBy: z.string(),
    reason: z.string().nullable(),
  }),

  RESERVATION_PENDING: z.object({
    itemName: z.string(),
    start: z.string(),
    end: z.string(),
    requester: z.string(),
    message: z.string().nullable(),
  }),

  RESERVATION_APPROVED: z.object({
    itemName: z.string(),
    start: z.string(),
    end: z.string(),
    message: z.string().nullable(),
  }),

  RESERVATION_DENIED: z.object({
    itemName: z.string(),
    reason: z.string().nullable(),
  }),

  RESERVATION_CANCELLED: z.object({
    itemName: z.string(),
    originalStart: z.string(),
    originalEnd: z.string(),
    originalBorrower: z.string(),
    reason: z.string().nullable(),
  }),

  RESERVATION_EXPIRED: z.object({
    itemName: z.string(),
    originalStart: z.string(),
    originalEnd: z.string(),
  }),

  PICKUP_REMINDER: z.object({
    itemName: z.string(),
    originalStart: z.string(),
    originalEnd: z.string(),
  }),

  OVERDUE_NUDGE: z.object({
    itemName: z.string(),
    originalEnd: z.string(),
  })
} as const;

export type NotificationType = keyof typeof notificationPayloadSchemas;
export type NotificationPayloads = {
  [K in NotificationType]: z.infer<(typeof notificationPayloadSchemas)[K]>;
}