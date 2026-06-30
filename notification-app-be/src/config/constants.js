export const NOTIFICATION_API_URL =
  process.env.NOTIFICATION_API_URL ||
  "http://4.224.186.213/evaluation-service/notifications";

export const NOTIFICATION_API_TOKEN = process.env.NOTIFICATION_API_TOKEN || "";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const NOTIFICATION_TYPES = ["Placement", "Result", "Event"];

export const PRIORITY_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1
};
