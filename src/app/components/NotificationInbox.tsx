"use client";
import { Bell } from "lucide-react";
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
   <div className="fixed bottom-6 right-6 z-50 max-h-[500px] rounded-lg shadow-xl border border-gray-200">
    {!isOpen && (
      <button onClick={() => setIsOpen(true)} className="flex -space-x-0.75">
        <Bell color="darkred" />
        <p className="text-xs text-red-900">{unreadCount}</p>
      </button>
    )}
    {isOpen && (
      <ul>
        {notifications.map((notificaiton) => {
          if (notificaiton.type === "EARLY_RETURN_REQUESTED") {
            const payload = notificaiton.payload as NotificationPayloads["EARLY_RETURN_REQUESTED"];
            return (
              <li key={notificaiton.id}>
                <p>{notificaiton.createdAt.toLocaleDateString()}</p>
                <p>{notificaiton.type}</p>
                <p>{payload.itemName}</p>
                <p>{payload.message}</p>
              </li>
            )
          }
          if (notificaiton.type === "RESERVATION_PREEMPTED") {
            const payload = notificaiton.payload as NotificationPayloads["RESERVATION_PREEMPTED"];
            return (
              <li key={notificaiton.id}>
                <p>{notificaiton.createdAt.toLocaleDateString()}</p>
                <p>{notificaiton.type}</p>
                <p>{payload.itemName}</p>
                <p>Preempted By: {payload.preemptedBy}</p>
                <p>{payload.reason}</p>
              </li>
            )
          }
          
        })}
      </ul>
    )}
   </div> 
  )
}