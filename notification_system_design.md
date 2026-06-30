# Notification System Design

# Stage 1 - API Design

## Overview

The notification system lets authorised students view campus notifications for placements, results and events. The system supports unread/read state, fetching by id, deleting old notifications and real-time delivery.

## REST APIs

### Get all notifications

**Method:** `GET`

**Endpoint:** `/notifications`

**Headers**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Query parameters**

| Parameter | Description |
| --- | --- |
| `page` | Page number for pagination |
| `limit` | Number of notifications per page |
| `notification_type` | `Placement`, `Result` or `Event` |

**Response**

```json
{
  "notifications": [
    {
      "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "type": "Placement",
      "message": "Hiring drive",
      "timestamp": "2026-04-22T17:51:30Z",
      "isRead": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Mark notification as read

**Method:** `PATCH`

**Endpoint:** `/notifications/{id}/read`

**Response**

```json
{
  "message": "Notification marked as read successfully"
}
```

### Get notification by id

**Method:** `GET`

**Endpoint:** `/notifications/{id}`

### Delete notification

**Method:** `DELETE`

**Endpoint:** `/notifications/{id}`

## Response Codes

| Status Code | Description |
| --- | --- |
| 200 | Request successful |
| 201 | Notification created |
| 400 | Invalid request |
| 401 | Unauthorized |
| 404 | Notification not found |
| 500 | Internal server error |

## JSON Schema

```json
{
  "id": "string",
  "type": "Placement | Result | Event",
  "message": "string",
  "timestamp": "ISO-8601 datetime",
  "isRead": false
}
```

## Real-Time Mechanism

Socket.IO can be used for real-time delivery. The server emits notification events to connected students and the frontend updates the notification list without refreshing.

# Stage 2 - Database Design

## Recommended Database

I recommend MySQL or PostgreSQL because notifications have structured fields, predictable queries and relations with students.

## Schema

### students

| Column | Type | Constraint |
| --- | --- | --- |
| student_id | BIGINT | Primary key |
| name | VARCHAR(100) | Not null |
| email | VARCHAR(150) | Unique |
| created_at | TIMESTAMP | Default current timestamp |

### notifications

| Column | Type | Constraint |
| --- | --- | --- |
| notification_id | BIGINT | Primary key |
| student_id | BIGINT | Foreign key |
| notification_type | ENUM('Placement','Result','Event') | Not null |
| message | TEXT | Not null |
| is_read | BOOLEAN | Default false |
| created_at | TIMESTAMP | Indexed |

## Indexes

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications (student_id, is_read, created_at DESC);

CREATE INDEX idx_notifications_type_created
ON notifications (notification_type, created_at DESC);
```

## Large Data Challenges

As the system grows, queries may slow down, indexes may become expensive to maintain, and old notifications may make the table heavy.

## Solutions

- Use pagination for every list endpoint.
- Add composite indexes for common filters.
- Archive old notifications after a retention period.
- Use read replicas for high read traffic.
- Cache frequently accessed notification pages.

# Stage 3 - SQL Query Optimization

## Given Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

## Issues

The query is logically close, but for an inbox the newest notifications should usually appear first. It can become slow with millions of rows because it may scan many records unless a composite index supports the filter and sort.

## Optimized Query

```sql
SELECT notification_id,
       notification_type,
       message,
       is_read,
       created_at
FROM notifications
WHERE student_id = 1042
  AND is_read = false
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

## Recommended Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications (student_id, is_read, created_at DESC);
```

## Should Every Column Be Indexed?

No. Indexes speed up reads but increase storage and slow down inserts/updates. Only columns used frequently in filters, joins and sorting should be indexed.

## Last 7 Days Placement Notifications

```sql
SELECT notification_id,
       student_id,
       message,
       created_at
FROM notifications
WHERE notification_type = 'Placement'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

# Stage 4 - Performance Improvements

## Problem

Fetching all notifications on every page load overloads the database and creates poor frontend performance.

## Recommended Improvements

### Pagination

Return small batches using `limit` and `page`. This reduces memory usage, network transfer and render cost.

### Indexing

Use composite indexes such as `(student_id, is_read, created_at DESC)` and `(notification_type, created_at DESC)` for common queries.

### Caching

Use Redis for frequently requested pages, counts and metadata. Cache entries should expire quickly so new notifications are still visible.

### Archiving

Move old notifications into an archive table or cold storage. This keeps the active table small.

### Lazy Loading

Load notifications as the user scrolls or changes pages instead of loading everything up front.

## Tradeoffs

Caching adds invalidation complexity, archiving adds operational work, and indexes add write overhead. The combined approach is still better because it keeps reads fast as notification volume grows.

# Stage 5 - Reliable Notification System

## Shortcomings

If `send_email` fails midway, some students receive email and others do not. Saving to the database and sending external notifications should not be tightly coupled because external services can fail independently.

## Redesigned Flow

Use a message queue between the application and delivery workers.

```text
Admin action
  -> Application validates request
  -> Store notification request
  -> Publish jobs to queue
  -> Email worker retries failed email jobs
  -> Push worker retries failed push jobs
  -> Failed jobs move to dead-letter queue
```

## Revised Pseudocode

```text
function notify_all(student_ids, message):
    notification_batch = save_batch(message)

    for student_id in student_ids:
        save_in_app_notification(student_id, notification_batch.id)
        enqueue("email", student_id, message)
        enqueue("push", student_id, message)

    return accepted_response(notification_batch.id)

worker email_worker(job):
    try:
        send_email(job.student_id, job.message)
        mark_job_success(job.id)
    catch error:
        retry_or_move_to_dlq(job)
```

## Benefits

- Faster API response.
- Retries are possible.
- Delivery failures do not lose notifications.
- Email and database operations can scale independently.

# Stage 6 - Priority Notification Algorithm

## Requirement

The priority inbox must show the top `n` unread or important notifications first. Priority is determined by notification type and recency.

## Priority Order

```text
Placement > Result > Event
```

## Algorithm

1. Fetch notifications from the provided API.
2. Normalize API fields into `id`, `type`, `message` and `timestamp`.
3. Assign priority weights:
   - Placement = 3
   - Result = 2
   - Event = 1
4. Sort by priority weight descending.
5. If two notifications have the same priority, sort by newer timestamp first.
6. Return the top `n` notifications, defaulting to 10.

## JavaScript Implementation

```js
const PRIORITY_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function compareByPriority(first, second) {
  const priorityDifference =
    PRIORITY_WEIGHTS[second.type] - PRIORITY_WEIGHTS[first.type];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime();
}

function getTopPriorityNotifications(notifications, limit = 10) {
  return [...notifications].sort(compareByPriority).slice(0, limit);
}
```

## Maintaining Top 10 Efficiently

For a continuous stream of notifications, maintain a min-heap of size 10. Insert each new notification into the heap using the same priority comparator. If the heap size becomes greater than 10, remove the lowest priority item. This keeps updates efficient without sorting all notifications every time.
