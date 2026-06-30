const memoryLogs = [];

const ALLOWED_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const ALLOWED_STACKS = new Set(["backend", "frontend", "middleware"]);

function readEnv(key) {
  if (typeof import.meta !== "undefined" && import.meta.env?.[key]) {
    return import.meta.env[key];
  }

  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }

  return "";
}

function normalize(value, fallback) {
  return String(value || fallback).trim().toLowerCase();
}

function getLoggingUrl() {
  return readEnv("LOGGING_API_URL") || readEnv("VITE_LOGGING_API_URL");
}

function getLoggingToken() {
  return readEnv("LOGGING_API_TOKEN") || readEnv("VITE_LOGGING_API_TOKEN");
}

function buildPayload(stack, level, packageName, message) {
  const normalizedStack = normalize(stack, "middleware");
  const normalizedLevel = normalize(level, "info");

  return {
    stack: ALLOWED_STACKS.has(normalizedStack) ? normalizedStack : "middleware",
    level: ALLOWED_LEVELS.has(normalizedLevel) ? normalizedLevel : "info",
    package: normalize(packageName, "middleware"),
    message: String(message || "Application event"),
    timestamp: new Date().toISOString()
  };
}

async function sendLog(payload) {
  const url = getLoggingUrl();

  if (!url || typeof fetch !== "function") {
    memoryLogs.push(payload);
    return { success: true, stored: "memory" };
  }

  const token = getLoggingToken();
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  return {
    success: response.ok,
    status: response.status
  };
}

export async function Log(stack, level, packageName, message) {
  const payload = buildPayload(stack, level, packageName, message);

  try {
    return await sendLog(payload);
  } catch (error) {
    memoryLogs.push({
      ...payload,
      level: "error",
      message: `Logging transport failed: ${error.message}`
    });

    return { success: false, stored: "memory" };
  }
}

export function getMemoryLogs() {
  return [...memoryLogs];
}

export function createExpressLogger(packageName = "middleware") {
  return function loggingMiddleware(req, res, next) {
    const startedAt = Date.now();

    Log("backend", "info", packageName, `${req.method} ${req.originalUrl} started`);

    res.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      const level = res.statusCode >= 500 ? "error" : "info";
      Log(
        "backend",
        level,
        packageName,
        `${req.method} ${req.originalUrl} completed ${res.statusCode} in ${durationMs}ms`
      );
    });

    next();
  };
}
