import { NotificationsPage } from "./NotificationsPage";

export function PriorityNotificationsPage({ readIds, onToggleRead }) {
  return (
    <NotificationsPage
      priority
      readIds={readIds}
      onToggleRead={onToggleRead}
    />
  );
}
