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


---

# Stage 2 – Database Design

## Recommended Database

I recommend using a **Relational Database (MySQL)** for this notification system.

### Why MySQL?

- Provides ACID compliance for reliable transactions.
- Suitable for structured notification data.
- Supports indexing for faster queries.
- Easy to maintain relationships between students and notifications.
- Good performance for filtering, sorting, and pagination.

---

## Database Schema

### Table: Students

| Column | Data Type | Constraints |
|---------|-----------|------------|
| student_id | INT | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE |

---

### Table: Notifications

| Column | Data Type | Constraints |
|---------|-----------|------------|
| notification_id | INT | PRIMARY KEY AUTO_INCREMENT |
| student_id | INT | FOREIGN KEY |
| type | VARCHAR(20) | NOT NULL |
| message | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Relationship

- One Student can have many Notifications.
- Each Notification belongs to one Student.

(Student 1 -----> Many Notifications)

---

## Indexes

Create indexes on:

- student_id
- is_read
- created_at

These indexes improve search performance.

---

## Challenges with Large Data

As the number of notifications increases, the following issues may occur:

- Slow query execution
- Increased database size
- Higher response time
- Heavy server load

---

## Solutions

- Create indexes on frequently searched columns.
- Use pagination (LIMIT and OFFSET).
- Archive old notifications.
- Cache frequently accessed data using Redis.
- Optimize SQL queries.
- Use read replicas for heavy read traffic.

---

## Sample SQL Query

```sql
SELECT notification_id,
       type,
       message,
       created_at
FROM Notifications
WHERE student_id = 1042
  AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 20;
```