# Showrooms Phase 2 — Ruleset & Edge Cases

## Agent 1: Game Systems Rules & Balance

---

## 1. Slot Rules

### Primary Showroom (Slot 0)
| Rule | Value |
|------|-------|
| Max per user | Exactly 1 |
| Auto-assigned | First showroom joined becomes Primary |
| Can be changed | Yes, via `set-primary` action |
| Switching cooldown | 30 days |
| Contributes to city rivalry | YES |
| Label | "Home" |

### Secondary Showrooms (Slots 1 & 2)
| Rule | Value |
|------|-------|
| Max per user | Up to 2 (slot_index 1 and 2) |
| Unlock: Secondary #1 | Level 10 OR purchase with 100 coins (~10 Birr) |
| Unlock: Secondary #2 | Level 25 OR purchase with 400 coins (~40 Birr) |
| Contributes to city rivalry | NO |
| Switching cooldown | 7 days per slot |
| Label | "Secondary" |

### Locked Slots
| State | Display |
|-------|---------|
| Not unlocked, level not met | "Locked - Reach Level X or Buy with Coins" |
| Not unlocked, level met | "Unlocked via Level - Tap to Activate" |
| Unlocked, no showroom | "Empty - Join a Showroom" |
| Unlocked, showroom assigned | Shows showroom card with "Secondary" badge |

---

## 2. Switching Cooldown Rules

### Primary Switching
- **Cooldown**: 30 days from last primary switch
- **Enforcement**: Server-side via `switch_locked_until` timestamp on membership record
- **Edge case**: If user leaves primary showroom, they must pick a new one immediately (or next join becomes primary)
- **Edge case**: If primary showroom is dissolved/suspended, cooldown resets to 0

### Secondary Switching
- **Cooldown**: 7 days per secondary slot
- **Enforcement**: Server-side via `switch_locked_until` per slot
- **Edge case**: Leaving a secondary slot does NOT reset the cooldown — user must wait before joining a new showroom in that slot
- **Edge case**: If secondary showroom is dissolved, cooldown resets to 0 for that slot

### Cooldown Edge Cases Table

| Scenario | Behavior |
|----------|----------|
| User tries to switch primary within 30 days | Reject with "You can switch your Home showroom in X days" |
| User tries to switch secondary within 7 days | Reject with "This slot is on cooldown for X days" |
| Primary showroom suspended by admin | Cooldown resets, user prompted to pick new primary |
| Secondary showroom dissolved | Slot freed, cooldown resets for that slot |
| User has no primary (edge state) | Next join auto-assigns as primary regardless of slot status |
| User demotes primary to secondary | Only if secondary slot available AND primary cooldown allows |
| User promotes secondary to primary | Primary cooldown applies; old primary demoted to secondary (if slot exists) or removed |

---

## 3. Anti-Exploit Caps

### Daily Check-in
- **Cap**: Once per day per USER (not per showroom)
- **Reward**: 25 XP + 5 coins (awarded only once regardless of how many showrooms user belongs to)
- **Enforcement**: `showroom_checkins` table with UNIQUE(user_id, checkin_date)
- **Match-hour bonus**: Optional 2x XP if check-in occurs during live match hours (server validates)

### Mission/Quest Caps
- Missions are shared across ALL showrooms (account-wide)
- Daily quest completion counts once per quest type per day
- No stacking of rewards from multiple showroom memberships

### Reward Farming Prevention
| Cap | Limit | Window |
|-----|-------|--------|
| Check-in reward | 1 | Per day |
| Showroom joins | 5 | Per 24 hours |
| Showroom leaves | 3 | Per 24 hours |
| QR scans | 10 | Per hour |
| Slot unlock purchases | 2 | Per lifetime (one per slot) |

---

## 4. City Rivalry Aggregation Rule

### Contribution Rule
- **ONLY Primary showroom memberships count** toward city rivalry scoring
- Secondary memberships provide access to leaderboards and hub but do NOT contribute points
- UI must clearly state: "Only your Home Showroom counts toward city rivalry"

### Aggregation Formula
```
showroom_weekly_score = AVG(top_N_primary_member_gw_points)
where N = MIN(25, active_primary_member_count)
```

### Active Member Definition
- Has Primary membership in this showroom
- Logged in within last 7 days
- Made at least 1 team action (transfer, captain change, chip use) in current gameweek

---

## 5. User-Facing Status Labels

| Status | Badge | Color | Description |
|--------|-------|-------|-------------|
| Home | "HOME" | Green | User's primary showroom |
| Secondary | "SECONDARY" | Blue | User's secondary showroom |
| Locked | "LOCKED" | Gray | Slot not yet unlocked |
| Cooldown | "ON COOLDOWN" | Orange | Slot switching locked |
| Available | "AVAILABLE" | Purple | Unlocked slot, no showroom assigned |

---

## 6. Slot Unlock Pricing Config

```typescript
export const SHOWROOM_SLOT_PRICING = {
  slot_1: {
    level_requirement: 10,
    coin_price: 100,       // ~10 Birr equivalent
    birr_equivalent: 10,
  },
  slot_2: {
    level_requirement: 25,
    coin_price: 400,       // ~40 Birr equivalent
    birr_equivalent: 40,
  },
} as const;
```

---

## 7. Membership Limit Summary

| Constraint | Value | Enforced Where |
|-----------|-------|----------------|
| Max primary showrooms | 1 | DB constraint + API validation |
| Max secondary showrooms | 2 | DB constraint + API validation |
| Max total showrooms | 3 | Derived from above |
| Primary switch cooldown | 30 days | Server-side timestamp check |
| Secondary switch cooldown | 7 days | Server-side timestamp check per slot |
| Daily check-in | 1 per user | DB unique constraint (user_id, date) |
| Join rate limit | 5 per 24h | Rate limiter middleware |
| Leave rate limit | 3 per 24h | Rate limiter middleware |
