import axios from "axios";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  NOTIFICATION_API_TOKEN,
  NOTIFICATION_API_URL,
  NOTIFICATION_TYPES
} from "../config/constants.js";
import {
  getPriorityWeight,
  getTopPriorityNotifications,
  parseNotificationTimestamp
} from "../utils/priority.js";
import { Log } from "../../../logging-middleware/index.js";

function toPositiveInteger(value, fallback, max = MAX_LIMIT) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

function normalizeType(type) {
  if (!type) {
    return "";
  }

  const value = String(type).trim().toLowerCase();
  return NOTIFICATION_TYPES.find(
    (supportedType) => supportedType.toLowerCase() === value
  );
}

function normalizeNotification(notification) {
  const type = normalizeType(notification.Type || notification.type);
  const id = notification.ID || notification.id;
  const timestamp = notification.Timestamp || notification.timestamp;

  return {
    id,
    type,
    message: notification.Message || notification.message || "",
    timestamp,
    priorityWeight: getPriorityWeight(type)
  };
}

function buildSourceHeaders(authorizationHeader) {
  const headers = {
    Accept: "application/json"
  };
  const token = authorizationHeader || NOTIFICATION_API_TOKEN;

  if (token) {
    headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  return headers;
}

function filterNotifications(notifications, notificationType) {
  const type = normalizeType(notificationType);

  if (!type) {
    return notifications;
  }

  return notifications.filter((notification) => notification.type === type);
}

function paginate(notifications, page, limit) {
  const totalPages = Math.max(1, Math.ceil(notifications.length / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: notifications.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total: notifications.length,
      totalPages
    }
  };
}

async function fetchNotificationsFromSource(authorizationHeader, params = {}) {
  try {
    Log("backend", "info", "service", "Fetching notifications from source API");

    const response = await axios.get(NOTIFICATION_API_URL, {
      timeout: 10000,
      headers: buildSourceHeaders(authorizationHeader),
      params
    });

    const notifications = Array.isArray(response.data?.notifications)
      ? response.data.notifications
      : [];

    return notifications
      .map(normalizeNotification)
      .filter(
        (notification) =>
          notification.id &&
          notification.type &&
          notification.timestamp &&
          parseNotificationTimestamp(notification.timestamp) > 0
      );
  } catch (error) {
    const upstreamStatus = error.response?.status;
    const message = upstreamStatus
      ? `Notification service responded with status ${upstreamStatus}`
      : "Unable to fetch notifications from notification service";
    const serviceError = new Error(message);

    Log("backend", "error", "service", message);
    serviceError.statusCode = upstreamStatus === 401 ? 401 : 502;
    throw serviceError;
  }
}

export async function getNotifications(query = {}, authorizationHeader = "") {
  const page = toPositiveInteger(query.page, DEFAULT_PAGE);
  const limit = toPositiveInteger(query.limit, DEFAULT_LIMIT);
  const notificationType = normalizeType(query.notification_type);
  const notifications = await fetchNotificationsFromSource(authorizationHeader, {
    page,
    limit,
    notification_type: notificationType || undefined
  });
  const filteredNotifications = filterNotifications(
    notifications,
    notificationType
  ).sort(
    (first, second) =>
      parseNotificationTimestamp(second.timestamp) -
      parseNotificationTimestamp(first.timestamp)
  );

  return paginate(filteredNotifications, page, limit);
}

export async function getPriorityNotifications(query = {}, authorizationHeader = "") {
  const page = toPositiveInteger(query.page, DEFAULT_PAGE);
  const limit = toPositiveInteger(query.limit, DEFAULT_LIMIT);
  const notificationType = normalizeType(query.notification_type);
  const notifications = await fetchNotificationsFromSource(authorizationHeader, {
    notification_type: notificationType || undefined
  });
  const filteredNotifications = filterNotifications(notifications, notificationType);
  const priorityNotifications = getTopPriorityNotifications(
    filteredNotifications,
    limit
  );

  return paginate(priorityNotifications, page, limit);
}
