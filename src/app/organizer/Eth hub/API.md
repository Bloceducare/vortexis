# Lagos Ethereum Hub — API Reference

## Overview

REST API consumed by the frontend. Implement in any backend:
Node.js/Express, Python/FastAPI, Django, Laravel, Go — your choice.

Base URL (configure in `config.js`):
```
https://api.yourdomain.com/v1
```

All requests and responses use `Content-Type: application/json`.
All protected routes require the `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/login
Admin login. Returns a JWT token.

**Request**
```json
{
  "email": "admin@lagosethhub.org",
  "password": "your_password"
}
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin_01",
    "name": "Hub Manager",
    "email": "admin@lagosethhub.org",
    "role": "admin"
  },
  "expires_at": "2026-04-18T13:00:00Z"
}
```

**Response 401**
```json
{ "error": "Invalid credentials" }
```

---

### POST /auth/logout
Invalidate the current token.

**Headers** `Authorization: Bearer <token>`

**Response 200**
```json
{ "message": "Logged out successfully" }
```

---

### GET /auth/me
Return the currently authenticated admin.

**Headers** `Authorization: Bearer <token>`

**Response 200**
```json
{
  "id": "admin_01",
  "name": "Hub Manager",
  "email": "admin@lagosethhub.org",
  "role": "admin"
}
```

---

## Members

### POST /members
Register a new member. Status is automatically set to `pending`.

**Headers** `Authorization: Bearer <token>`

**Request**
```json
{
  "first_name": "Amara",
  "last_name": "Okafor",
  "email": "amara@example.com",
  "phone": "+234 801 234 5678",
  "type": "Co-working"
}
```

`type` must be `"Co-working"` or `"Training"`

**Response 201**
```json
{
  "id": "LEC-0001",
  "first_name": "Amara",
  "last_name": "Okafor",
  "name": "Amara Okafor",
  "email": "amara@example.com",
  "phone": "+234 801 234 5678",
  "type": "Co-working",
  "status": "pending",
  "registered_on": "2026-04-17",
  "registered_at": "2026-04-17T10:23:00Z",
  "visits": 0,
  "last_seen": null,
  "approved_by": null,
  "approved_at": null,
  "rejected_reason": null
}
```

**Response 409** — duplicate email
```json
{ "error": "A member with this email already exists" }
```

---

### GET /members
List all members. Supports filters.

**Headers** `Authorization: Bearer <token>`

**Query params**
| Param | Type | Example |
|---|---|---|
| `status` | string | `pending`, `approved`, `rejected` |
| `type` | string | `Co-working`, `Training` |
| `search` | string | `amara` (searches name, email, ID) |
| `page` | int | `1` |
| `limit` | int | `50` |

**Response 200**
```json
{
  "data": [
    {
      "id": "LEC-0001",
      "name": "Amara Okafor",
      "email": "amara@example.com",
      "phone": "+234 801 234 5678",
      "type": "Co-working",
      "status": "approved",
      "registered_on": "2026-04-17",
      "visits": 12,
      "last_seen": "2026-04-17",
      "approved_by": "admin@lagosethhub.org",
      "approved_at": "2026-04-17T11:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

---

### GET /members/:id
Get a single member by their `LEC-XXXX` ID.

**Headers** `Authorization: Bearer <token>`

**Response 200** — full member object (same shape as POST /members response)

**Response 404**
```json
{ "error": "Member not found" }
```

---

### PATCH /members/:id/approve
Approve a pending member. Generates their active QR status.

**Headers** `Authorization: Bearer <token>`

**Response 200**
```json
{
  "id": "LEC-0001",
  "status": "approved",
  "approved_by": "admin@lagosethhub.org",
  "approved_at": "2026-04-17T11:00:00Z"
}
```

**Response 400**
```json
{ "error": "Member is not in pending status" }
```

---

### PATCH /members/:id/reject
Reject a pending member.

**Headers** `Authorization: Bearer <token>`

**Request**
```json
{
  "reason": "Incomplete information provided"
}
```

**Response 200**
```json
{
  "id": "LEC-0001",
  "status": "rejected",
  "rejected_reason": "Incomplete information provided",
  "rejected_by": "admin@lagosethhub.org",
  "rejected_at": "2026-04-17T11:05:00Z"
}
```

---

### DELETE /members/:id
Permanently delete a member and all their attendance logs.

**Headers** `Authorization: Bearer <token>`

**Response 200**
```json
{ "message": "Member LEC-0001 and all logs deleted" }
```

---

## Check-in / Attendance

### POST /checkin
Process a QR code scan. The frontend sends the scanned member ID.

**Headers** `Authorization: Bearer <token>`

**Request**
```json
{
  "member_id": "LEC-0001"
}
```

**Response 200** — successful check-in
```json
{
  "status": "checked_in",
  "member": {
    "id": "LEC-0001",
    "name": "Amara Okafor",
    "type": "Co-working"
  },
  "log": {
    "id": "log_abc123",
    "member_id": "LEC-0001",
    "date": "2026-04-17",
    "time": "2026-04-17T09:14:33Z",
    "visit_num": 13
  }
}
```

**Response 200** — already checked in today
```json
{
  "status": "already_checked_in",
  "member": { "id": "LEC-0001", "name": "Amara Okafor", "type": "Co-working" },
  "checked_in_at": "2026-04-17T08:02:00Z"
}
```

**Response 403** — not approved
```json
{
  "status": "not_approved",
  "member_status": "pending",
  "message": "Registration is pending admin approval"
}
```

**Response 404**
```json
{ "status": "not_found", "message": "No member found with ID LEC-0001" }
```

---

### GET /attendance
List attendance logs. Supports filters.

**Headers** `Authorization: Bearer <token>`

**Query params**
| Param | Type | Example |
|---|---|---|
| `date` | string | `2026-04-17` |
| `member_id` | string | `LEC-0001` |
| `type` | string | `Co-working` |
| `search` | string | free text on name |
| `page` | int | `1` |
| `limit` | int | `100` |

**Response 200**
```json
{
  "data": [
    {
      "id": "log_abc123",
      "member_id": "LEC-0001",
      "name": "Amara Okafor",
      "type": "Co-working",
      "date": "2026-04-17",
      "time": "2026-04-17T09:14:33Z",
      "visit_num": 13
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 100
}
```

---

## Dashboard stats

### GET /stats
Summary numbers for the dashboard.

**Headers** `Authorization: Bearer <token>`

**Response 200**
```json
{
  "total_members": 42,
  "approved_members": 38,
  "pending_members": 3,
  "rejected_members": 1,
  "coworking_members": 25,
  "training_members": 13,
  "checkins_today": 17,
  "checkins_this_week": 89,
  "checkins_this_month": 312,
  "date": "2026-04-17"
}
```

---

## Database schema

### members table

```sql
CREATE TABLE members (
  id              VARCHAR(12) PRIMARY KEY,  -- e.g. LEC-0001
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  name            VARCHAR(200) NOT NULL,    -- first + last
  email           VARCHAR(200) UNIQUE NOT NULL,
  phone           VARCHAR(30),
  type            ENUM('Co-working','Training') NOT NULL,
  status          ENUM('pending','approved','rejected') DEFAULT 'pending',
  registered_on   DATE NOT NULL,
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visits          INT DEFAULT 0,
  last_seen       DATE,
  approved_by     VARCHAR(200),
  approved_at     TIMESTAMP,
  rejected_reason TEXT,
  rejected_by     VARCHAR(200),
  rejected_at     TIMESTAMP
);
```

### attendance_logs table

```sql
CREATE TABLE attendance_logs (
  id          VARCHAR(36) PRIMARY KEY,   -- UUID
  member_id   VARCHAR(12) NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  name        VARCHAR(200) NOT NULL,     -- denormalized for speed
  type        VARCHAR(20) NOT NULL,
  date        DATE NOT NULL,
  time        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visit_num   INT NOT NULL,
  UNIQUE (member_id, date)               -- one check-in per member per day
);
```

### admins table

```sql
CREATE TABLE admins (
  id         VARCHAR(36) PRIMARY KEY,   -- UUID
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(200) UNIQUE NOT NULL,
  password   VARCHAR(200) NOT NULL,     -- bcrypt hash
  role       VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Error format

All errors follow this shape:

```json
{
  "error": "Human readable message",
  "code": "MACHINE_READABLE_CODE",   // optional
  "field": "email"                   // optional, for validation errors
}
```

## HTTP status codes used

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Forbidden (approved status check) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

## Quick start (Node.js/Express example)

```bash
npm init -y
npm install express bcryptjs jsonwebtoken cors dotenv
```

```javascript
// server.js
const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const cors    = require('cors');
const app     = express();

app.use(cors({ origin: 'https://your-hub-url.netlify.app' }));
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'change-this-in-production';

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch(e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// POST /auth/login
app.post('/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // TODO: look up admin from DB, compare bcrypt hash
  // const admin = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
  // const valid = await bcrypt.compare(password, admin.password);
  const token = jwt.sign({ id: 'admin_01', email }, SECRET, { expiresIn: '24h' });
  res.json({ token, admin: { id: 'admin_01', email, name: 'Hub Manager' } });
});

// POST /v1/checkin
app.post('/v1/checkin', auth, async (req, res) => {
  const { member_id } = req.body;
  // TODO: look up member, check status, check today's log, insert log
  res.json({ status: 'checked_in', member: { id: member_id } });
});

app.listen(3000, () => console.log('API running on port 3000'));
```

Deploy to: **Railway**, **Render**, **Fly.io**, **Heroku**, or any VPS.
