export const NOTIFICATION_TYPES = ["Placement", "Result", "Event"];

export const TYPE_COLORS = {
  Placement: "success",
  Result: "primary",
  Event: "secondary"
};

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

export function getReadIds() {
  try {
    return JSON.parse(localStorage.getItem("affordmed_read_notifications")) || [];
  } catch {
    return [];
  }
}

export function saveReadIds(readIds) {
  localStorage.setItem(
    "affordmed_read_notifications",
    JSON.stringify([...new Set(readIds)])
  );
}
