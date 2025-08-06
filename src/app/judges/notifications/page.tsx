"use client";

import { Bell, Info, Award, MessageSquare, Clock, Edit } from "lucide-react";

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
  const notifications: Notification[] = [
    {
      id: "notif1",
      type: "announcement",
      title: "System Maintenance Scheduled",
      message:
        "Heads up! Our platform will undergo scheduled maintenance on May 20th, 2025, from 2 AM to 4 AM UTC. Expect brief downtime.",
      timestamp: "2025-05-18T10:00:00Z",
      read: false,
    },
    {
      id: "notif2",
      type: "assignment",
      title: "New Hackathon Assignment: AI for Good",
      message:
        'You have been assigned to judge the "AI for Good" hackathon. Submissions are now open for review.',
      timestamp: "2025-05-15T15:30:00Z",
      read: false,
      link: "/assigned-hackathons",
    },
    {
      id: "notif3",
      type: "discussion",
      title: 'New Reply in "Blockchain Vote Project" Discussion',
      message:
        'Alex Johnson replied to your comment in the "Blockchain Vote Project" discussion: "I agree on innovation, but..."',
      timestamp: "2025-05-14T09:45:00Z",
      read: true,
      link: "/judges/collaboration",
    },
    {
      id: "notif4",
      type: "deadline",
      title: "Deadline Approaching: Future Tech Summit",
      message:
        'Reminder: All reviews for "Future Tech Summit 2025" must be completed by May 15th, 5 PM EST.',
      timestamp: "2025-05-14T08:00:00Z",
      read: true,
    },
    {
      id: "notif5",
      type: "update",
      title: "Evaluation Criteria Updated for HealthTech",
      message:
        'The "Impact" criterion for the "HealthTech Innovation" hackathon has been updated. Please review the changes.',
      timestamp: "2025-05-10T11:20:00Z",
      read: true,
      link: "/judges/evaluation-criteria",
    },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
      <p className="text-gray-600 mb-6">
        Stay updated with important announcements and activities.
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
            No notifications to display.
          </p>
        )}
      </div>
    </div>
  );
}
