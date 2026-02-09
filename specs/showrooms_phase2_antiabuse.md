# Showrooms Phase 2 -- Anti-Abuse & Security Specification

*Companion to `showrooms_phase2_ruleset.md`. Defines protections against reward farming, bot abuse, and system exploitation.*

---

## 1. QR Replay Protections

### Token Format

All showroom QR codes encode a structured token:

```
ETHFPL-{showroom_id_short}-{rotation_key}-{checksum}
```

| Segment | Description | Example |
|---------|-------------|---------|
| `ETHFPL` | Fixed prefix for app recognition and namespace | `ETHFPL` |
| `showroom_id_short` | First 8 characters of the showroom UUID | `a3f9c2b1` |
| `rotation_key` | 12-character alphanumeric key, rotated on schedule | `k7Xm9pQ2rT4w` |
| `checksum` | HMAC-SHA256 truncated to 8 hex chars (server-side secret) | `e4a1bc09` |

Full example: `ETHFPL-a3f9c2b1-k7Xm9pQ2rT4w-e4a1bc09`

### Rotation Policy

| Token Type | Rotation Frequency | TTL | Max Uses | Use Case |
|------------|--------------------|-----|----------|----------|
| **Daily QR** | Weekly (configurable: 1-30 days) | 7 days from generation | Unlimited (within rate limits) | Standard showroom join/check-in |
| **Event QR** | Per event | Event duration + 1 hour grace | Single-use per user | Match day events, promotions |
| **Admin Reset QR** | On demand | Until next rotation | Unlimited | When existing QR is compromised |

### Server Validation Flow

When a QR token is scanned, the server performs the following checks in order:

```
1. Parse token format → reject if malformed (400)
2. Extract showroom_id_short → look up showroom
3. Verify showroom.is_active = true → reject if suspended (403)
4. Verify checksum via HMAC with server secret → reject if tampered (403)
5. Match rotation_key against showroom.current_rotation_key → reject if expired (410)
6. Check use_count < max_uses (for event tokens) → reject if exhausted (410)
7. Check expires_at > NOW() → reject if expired (410)
8. Check user rate limit (10 scans/hour) → reject if exceeded (429)
9. Proceed to join/check-in logic
```

### QR Rotation Database Fields

```sql
ALTER TABLE showrooms ADD COLUMN current_rotation_key VARCHAR(12) NOT NULL DEFAULT generate_rotation_key();
ALTER TABLE showrooms ADD COLUMN rotation_key_generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE showrooms ADD COLUMN rotation_ttl_days INTEGER NOT NULL DEFAULT 7;
```

### Rotation Cron Job

A scheduled function runs daily at 03:00 UTC:

```sql
UPDATE showrooms
SET current_rotation_key = generate_rotation_key(),
    rotation_key_generated_at = NOW()
WHERE rotation_key_generated_at + (rotation_ttl_days || ' days')::INTERVAL < NOW();
```

Showroom admins can also trigger manual rotation via the admin dashboard (generates a new key immediately and invalidates the old one).

---

## 2. Rate Limits for Endpoints

### Rate Limit Table

| Endpoint | Limit | Window | Enforcement | Response on Exceed |
|----------|-------|--------|-------------|-------------------|
| `POST /showrooms/join` | 5 | 24 hours | Server middleware + DB check | `429 Too Many Requests` with `Retry-After` header |
| `POST /showrooms/leave` | 3 | 24 hours | Server middleware + DB check | `429 Too Many Requests` with `Retry-After` header |
| `POST /showrooms/:id/checkin` | 1 | Per calendar day (UTC) | DB UNIQUE constraint on `(user_id, checkin_date)` | `409 Conflict` with message "Already checked in today" |
| `POST /showrooms/slots/unlock` | 2 | Lifetime (per slot) | DB UNIQUE constraint on `(user_id, slot_index)` | `409 Conflict` (idempotent -- return existing record) |
| `POST /showrooms/qr/scan` | 10 | 1 hour | Sliding window counter | `429 Too Many Requests` with remaining cooldown |
| `GET /showrooms/my` | 60 | 1 minute | Sliding window counter | `429 Too Many Requests` |
| `POST /showrooms/:id/set-primary` | 2 | 24 hours | Server middleware (cooldown is the real gate) | `429 Too Many Requests` |
| `GET /showrooms/leaderboard/:id` | 30 | 1 minute | Sliding window counter | `429 Too Many Requests` |

### Implementation Strategy

**Client-side (advisory, not authoritative):**
- Use `localStorage` to track recent request timestamps per endpoint category
- Disable UI buttons when local rate limit is approaching
- Show countdown timer for time-locked actions (e.g., "You can join again in 4h 32m")
- Client-side limits are 80% of server limits (buffer for clock skew)

**Server-side (authoritative):**
- Sliding window counter per `(user_id, endpoint_category)` stored in:
  - **Primary**: PostgreSQL table `rate_limit_counters` with automatic expiry via `pg_cron`
  - **Optional upgrade**: Redis `INCR` + `EXPIRE` for higher throughput
- Supabase RLS policies enforce membership and ownership checks before rate limit middleware fires
- All rate limit responses include:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in window
  - `X-RateLimit-Reset`: Unix timestamp when window resets
  - `Retry-After`: Seconds until next request is allowed (on 429 only)

### Rate Limit Counter Schema

```sql
CREATE TABLE rate_limit_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  endpoint_category VARCHAR(50) NOT NULL,
  request_timestamps TIMESTAMPTZ[] NOT NULL DEFAULT '{}',
  UNIQUE(user_id, endpoint_category)
);

-- Cleanup function: remove timestamps older than the window
CREATE OR REPLACE FUNCTION clean_rate_limit_window(
  p_user_id UUID,
  p_category VARCHAR,
  p_window INTERVAL
) RETURNS INTEGER AS $$
DECLARE
  remaining INTEGER;
BEGIN
  UPDATE rate_limit_counters
  SET request_timestamps = array(
    SELECT unnest(request_timestamps)
    WHERE unnest > NOW() - p_window
  )
  WHERE user_id = p_user_id AND endpoint_category = p_category;

  SELECT array_length(request_timestamps, 1) INTO remaining
  FROM rate_limit_counters
  WHERE user_id = p_user_id AND endpoint_category = p_category;

  RETURN COALESCE(remaining, 0);
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Suspicious Join Heuristics (Lightweight)

These heuristics are lightweight, client-and-server-enforced checks that flag or block suspicious activity without requiring a full fraud detection pipeline.

### Heuristic Rules

| ID | Signal | Threshold | Action | Severity |
|----|--------|-----------|--------|----------|
| H1 | Same user joins 5+ showrooms in 24 hours | 5 joins / 24h | **Flag** account for review | Medium |
| H2 | GPS mismatch: user location > 500m from showroom GPS coordinates | 500m Haversine distance | **Block** join, return error | High |
| H3 | Multiple joins from same IP address within 1 minute | 2+ joins / 1 min / IP | **Flag** all involved accounts | Medium |
| H4 | User joins and leaves the same showroom repeatedly | 3+ join-leave cycles in 7 days for same showroom | **Flag** account, escalate to admin | Medium |
| H5 | Multiple accounts join same showroom within seconds from different IPs | 3+ joins within 10 seconds from 3+ distinct IPs | **Flag** as potential bot ring | High |
| H6 | Account age < 24 hours attempts to join 3+ showrooms | 3 joins within first 24h of account creation | **Flag** account for review | Low |
| H7 | User switches primary showroom immediately after cooldown expires, repeatedly | 3+ primary switches within 100 days | **Flag** for reward exploitation review | Low |

### GPS Validation Details

The server uses the Haversine formula to compute the great-circle distance between the user's reported coordinates and the showroom's registered coordinates:

```typescript
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}
```

**GPS Policy:**
- GPS is required for QR-based joins (when `showrooms_gps_required` feature flag is enabled)
- GPS is NOT required for code-based joins (fallback for venues in areas with poor GPS)
- If the user denies location permission, they receive a clear explanation and are offered the manual code join path
- GPS coordinates are logged in the audit trail but NOT stored long-term (privacy)

### Flag Storage

```sql
CREATE TABLE abuse_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  heuristic_id VARCHAR(10) NOT NULL, -- e.g., 'H1', 'H2'
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  resolution VARCHAR(20) CHECK (resolution IN ('DISMISSED', 'WARNING_SENT', 'SUSPENDED', 'BANNED'))
);

CREATE INDEX idx_abuse_flags_user ON abuse_flags(user_id);
CREATE INDEX idx_abuse_flags_unreviewed ON abuse_flags(reviewed_at) WHERE reviewed_at IS NULL;
```

---

## 4. Reward Caps Enforcement

### Daily Check-in Caps

| Reward Type | Cap | Scope | Enforcement |
|-------------|-----|-------|-------------|
| Check-in XP | 25 XP (standard) / 50 XP (match hours) | Per user per calendar day | `UNIQUE(user_id, checkin_date)` on `showroom_checkins` |
| Check-in Coins | 5 coins | Per user per calendar day | Same constraint as above |
| Check-in count | 1 | Per user per calendar day (NOT per showroom) | Same constraint as above |

**Key rule:** A user who belongs to 3 showrooms still only checks in ONCE per day. The check-in is tied to the user, not the showroom. The showroom where the check-in occurs is recorded for analytics purposes only.

### Match Hour Bonus

Match hours are defined server-side and cannot be spoofed by the client:

```typescript
const MATCH_HOUR_RANGES = [
  { day: 'SATURDAY', start: '13:00', end: '22:00', timezone: 'Africa/Addis_Ababa' },
  { day: 'SUNDAY', start: '13:00', end: '22:00', timezone: 'Africa/Addis_Ababa' },
  // Additional ranges added per gameweek schedule
];
```

The server evaluates `NOW() AT TIME ZONE 'Africa/Addis_Ababa'` against the match hour ranges. If within range, XP is doubled (25 -> 50). The client cannot influence this calculation.

### Mission/Quest Caps

| Cap Type | Limit | Scope | Enforcement |
|----------|-------|-------|-------------|
| Daily quest completion | Once per quest type per day | Account-wide (all showrooms) | `UNIQUE(user_id, quest_id, completion_date)` |
| Weekly mission completion | Once per mission per week | Account-wide | `UNIQUE(user_id, mission_id, week_number)` |
| Quest reward stacking | Not allowed | Account-wide | Rewards issued once per completion, not per showroom |

### Slot Unlock Purchase Caps

| Constraint | Limit | Enforcement |
|-----------|-------|-------------|
| Slot 1 unlock | 1 per lifetime | `UNIQUE(user_id, slot_index)` on `user_showroom_slots` |
| Slot 2 unlock | 1 per lifetime | Same constraint |
| Total slot purchases | 2 maximum | Derived from above (only 2 secondary slots exist) |
| Idempotency | Duplicate purchase requests return existing record | Idempotency key + `ON CONFLICT DO NOTHING` |

### Slot Unlock Idempotency

Every purchase request includes an `idempotency_key` generated client-side (UUID v4). The server:

```sql
INSERT INTO user_showroom_slots (user_id, slot_index, unlock_method, idempotency_key)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, slot_index) DO NOTHING
RETURNING *;
```

If the insert succeeds, the unlock is new. If it conflicts, the existing record is returned with a `200 OK` (not an error). This ensures:
- Network retries do not double-charge
- Race conditions from double-taps do not create duplicate records
- The client always receives a consistent response

---

## 5. Admin Flags and Audit Trail

### Audit Log Schema

```sql
CREATE TABLE showroom_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  showroom_id UUID REFERENCES showrooms(id),
  event_type VARCHAR(30) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON showroom_audit_logs(user_id);
CREATE INDEX idx_audit_showroom ON showroom_audit_logs(showroom_id);
CREATE INDEX idx_audit_event ON showroom_audit_logs(event_type);
CREATE INDEX idx_audit_created ON showroom_audit_logs(created_at);
```

### Event Types

| Event Type | Trigger | Metadata Fields |
|------------|---------|-----------------|
| `JOIN` | User joins a showroom | `{ slot_index, join_method: "QR" \| "CODE", gps_lat, gps_lon }` |
| `LEAVE` | User leaves a showroom | `{ slot_index, membership_duration_days }` |
| `SET_PRIMARY` | User sets their first primary showroom | `{ showroom_id }` |
| `SWITCH_PRIMARY` | User changes primary showroom | `{ old_showroom_id, new_showroom_id, cooldown_reset_at }` |
| `SWITCH_SECONDARY` | User changes a secondary showroom | `{ slot_index, old_showroom_id, new_showroom_id, cooldown_reset_at }` |
| `SLOT_UNLOCK_LEVEL` | Slot unlocked via level achievement | `{ slot_index, user_level }` |
| `SLOT_UNLOCK_PURCHASE` | Slot unlocked via coin purchase | `{ slot_index, coins_spent, idempotency_key }` |
| `CHECKIN` | Daily check-in recorded | `{ showroom_id, xp_awarded, coins_awarded, is_match_hour }` |
| `COOLDOWN_RESET` | Cooldown manually reset (admin or showroom dissolution) | `{ slot_index, reason, reset_by }` |
| `ADMIN_ACTION` | Admin performs moderation action | `{ action, target_user_id, reason }` |
| `SHOWROOM_SUSPENDED` | Showroom suspended by platform admin | `{ reason, suspended_by, member_count_at_suspension }` |

### Metadata Examples

**JOIN event:**
```json
{
  "slot_index": 0,
  "join_method": "QR",
  "gps_lat": 9.0192,
  "gps_lon": 38.7525,
  "gps_distance_m": 45,
  "qr_rotation_key": "k7Xm9pQ2rT4w"
}
```

**SWITCH_PRIMARY event:**
```json
{
  "old_showroom_id": "uuid-old",
  "new_showroom_id": "uuid-new",
  "cooldown_reset_at": "2025-08-15T00:00:00Z",
  "old_membership_duration_days": 34
}
```

**SLOT_UNLOCK_PURCHASE event:**
```json
{
  "slot_index": 1,
  "coins_spent": 100,
  "idempotency_key": "uuid-idempotency",
  "user_coin_balance_before": 250,
  "user_coin_balance_after": 150
}
```

### Admin Dashboard Queries

**Find users who joined 5+ showrooms in 24 hours (H1):**
```sql
SELECT user_id, COUNT(*) AS join_count
FROM showroom_audit_logs
WHERE event_type = 'JOIN'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) >= 5;
```

**Find repeated join-leave patterns (H4):**
```sql
SELECT user_id, showroom_id, COUNT(*) AS cycle_count
FROM (
  SELECT user_id, showroom_id,
    ROW_NUMBER() OVER (PARTITION BY user_id, showroom_id ORDER BY created_at) AS rn
  FROM showroom_audit_logs
  WHERE event_type IN ('JOIN', 'LEAVE')
    AND created_at > NOW() - INTERVAL '7 days'
) sub
GROUP BY user_id, showroom_id
HAVING COUNT(*) >= 6;  -- 3 join + 3 leave = 6 events
```

**Find suspicious multi-account joins (H5):**
```sql
SELECT showroom_id,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT ip_address) AS unique_ips,
  MIN(created_at) AS first_join,
  MAX(created_at) AS last_join
FROM showroom_audit_logs
WHERE event_type = 'JOIN'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY showroom_id
HAVING COUNT(DISTINCT user_id) >= 3
  AND EXTRACT(EPOCH FROM MAX(created_at) - MIN(created_at)) < 10;
```

**Daily abuse flag summary:**
```sql
SELECT
  heuristic_id,
  severity,
  COUNT(*) AS flag_count,
  COUNT(*) FILTER (WHERE reviewed_at IS NULL) AS unreviewed
FROM abuse_flags
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY heuristic_id, severity
ORDER BY severity DESC, flag_count DESC;
```

### Retention Policy

- Audit logs are retained for 365 days in the primary table
- After 365 days, logs are moved to `showroom_audit_logs_archive` (same schema, no indexes except on `id` and `created_at`)
- IP addresses are anonymized (last octet zeroed) after 90 days for privacy compliance
- Abuse flags are retained indefinitely (they are small and critical for pattern detection)

---

## 6. Middleware Approach

### Middleware Stack (Request Processing Order)

```
Request
  |
  v
[1] Auth Middleware          -- Verify JWT, extract user_id
  |
  v
[2] Rate Limit Middleware    -- Check sliding window counters
  |
  v
[3] Membership Middleware    -- Verify user has required membership status
  |
  v
[4] Cooldown Middleware      -- Check switch_locked_until timestamps
  |
  v
[5] GPS Validation Middleware -- Haversine check (QR joins only)
  |
  v
[6] Idempotency Middleware   -- Check/store idempotency key (purchases only)
  |
  v
[7] Route Handler            -- Business logic
  |
  v
[8] Audit Middleware         -- Log action to showroom_audit_logs
  |
  v
Response
```

### 6.1 Rate Limiting Middleware

**Primary implementation:** In-memory sliding window using a PostgreSQL-backed counter table.

```typescript
interface RateLimitConfig {
  endpoint_category: string;
  max_requests: number;
  window_seconds: number;
}

const RATE_LIMITS: RateLimitConfig[] = [
  { endpoint_category: 'showroom_join', max_requests: 5, window_seconds: 86400 },
  { endpoint_category: 'showroom_leave', max_requests: 3, window_seconds: 86400 },
  { endpoint_category: 'qr_scan', max_requests: 10, window_seconds: 3600 },
  { endpoint_category: 'showroom_read', max_requests: 60, window_seconds: 60 },
  { endpoint_category: 'set_primary', max_requests: 2, window_seconds: 86400 },
  { endpoint_category: 'leaderboard_read', max_requests: 30, window_seconds: 60 },
];
```

**Upgrade path:** If PostgreSQL becomes a bottleneck for rate limiting, swap to Redis:
- Use `MULTI` / `EXEC` for atomic increment + expire
- Key format: `rl:{user_id}:{endpoint_category}`
- TTL matches the window duration
- Fallback to PostgreSQL if Redis is unavailable

### 6.2 Request Validation Middleware

Validates preconditions before the route handler executes:

| Check | Applies To | Error Code | Error Message |
|-------|------------|------------|---------------|
| User is authenticated | All endpoints | 401 | "Authentication required" |
| User has active membership | Check-in, leave, set-primary | 403 | "You are not a member of this showroom" |
| User has not exceeded slot limit | Join | 400 | "All showroom slots are full" |
| Cooldown has expired | Set-primary, switch secondary | 403 | "Switching is locked until {date}" |
| Showroom is active | Join, check-in | 403 | "This showroom is currently suspended" |
| Showroom has capacity | Join | 400 | "This showroom is full" |

### 6.3 GPS Validation Middleware

Applied only to QR-based join requests when the `showrooms_gps_required` feature flag is enabled:

```typescript
async function validateGPS(req: Request, showroom: Showroom): Promise<void> {
  const { lat, lon } = req.body.gps_coordinates;

  // Validate coordinate ranges
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new ValidationError('Invalid GPS coordinates');
  }

  const distance = haversineDistance(lat, lon, showroom.gps_lat, showroom.gps_lon);

  if (distance > 500) { // 500 meters threshold
    // Log the attempt for abuse detection
    await logAbuseFlag(req.user.id, 'H2', 'HIGH', {
      user_lat: lat,
      user_lon: lon,
      showroom_lat: showroom.gps_lat,
      showroom_lon: showroom.gps_lon,
      distance_meters: Math.round(distance),
    });

    throw new ForbiddenError(
      `You appear to be ${Math.round(distance)}m from this showroom. ` +
      `Please visit the venue to join via QR code.`
    );
  }
}
```

### 6.4 Idempotency Middleware

Applied to all purchase/unlock operations:

```typescript
async function ensureIdempotent(req: Request): Promise<Response | null> {
  const key = req.headers['x-idempotency-key'];

  if (!key) {
    throw new ValidationError('Idempotency key required for purchase operations');
  }

  // Check if this key was already processed
  const existing = await db.query(
    'SELECT response_body, status_code FROM idempotency_keys WHERE key = $1 AND user_id = $2',
    [key, req.user.id]
  );

  if (existing.rows.length > 0) {
    // Return the cached response (idempotent replay)
    return new Response(existing.rows[0].response_body, {
      status: existing.rows[0].status_code,
      headers: { 'X-Idempotent-Replayed': 'true' },
    });
  }

  // No existing record -- proceed with the request
  // The route handler is responsible for storing the response in idempotency_keys
  return null;
}
```

**Idempotency Key Table:**

```sql
CREATE TABLE idempotency_keys (
  key UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  endpoint VARCHAR(100) NOT NULL,
  response_body JSONB NOT NULL,
  status_code INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-expire after 24 hours
CREATE INDEX idx_idempotency_created ON idempotency_keys(created_at);
```

---

## 7. Test Cases

### TC-01: Normal Join Flow (Happy Path)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User scans valid QR code at showroom | Token parsed, checksum verified |
| 2 | Server validates showroom is active | Passes |
| 3 | Server checks user has available slot | Slot 0 (PRIMARY) available |
| 4 | Server checks rate limit (< 5 joins in 24h) | Passes |
| 5 | Membership created with `slot_index=0`, `role=PRIMARY` | `201 Created` with membership record |
| 6 | Audit log entry created | `JOIN` event with metadata |

### TC-02: Join When All Slots Full

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User has PRIMARY + 2 SECONDARY showrooms | All 3 slots occupied |
| 2 | User attempts to join another showroom | Server returns `400 Bad Request` |
| 3 | Response body | `{ "error": "All showroom slots are full. Leave a showroom or unlock a new slot." }` |
| 4 | No audit log entry created | Join was rejected before processing |

### TC-03: Rate Limit Exceeded

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User has joined 5 showrooms in the last 24 hours | Rate limit counter at 5/5 |
| 2 | User attempts 6th join | Server returns `429 Too Many Requests` |
| 3 | Response headers | `Retry-After: {seconds}`, `X-RateLimit-Remaining: 0` |
| 4 | Response body | `{ "error": "Join rate limit exceeded. Try again in X hours." }` |
| 5 | Abuse flag created | H1 flag with MEDIUM severity |

### TC-04: QR Token Expired / Rotated

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User scans QR code with old rotation key | Token parsed successfully |
| 2 | Server compares rotation_key to current | Mismatch detected |
| 3 | Server returns `410 Gone` | `{ "error": "This QR code has expired. Please scan the current code at the venue." }` |
| 4 | Audit log: no entry | Request rejected at validation stage |

### TC-05: GPS Too Far From Showroom

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User scans QR with GPS enabled | Coordinates submitted: 9.0300, 38.7600 |
| 2 | Showroom registered at | 9.0192, 38.7525 |
| 3 | Haversine distance computed | ~1,400m (exceeds 500m threshold) |
| 4 | Server returns `403 Forbidden` | `{ "error": "You appear to be 1400m from this showroom..." }` |
| 5 | Abuse flag created | H2 flag with HIGH severity, distance logged in metadata |

### TC-06: Double Check-in Same Day

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User checks in at 08:00 UTC at Showroom A | `201 Created`, 25 XP + 5 coins awarded |
| 2 | User attempts check-in at 14:00 UTC at Showroom B | Server returns `409 Conflict` |
| 3 | Response body | `{ "error": "Already checked in today. Next check-in available tomorrow." }` |
| 4 | DB constraint | `UNIQUE(user_id, checkin_date)` prevents insert |
| 5 | No additional rewards issued | XP and coins unchanged |

### TC-07: Double Purchase Same Slot (Idempotent Success)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User sends unlock request for Slot 1 with idempotency key `abc-123` | First request: `201 Created`, coins deducted |
| 2 | Network timeout, client retries with same idempotency key `abc-123` | Second request: `200 OK` with same response body |
| 3 | Response header | `X-Idempotent-Replayed: true` |
| 4 | Coins deducted | Exactly once (100 coins for Slot 1) |
| 5 | `user_showroom_slots` record | Exactly 1 row for `(user_id, slot_index=1)` |

### TC-08: Cooldown Enforcement on Primary Switch

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User switched primary showroom 15 days ago | `switch_locked_until` is 15 days in the future |
| 2 | User attempts to set a new primary showroom | Server returns `403 Forbidden` |
| 3 | Response body | `{ "error": "Switching is locked until {date}. You can change your Home showroom in 15 days." }` |
| 4 | No membership changes | Records unchanged |

### TC-09: Showroom Suspension Cascading Effects

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Admin suspends a showroom | `showrooms.is_active` set to `false` |
| 2 | All primary members notified | Push notification: "Your Home showroom has been suspended" |
| 3 | Primary members' cooldowns reset | `switch_locked_until` set to `NULL` for affected memberships |
| 4 | Affected users prompted to pick new primary | On next app open, modal shows "Select a new Home showroom" |
| 5 | Audit log entry | `SHOWROOM_SUSPENDED` with member count in metadata |

### TC-10: Bot Ring Detection (H5)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | 5 different accounts join Showroom X within 8 seconds | Each from a different IP address |
| 2 | Server detects pattern after 3rd join | H5 heuristic triggered |
| 3 | Abuse flags created | One H5 flag per involved account, severity HIGH |
| 4 | Joins are NOT blocked (flags only) | Memberships created normally |
| 5 | Admin dashboard shows alert | "Potential bot ring detected at Showroom X" |

---

## Appendix: Error Code Reference

| HTTP Status | Usage in Showrooms |
|-------------|-------------------|
| `200 OK` | Successful read, idempotent replay |
| `201 Created` | New membership, check-in, slot unlock |
| `400 Bad Request` | Validation failure (slots full, invalid input) |
| `401 Unauthorized` | Missing or invalid JWT |
| `403 Forbidden` | Permission denied, cooldown active, GPS mismatch, suspended showroom |
| `409 Conflict` | Duplicate check-in, duplicate constraint violation |
| `410 Gone` | Expired QR token |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |
