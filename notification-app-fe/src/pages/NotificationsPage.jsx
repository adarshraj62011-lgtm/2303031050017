import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import { NotificationControls } from "../components/NotificationControls";
import { NotificationList } from "../components/NotificationList";
import { PaginationControls } from "../components/PaginationControls";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../../../logging-middleware/index.js";

export function NotificationsPage({
  priority = false,
  readIds,
  onToggleRead
}) {
  const [notificationType, setNotificationType] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { notifications, pagination, loading, error } = useNotifications({
    priority,
    page,
    limit,
    notificationType
  });

  const unreadCount = notifications.filter(
    (notification) => !readIds.includes(notification.id)
  ).length;

  const Icon = priority ? PriorityHighIcon : NotificationsIcon;
  const title = priority ? "Priority Notifications" : "All Notifications";
  const subtitle = priority
    ? "Placement notifications rank first, then results, then events."
    : "Latest notifications sorted by timestamp.";

  function handleFilterChange(newFilter) {
    Log("frontend", "info", "page", `Filter changed to ${newFilter || "All"}`);
    setNotificationType(newFilter);
    setPage(1);
  }

  function handleLimitChange(newLimit) {
    Log("frontend", "info", "page", `Limit changed to ${newLimit}`);
    setLimit(newLimit);
    setPage(1);
  }

  return (
    <Stack spacing={3}>
      <Box className="page-heading">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Icon color={priority ? "warning" : "primary"} />
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
        </Stack>
        <Typography color="text.secondary">{subtitle}</Typography>
        <Typography variant="body2" color="text.secondary">
          {unreadCount} unread on this page
        </Typography>
      </Box>

      <NotificationControls
        notificationType={notificationType}
        limit={limit}
        onTypeChange={handleFilterChange}
        onLimitChange={handleLimitChange}
        title="Filter notifications"
      />

      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        readIds={readIds}
        onToggleRead={onToggleRead}
      />

      <PaginationControls pagination={pagination} onPageChange={setPage} />
    </Stack>
  );
}
