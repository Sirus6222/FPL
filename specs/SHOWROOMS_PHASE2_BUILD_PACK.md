# Showrooms Phase 2 — Build Pack

## Primary + Paid/Progression Secondary Slots

**Version:** 1.0.0
**Status:** Implementation-Ready
**Date:** 2026-02-06

---

## Executive Summary

Showrooms Phase 2 extends the existing showroom system with a **Primary + Secondary slot model**:
- Each user has exactly **1 Primary ("Home") showroom** that contributes to city rivalry scoring
- Each user may unlock up to **2 Secondary showroom slots** via level progression or coin purchase
- Secondary showrooms provide access to additional hubs and leaderboards but do **NOT** contribute to city rivalry
- All switching has cooldowns (30 days for Primary, 7 days for Secondary)
- Anti-exploit caps prevent reward farming across multiple showrooms

---

## Table of Contents

1. [Ruleset & Edge Cases](#1-ruleset--edge-cases)
2. [DB Schema & Migrations](#2-db-schema--migrations)
3. [API Spec & Backend Services](#3-api-spec--backend-services)
4. [Wallet Purchase Unlock Integration](#4-wallet-purchase-unlock-integration)
5. [Aggregation Jobs & Leaderboards](#5-aggregation-jobs--leaderboards)
6. [Frontend Routes & Components](#6-frontend-routes--components)
7. [Anti-Abuse Protections](#7-anti-abuse-protections)
8. [Backlog & Acceptance Criteria](#8-backlog--acceptance-criteria)
9. [Feature Flags & Rollout](#9-feature-flags--rollout)
10. [Dependency Map](#10-dependency-map)

---

## 1. Ruleset & Edge Cases

**Full spec:** `specs/showrooms_phase2_ruleset.md`

### Slot Rules Summary

| Slot | Type | Unlock | Cooldown | Rivalry |
|------|------|--------|----------|---------|
| 0 | PRIMARY | Auto (first join) | 30 days | YES |
| 1 | SECONDARY | Level 10 OR 100 coins | 7 days | NO |
| 2 | SECONDARY | Level 25 OR 400 coins | 7 days | NO |

### Key Rules
- **1 PRIMARY max** — enforced by partial unique index on DB
- **2 SECONDARY max** — enforced by slot_index constraint (1 or 2)
- **Daily check-in**: Once per user per day (not per showroom)
- **Missions/quests**: Account-wide caps, not per-showroom
- **City rivalry**: Only PRIMARY member points count
- **Aggregation formula**: `AVG(top MIN(25, active_primary_count) member GW points)`

### Switching Logic
- **Primary switch**: Swap current primary with a secondary; 30-day cooldown on new primary
- **Secondary switch**: Leave secondary, wait 7-day cooldown on that slot, join new
- **If primary showroom suspended**: Cooldown resets, user prompted to pick new

---

## 2. DB Schema & Migrations

**Migration file:** `supabase/migrations/003_showrooms_phase2.sql`

### New Tables (9)

| Table | Purpose |
|-------|---------|
| `showrooms` | Venue definitions with location, tier, verification, stats |
| `showroom_memberships` | User memberships with PRIMARY/SECONDARY type and slot_index |
| `user_showroom_slots` | Slot unlock tracking (is_unlocked, source, level, timestamp) |
| `showroom_slot_unlock_transactions` | Links slot purchases to wallet ledger with idempotency |
| `showroom_checkins` | Daily check-in records with UNIQUE(user_id, checkin_date) |
| `showroom_weekly_scores` | Aggregation snapshots per showroom per gameweek |
| `city_leaderboard_snapshots` | City-level leaderboard rankings as JSONB |
| `showroom_audit_logs` | Full audit trail for all membership/slot events |
| `qr_tokens` | QR code tokens with rotation, expiry, use limits |

### Key Constraints
- `UNIQUE(showroom_id, user_id)` on memberships — one membership per showroom per user
- `UNIQUE(user_id, slot_index)` on memberships — one slot assignment per slot per user
- Partial unique index `idx_one_primary_per_user` — only one PRIMARY per user
- `UNIQUE(user_id, checkin_date)` on checkins — one check-in per day
- `UNIQUE(idempotency_key)` on unlock transactions — double-spend prevention

### Database Functions (6)
1. `join_showroom()` — Auto-assigns PRIMARY or SECONDARY, validates slots, updates counts
2. `leave_showroom()` — Removes membership, updates counts, frees slot
3. `set_primary_showroom()` — Swaps primary/secondary with cooldown enforcement
4. `unlock_showroom_slot()` — Level or coin purchase unlock with idempotency
5. `showroom_checkin()` — Daily check-in with match-hour bonus
6. `calculate_showroom_weekly_score()` — Aggregates PRIMARY member points

### RLS Policies
- All 9 tables have RLS enabled
- Users can only read/write their own data
- Showrooms are publicly readable (if verified)
- Weekly scores and city leaderboards are publicly readable
- QR tokens readable by authenticated users, manageable by showroom admins

---

## 3. API Spec & Backend Services

**Service file:** `services/showroomService.ts`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/showrooms/join` | Join by showroom_id (auto PRIMARY/SECONDARY) |
| POST | `/showrooms/join/qr` | Join by QR token_code |
| POST | `/showrooms/set-primary` | Promote secondary to primary (swap) |
| POST | `/showrooms/leave` | Leave showroom, free slot |
| GET | `/showrooms/my` | Get user's complete showroom state |
| POST | `/showrooms/slots/unlock` | Unlock secondary slot (LEVEL or PURCHASE) |
| GET | `/showrooms/slots/status` | Get slot unlock status |
| GET | `/showrooms/:id/hub` | Matchday hub data (members, rankings) |
| POST | `/showrooms/:id/checkin` | Daily check-in |
| GET | `/leaderboards/showrooms/city` | City showroom leaderboard |
| GET | `/leaderboards/showrooms/:id` | Individual showroom leaderboard |
| GET | `/showrooms` | Browse verified showrooms (with filters) |

### Service Functions
All implemented in `services/showroomService.ts` with:
- Supabase RPC calls for transactional operations
- Direct queries for read operations
- Proper error handling and typed responses
- QR token validation flow
- Aggregation job runner (`runCityAggregation`)

---

## 4. Wallet Purchase Unlock Integration

### Pricing Config

```typescript
SHOWROOM_SLOT_PRICING = {
  slot_1: { level_requirement: 10, coin_price: 100, birr_equivalent: 10 },
  slot_2: { level_requirement: 25, coin_price: 400, birr_equivalent: 40 },
}
```

### Purchase Flow
1. Client calls `unlockShowroomSlot(userId, slotIndex, 'PURCHASE', idempotencyKey)`
2. DB function `unlock_showroom_slot()` executes in transaction:
   a. Checks idempotency key — returns early if already processed
   b. Validates coin balance
   c. Debits coins from user
   d. Creates wallet transaction record (type: `coin_spend`)
   e. Creates `showroom_slot_unlock_transactions` record
   f. Sets slot as unlocked in `user_showroom_slots`
   g. Creates audit log entry
3. All within SECURITY DEFINER function — atomic transaction

### Idempotency
- Key format: `slot_unlock:{user_id}:{slot_index}`
- `UNIQUE(idempotency_key)` constraint prevents double-processing
- Duplicate requests return `{ success: true, already_unlocked: true }`

### Rollback
- If any step fails, PostgreSQL transaction rolls back all changes
- No partial state — either fully unlocked or not at all

---

## 5. Aggregation Jobs & Leaderboards

### Weekly Score Formula
```
showroom_weekly_score = AVG(top_N_primary_member_gw_points)
where N = MIN(25, active_primary_count)
```

### Active Member Definition
- Has PRIMARY membership (not secondary)
- Is active (`is_active = TRUE`)
- Last active within 7 days

### Job Flow (`runCityAggregation`)
1. Query all verified showrooms in city
2. For each: call `calculate_showroom_weekly_score()` RPC
3. Build city leaderboard by ordering showrooms by weekly_score DESC
4. Update `city_rank` on showrooms and weekly_scores
5. Upsert `city_leaderboard_snapshots` with JSONB rankings

### Caching Strategy
- Showroom weekly_score denormalized on `showrooms` table for fast reads
- City leaderboard stored as JSONB snapshot — no real-time calculation needed
- Can add Redis cache for `/leaderboards/showrooms/city` with 5-minute TTL

### Endpoints
- `GET /leaderboards/showrooms/city?city=Addis+Ababa&gameweek=15`
- `GET /leaderboards/showrooms/:id` — Internal member rankings

---

## 6. Frontend Routes & Components

### Route Map

| Route | Component | Description |
|-------|-----------|-------------|
| `/showrooms` (tab) | `ShowroomsTab` | Main showroom management view |
| Showroom detail | Within `ShowroomsTab` | Primary/Secondary/Locked cards |
| Matchday hub | `ShowroomMatchdayHub` (modal) | Rankings + rivalry info |
| QR scan | Existing `ShowroomHub` | QR scanner entry |

### New Components (4)

1. **`ShowroomsTab.tsx`** — Main tab view
   - Shows Primary showroom card (large, green border, HOME badge)
   - Shows Secondary section with filled/empty/locked slot cards
   - Info section explaining slot system
   - CTAs for QR scan and browse

2. **`ShowroomSlotCard.tsx`** — 4 card variants:
   - `PrimaryShowroomCard` — Large card with HOME badge, rivalry indicator, check-in button, hub link
   - `SecondaryShowroomCard` — Smaller card with SECONDARY badge, hub link, promote/leave actions, cooldown display
   - `LockedSlotCard` — Locked slot with two unlock CTAs (Level or Purchase), level/coin requirements shown
   - `EmptySlotCard` — Unlocked but empty, CTA to browse showrooms

3. **`ShowroomMatchdayHub.tsx`** — Matchday hub modal
   - Showroom selector dropdown (switch between primary/secondary)
   - Rivalry contribution banner (green for primary, blue for secondary)
   - Weekly score + city rank summary
   - Member rankings table with GW points, rank changes, membership type badges

4. **Existing `ShowroomHub.tsx`** — Browse/search showrooms (unchanged, backward compatible)

### State Management
- `userShowroomState: UserShowroomState` — central state object containing:
  - `primary`: Membership + Showroom (or null)
  - `secondaries`: Array of Membership + Showroom
  - `slots`: { slot_1, slot_2 } with unlock status
- `hubData: ShowroomHubData | null` — loaded on demand for matchday hub
- `hasCheckedInToday: boolean` — tracked for check-in button state

### UX Key Behaviors
- First join auto-becomes PRIMARY (no user choice needed)
- Matchday hub defaults to Primary; dropdown to switch to secondary
- Clear rivalry label on every screen
- Locked slots show level progress and coin price
- Cooldown timers shown with days remaining

---

## 7. Anti-Abuse Protections

**Full spec:** `specs/showrooms_phase2_antiabuse.md`

### Summary

| Protection | Implementation |
|-----------|---------------|
| QR replay | Rotating tokens, TTL, use_count limits |
| Rate limits | 5 joins/24h, 1 check-in/day, 10 QR scans/hour |
| GPS validation | Haversine distance check (500m radius) |
| Reward caps | UNIQUE constraint on daily check-in |
| Slot purchase | Idempotency key prevents double-spend |
| Switching abuse | Server-side cooldown timestamps |
| Bot detection | Suspicious join heuristics (same IP, rapid joins) |
| Audit trail | All events logged with metadata, IP, user agent |

---

## 8. Backlog & Acceptance Criteria

**Full spec:** `specs/showrooms_phase2_delivery_backlog.md`

### Epic Summary

| # | Epic | Stories | Priority |
|---|------|---------|----------|
| 1 | Database Schema | 5 | P0 (MVP) |
| 2 | Membership APIs | 4 | P0 (MVP) |
| 3 | Slot Unlock System | 3 | P1 (v1) |
| 4 | Daily Check-in | 2 | P0 (MVP) |
| 5 | Aggregation & Leaderboards | 3 | P1 (v1) |
| 6 | Frontend UI | 4 | P1 (v1) |
| 7 | Anti-Abuse & Security | 3 | P1 (v1) |

### Scope Phases
- **MVP**: Primary join/leave, basic check-in, slot display (locked)
- **v1**: Secondary slots, slot unlocks, matchday hub, city leaderboard, rate limiting
- **vNext**: QR scanning, GPS verification, admin dashboard, mission integration

---

## 9. Feature Flags & Rollout

| Phase | Flag | What It Enables |
|-------|------|-----------------|
| 1 | `showrooms_enabled` | Base showroom tables, primary join/leave |
| 2 | `showrooms_secondary_slots` | Slot unlock system, secondary join |
| 3 | `showrooms_rivalry` | Aggregation jobs, city leaderboard |
| 4 | `showrooms_matchday_hub` | Full UI with hub switcher |

### Rollback
- Each phase can be disabled independently
- DB tables remain (no destructive rollback)
- UI components hidden behind feature flags
- Scheduled jobs skipped when flag disabled

---

## 10. Dependency Map

```
agent_1_rules ──────────────────────────────────┐
  │                                              │
  ├─► agent_2_data_model ──────────────────┐     │
  │     │                                  │     │
  │     ├─► agent_3_backend_api ──────┐    │     │
  │     │     │                       │    │     │
  │     │     ├─► agent_4_wallet ──┐  │    │     │
  │     │     │                    │  │    │     │
  │     │     └─► agent_6_frontend │  │    │     │
  │     │                          │  │    │     │
  │     └─► agent_5_aggregation ───┤  │    │     │
  │                                │  │    │     │
  ├─► agent_6_frontend ────────────┤  │    │     │
  │                                │  │    │     │
  └─► agent_7_antiabuse ──────────┤  │    │     │
                                   │  │    │     │
                                   ▼  ▼    ▼     ▼
                              agent_8_qa_delivery
                                      │
                                      ▼
                                 orchestrator
                                 (this doc)
```

---

## Artifacts Produced

| Agent | Artifact | Location |
|-------|----------|----------|
| 1 | Ruleset + Edge Cases | `specs/showrooms_phase2_ruleset.md` |
| 2 | DB Migration | `supabase/migrations/003_showrooms_phase2.sql` |
| 3 | Backend Service | `services/showroomService.ts` |
| 4 | Wallet Integration | Integrated in DB functions + service |
| 5 | Aggregation Logic | DB function + `runCityAggregation()` in service |
| 6 | Frontend Components | `components/ShowroomsTab.tsx`, `ShowroomSlotCard.tsx`, `ShowroomMatchdayHub.tsx` |
| 7 | Anti-Abuse Spec | `specs/showrooms_phase2_antiabuse.md` |
| 8 | Delivery Backlog | `specs/showrooms_phase2_delivery_backlog.md` |
| Orchestrator | Build Pack | `specs/SHOWROOMS_PHASE2_BUILD_PACK.md` (this file) |
| Types | Updated Types | `types.ts` (ShowroomMembershipType, ShowroomSlot, UserShowroomState, etc.) |

---

## Success Criteria Verification

| Criteria | Status |
|----------|--------|
| Users can set exactly 1 Primary and up to 2 Secondary showrooms | Enforced by DB constraints + API validation |
| UI clearly shows Home vs Secondary vs Locked slots | PrimaryShowroomCard, SecondaryShowroomCard, LockedSlotCard components |
| Unlock-by-purchase uses wallet ledger with idempotency | `unlock_showroom_slot()` function with idempotency_key |
| City rivalry uses Primary-only + top-N average formula | `calculate_showroom_weekly_score()` function |
| Switching cooldowns enforced server-side | `switch_locked_until` timestamp checked in DB functions |
| Abuse protections for QR joins, check-ins, reward farming | Rate limits, UNIQUE constraints, audit logs |
