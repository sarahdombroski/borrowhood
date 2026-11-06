"use client";
import { Bell, BellDot } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotfications, getUnreadAction } from "../actions";
import { Notification } from "../generated/prisma/client";
import { NotificationPayloads } from "@/lib/validation/notifications";

export function NotificationInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    async function loadNotifications() {
      const data = await getNotfications();
      setNotifications(data);
      const unread = await getUnreadAction();
      setUnreadCount(unread);
    }
    loadNotifications();
  }, []);

  return (
   <div className="fixed bottom-6 right-6 z-50 max-h-[75vh] max-w-[300px] rounded-lg shadow-xl">
    {!isOpen && (
      <button onClick={() => setIsOpen(true)} className="flex -space-x-0.75">
        <Bell color="#9E643C" />
        <p className="text-xs text-[#9E643C]">{unreadCount}</p>
      </button>
    )}
    {isOpen && (
      <ul className="bg-[#8ACDEA]">
        {notifications.map((notification) => {
          if (notification.type === "EARLY_RETURN_REQUESTED") {
            const payload = notification.payload as NotificationPayloads["EARLY_RETURN_REQUESTED"];
            return (
              <li key={notification.id} className="border text-sm flex">
                <div>
                  <p>{notification.createdAt.toLocaleDateString('en-US')}</p>
                  <p>{payload.owner} has requested an early return {payload.itemName}. If possible, please return the item as soon as you can.</p>
                  <p>{payload.message}</p>
                </div>
                {!notification.readAt && (
                  <BellDot size={25} className="min-w-[25px]" />
                )}
              </li>
            )
          }
          if (notification.type === "RESERVATION_PREEMPTED") {
            const payload = notification.payload as NotificationPayloads["RESERVATION_PREEMPTED"];
            return (
              <li key={notification.id} className="border text-sm flex">
                <div>
                <p>{notification.createdAt.toLocaleDateString('en-US')}</p>
                <p>Reservation on {payload.itemName} has been preempted by {payload.preemptedBy}.</p>
                <p>{payload.reason}</p>
                </div>
                {!notification.readAt && (
                  <BellDot size={25} className="min-w-[25px]" />
                )}
              </li>
            )
          }
          if (notification.type === "RESERVATION_PENDING") {
            const payload = notification.payload as NotificationPayloads["RESERVATION_PENDING"];
            const start = new Date(payload.start);
            const end = new Date(payload.end);
            return (
              <li key={notification.id} className="border text-sm flex">
                <div>
                <p>{notification.createdAt.toLocaleDateString('en-US')}</p>
                <p>{payload.requester} has requested to reserve {payload.itemName} from {start.toLocaleDateString()} to {end.toLocaleDateString()} and are awaiting your approval.</p>
                <p>{payload.message}</p>
                </div>
                {!notification.readAt && (
                  <BellDot size={25} className="min-w-[25px]" />
                )}
              </li>
            )
          }
          if (notification.type === "RESERVATION_APPROVED") {
            const payload = notification.payload as NotificationPayloads["RESERVATION_APPROVED"];
            const start = new Date(payload.start)
            const end = new Date(payload.end)
            return (
              <li key={notification.id} className="border text-sm flex">
                <div>
                <p>{notification.createdAt.toLocaleDateString('en-US')}</p>
                <p>Your reservation on {payload.itemName} from {start.toLocaleDateString()} to {end.toLocaleDateString()} has been approved. Don't forget to pick it up!</p>
                <p>{payload.message}</p>
                </div>
                {!notification.readAt && (
                  <BellDot size={25} className="min-w-[25px]" />
                )}
              </li>
            )
          }
          if (notification.type === "RESERVATION_DENIED") {
            const payload = notification.payload as NotificationPayloads["RESERVATION_DENIED"];
            return (
              <li key={notification.id} className="border text-sm flex">
                <div>
                <p>{notification.createdAt.toLocaleDateString('en-US')}</p>
                <p>We're sorry, but your reservation on {payload.itemName} has been denied.</p>
                <p>{payload.reason}</p>
                </div>
                {!notification.readAt && (
                  <BellDot size={25} className="min-w-[25px]" />
                )}
              </li>
            )
          }
          if (notification.type === "RESERVATION_CANCELLED") {
            const payload = notification.payload as NotificationPayloads["RESERVATION_CANCELLED"];
            const start = new Date(payload.originalStart)
            const end = new Date(payload.originalEnd)
            return (
              <li key={notification.id} className="border text-sm flex">
                <div>
                <p>{notification.createdAt.toLocaleDateString('en-US')}</p>
                <p>{payload.originalBorrower}'s reservation on {payload.itemName} from {start.toLocaleDateString()} to {end.toLocaleDateString()} has been cancelled.</p>
                <p>{payload.reason}</p>
                </div>
                {!notification.readAt && (
                  <BellDot size={25} className="min-w-[25px]" />
                )}
              </li>
            )
          }
        })}
        <li className="text-right pr-2"><button onClick={() => setIsOpen(false)}>Close</button></li>
      </ul>
    )}
   </div> 
  )
}