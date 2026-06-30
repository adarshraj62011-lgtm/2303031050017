import { Log } from "../../../logging-middleware/index.js";

export function notFoundHandler(req, res) {
  Log("backend", "warn", "middleware", `Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  Log("backend", "error", "middleware", err.message || "Internal server error");

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
}
