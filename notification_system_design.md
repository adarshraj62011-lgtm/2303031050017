# Stage 1 – API Design

## Overview

The notification system enables students to receive real-time notifications related to Placements, Results, and Events.

---

## REST APIs

### 1. Get All Notifications

**Method:** GET

**Endpoint:**

```
/notifications
```

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response**

```json
{
  "notifications": [
    {
      "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "type": "Placement",
      "message": "Microsoft Hiring Drive",
      "timestamp": "2026-04-22T17:51:30Z",
      "isRead": false
    }
  ]
}
```

---

### 2. Mark Notification as Read

**Method:** PATCH

**Endpoint**

```
/notifications/{id}/read
```

**Response**

```json
{
  "message": "Notification marked as read successfully"
}
```

---

### 3. Get Notification by ID

**Method:** GET

**Endpoint**

```
/notifications/{id}
```

---

### 4. Delete Notification

**Method:** DELETE

**Endpoint**

```
/notifications/{id}
```

**Response**

```json
{
  "message": "Notification deleted successfully"
}
```

---

## Response Status Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Request Successful |
| 201 | Notification Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Notification Not Found |
| 500 | Internal Server Error |

---

## JSON Schema

```json
{
  "id": "string",
  "type": "Placement | Result | Event",
  "message": "string",
  "timestamp": "ISO-8601 DateTime",
  "isRead": false
}
```

---

## Real-Time Notification Mechanism

The system will use **WebSocket (Socket.IO)** to push notifications instantly to connected users. This eliminates the need for page refreshes and provides real-time updates with low latency.

### Supported Notification Types

- Placement
- Result
- Event