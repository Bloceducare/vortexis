"use client";

import { Bell, Info, Award, MessageSquare, Clock, Edit } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import HtmlContent from "@/components/ui/HtMLContent";
import Link from "next/link";

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

  // Normalize action URL to use proper Next.js routes
  const normalizeActionUrl = (
    url: string | null | undefined
  ): string | null => {
    if (!url) return null;

    // Handle external URLs that contain dashboard patterns
    // Extract hackathon ID from URLs like https://vortexis-dev.vercel.app/dashboard/33/project
    const externalDashboardProjectMatch = url.match(
      /\/dashboard\/(\d+)\/project/
    );
    if (externalDashboardProjectMatch) {
      const hackathonId = externalDashboardProjectMatch[1];
      return `/judges/dashboard/${hackathonId}`;
    }

    // Extract hackathon ID from external URLs like https://vortexis-dev.vercel.app/dashboard/33
    const externalDashboardMatch = url.match(/\/dashboard\/(\d+)(?:\/|$)/);
    if (externalDashboardMatch) {
      const hackathonId = externalDashboardMatch[1];
      return `/judges/dashboard/${hackathonId}`;
    }

    // Handle /submissions/{id} pattern
    const submissionsMatch = url.match(/\/submissions\/(\d+)/);
    if (submissionsMatch) {
      // Check if URL has hackathon ID pattern like /hackathon/{id}/submissions/{id}
      const hackathonFromSubmissions = url.match(/\/hackathon\/(\d+)\/submissions\/(\d+)/);
      if (hackathonFromSubmissions) {
        return `/judges/dashboard/${hackathonFromSubmissions[1]}`;
      }
      // Check if URL contains dashboard pattern elsewhere
      const dashboardInUrl = url.match(/\/dashboard\/(\d+)/);
      if (dashboardInUrl) {
        return `/judges/dashboard/${dashboardInUrl[1]}`;
      }
      // If it's just /submissions/{id} without hackathon context, we can't determine hackathon ID
      // In this case, we might need to fetch the submission to get hackathon ID
      // For now, we'll leave it as-is and let the backend handle it or return the original URL
    }

    // If it's an external URL without dashboard pattern, return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Fix common route patterns
    // /hackathons/{id} -> /hackathon/{id}
    url = url.replace(/^\/hackathons\//, "/hackathon/");

    // Handle submission review URLs
    // /dashboard/{hackathon_id}/project -> /judges/dashboard/{hackathon_id}
    const dashboardProjectMatch = url.match(/\/dashboard\/(\d+)\/project/);
    if (dashboardProjectMatch) {
      const hackathonId = dashboardProjectMatch[1];
      return `/judges/dashboard/${hackathonId}`;
    }

    // Handle submission URLs that might be in the message
    // Extract hackathon ID from URLs like /dashboard/33/project or /dashboard/33
    const submissionMatch = url.match(/\/dashboard\/(\d+)/);
    if (submissionMatch) {
      const hackathonId = submissionMatch[1];
      return `/judges/dashboard/${hackathonId}`;
    }

    // Handle /submissions/{id} pattern for internal URLs
    const internalSubmissionsMatch = url.match(/^\/submissions\/(\d+)/);
    if (internalSubmissionsMatch) {
      // For internal /submissions/{id}, we can't determine hackathon ID from URL alone
      // We would need to fetch the submission, but for now we'll try to extract from context
      // Check if there's a dashboard pattern in the URL
      const dashboardPattern = url.match(/\/dashboard\/(\d+)/);
      if (dashboardPattern) {
        return `/judges/dashboard/${dashboardPattern[1]}`;
      }
      // If no hackathon ID found, we might need backend support or return original
      // For now, let's return the original URL and let the backend handle routing
    }

    return url;
  };

  const actionUrl = normalizeActionUrl(notification.action_url);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start gap-4 overflow-hidden ${!notification.is_read ? "border-l-4 border-blue-500" : ""
        }`}
    >
      <div className="flex-shrink-0 mt-1">{getTypeIcon(notificationType)}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 break-words max-w-[calc(100%-100px)]">
            {notification.title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 break-words line-clamp-3">
          <HtmlContent html={notification.message} />
        </div>
        {actionUrl && (
          <div className="mt-3">
            {actionUrl.startsWith("http://") ||
              actionUrl.startsWith("https://") ? (
              <a
                href={actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 text-sm font-medium text-white bg-[#605DEC] rounded-md hover:bg-[#5048E5] transition-colors"
              >
                {notification.action_text || "View Details"}
              </a>
            ) : (
              <Link
                href={actionUrl}
                className="inline-block px-4 py-2 text-sm font-medium text-white bg-[#605DEC] rounded-md hover:bg-[#5048E5] transition-colors"
              >
                {notification.action_text || "View Details"}
              </Link>
            )}
          </div>
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
    <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        <div className="flex justify-between items-center my-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with important announcements and activities.
              {stats && stats.unread_count !== undefined && stats.total_count !== undefined && (
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Read
                </h2>
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
    </div>
  );
}
