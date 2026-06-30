import axios from "axios";
import { Log } from "../../../logging-middleware/index.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_API_AUTH_TOKEN;

  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  return config;
});

function buildParams({ page, limit, notificationType }) {
  return {
    page,
    limit,
    notification_type: notificationType || undefined
  };
}

export async function fetchNotifications(params) {
  Log("frontend", "info", "api", "Fetching all notifications");
  const response = await api.get("/notifications", {
    params: buildParams(params)
  });

  return response.data;
}

export async function fetchPriorityNotifications(params) {
  Log("frontend", "info", "api", "Fetching priority notifications");
  const response = await api.get("/notifications/priority", {
    params: buildParams(params)
  });

  return response.data;
}
