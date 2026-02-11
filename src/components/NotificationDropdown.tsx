"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Info, Award, MessageSquare, Clock, Edit, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HtmlContent from "@/components/ui/HtMLContent";

type NotificationType =
  | "announcement"
  | "assignment"
  | "discussion"
  | "deadline"
  | "update";

interface NotificationDropdownProps {
  baseUrl?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  baseUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { notifications, stats, isLoading, markAsRead, refetch } =
    useNotifications({
      baseUrl,
      autoFetch: true,
    });

  // Get unread notifications (limit to 5 most recent)
  const unreadNotifications = notifications
    .filter((n) => !n.is_read)
    .slice(0, 5);

  // Get notification type for icon
  const getNotificationType = (category?: string): NotificationType => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("announcement")) return "announcement";
    if (cat.includes("assignment")) return "assignment";
    if (cat.includes("discussion")) return "discussion";
    if (cat.includes("deadline")) return "deadline";
    if (cat.includes("update")) return "update";
    return "announcement";
  };

  const getTypeIcon = (type: NotificationType) => {
    const iconClass = "size-4";
    switch (type) {
      case "announcement":
        return <Info className={`${iconClass} text-blue-600`} />;
      case "assignment":
        return <Award className={`${iconClass} text-green-600`} />;
      case "discussion":
        return <MessageSquare className={`${iconClass} text-purple-600`} />;
      case "deadline":
        return <Clock className={`${iconClass} text-red-600`} />;
      case "update":
        return <Edit className={`${iconClass} text-orange-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await markAsRead(id);
    setTimeout(() => refetch(), 100);
  };

  const handleNotificationClick = (id: string) => {
    // Mark as read when clicked
    if (!notifications.find((n) => n.id === id)?.is_read) {
      markAsRead(id);
      setTimeout(() => refetch(), 100);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="size-4 xl:size-5 text-gray-700" />
        {stats && stats.unread_count > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {stats.unread_count > 9 ? "9+" : stats.unread_count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 md:absolute md:right-0 md:top-12 md:inset-x-auto w-full md:w-96 bg-white dark:bg-gray-800 rounded-none md:rounded-lg shadow-xl border-t md:border border-gray-200 dark:border-gray-700 z-50 max-h-[calc(100vh-4rem)] md:max-h-125 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="Close"
            >
              <X className="size-4 text-gray-500" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto scrollbar-hide flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#605DEC]"></div>
              </div>
            ) : unreadNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {unreadNotifications.map((notif) => {
                  const notifType = getNotificationType(notif.category);
                  // Normalize action URL
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
                    const externalDashboardMatch = url.match(
                      /\/dashboard\/(\d+)(?:\/|$)/
                    );
                    if (externalDashboardMatch) {
                      const hackathonId = externalDashboardMatch[1];
                      return `/judges/dashboard/${hackathonId}`;
                    }

                    // Handle /submissions/{id} pattern - check if URL contains hackathon ID
                    const submissionsMatch = url.match(/\/submissions\/(\d+)/);
                    if (submissionsMatch) {
                      // Check if URL has hackathon ID pattern like /hackathon/{id}/submissions/{id}
                      const hackathonFromSubmissions = url.match(
                        /\/hackathon\/(\d+)\/submissions\/(\d+)/
                      );
                      if (hackathonFromSubmissions) {
                        return `/judges/dashboard/${hackathonFromSubmissions[1]}`;
                      }
                      // Check if URL contains dashboard pattern elsewhere
                      const dashboardInUrl = url.match(/\/dashboard\/(\d+)/);
                      if (dashboardInUrl) {
                        return `/judges/dashboard/${dashboardInUrl[1]}`;
                      }
                      // If it's just /submissions/{id}, we can't determine hackathon ID
                      // But we'll try to redirect to judges dashboard with the submission ID
                      // This might need backend support to resolve hackathon ID
                    }

                    // If it's an external URL without dashboard pattern, return as-is
                    if (
                      url.startsWith("http://") ||
                      url.startsWith("https://")
                    ) {
                      return url;
                    }

                    // Fix common route patterns
                    let normalized = url.replace(
                      /^\/hackathons\//,
                      "/hackathon/"
                    );
                    // Handle submission review URLs
                    const dashboardProjectMatch = normalized.match(
                      /\/dashboard\/(\d+)\/project/
                    );
                    if (dashboardProjectMatch) {
                      return `/judges/dashboard/${dashboardProjectMatch[1]}`;
                    }
                    const submissionMatch =
                      normalized.match(/\/dashboard\/(\d+)/);
                    if (submissionMatch) {
                      return `/judges/dashboard/${submissionMatch[1]}`;
                    }
                    return normalized;
                  };

                  const actionUrl = normalizeActionUrl(notif.action_url);

                  const content = (
                    <div
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${!notif.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                        }`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {getTypeIcon(notifType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {notif.title}
                            </h4>
                            {!notif.is_read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notif.id, e)}
                                className="shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                aria-label="Mark as read"
                              >
                                <X className="size-3 text-gray-400" />
                              </button>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            <HtmlContent html={notif.message} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                            {new Date(notif.created_at).toLocaleDateString()}{" "}
                            {new Date(notif.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  if (actionUrl) {
                    // External URLs open in new tab
                    if (
                      actionUrl.startsWith("http://") ||
                      actionUrl.startsWith("https://")
                    ) {
                      return (
                        <a
                          key={notif.id}
                          href={actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                        >
                          {content}
                        </a>
                      );
                    }
                    // Internal URLs use Next.js Link
                    return (
                      <Link
                        key={notif.id}
                        href={actionUrl}
                        onClick={() => setIsOpen(false)}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={notif.id}>{content}</div>;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <Bell className="size-12 mb-4 opacity-50" />
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm font-medium text-[#605DEC] hover:text-[#5048E5] transition-colors"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
