import { PRIORITY_WEIGHTS } from "../config/constants.js";
import { Log } from "../../../logging-middleware/index.js";

export function getPriorityWeight(type) {
  Log("backend", "debug", "utils", `Priority weight requested for ${type}`);
  return PRIORITY_WEIGHTS[type] || 0;
}

export function parseNotificationTimestamp(timestamp) {
  const parsed = new Date(timestamp).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function compareByPriority(first, second) {
  const weightDifference =
    getPriorityWeight(second.type) - getPriorityWeight(first.type);

  if (weightDifference !== 0) {
    return weightDifference;
  }

  return (
    parseNotificationTimestamp(second.timestamp) -
    parseNotificationTimestamp(first.timestamp)
  );
}

export function getTopPriorityNotifications(notifications, limit) {
  Log("backend", "info", "utils", `Ranking ${notifications.length} notifications`);
  return [...notifications].sort(compareByPriority).slice(0, limit);
}
