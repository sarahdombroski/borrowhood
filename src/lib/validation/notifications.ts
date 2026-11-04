export type NotificationPayloads = {
  EARLY_RETURN_REQUESTED: {
    itemName: string;
    originalEnd: string;
    message: string | null;
  };

  RESERVATION_PREEMPTED: {
    itemName: string;
    originalStart: string;
    originalEnd: string;
    preemptedBy: string;
    reason: string | null;
  };
}

