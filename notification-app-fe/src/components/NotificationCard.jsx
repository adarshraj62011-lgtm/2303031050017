import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { TYPE_COLORS, formatTimestamp } from "../utils/notification";

export function NotificationCard({ notification, isRead, onToggleRead }) {
  return (
    <Card className={isRead ? "notification-card read" : "notification-card unread"}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box className="notification-copy">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={notification.type}
                color={TYPE_COLORS[notification.type] || "default"}
                size="small"
              />
              <Chip
                label={isRead ? "Read" : "Unread"}
                variant={isRead ? "outlined" : "filled"}
                color={isRead ? "default" : "warning"}
                size="small"
              />
              {notification.priorityWeight ? (
                <Chip
                  label={`Priority ${notification.priorityWeight}`}
                  variant="outlined"
                  size="small"
                />
              ) : null}
            </Stack>

            <Typography variant="h6" className="notification-title">
              {notification.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTimestamp(notification.timestamp)}
            </Typography>
          </Box>

          <Tooltip title={isRead ? "Mark as unread" : "Mark as read"}>
            <Button
              variant={isRead ? "outlined" : "contained"}
              startIcon={isRead ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
              onClick={() => onToggleRead(notification.id)}
              className="read-button"
            >
              {isRead ? "Unread" : "Read"}
            </Button>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
