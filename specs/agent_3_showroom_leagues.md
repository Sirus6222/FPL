# Agent 3: Showroom Leagues Architect
## Ethiopian FPL - Physical-to-Digital League System

*Inherits compliance from Agent 1: Guaranteed prizes, skill-based competition*

---

## 1. Venue Registration Flow

### Venue Types

| Type | Examples | Requirements | Tier |
|------|----------|--------------|------|
| **Coffee Shop** | Local bunna bet, café | Business license, 10+ regular customers | Bronze |
| **Sports Bar** | Bars with TV screens | Business license, 20+ capacity | Silver |
| **Betting Shop** | SportPesa agents, etc. | Existing license, 50+ daily visitors | Gold |
| **University** | Campus clubs, dorms | Student org registration | Bronze |
| **Corporate** | Office leagues | Company verification | Silver |
| **Stadium/Arena** | Match viewing venues | Event license | Platinum |

### Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│  VENUE REGISTRATION FLOW                                     │
├─────────────────────────────────────────────────────────────┤
│  1. Venue Owner downloads app → Creates personal account    │
│  2. Applies for "Showroom Partner" via in-app form          │
│     - Business name, location (GPS + manual address)        │
│     - Business license photo upload                         │
│     - Contact phone (Telebirr-linked preferred)             │
│     - Estimated daily foot traffic                          │
│     - Photo of venue (exterior + interior with screens)     │
│  3. Platform reviews (24-72 hours)                          │
│     - Verify business license                               │
│     - Check location on map                                 │
│     - Optional: Call verification                           │
│  4. Approval → Venue Owner becomes "Showroom Admin"         │
│  5. Admin receives:                                         │
│     - Unique Showroom QR code (printable)                   │
│     - Admin dashboard access                                │
│     - Promotional materials (digital)                       │
│  6. First 30 days: "New Venue" boost (2x visibility)        │
└─────────────────────────────────────────────────────────────┘
```

### Admin Controls

| Feature | Access Level | Description |
|---------|--------------|-------------|
| View Member List | Admin | See all joined managers |
| Remove Member | Admin | Kick abusive/fake accounts |
| Set League Name | Admin | Custom showroom name |
| Upload Logo | Admin | Venue branding |
| View Analytics | Admin | Joins, active users, points |
| Generate New QR | Admin | Rotate QR if compromised |
| Set Open Hours | Admin | When league is joinable |
| Appoint Co-Admin | Admin | Delegate to staff |
| Request Prize Sponsorship | Admin | Apply for sponsored prizes |

### Moderation Rules

1. **Member Complaints**: 3+ reports → review triggered
2. **Suspicious Activity**: Auto-flag for platform review
3. **Venue Violations**: Fake location, fake traffic → suspension
4. **Appeals**: 7-day window to dispute suspension

---

## 2. QR Code Join Flow

### Standard Join Flow

```
┌─────────────────────────────────────────────────────────────┐
│  QR JOIN FLOW                                                │
├─────────────────────────────────────────────────────────────┤
│  1. User opens app camera (or dedicated QR scanner)         │
│  2. Scans Showroom QR code displayed at venue               │
│  3. App validates:                                          │
│     a) QR token is valid and not expired                    │
│     b) User is not already in this showroom                 │
│     c) GPS proximity check (within 500m of venue)           │
│     d) Rate limit check (not joining too many too fast)     │
│  4. Success → User sees Showroom details:                   │
│     - Venue name, logo, member count                        │
│     - Current leaderboard position                          │
│     - This week's active members                            │
│  5. User taps "Join Showroom"                               │
│  6. Confirmation: "You've joined [Venue Name]!"             │
│  7. User appears in Showroom leaderboard                    │
└─────────────────────────────────────────────────────────────┘
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| **Repeat Scan (already member)** | "You're already a member! View your ranking." |
| **Expired QR** | "This QR code has expired. Ask staff for new code." |
| **Outside GPS Range** | "You appear to be outside [Venue]. Visit in person to join." |
| **GPS Disabled** | "Enable location to verify you're at the venue." |
| **Rate Limit (5+ joins/day)** | "You've joined many showrooms today. Try again tomorrow." |
| **Banned User** | "You cannot join this showroom." (no details) |
| **Venue Suspended** | "This showroom is temporarily unavailable." |
| **Max Members Reached** | "This showroom is full (500/500). Join waitlist?" |
| **QR Shared Online** | GPS check fails; rejected |

### QR Token Structure

```
Token Format: ETHFPL-{venue_id}-{rotation_key}-{checksum}
Example: ETHFPL-V00123-R7K2M-X9Y

Properties:
- venue_id: Unique venue identifier
- rotation_key: Changes weekly or on-demand
- checksum: Validation hash
- Embedded URL: https://fpl.et/join?t={token}
```

---

## 3. Showroom Scoring Model

### Aggregate Performance Formula

```
Showroom Weekly Score = Σ (Member GW Points) / Active Members

Where:
- Active Member = Logged in within last 7 days + made 1+ team change
- Minimum 5 active members required for ranking
- Maximum 50 members count toward score (prevents mega-showroom advantage)
```

### Leaderboard Types

| Leaderboard | Scope | Ranking Basis | Prize Eligibility |
|-------------|-------|---------------|-------------------|
| **Showroom Internal** | Within venue | Individual GW points | Venue-sponsored |
| **City Showroom** | All venues in city | Showroom aggregate score | Platform-sponsored |
| **National Showroom** | All venues in Ethiopia | Showroom aggregate score | Major sponsor |
| **Venue Type** | E.g., all coffee shops | Showroom aggregate score | Category prizes |

### Scoring Weights

| Factor | Weight | Rationale |
|--------|--------|-----------|
| Average Member Points | 60% | Core skill signal |
| Member Engagement Rate | 20% | Active participation |
| Week-over-Week Growth | 10% | Acquisition effort |
| Streak Holders (%) | 10% | Retention quality |

### Example Calculation

```
Coffee House Abyssinia:
- 25 members, 18 active this week
- Total GW points of active: 1,080
- Average: 1,080 / 18 = 60.0
- Engagement rate: 18/25 = 72% → 72 points
- Growth: +3 members → 30 points
- Streak holders: 10/25 = 40% → 40 points

Weighted Score: (60 × 0.6) + (72 × 0.2) + (30 × 0.1) + (40 × 0.1)
             = 36 + 14.4 + 3 + 4 = 57.4
```

---

## 4. Geo-League Suggestions

### GPS Permission Flow

```
1. User grants location permission (optional)
2. App detects woreda/sub-city from coordinates
3. Suggests nearby showrooms (within 2km)
4. Suggests city rivalry leagues

UI: "Join managers near you?"
    [Show Nearby Showrooms] [Maybe Later]
```

### Geo-Hierarchy

| Level | Example | Auto-Join Option |
|-------|---------|------------------|
| Woreda | Bole Woreda 03 | Opt-in |
| Sub-City | Bole Sub-City | Opt-in |
| City | Addis Ababa | Auto (if GPS enabled) |
| Region | Oromia | Opt-in |
| National | Ethiopia | Default |

### City Rivalry Leagues

| Rivalry | Teams | Special Events |
|---------|-------|----------------|
| Addis vs Dire Dawa | 2 cities | Derby weekends |
| University Cup | Top 10 unis | Semester championships |
| Coffee Shop League | Venue type | Monthly showcase |

### Location Data Handling

- **Storage**: Approximate location only (sub-city level)
- **No Tracking**: GPS used for verification only, not tracking
- **User Control**: Can disable geo-suggestions anytime
- **Privacy**: No location shared with other users

---

## 5. Anti-Fraud Controls

### GPS Heuristics

| Check | Threshold | Action |
|-------|-----------|--------|
| Distance from venue | > 500m | Reject join |
| Location accuracy | < 50m required | Prompt to improve signal |
| Rapid location changes | > 100km/hour | Flag for review |
| VPN/Proxy detected | GPS mismatch with IP | Additional verification |
| Mock location app | Detected via system flags | Block + warn |

### Device Fingerprinting

```
Fingerprint Components:
- Device model + OS version
- Screen resolution
- Installed fonts (subset)
- Timezone
- Language settings
- Battery status patterns

Usage:
- 1 device = max 2 accounts
- Same device joining 10+ showrooms = suspicious
- Device seen in multiple cities same day = flag
```

### Rate Limits

| Action | Limit | Window |
|--------|-------|--------|
| QR scans | 10 | 1 hour |
| Showroom joins | 5 | 24 hours |
| Failed join attempts | 3 | 1 hour |
| Showroom switches | 2 | 7 days |

### Suspicious Join Patterns

| Pattern | Detection | Response |
|---------|-----------|----------|
| Bulk joins (10+ same minute) | Server-side monitoring | Block all, review |
| QR shared on social media | GPS failures spike | Rotate QR, notify admin |
| Ghost members (join, never active) | 7-day inactivity | Auto-remove, no penalty |
| Collusion ring | Same transfers, same captain | Investigate, potential ban |
| Fake venues | No real joins, suspicious location | Suspend pending review |

### Abuse Response Tiers

| Tier | Offense | Consequence |
|------|---------|-------------|
| 1 | First minor violation | Warning + 24-hour cooldown |
| 2 | Repeat minor / first major | 7-day showroom ban |
| 3 | Serious fraud attempt | 30-day platform suspension |
| 4 | Confirmed fraud | Permanent ban + prize forfeiture |

---

## 6. Showroom Data Model

### Entity: Showroom

```sql
CREATE TABLE showrooms (
    showroom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    venue_type ENUM('coffee_shop', 'sports_bar', 'betting_shop',
                    'university', 'corporate', 'stadium') NOT NULL,
    tier ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',

    -- Location
    address TEXT,
    city VARCHAR(50) NOT NULL,
    sub_city VARCHAR(50),
    woreda VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geo_point GEOGRAPHY(POINT, 4326), -- PostGIS

    -- Verification
    business_license_url TEXT,
    verification_status ENUM('pending', 'verified', 'suspended', 'rejected') DEFAULT 'pending',
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES admins(admin_id),

    -- Branding
    logo_url TEXT,
    cover_photo_url TEXT,
    description TEXT,

    -- Settings
    max_members INT DEFAULT 500,
    join_radius_meters INT DEFAULT 500,
    is_public BOOLEAN DEFAULT TRUE,

    -- Stats (denormalized for performance)
    member_count INT DEFAULT 0,
    active_member_count INT DEFAULT 0,
    total_points_this_gw INT DEFAULT 0,
    weekly_score DECIMAL(10, 2) DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_showroom_city (city),
    INDEX idx_showroom_geo (geo_point),
    INDEX idx_showroom_tier (tier),
    INDEX idx_showroom_weekly_score (weekly_score DESC)
);
```

### Entity: ShowroomMembership

```sql
CREATE TABLE showroom_memberships (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showroom_id UUID REFERENCES showrooms(showroom_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    role ENUM('member', 'co_admin', 'admin') DEFAULT 'member',

    -- Join verification
    joined_via ENUM('qr_scan', 'invite_link', 'admin_add', 'geo_suggest') NOT NULL,
    join_latitude DECIMAL(10, 8),
    join_longitude DECIMAL(11, 8),
    join_device_fingerprint VARCHAR(64),

    -- Activity
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    points_contributed_this_gw INT DEFAULT 0,

    -- Status
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    banned_reason TEXT,
    banned_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(showroom_id, user_id),
    INDEX idx_membership_user (user_id),
    INDEX idx_membership_showroom (showroom_id),
    INDEX idx_membership_active (showroom_id, is_active)
);
```

### Entity: QRToken

```sql
CREATE TABLE qr_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showroom_id UUID REFERENCES showrooms(showroom_id) ON DELETE CASCADE,

    token_code VARCHAR(50) UNIQUE NOT NULL, -- ETHFPL-V00123-R7K2M-X9Y
    token_type ENUM('permanent', 'temporary', 'single_use') DEFAULT 'permanent',

    -- Validity
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    max_uses INT, -- NULL = unlimited
    use_count INT DEFAULT 0,

    -- Rotation
    rotation_key VARCHAR(10) NOT NULL,
    rotated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Metadata
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_qr_token_code (token_code),
    INDEX idx_qr_showroom (showroom_id)
);
```

### Entity: CityLeaderboard

```sql
CREATE TABLE city_leaderboards (
    leaderboard_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(50) NOT NULL,
    gameweek INT NOT NULL,
    season VARCHAR(10) NOT NULL, -- '2024-25'

    -- Showroom rankings (JSONB for flexibility)
    rankings JSONB NOT NULL,
    -- Example: [{"showroom_id": "...", "rank": 1, "score": 85.5, "member_count": 45}, ...]

    -- Stats
    total_showrooms INT DEFAULT 0,
    total_participants INT DEFAULT 0,

    -- Timestamps
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(city, gameweek, season),
    INDEX idx_city_lb_city (city),
    INDEX idx_city_lb_gw (gameweek)
);
```

### Entity: ShowroomPrize

```sql
CREATE TABLE showroom_prizes (
    prize_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showroom_id UUID REFERENCES showrooms(showroom_id),

    prize_type ENUM('venue_sponsored', 'platform_sponsored', 'sponsor_funded') NOT NULL,
    sponsor_name VARCHAR(100),

    -- Prize details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    value_etb DECIMAL(10, 2),
    prize_items JSONB, -- ["Coffee Voucher", "Free Jersey"]

    -- Conditions
    gameweek INT,
    season VARCHAR(10),
    rank_required INT, -- Top N to qualify

    -- Status
    status ENUM('upcoming', 'active', 'claimed', 'expired') DEFAULT 'upcoming',
    winner_user_id UUID REFERENCES users(user_id),
    claimed_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,

    INDEX idx_prize_showroom (showroom_id),
    INDEX idx_prize_status (status)
);
```

---

## Key Decisions (Agent 3)

1. **500m GPS radius**: Balance between accessibility and fraud prevention
2. **50-member scoring cap**: Prevents mega-showrooms from dominating
3. **Weekly QR rotation option**: Security without constant disruption
4. **Aggregate scoring**: Showrooms compete on average, not total (fair for small venues)
5. **Tiered venues**: Different service levels for different business sizes

## Assumptions

- GPS is reasonably accurate in Ethiopian urban areas
- Venues will display QR codes prominently
- Business license verification can be done manually initially
- PostGIS or equivalent available for geo queries

## Open Questions

1. How to handle venues that move locations?
2. Should showrooms have "seasons" that reset?
3. What's the SLA for venue verification (24h? 72h?)?

---

*Agent 3 Complete. Handoff to Agent 4: Live Ops + Tournament Mode PM*
