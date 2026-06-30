import { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityNotificationsPage } from "./pages/PriorityNotificationsPage";
import { getReadIds, saveReadIds } from "./utils/notification";
import { Log } from "../../logging-middleware/index.js";

export default function App() {
  const initialReadIds = useMemo(() => {
    Log("frontend", "info", "app", "Application initialized");
    return getReadIds();
  }, []);
  const [readIds, setReadIds] = useState(initialReadIds);

  function handleToggleRead(id, forceRead = false) {
    setReadIds((currentReadIds) => {
      if (forceRead && currentReadIds.includes(id)) {
        return currentReadIds;
      }

      const nextReadIds =
        forceRead || !currentReadIds.includes(id)
          ? [...currentReadIds, id]
          : currentReadIds.filter((readId) => readId !== id);

      saveReadIds(nextReadIds);
      Log("frontend", "info", "app", `Read state updated for ${id}`);
      return nextReadIds;
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <NotificationsPage
                readIds={readIds}
                onToggleRead={handleToggleRead}
              />
            }
          />
          <Route
            path="/priority"
            element={
              <PriorityNotificationsPage
                readIds={readIds}
                onToggleRead={handleToggleRead}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
