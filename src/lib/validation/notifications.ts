export type NotificationPayloads = {
  EARLY_RETURN_REQUESTED: {
    itemName: string;
    owner: string;
    message: string | null;
  };

  RESERVATION_PREEMPTED: {
    itemName: string;
    originalStart: string;
    originalEnd: string;
    preemptedBy: string;
    reason: string | null;
  };

  RESERVATION_PENDING: {
    itemName: string;
    start: string;
    end: string;
    requester: string;
    message: string | null;
  }

  RESERVATION_APPROVED: {
    itemName: string;
    start: string;
    end: string;
    message: string | null;
  }

  RESERVATION_DENIED: {
    itemName: string;
    reason: string | null;
  }

  RESERVATION_CANCELLED: {
    itemName: string;
    originalStart: string;
    originalEnd: string;
    originalBorrower: string;
    reason: string | null;
  }
}

