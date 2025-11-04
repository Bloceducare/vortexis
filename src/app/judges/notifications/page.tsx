"use client";

import { Bell, Info, Award, MessageSquare, Clock, Edit } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

type NotificationType =
  | "announcement"
  | "assignment"
  | "discussion"
  | "deadline"
  | "update";

function NotificationCard({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) {
  const formattedDate = new Date(notification.created_at).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  // Map API category to NotificationType for icon display
  const getNotificationType = (): NotificationType => {
    const category = notification.category?.toLowerCase() || "";
    if (category.includes("announcement")) return "announcement";
    if (category.includes("assignment")) return "assignment";
    if (category.includes("discussion")) return "discussion";
    if (category.includes("deadline")) return "deadline";
    if (category.includes("update")) return "update";
    return "announcement";
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "announcement":
        return <Info className="size-5 text-blue-600" />;
      case "assignment":
        return <Award className="size-5 text-green-600" />;
      case "discussion":
        return <MessageSquare className="size-5 text-purple-600" />;
      case "deadline":
        return <Clock className="size-5 text-red-600" />;
      case "update":
        return <Edit className="size-5 text-orange-600" />;
      default:
        return <Bell className="size-5 text-gray-600" />;
    }
  };

  const notificationType = getNotificationType();

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 ${
        !notification.is_read ? "border-l-4 border-blue-500" : ""
      }`}
    >
      <div className="flex-shrink-0 mt-1">{getTypeIcon(notificationType)}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {notification.title}
          </h3>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
        {notification.action_url && (
          <a
            href={notification.action_url}
            className="text-blue-600 hover:underline text-sm"
          >
            {notification.action_text || "View Details"}
          </a>
        )}
      </div>
      {!notification.is_read && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="flex-shrink-0 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none"
        >
          Mark as Read
        </button>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const {
    notifications,
    stats,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications({ autoFetch: true });

  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    // Refetch to ensure UI is updated
    setTimeout(() => refetch(), 100);
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    await markAllAsRead();
    setTimeout(() => {
      refetch();
      setIsMarkingAll(false);
    }, 100);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with important announcements and activities.
            {stats && (
              <span className="ml-2 text-sm">
                ({stats.unread_count} unread of {stats.total_count} total)
              </span>
            )}
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            variant="outline"
          >
            {isMarkingAll ? "Marking..." : "Mark All as Read"}
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isLoading && notifications.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Unread
              </h2>
              <div className="space-y-4">
                {unreadNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Read</h2>
              <div className="space-y-4">
                {readNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            </div>
          )}

          {notifications.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="size-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
