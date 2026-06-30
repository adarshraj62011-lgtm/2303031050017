# Postman Collection

This folder contains the Postman files needed to test the Affordmed Notification App APIs.

## Files

- `Affordmed-Notification-App.postman_collection.json` - API collection with requests, variables, tests and example responses.
- `Affordmed-Local.postman_environment.json` - local development environment for `http://localhost:5000`.
- `Affordmed-Deployed.postman_environment.json` - placeholder environment for a deployed backend URL.

## Import Steps

1. Open Postman.
2. Click **Import**.
3. Import all JSON files from this folder.
4. Select the **Affordmed Local** environment.
5. Run the backend:

```powershell
cd notification-app-be
npm.cmd install
npm.cmd start
```

6. Send **Health Check** first.
7. If notification requests return `401`, set `authToken` in the selected Postman environment.

## Included Requests

- `GET /health`
- `GET /api/notifications?page={{page}}&limit={{limit}}`
- `GET /api/notifications?page={{page}}&limit={{limit}}&notification_type={{notificationType}}`
- `GET /api/notifications/priority?page={{page}}&limit={{limit}}`
- `GET /api/notifications/priority?page={{page}}&limit={{limit}}&notification_type={{notificationType}}`
- Direct protected evaluation API request for source API verification.

## Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `baseUrl` | `http://localhost:5000` | Local backend API base URL |
| `sourceApiUrl` | `http://4.224.186.213/evaluation-service/notifications` | Provided evaluation API |
| `authToken` | empty | Optional protected API bearer token |
| `page` | `1` | Pagination page |
| `limit` | `10` | Pagination limit |
| `notificationType` | `Placement` | Supported values: `Placement`, `Result`, `Event` |

## Notes

The provided evaluation API is protected. The local backend forwards the Postman `Authorization: Bearer {{authToken}}` value to the source API when the token is set.
