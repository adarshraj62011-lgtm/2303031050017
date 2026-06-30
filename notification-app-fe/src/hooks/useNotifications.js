import { useState, useEffect } from "react";
import {
  fetchNotifications,
  fetchPriorityNotifications
} from "../api/notifications";
import { Log } from "../../../logging-middleware/index.js";

export function useNotifications({
  priority = false,
  page = 1,
  limit = 10,
  notificationType = ""
}) {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const fetcher = priority ? fetchPriorityNotifications : fetchNotifications;
        const data = await fetcher({ page, limit, notificationType });

        if (!ignore) {
          setNotifications(data.notifications ?? []);
          setPagination(data.pagination ?? null);
          Log("frontend", "info", "hook", "Notifications loaded successfully");
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err.response?.data?.message ||
            "Unable to load notifications. Please try again.";

          setError(message);
          Log("frontend", "error", "hook", message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [priority, page, limit, notificationType]);

  return {
    notifications,
    pagination,
    total: pagination?.total ?? 0,
    totalPages: pagination?.totalPages ?? 1,
    loading,
    error
  };
}
