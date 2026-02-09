# Showrooms Phase 2 -- Delivery Backlog & Test Plan

*Comprehensive epic breakdown, story acceptance criteria, phased rollout plan, and E2E test cases for the Showrooms feature.*

*Inherits rules from `showrooms_phase2_ruleset.md` and security from `showrooms_phase2_antiabuse.md`.*

---

## 1. Epics and Stories with Acceptance Criteria

---

### Epic 1: Database Schema & Migrations

**Goal:** Establish the foundational data model for showrooms, memberships, slots, check-ins, and audit logging.

**Priority:** P0 -- MVP

**Dependencies:** None (foundational)

---

#### E1-S1: Create `showrooms` table with all fields

**As a** platform engineer, **I want** a `showrooms` table that stores venue identity, location, status, and QR rotation data **so that** all showroom operations have a reliable data foundation.

**Acceptance Criteria:**
1. Table includes columns: `id` (UUID PK), `name`, `city`, `venue_type`, `gps_lat`, `gps_lon`, `address`, `is_active`, `max_members`, `current_rotation_key`, `rotation_key_generated_at`, `rotation_ttl_days`, `owner_user_id`, `created_at`, `updated_at`.
2. RLS policy restricts writes to platform admins and the `owner_user_id`; reads are public for active showrooms.
3. `is_active` defaults to `true`; suspended showrooms are filtered from public queries.
4. Migration is idempotent (can be run multiple times without error).

---

#### E1-S2: Create `showroom_memberships` table with PRIMARY/SECONDARY support

**As a** platform engineer, **I want** a memberships table that tracks which users belong to which showrooms with slot assignment **so that** the slot system (1 PRIMARY + up to 2 SECONDARY) is enforced at the database level.

**Acceptance Criteria:**
1. Table includes: `id` (UUID PK), `user_id`, `showroom_id`, `slot_index` (0=PRIMARY, 1-2=SECONDARY), `role` (PRIMARY/SECONDARY), `switch_locked_until` (TIMESTAMPTZ nullable), `joined_at`, `left_at`.
2. UNIQUE constraint on `(user_id, slot_index)` prevents duplicate slot assignments.
3. UNIQUE constraint on `(user_id, showroom_id)` WHERE `left_at IS NULL` prevents duplicate active memberships.
4. Partial index on `(user_id) WHERE slot_index = 0 AND left_at IS NULL` enforces exactly one active primary.

---

#### E1-S3: Create `user_showroom_slots` for slot unlock tracking

**As a** platform engineer, **I want** a table that records which secondary slots a user has unlocked and how **so that** slot unlock state is persistent and purchase idempotency is enforced.

**Acceptance Criteria:**
1. Table includes: `id` (UUID PK), `user_id`, `slot_index` (1 or 2), `unlock_method` (LEVEL/PURCHASE), `coins_spent` (nullable), `idempotency_key` (UUID nullable), `unlocked_at`.
2. UNIQUE constraint on `(user_id, slot_index)` prevents double unlocks.
3. UNIQUE constraint on `idempotency_key` WHERE `idempotency_key IS NOT NULL` ensures purchase idempotency.
4. RLS policy: users can only read/insert their own rows; no updates or deletes.

---

#### E1-S4: Create `showroom_checkins` with daily uniqueness

**As a** platform engineer, **I want** a check-ins table that enforces one check-in per user per calendar day **so that** reward farming through multiple daily check-ins is impossible.

**Acceptance Criteria:**
1. Table includes: `id` (UUID PK), `user_id`, `showroom_id`, `checkin_date` (DATE), `xp_awarded`, `coins_awarded`, `is_match_hour` (BOOLEAN), `created_at`.
2. UNIQUE constraint on `(user_id, checkin_date)` enforces one check-in per user per day (not per showroom).
3. `checkin_date` is computed server-side using `CURRENT_DATE AT TIME ZONE 'Africa/Addis_Ababa'` to prevent timezone manipulation.
4. RLS policy: users can insert their own check-ins and read their own history.

---

#### E1-S5: Create audit logs and aggregation tables

**As a** platform engineer, **I want** audit log and aggregation tables **so that** all membership changes are traceable and showroom/city leaderboards can be computed efficiently.

**Acceptance Criteria:**
1. `showroom_audit_logs` table created per schema in `showrooms_phase2_antiabuse.md` with indexes on `user_id`, `showroom_id`, `event_type`, and `created_at`.
2. `showroom_weekly_scores` table includes: `id`, `showroom_id`, `gameweek`, `score`, `active_member_count`, `calculated_at`.
3. `city_leaderboard_snapshots` table includes: `id`, `city`, `gameweek`, `rankings` (JSONB array), `snapshot_at`.
4. `abuse_flags` table created per schema in anti-abuse spec.

---

### Epic 2: Membership Management APIs

**Goal:** Provide the core join, leave, and switching APIs that power the showroom membership system.

**Priority:** P0 -- MVP (join/leave), P1 -- v1 (switching)

**Dependencies:** Epic 1

---

#### E2-S1: Join showroom (auto-assign PRIMARY or SECONDARY)

**As a** user, **I want** to join a showroom by scanning its QR code or entering its code **so that** I can participate in showroom activities and leaderboards.

**Acceptance Criteria:**
1. If user has no primary showroom, the joined showroom is auto-assigned as PRIMARY (slot_index=0).
2. If user already has a primary, the join is assigned to the first available secondary slot (if unlocked).
3. If all slots are full or locked, the join is rejected with a clear error message indicating what the user needs to do (leave a showroom or unlock a slot).
4. Join rate limit (5/24h) is enforced; audit log entry `JOIN` is created.

---

#### E2-S2: Leave showroom (free slot)

**As a** user, **I want** to leave a showroom **so that** I can free up a slot to join a different one.

**Acceptance Criteria:**
1. Membership is soft-deleted (`left_at` set to `NOW()`), freeing the slot.
2. If the user leaves their PRIMARY showroom and has secondary showrooms, the user is prompted to promote one to primary (not auto-promoted).
3. If the user leaves their PRIMARY and has no secondary showrooms, their primary slot is simply freed.
4. Leave rate limit (3/24h) is enforced; audit log entry `LEAVE` is created.

---

#### E2-S3: Set primary showroom (swap with cooldown)

**As a** user, **I want** to change which showroom is my primary **so that** I can support a different venue in city rivalry.

**Acceptance Criteria:**
1. Primary switch is rejected if `switch_locked_until > NOW()` with a message showing the remaining cooldown period.
2. On successful switch, the old primary is either demoted to a secondary slot (if available) or removed.
3. `switch_locked_until` is set to `NOW() + 30 days` on the new primary membership.
4. Audit log entry `SWITCH_PRIMARY` is created with old and new showroom IDs.

---

#### E2-S4: Get user's showroom state

**As a** user, **I want** to retrieve my complete showroom state (all slots, memberships, cooldowns, unlock status) **so that** the UI can render my showrooms tab accurately.

**Acceptance Criteria:**
1. Response includes an array of 3 slot objects (index 0, 1, 2), each with: `slot_index`, `status` (OCCUPIED/EMPTY/LOCKED), `showroom` (if occupied), `role` (PRIMARY/SECONDARY), `switch_locked_until`, `unlock_status`.
2. Locked slots include `unlock_requirements` (level needed, coin price, user's current level).
3. Response is performant: single query or minimal joins (target < 100ms at p95).
4. Rate limited at 60 requests/minute.

---

### Epic 3: Slot Unlock System

**Goal:** Allow users to unlock secondary showroom slots via level progression or coin purchase.

**Priority:** P1 -- v1

**Dependencies:** Epic 1, Epic 2

---

#### E3-S1: Unlock slot via level achievement

**As a** user, **I want** my secondary slot to automatically unlock when I reach the required level **so that** I am rewarded for engagement.

**Acceptance Criteria:**
1. When a user reaches Level 10, Slot 1 becomes unlockable (status changes from LOCKED to AVAILABLE).
2. When a user reaches Level 25, Slot 2 becomes unlockable.
3. The unlock is recorded in `user_showroom_slots` with `unlock_method=LEVEL`.
4. A notification is sent to the user: "You've unlocked a new showroom slot! Join a second showroom now."

---

#### E3-S2: Unlock slot via coin purchase (idempotent)

**As a** user, **I want** to purchase a slot unlock with coins **so that** I can access secondary showrooms before reaching the level requirement.

**Acceptance Criteria:**
1. Slot 1 costs 100 coins; Slot 2 costs 400 coins.
2. Purchase requires an `X-Idempotency-Key` header; duplicate requests return the existing record with `200 OK`.
3. Coins are deducted atomically in the same transaction as the slot unlock insert (no partial state).
4. If the user has insufficient coins, the request is rejected with `400 Bad Request` and a clear message showing the shortfall.

---

#### E3-S3: Get slot status

**As a** user, **I want** to see the current status of all my showroom slots **so that** I know which are locked, unlocked, or occupied.

**Acceptance Criteria:**
1. Each slot returns: `slot_index`, `is_unlocked`, `unlock_method` (if unlocked), `showroom` (if occupied), `unlock_requirements` (if locked).
2. For locked slots, `unlock_requirements` includes: `level_needed`, `user_current_level`, `coin_price`, `user_coin_balance`.
3. Response is included in the E2-S4 showroom state endpoint (not a separate call).

---

### Epic 4: Daily Check-in

**Goal:** Provide a daily engagement mechanic tied to showroom membership.

**Priority:** P0 -- MVP

**Dependencies:** Epic 1, Epic 2

---

#### E4-S1: Check-in at showroom (once per day per user)

**As a** user, **I want** to check in at my showroom once per day **so that** I earn XP and coins for my engagement.

**Acceptance Criteria:**
1. Check-in awards 25 XP and 5 coins on success.
2. Second check-in attempt on the same calendar day (EAT timezone) returns `409 Conflict` with "Already checked in today."
3. The showroom where check-in occurs is recorded for analytics, but the cap is per-user (not per-showroom).
4. Audit log entry `CHECKIN` is created with XP/coins awarded and match hour status.

---

#### E4-S2: Match hour bonus detection

**As a** user, **I want** to receive double XP when I check in during live match hours **so that** I am incentivized to engage during matches.

**Acceptance Criteria:**
1. If `NOW() AT TIME ZONE 'Africa/Addis_Ababa'` falls within defined match hours, XP is doubled (25 -> 50 XP).
2. Match hour windows are configurable per gameweek (stored in a config table or environment).
3. The `is_match_hour` flag is stored on the check-in record for analytics.
4. Coin reward remains 5 regardless of match hour status (only XP is doubled).

---

### Epic 5: Aggregation & Leaderboards

**Goal:** Calculate showroom scores, build city rivalry leaderboards, and show internal showroom rankings.

**Priority:** P1 -- v1 (showroom leaderboard), P2 -- vNext (city leaderboard)

**Dependencies:** Epic 1, Epic 2, Scoring Engine (Epic 3 from main delivery plan)

---

#### E5-S1: Calculate showroom weekly scores (PRIMARY members only)

**As a** platform, **I want** to compute weekly scores for each showroom based on their primary members' gameweek performance **so that** showrooms can be ranked.

**Acceptance Criteria:**
1. Score formula: `AVG(top_N_primary_member_gw_points)` where `N = MIN(25, active_primary_count)`.
2. Only members with `role=PRIMARY` and `left_at IS NULL` and active in the last 7 days are counted.
3. Scores are calculated via a scheduled job after each gameweek finalizes.
4. Results are stored in `showroom_weekly_scores` with the gameweek number and calculation timestamp.

---

#### E5-S2: Build city leaderboard snapshots

**As a** user, **I want** to see how showrooms in my city rank against each other **so that** I feel rivalry and competition.

**Acceptance Criteria:**
1. City leaderboard ranks showrooms by their `showroom_weekly_score` within the same `city` value.
2. Snapshots are taken after each gameweek's scores are calculated and stored in `city_leaderboard_snapshots`.
3. The leaderboard shows: rank, showroom name, score, primary member count, rank change from previous week.
4. Only showrooms with 5+ active primary members are included (prevents dead showrooms from cluttering the board).

---

#### E5-S3: Showroom internal leaderboard

**As a** user, **I want** to see how I rank within my showroom **so that** I can compete with other members.

**Acceptance Criteria:**
1. Internal leaderboard shows all active members ranked by their current gameweek points.
2. Both PRIMARY and SECONDARY members are shown (with role badges).
3. Only PRIMARY members have a "Contributes to Showroom Score" indicator.
4. Leaderboard is paginated (20 per page) with the user's own rank pinned at the top.

---

### Epic 6: Frontend -- Showrooms Tab

**Goal:** Build the user-facing showrooms interface with slot cards, matchday hub integration, and showroom switching.

**Priority:** P0 -- MVP (basic display), P1 -- v1 (full functionality)

**Dependencies:** Epic 2, Epic 3, Epic 4

---

#### E6-S1: Primary showroom card with HOME badge

**As a** user, **I want** to see my primary showroom prominently displayed with a HOME badge **so that** I can quickly identify my home venue.

**Acceptance Criteria:**
1. Primary showroom card displays: showroom name, venue type icon, city, member count, and a green "HOME" badge.
2. Tapping the card opens the showroom detail view (internal leaderboard, info, leave option).
3. If the user has no primary showroom, the slot shows "Join a Showroom" with a QR scan button and code entry option.
4. Card shows the user's rank within the showroom.

---

#### E6-S2: Secondary showroom cards

**As a** user, **I want** to see my secondary showrooms displayed below my primary **so that** I can manage all my memberships.

**Acceptance Criteria:**
1. Secondary cards display: showroom name, venue type, city, and a blue "SECONDARY" badge.
2. Cards are visually smaller than the primary card to establish hierarchy.
3. Each card has a "..." menu with options: "View Details", "Leave", "Promote to Primary" (if cooldown allows).
4. If a secondary slot is occupied, the card shows the showroom. If empty, it shows "Join a Showroom."

---

#### E6-S3: Locked/empty slot cards with unlock CTAs

**As a** user, **I want** to see locked slots with clear unlock instructions **so that** I know how to access more showrooms.

**Acceptance Criteria:**
1. Locked slots display a gray card with a lock icon and the text "Locked -- Reach Level X or Buy with Y Coins."
2. If the user's level meets the requirement, the card changes to "Unlocked via Level -- Tap to Activate" with a purple highlight.
3. A "Buy with Coins" button shows the coin price and the user's current balance.
4. Empty (unlocked but unoccupied) slots display "Empty -- Join a Showroom" with QR scan and code entry buttons.

---

#### E6-S4: Matchday hub with showroom switcher

**As a** user, **I want** to switch between my showrooms within the matchday hub **so that** I can see different showroom leaderboards and chats during live matches.

**Acceptance Criteria:**
1. A horizontal pill selector at the top of the matchday hub shows the user's showroom memberships (max 3).
2. The primary showroom is selected by default, marked with a small "HOME" indicator.
3. Switching showrooms updates the leaderboard, chat feed, and showroom-specific content below.
4. The switcher remembers the last selected showroom for the session (reverts to primary on app restart).

---

### Epic 7: Anti-Abuse & Security

**Goal:** Implement the protections defined in `showrooms_phase2_antiabuse.md`.

**Priority:** P1 -- v1 (rate limits, basic validation), P2 -- vNext (GPS, QR rotation, heuristics)

**Dependencies:** Epic 1, Epic 2

---

#### E7-S1: QR token validation with rotation

**As a** platform, **I want** QR tokens to rotate on a configurable schedule with server-side validation **so that** shared or screenshot QR codes become invalid over time.

**Acceptance Criteria:**
1. QR tokens follow the format `ETHFPL-{showroom_id_short}-{rotation_key}-{checksum}`.
2. Server validates checksum via HMAC-SHA256 with a server-side secret.
3. Expired rotation keys return `410 Gone` with a message to scan the current code at the venue.
4. A cron job rotates keys based on each showroom's `rotation_ttl_days` setting.

---

#### E7-S2: Rate limiting middleware

**As a** platform, **I want** all showroom endpoints to be rate limited **so that** automated abuse and excessive usage are prevented.

**Acceptance Criteria:**
1. Rate limits match the table in the anti-abuse spec (5 joins/24h, 3 leaves/24h, 10 QR scans/hour, etc.).
2. Exceeded limits return `429 Too Many Requests` with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.
3. Rate limit counters are per-user, stored in PostgreSQL with a cleanup job.
4. Client-side advisory limits disable buttons before server limits are hit (80% threshold).

---

#### E7-S3: GPS proximity validation

**As a** platform, **I want** QR-based joins to verify the user's GPS proximity to the showroom **so that** remote QR sharing is detectable.

**Acceptance Criteria:**
1. When `showrooms_gps_required` feature flag is enabled, QR join requests must include GPS coordinates.
2. Haversine distance > 500m results in a `403 Forbidden` response with the computed distance.
3. GPS validation failures are logged as H2 abuse flags with HIGH severity.
4. Users who deny GPS permission are offered the manual code join path (no GPS check for code joins).

---

## 2. MVP vs v1 vs vNext Scope

### Scope Matrix

| Feature | MVP | v1 | vNext |
|---------|-----|----|-------|
| **Showrooms table & schema** | Yes | -- | -- |
| **Primary showroom join/leave** | Yes | -- | -- |
| **Basic daily check-in (25 XP, 5 coins)** | Yes | -- | -- |
| **Slot display (all locked except primary)** | Yes | -- | -- |
| **Primary showroom card with HOME badge** | Yes | -- | -- |
| **Showroom state API** | Yes | -- | -- |
| **Secondary slot unlocks (level + purchase)** | -- | Yes | -- |
| **Secondary showroom cards** | -- | Yes | -- |
| **Slot unlock CTAs (buy/level)** | -- | Yes | -- |
| **Primary switch with 30-day cooldown** | -- | Yes | -- |
| **Secondary switch with 7-day cooldown** | -- | Yes | -- |
| **Match hour bonus (2x XP)** | -- | Yes | -- |
| **Showroom internal leaderboard** | -- | Yes | -- |
| **Matchday hub showroom switcher** | -- | Yes | -- |
| **City leaderboard** | -- | Yes | -- |
| **Rate limiting middleware** | -- | Yes | -- |
| **Audit logging** | -- | Yes | -- |
| **QR token rotation & validation** | -- | -- | Yes |
| **GPS proximity verification** | -- | -- | Yes |
| **Suspicious join heuristics (H1-H7)** | -- | -- | Yes |
| **Admin moderation dashboard** | -- | -- | Yes |
| **Mission/quest integration with showrooms** | -- | -- | Yes |
| **Showroom chat** | -- | -- | Yes |
| **Showroom events calendar** | -- | -- | Yes |

### MVP Definition of Done

- User can join exactly 1 showroom (primary) via QR code or manual code entry
- User can leave their primary showroom
- User can check in once per day and receive 25 XP + 5 coins
- Showrooms tab shows the primary slot (occupied or empty) and 2 locked slots
- All data persists in Supabase with RLS policies
- No rate limiting required (low user volume expected)

### v1 Definition of Done

- All MVP features plus secondary slots, switching, and leaderboards
- Slot unlock system functional (level-based and coin purchase)
- Rate limiting active on all write endpoints
- Audit logging captures all membership changes
- City leaderboard visible with weekly snapshots
- Matchday hub integrates showroom context

### vNext Definition of Done

- QR rotation system with configurable TTL
- GPS validation with Haversine distance check
- Automated abuse detection heuristics running
- Admin dashboard for reviewing flags and taking action
- Mission system aware of showroom context

---

## 3. E2E Test Cases

### E2E-01: Set primary showroom via QR join

| Precondition | User has no showroom memberships |
|---|---|
| Steps | 1. User opens QR scanner. 2. Scans valid showroom QR code. 3. Server validates token. 4. Membership created. |
| Expected | Membership created with `slot_index=0`, `role=PRIMARY`. Showrooms tab shows showroom with HOME badge. Audit log `JOIN` created. |

### E2E-02: Unlock secondary slot via level achievement

| Precondition | User is Level 9, has a primary showroom |
|---|---|
| Steps | 1. User completes action that brings them to Level 10. 2. System checks slot unlock eligibility. 3. Slot 1 status changes to AVAILABLE. |
| Expected | `user_showroom_slots` record created with `unlock_method=LEVEL`. Notification sent. Showrooms tab shows Slot 1 as "Empty -- Join a Showroom." |

### E2E-03: Unlock secondary slot via wallet purchase (idempotent)

| Precondition | User has 150 coins, Slot 1 is locked, user is below Level 10 |
|---|---|
| Steps | 1. User taps "Buy with 100 Coins" on Slot 1. 2. Request sent with idempotency key `key-001`. 3. 100 coins deducted, slot unlocked. 4. Network glitch -- client retries with same `key-001`. |
| Expected | First request: `201 Created`, balance = 50 coins. Second request: `200 OK` with `X-Idempotent-Replayed: true`, balance still 50 coins. Only 1 row in `user_showroom_slots`. |

### E2E-04: Primary switching cooldown enforcement (30 days)

| Precondition | User switched primary showroom 10 days ago |
|---|---|
| Steps | 1. User opens primary showroom menu. 2. Taps "Change Home Showroom." 3. Server checks `switch_locked_until`. |
| Expected | `403 Forbidden` with message "You can change your Home showroom in 20 days." UI shows grayed-out button with countdown. No membership changes. |

### E2E-05: Secondary switching cooldown enforcement (7 days)

| Precondition | User changed Slot 1 showroom 3 days ago |
|---|---|
| Steps | 1. User taps "Leave" on Slot 1 secondary showroom. 2. Leave succeeds, slot is empty. 3. User attempts to join a new showroom in Slot 1. |
| Expected | Join rejected: "This slot is on cooldown for 4 more days." Slot shows EMPTY but with an orange COOLDOWN badge. |

### E2E-06: City leaderboard only counts primary members

| Precondition | Showroom A has 10 primary + 5 secondary members. Showroom B has 8 primary + 20 secondary members. |
|---|---|
| Steps | 1. Gameweek finalizes. 2. Aggregation job runs. 3. City leaderboard is generated. |
| Expected | Showroom A score = AVG(top 10 primary members' GW points). Showroom B score = AVG(top 8 primary members' GW points). Secondary members' scores are NOT included in either showroom's score. |

### E2E-07: Leave showroom and rejoin

| Precondition | User is a primary member of Showroom A |
|---|---|
| Steps | 1. User leaves Showroom A. 2. User joins Showroom B via QR code. |
| Expected | Showroom A membership `left_at` populated. Showroom B membership created with `slot_index=0`, `role=PRIMARY`. Audit logs show LEAVE and JOIN events. |

### E2E-08: Daily check-in once per user (not per showroom)

| Precondition | User belongs to Showroom A (primary) and Showroom B (secondary) |
|---|---|
| Steps | 1. User checks in at 09:00 EAT (via Showroom A). 2. User attempts check-in at 15:00 EAT (via Showroom B). |
| Expected | First check-in: `201 Created`, 25 XP + 5 coins. Second check-in: `409 Conflict`, "Already checked in today." Only 1 row in `showroom_checkins` for today. |

### E2E-09: Promote secondary to primary (swap)

| Precondition | User has Primary=Showroom A (Slot 0), Secondary=Showroom B (Slot 1). Primary cooldown has expired. |
|---|---|
| Steps | 1. User taps "Promote to Primary" on Showroom B. 2. Server processes the swap. |
| Expected | Showroom B moves to `slot_index=0`, `role=PRIMARY`. Showroom A moves to `slot_index=1`, `role=SECONDARY`. New `switch_locked_until = NOW() + 30 days` on Slot 0. Audit log `SWITCH_PRIMARY` with old/new IDs. |

### E2E-10: Max slot limit enforcement

| Precondition | User has Primary + 2 Secondary showrooms (all 3 slots occupied) |
|---|---|
| Steps | 1. User scans a new showroom QR code. 2. Server checks available slots. |
| Expected | `400 Bad Request`: "All showroom slots are full. Leave a showroom or unlock a new slot." No membership created. No audit log entry. |

### E2E-11: Match hour bonus check-in

| Precondition | User has not checked in today. Current time is 16:00 EAT on Saturday (within match hours). |
|---|---|
| Steps | 1. User taps "Check In" at their primary showroom. 2. Server evaluates match hour status. |
| Expected | `201 Created` with 50 XP (doubled) + 5 coins (not doubled). `showroom_checkins.is_match_hour = true`. Notification shows "Match Day Bonus! 50 XP earned." |

### E2E-12: QR token expired after rotation

| Precondition | Showroom A's QR token was rotated 2 hours ago. User has a screenshot of the old QR code. |
|---|---|
| Steps | 1. User scans the old QR code. 2. Server extracts rotation key. 3. Server compares to current rotation key. |
| Expected | `410 Gone`: "This QR code has expired. Please scan the current code at the venue." No membership created. |

### E2E-13: GPS too far from showroom location

| Precondition | Showroom is at GPS (9.0192, 38.7525). `showrooms_gps_required` flag is enabled. |
|---|---|
| Steps | 1. User scans QR code while at GPS (9.0450, 38.7800) -- approximately 3.5 km away. 2. Server computes Haversine distance. |
| Expected | `403 Forbidden`: "You appear to be 3500m from this showroom. Please visit the venue to join via QR code." Abuse flag H2 created with HIGH severity. |

### E2E-14: Showroom suspension cascading to members

| Precondition | Showroom A has 15 primary members and 8 secondary members. |
|---|---|
| Steps | 1. Platform admin suspends Showroom A. 2. `showrooms.is_active` set to `false`. 3. System processes cascading effects. |
| Expected | All primary members' `switch_locked_until` reset to NULL. Primary members receive notification to select a new home. Secondary members receive notification that the showroom is suspended. Audit log `SHOWROOM_SUSPENDED` with `member_count_at_suspension: 23`. |

### E2E-15: Rate limit on join endpoint

| Precondition | User has joined 5 showrooms in the last 20 hours (leaving between joins). |
|---|---|
| Steps | 1. User attempts to join a 6th showroom. 2. Server checks rate limit counter. |
| Expected | `429 Too Many Requests` with headers: `Retry-After: {seconds}`, `X-RateLimit-Remaining: 0`. Response body: "Join rate limit exceeded. Try again in X hours." Abuse flag H1 raised. |

---

## 4. Rollout Plan with Feature Flags

### Phase 1: `showrooms_enabled`

**Scope:** Database tables created, basic join/leave, primary showroom only.

| Item | Detail |
|------|--------|
| **Flag name** | `showrooms_enabled` |
| **Default** | `false` |
| **Enable criteria** | All E1 migrations applied successfully. E2-S1, E2-S2, E2-S4, E4-S1 APIs deployed and passing integration tests. Basic UI (E6-S1 primary card, E6-S3 locked slots display) reviewed by design. |
| **What it unlocks** | Showrooms tab visible in bottom nav. Users can join 1 showroom (primary only). Daily check-in functional. Secondary slots shown as locked (no unlock path yet). |
| **Rollback steps** | 1. Set `showrooms_enabled = false`. 2. Showrooms tab hidden from UI. 3. Existing memberships preserved in DB (not deleted). 4. No data migration needed on rollback. |
| **Rollback risk** | Low -- feature is purely additive, no impact on existing functionality. |

### Phase 2: `showrooms_secondary_slots`

**Scope:** Secondary slot unlock system (level + purchase), secondary membership management.

| Item | Detail |
|------|--------|
| **Flag name** | `showrooms_secondary_slots` |
| **Default** | `false` |
| **Depends on** | `showrooms_enabled = true` |
| **Enable criteria** | E3 (Slot Unlock) APIs deployed with idempotency verified. E2-S3 (set primary with cooldown) deployed. E6-S2 (secondary cards), E6-S3 (unlock CTAs) UI reviewed. Coin deduction tested end-to-end. |
| **What it unlocks** | Locked slot cards show unlock options (level progress, buy button). Users can unlock Slot 1 (Level 10 / 100 coins) and Slot 2 (Level 25 / 400 coins). Users can join secondary showrooms. Primary switching with 30-day cooldown. |
| **Rollback steps** | 1. Set `showrooms_secondary_slots = false`. 2. Secondary slots revert to LOCKED display. 3. Existing secondary memberships preserved but hidden from UI. 4. Purchased slot unlocks preserved in DB (no refund needed -- slot just not visible). |
| **Rollback risk** | Medium -- users who purchased unlocks will see slots revert to locked. Need comms plan. |

### Phase 3: `showrooms_rivalry`

**Scope:** Aggregation jobs, city leaderboard, showroom weekly scores.

| Item | Detail |
|------|--------|
| **Flag name** | `showrooms_rivalry` |
| **Default** | `false` |
| **Depends on** | `showrooms_enabled = true`, `showrooms_secondary_slots = true` |
| **Enable criteria** | E5-S1 aggregation job running successfully for 2+ gameweeks in staging. E5-S2 city leaderboard snapshots generated correctly. E5-S3 internal leaderboard API tested with 50+ member showrooms. Minimum 10 showrooms with 5+ primary members each (sufficient data for meaningful leaderboards). |
| **What it unlocks** | City leaderboard tab within Showrooms. Showroom weekly scores displayed on showroom detail page. Internal leaderboard within each showroom. "Contributes to Showroom Score" badge on primary members. |
| **Rollback steps** | 1. Set `showrooms_rivalry = false`. 2. Leaderboard UI hidden. 3. Aggregation cron job paused (not removed). 4. Existing snapshots preserved for when re-enabled. |
| **Rollback risk** | Low -- leaderboards are read-only views, no user data affected. |

### Phase 4: `showrooms_matchday_hub`

**Scope:** Full matchday hub integration with showroom context switcher.

| Item | Detail |
|------|--------|
| **Flag name** | `showrooms_matchday_hub` |
| **Default** | `false` |
| **Depends on** | `showrooms_enabled = true` |
| **Enable criteria** | E6-S4 showroom switcher UI reviewed and tested. Matchday hub performs well with showroom context switching (no jank, < 200ms switch). Rate limiting active on leaderboard endpoints. At least 1 full gameweek tested with showroom context in staging. |
| **What it unlocks** | Horizontal pill selector in matchday hub showing user's showrooms. Switching between showroom leaderboards during live matches. Showroom-specific content in matchday hub. |
| **Rollback steps** | 1. Set `showrooms_matchday_hub = false`. 2. Matchday hub reverts to default view (no showroom context). 3. No data impact. |
| **Rollback risk** | Low -- purely UI change, no data dependencies. |

### Feature Flag Implementation

Feature flags are stored in the `feature_flags` table:

```sql
CREATE TABLE feature_flags (
  key VARCHAR(50) PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  enabled_for_users UUID[] DEFAULT '{}',  -- gradual rollout
  enabled_percentage INTEGER DEFAULT 0,   -- percentage rollout (0-100)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);
```

**Evaluation order:**
1. If `enabled = true`, flag is on for everyone.
2. If `enabled = false` but user is in `enabled_for_users`, flag is on for that user.
3. If `enabled = false` and `enabled_percentage > 0`, flag is on for `user_id % 100 < enabled_percentage`.
4. Otherwise, flag is off.

---

## 5. Monitoring Checklist

### Operational Metrics

| Metric | Source | Alert Threshold | Dashboard |
|--------|--------|-----------------|-----------|
| **Join rate per day** | `showroom_audit_logs` WHERE `event_type = 'JOIN'` | > 500/day (unexpected spike) or < 5/day (feature broken) | Showrooms Operations |
| **Leave rate per day** | `showroom_audit_logs` WHERE `event_type = 'LEAVE'` | > 200/day (churn signal) | Showrooms Operations |
| **Unlock conversion rate** | `user_showroom_slots` grouped by `unlock_method` | Level unlocks < 10% of eligible users (feature not discoverable) | Showrooms Growth |
| **Unlock revenue (coins)** | `user_showroom_slots` WHERE `unlock_method = 'PURCHASE'` SUM `coins_spent` | Track daily; no alert threshold (business metric) | Showrooms Revenue |
| **Check-in rate per day** | `showroom_checkins` COUNT per day | < 20% of active members (engagement drop) | Showrooms Engagement |
| **Check-in time distribution** | `showroom_checkins` grouped by hour (EAT) | Match hour check-ins < 30% of daily total (bonus not incentivizing) | Showrooms Engagement |
| **Abuse flag rate** | `abuse_flags` COUNT per day | > 50/day (potential attack) | Showrooms Security |
| **Unreviewed abuse flags** | `abuse_flags` WHERE `reviewed_at IS NULL` | > 100 unreviewed (admin backlog) | Showrooms Security |
| **Primary switch frequency** | `showroom_audit_logs` WHERE `event_type = 'SWITCH_PRIMARY'` per week | > 100/week (unexpected, possible exploit) | Showrooms Operations |
| **City leaderboard engagement** | Page views on city leaderboard (analytics event) | Track weekly; no alert threshold | Showrooms Engagement |
| **Error rates by endpoint** | Application logs grouped by endpoint and status code | 5xx rate > 1% on any endpoint | Showrooms Health |
| **API latency (p95)** | Application logs response times | p95 > 500ms on any endpoint | Showrooms Health |
| **Rate limit trigger rate** | Count of 429 responses per endpoint per day | > 100/day on join endpoint (possible abuse wave) | Showrooms Security |
| **Showroom membership distribution** | `showroom_memberships` grouped by `showroom_id` | Any showroom > 1000 members (capacity review needed) | Showrooms Operations |

### Health Check Queries

**Daily active showrooms (at least 1 check-in):**
```sql
SELECT COUNT(DISTINCT showroom_id)
FROM showroom_checkins
WHERE checkin_date = CURRENT_DATE;
```

**Slot unlock funnel:**
```sql
SELECT
  unlock_method,
  COUNT(*) AS total_unlocks,
  COUNT(*) FILTER (WHERE slot_index = 1) AS slot_1_unlocks,
  COUNT(*) FILTER (WHERE slot_index = 2) AS slot_2_unlocks
FROM user_showroom_slots
WHERE unlocked_at > NOW() - INTERVAL '7 days'
GROUP BY unlock_method;
```

**Cooldown compliance (are users hitting cooldowns?):**
```sql
SELECT
  COUNT(*) FILTER (WHERE switch_locked_until > NOW()) AS users_in_cooldown,
  COUNT(*) FILTER (WHERE switch_locked_until IS NULL OR switch_locked_until <= NOW()) AS users_free_to_switch
FROM showroom_memberships
WHERE left_at IS NULL AND slot_index = 0;
```

**Top showrooms by check-in engagement this week:**
```sql
SELECT
  s.name,
  s.city,
  COUNT(c.id) AS checkins_this_week,
  COUNT(DISTINCT c.user_id) AS unique_users
FROM showroom_checkins c
JOIN showrooms s ON s.id = c.showroom_id
WHERE c.checkin_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY s.id, s.name, s.city
ORDER BY checkins_this_week DESC
LIMIT 20;
```

---

## Appendix: Story Point Estimates

| Epic | Story Count | Estimated Points | Sprint Allocation |
|------|-------------|-----------------|-------------------|
| E1: Database Schema | 5 | 13 | Sprint 1 |
| E2: Membership APIs | 4 | 13 | Sprint 1-2 |
| E3: Slot Unlock | 3 | 8 | Sprint 2 |
| E4: Daily Check-in | 2 | 5 | Sprint 1 |
| E5: Aggregation | 3 | 13 | Sprint 3 |
| E6: Frontend | 4 | 13 | Sprint 2-3 |
| E7: Anti-Abuse | 3 | 8 | Sprint 3 |
| **Total** | **24** | **73** | **3 Sprints** |

*Assumes 2-week sprints with a velocity of ~25 points per sprint.*
