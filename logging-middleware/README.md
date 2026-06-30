## Logging Middleware

Shared logging utility used by both `notification-app-be` and `notification-app-fe`.

The exported `Log(stack, level, packageName, message)` function can send logs to an
external logging API when `LOGGING_API_URL`/`VITE_LOGGING_API_URL` and an optional
token are configured. When no endpoint is configured, logs are retained in memory
so application code never falls back to built-in console logging.
