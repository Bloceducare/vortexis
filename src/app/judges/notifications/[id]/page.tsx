"use client";

import { Bell, Info, Award, MessageSquare, Clock, Edit } from "lucide-react";
import { useParams } from "next/navigation";
import { useSubmissionReview } from "@/hooks/useSubmissionReview";

type NotificationType =
  | "announcement"
  | "assignment"
  | "discussion"
  | "deadline"
  | "update";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

function NotificationCard({ notification }: { notification: Notification }) {
  const formattedDate = new Date(notification.timestamp).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

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

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 ${
        !notification.read ? "border-l-4 border-blue-500" : ""
      }`}
    >
      <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {notification.title}
          </h3>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
        {notification.link && (
          <a
            href={notification.link}
            className="text-blue-600 hover:underline text-sm"
          >
            View Details
          </a>
        )}
      </div>
      {!notification.read && (
        <button className="flex-shrink-0 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none">
          Mark as Read
        </button>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const params = useParams();
  const hackathonId = params.id as string;

  // Fetch hackathon details to get the real name
  const { hackathonDetails } = useSubmissionReview(hackathonId);
  const hackathonName = hackathonDetails?.title || `Hackathon #${hackathonId}`;

  // Mock notifications specific to the hackathon
  const notifications: Notification[] = [
    {
      id: "notif1",
      type: "announcement",
      title: `Hackathon #${hackathonId} Updates`,
      message: `Important updates for Hackathon #${hackathonId}. Please review the latest submission guidelines and evaluation criteria.`,
      timestamp: "2025-05-18T10:00:00Z",
      read: false,
    },
    {
      id: "notif2",
      type: "assignment",
      title: `New Submissions Available for Review`,
      message: `3 new submissions have been submitted for Hackathon #${hackathonId}. Please review them by the deadline.`,
      timestamp: "2025-05-15T15:30:00Z",
      read: false,
      link: `/judges/dashboard/${hackathonId}`,
    },
    {
      id: "notif3",
      type: "discussion",
      title: `New Discussion Activity`,
      message: `New messages in the judges discussion room for Hackathon #${hackathonId}. Check the collaboration tab for updates.`,
      timestamp: "2025-05-14T09:45:00Z",
      read: true,
      link: `/judges/collaboration/${hackathonId}`,
    },
    {
      id: "notif4",
      type: "deadline",
      title: `Review Deadline Approaching`,
      message: `Reminder: All reviews for Hackathon #${hackathonId} must be completed by May 15th, 5 PM EST.`,
      timestamp: "2025-05-14T08:00:00Z",
      read: true,
    },
    {
      id: "notif5",
      type: "update",
      title: `Evaluation Criteria Updated`,
      message: `The evaluation criteria for Hackathon #${hackathonId} has been updated. Please review the changes before scoring.`,
      timestamp: "2025-05-10T11:20:00Z",
      read: true,
      link: `/judges/evaluation-criteria/${hackathonId}`,
    },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
      <p className="text-gray-600 mb-6">
        Notifications for {hackathonName} - Stay updated with important
        announcements and activities.
      </p>

      <div className="space-y-6">
        {unreadNotifications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Unread</h2>
            <div className="space-y-4">
              {unreadNotifications.map((notif) => (
                <NotificationCard key={notif.id} notification={notif} />
              ))}
            </div>
          </div>
        )}

        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Read</h2>
            <div className="space-y-4">
              {readNotifications.map((notif) => (
                <NotificationCard key={notif.id} notification={notif} />
              ))}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <p className="text-center text-gray-500">
            No notifications to display for this hackathon.
          </p>
        )}
      </div>
    </div>
  );
}
