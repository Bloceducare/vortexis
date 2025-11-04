import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

export interface Notification {
  id: string;
  title: string;
  message: string;
  category?: string;
  priority?: string;
  is_read: boolean;
  created_at: string;
  action_url?: string | null;
  action_text?: string | null;
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  category_breakdown?: Record<string, number>;
  recent_notifications?: Notification[];
}

interface UseNotificationsOptions {
  baseUrl?: string;
  autoFetch?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { token, userId, isAuthenticated } = useAuth();
  const baseUrl =
    options.baseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setError("Authentication required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      // Handle paginated response
      let notificationsArray: Notification[] = [];
      if (Array.isArray(data)) {
        notificationsArray = data;
      } else if (data && Array.isArray(data.results)) {
        notificationsArray = data.results;
      } else {
        console.warn("Unexpected API response format:", data);
        notificationsArray = [];
      }

      setNotifications(notificationsArray);
      return notificationsArray;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token, isAuthenticated]);

  // Fetch notification statistics
  const fetchStats = useCallback(async () => {
    if (!token || !isAuthenticated) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/notifications/stats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data: NotificationStats = await response.json();
      setStats(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch notification stats";
      console.error("Error fetching notification stats:", err);
      return null;
    }
  }, [baseUrl, token, isAuthenticated]);

  // Fetch a single notification by ID
  const fetchNotification = useCallback(
    async (id: string) => {
      if (!token || !isAuthenticated) {
        setError("Authentication required");
        return null;
      }

      try {
        const response = await fetch(`${baseUrl}/notifications/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data: Notification = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch notification";
        setError(errorMessage);
        console.error("Error fetching notification:", err);
        return null;
      }
    },
    [baseUrl, token, isAuthenticated]
  );

  // Mark a specific notification as read
  const markAsRead = useCallback(
    async (id: string) => {
      if (!token || !isAuthenticated) {
        setError("Authentication required");
        return false;
      }

      try {
        const response = await fetch(
          `${baseUrl}/notifications/${id}/mark_read/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        // Optimistically update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );

        // Update stats if available
        if (stats) {
          setStats({
            ...stats,
            unread_count: Math.max(0, stats.unread_count - 1),
          });
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to mark notification as read";
        setError(errorMessage);
        console.error("Error marking notification as read:", err);
        return false;
      }
    },
    [baseUrl, token, isAuthenticated, stats]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(
    async (category?: string) => {
      if (!token || !isAuthenticated) {
        setError("Authentication required");
        return false;
      }

      try {
        const body = category ? { category } : {};
        const response = await fetch(
          `${baseUrl}/notifications/mark_all_read/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        // Optimistically update local state
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, is_read: true }))
        );

        // Update stats
        if (stats) {
          setStats({
            ...stats,
            unread_count: 0,
          });
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to mark all as read";
        setError(errorMessage);
        console.error("Error marking all notifications as read:", err);
        return false;
      }
    },
    [baseUrl, token, isAuthenticated, stats]
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options.autoFetch !== false && token && isAuthenticated) {
      fetchNotifications();
      fetchStats();
    }
  }, [
    token,
    isAuthenticated,
    options.autoFetch,
    fetchNotifications,
    fetchStats,
  ]);

  return {
    notifications,
    stats,
    isLoading,
    error,
    fetchNotifications,
    fetchStats,
    fetchNotification,
    markAsRead,
    markAllAsRead,
    refetch: () => {
      fetchNotifications();
      fetchStats();
    },
  };
};
