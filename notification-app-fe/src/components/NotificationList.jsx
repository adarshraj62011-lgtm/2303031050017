import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { NotificationCard } from "./NotificationCard";

export function NotificationList({
  notifications,
  loading,
  error,
  readIds,
  onToggleRead
}) {
  if (loading) {
    return (
      <Box className="center-state">
        <CircularProgress />
        <Typography color="text.secondary">Loading notifications</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" icon={<ErrorOutlineIcon />}>
        {error}
      </Alert>
    );
  }

  if (!notifications.length) {
    return (
      <Alert severity="info">No notifications found for the selected filters.</Alert>
    );
  }

  return (
    <Stack spacing={2}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          isRead={readIds.includes(notification.id)}
          onToggleRead={onToggleRead}
        />
      ))}

      <Button
        variant="text"
        startIcon={<DoneAllIcon />}
        onClick={() => notifications.forEach((item) => onToggleRead(item.id, true))}
        className="mark-visible-button"
      >
        Mark visible as read
      </Button>
    </Stack>
  );
}
