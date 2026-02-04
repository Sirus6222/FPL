# Agent 7: Technical Lead / Architect
## Ethiopian FPL - Technical Blueprint

*Inherits requirements from all previous agents*

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  React 19 + TypeScript PWA                                          │
│  ├── Mobile-first responsive design                                 │
│  ├── Service Worker (offline support)                               │
│  ├── Push notifications (Firebase)                                  │
│  └── Deep links (QR codes)                                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Kong / AWS API Gateway                                             │
│  ├── Rate limiting                                                  │
│  ├── JWT validation                                                 │
│  ├── Request routing                                                │
│  └── CORS + Security headers                                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │    Auth     │  │   Users     │  │   Teams     │                 │
│  │   Service   │  │   Service   │  │   Service   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Leagues   │  │  Contests   │  │   Wallet    │                 │
│  │   Service   │  │   Service   │  │   Service   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  Showroom   │  │  Analytics  │  │ Notification│                 │
│  │   Service   │  │   Service   │  │   Service   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  Gamification│ │   Content   │  │   Scoring   │                 │
│  │   Service   │  │   Service   │  │   Service   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ PostgreSQL  │  │    Redis    │  │ ClickHouse  │                 │
│  │  (Primary)  │  │   (Cache)   │  │ (Analytics) │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   FPL API   │  │  Telebirr   │  │    Chapa    │                 │
│  │ (bootstrap) │  │  (Payments) │  │  (Payments) │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐                                   │
│  │  Firebase   │  │   Twilio    │                                   │
│  │   (Push)    │  │   (SMS)     │                                   │
│  └─────────────┘  └─────────────┘                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Service Responsibilities

| Service | Responsibilities | Key Dependencies |
|---------|------------------|------------------|
| **Auth** | Registration, login, JWT, phone verification | Twilio, Redis |
| **Users** | Profile, XP, levels, settings, avatars | Auth, Gamification |
| **Teams** | Squad management, transfers, formation, chips | Scoring, Content |
| **Leagues** | Private/public leagues, membership, leaderboards | Users, Scoring |
| **Contests** | Entry, prize distribution, rankings | Wallet, Leagues |
| **Wallet** | Coins balance, transactions, payment webhooks | Telebirr, Chapa |
| **Showroom** | Venue registration, QR codes, geo leagues | Auth, Analytics |
| **Analytics** | Event ingestion, metrics, reports | ClickHouse |
| **Notification** | Push, in-app, email scheduling | Firebase |
| **Gamification** | XP, streaks, achievements, daily quests | Users, Analytics |
| **Content** | Players, teams, fixtures, prices, trivia | FPL API |
| **Scoring** | Point calculations, live updates | Content |

---

## 2. Database Schema

### Core Entities

```sql
-- =============================================
-- USERS & AUTH
-- =============================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),

    -- Profile
    display_name VARCHAR(50) NOT NULL,
    avatar_id VARCHAR(20) DEFAULT 'av1',
    country_code VARCHAR(3) DEFAULT 'ET',
    city VARCHAR(50),
    sub_city VARCHAR(50),

    -- Gamification
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    coins INT DEFAULT 0,
    login_streak INT DEFAULT 0,
    last_login_date DATE,

    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,

    -- Settings
    language VARCHAR(2) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_user_phone (phone),
    INDEX idx_user_city (city),
    INDEX idx_user_xp (xp DESC)
);

CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(64),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_session_user (user_id),
    INDEX idx_session_expires (expires_at)
);

CREATE TABLE user_achievements (
    achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, achievement_type),
    INDEX idx_achievement_user (user_id)
);

-- =============================================
-- TEAMS & SQUADS
-- =============================================

CREATE TABLE teams (
    team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    -- Team Info
    name VARCHAR(50) NOT NULL,
    budget DECIMAL(5, 1) DEFAULT 100.0,
    total_points INT DEFAULT 0,

    -- Chips
    wildcard_available INT DEFAULT 2,
    freehit_available INT DEFAULT 1,
    benchboost_available INT DEFAULT 1,
    triplecaptain_available INT DEFAULT 1,

    -- Transfers
    free_transfers INT DEFAULT 1,
    transfers_made_this_gw INT DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    season VARCHAR(10) NOT NULL, -- '2024-25'

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, season),
    INDEX idx_team_user (user_id),
    INDEX idx_team_points (total_points DESC)
);

CREATE TABLE squad_players (
    squad_player_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(team_id) ON DELETE CASCADE,
    player_id INT NOT NULL, -- FPL player ID

    -- Position in squad
    is_bench BOOLEAN DEFAULT FALSE,
    bench_order INT, -- 1-4 for bench players

    -- Roles
    is_captain BOOLEAN DEFAULT FALSE,
    is_vice_captain BOOLEAN DEFAULT FALSE,

    -- Purchase info
    purchase_price DECIMAL(4, 1) NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_squad_team (team_id),
    INDEX idx_squad_player (player_id)
);

CREATE TABLE transfers (
    transfer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(team_id) ON DELETE CASCADE,
    gameweek INT NOT NULL,

    player_in_id INT NOT NULL,
    player_out_id INT NOT NULL,

    price_in DECIMAL(4, 1) NOT NULL,
    price_out DECIMAL(4, 1) NOT NULL,

    transfer_cost INT DEFAULT 0, -- Points cost

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_transfer_team (team_id),
    INDEX idx_transfer_gw (gameweek)
);

-- =============================================
-- LEAGUES
-- =============================================

CREATE TABLE leagues (
    league_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE,

    type ENUM('private', 'public', 'h2h', 'prize',
              'city', 'company', 'university', 'showroom') NOT NULL,

    -- Settings
    entry_code VARCHAR(20),
    min_level INT DEFAULT 1,
    max_members INT DEFAULT 1000,
    entry_fee_coins INT DEFAULT 0,

    -- Ownership
    created_by UUID REFERENCES users(user_id),

    -- Sponsorship
    sponsor_id UUID,
    sponsor_name VARCHAR(100),

    -- Location (for city/showroom leagues)
    city VARCHAR(50),
    sub_city VARCHAR(50),
    showroom_id UUID REFERENCES showrooms(showroom_id),

    -- Status
    status ENUM('active', 'archived', 'suspended') DEFAULT 'active',
    season VARCHAR(10) NOT NULL,

    -- Stats (denormalized)
    member_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_league_type (type),
    INDEX idx_league_city (city),
    INDEX idx_league_status (status)
);

CREATE TABLE league_memberships (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(league_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(team_id),

    role ENUM('member', 'admin', 'owner') DEFAULT 'member',
    rank INT,
    previous_rank INT,
    total_points INT DEFAULT 0,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(league_id, user_id),
    INDEX idx_membership_league (league_id),
    INDEX idx_membership_user (user_id),
    INDEX idx_membership_rank (league_id, rank)
);

-- =============================================
-- CONTESTS
-- =============================================

CREATE TABLE contests (
    contest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    description TEXT,

    type ENUM('free', 'micro', 'standard', 'premium', 'elite', 'grand') NOT NULL,

    -- Entry
    entry_fee_coins INT DEFAULT 0,
    max_entries INT,

    -- Prizes (JSONB for flexibility)
    prize_structure JSONB NOT NULL,
    -- Example: {"1": {"coins": 200, "badge": "champion"}, "2-3": {"coins": 100}}

    total_prize_pool_coins INT NOT NULL,
    sponsor_name VARCHAR(100),

    -- Timing
    gameweek INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,

    -- Status
    status ENUM('upcoming', 'active', 'calculating', 'completed', 'cancelled') DEFAULT 'upcoming',

    -- Stats
    entry_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_contest_status (status),
    INDEX idx_contest_gw (gameweek),
    INDEX idx_contest_type (type)
);

CREATE TABLE contest_entries (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES contests(contest_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(team_id),

    -- Snapshot of team at entry time
    squad_snapshot JSONB NOT NULL,

    -- Results
    points INT DEFAULT 0,
    rank INT,
    prize_coins INT DEFAULT 0,
    prize_claimed BOOLEAN DEFAULT FALSE,

    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(contest_id, user_id),
    INDEX idx_entry_contest (contest_id),
    INDEX idx_entry_user (user_id),
    INDEX idx_entry_rank (contest_id, rank)
);

-- =============================================
-- WALLET & TRANSACTIONS
-- =============================================

CREATE TABLE coin_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    type ENUM('purchase', 'contest_entry', 'contest_prize', 'reward',
              'daily_bonus', 'referral', 'survey', 'refund', 'admin') NOT NULL,

    amount INT NOT NULL, -- Positive for credit, negative for debit
    balance_after INT NOT NULL,

    -- Reference
    reference_type VARCHAR(50), -- 'contest', 'achievement', 'streak', etc.
    reference_id UUID,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_coin_tx_user (user_id),
    INDEX idx_coin_tx_type (type),
    INDEX idx_coin_tx_created (created_at)
);

CREATE TABLE payment_transactions (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    provider ENUM('telebirr', 'chapa') NOT NULL,
    provider_transaction_id VARCHAR(100),

    amount_birr DECIMAL(10, 2) NOT NULL,
    coins_credited INT NOT NULL,

    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',

    -- Metadata
    payment_method VARCHAR(50),
    provider_response JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    INDEX idx_payment_user (user_id),
    INDEX idx_payment_status (status),
    INDEX idx_payment_provider (provider, provider_transaction_id)
);

-- =============================================
-- SHOWROOMS (from Agent 3)
-- =============================================

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

    -- Verification
    business_license_url TEXT,
    verification_status ENUM('pending', 'verified', 'suspended', 'rejected') DEFAULT 'pending',
    verified_at TIMESTAMP,

    -- Branding
    logo_url TEXT,
    cover_photo_url TEXT,

    -- Settings
    max_members INT DEFAULT 500,
    join_radius_meters INT DEFAULT 500,

    -- Stats
    member_count INT DEFAULT 0,
    weekly_score DECIMAL(10, 2) DEFAULT 0,

    admin_user_id UUID REFERENCES users(user_id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_showroom_city (city),
    INDEX idx_showroom_tier (tier)
);

CREATE TABLE showroom_memberships (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showroom_id UUID REFERENCES showrooms(showroom_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    role ENUM('member', 'co_admin', 'admin') DEFAULT 'member',
    joined_via ENUM('qr_scan', 'invite_link', 'admin_add', 'geo_suggest') NOT NULL,

    join_latitude DECIMAL(10, 8),
    join_longitude DECIMAL(11, 8),

    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(showroom_id, user_id),
    INDEX idx_showroom_mem_user (user_id)
);

CREATE TABLE qr_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showroom_id UUID REFERENCES showrooms(showroom_id) ON DELETE CASCADE,
    token_code VARCHAR(50) UNIQUE NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    use_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_qr_token (token_code)
);

-- =============================================
-- GAMIFICATION
-- =============================================

CREATE TABLE daily_quests (
    quest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    quest_type VARCHAR(50) NOT NULL,
    target_count INT NOT NULL,
    current_count INT DEFAULT 0,

    reward_type ENUM('coins', 'xp') NOT NULL,
    reward_amount INT NOT NULL,

    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,

    date DATE NOT NULL,

    UNIQUE(user_id, quest_type, date),
    INDEX idx_quest_user_date (user_id, date)
);

CREATE TABLE trivia_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    questions JSONB NOT NULL, -- Array of question IDs
    answers JSONB, -- User's answers

    score INT DEFAULT 0,
    coins_earned INT DEFAULT 0,
    xp_earned INT DEFAULT 0,

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    INDEX idx_trivia_user (user_id)
);

-- =============================================
-- CONTENT (FPL Data)
-- =============================================

CREATE TABLE players (
    player_id INT PRIMARY KEY, -- FPL ID

    first_name VARCHAR(50),
    second_name VARCHAR(50),
    web_name VARCHAR(50) NOT NULL,

    team_id INT NOT NULL,
    position ENUM('GK', 'DEF', 'MID', 'FWD') NOT NULL,

    -- Pricing
    now_cost DECIMAL(4, 1) NOT NULL,
    cost_change_event INT DEFAULT 0,
    cost_change_start INT DEFAULT 0,

    -- Stats
    total_points INT DEFAULT 0,
    points_per_game DECIMAL(4, 2) DEFAULT 0,
    minutes INT DEFAULT 0,
    goals_scored INT DEFAULT 0,
    assists INT DEFAULT 0,
    clean_sheets INT DEFAULT 0,

    -- Selection
    selected_by_percent DECIMAL(5, 2) DEFAULT 0,

    -- Status
    status VARCHAR(10) DEFAULT 'a', -- a=available, i=injured, etc.
    news TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_player_team (team_id),
    INDEX idx_player_position (position),
    INDEX idx_player_points (total_points DESC)
);

CREATE TABLE fixtures (
    fixture_id INT PRIMARY KEY,
    gameweek INT NOT NULL,

    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,

    home_score INT,
    away_score INT,

    kickoff_time TIMESTAMP,

    is_finished BOOLEAN DEFAULT FALSE,

    INDEX idx_fixture_gw (gameweek),
    INDEX idx_fixture_kickoff (kickoff_time)
);

CREATE TABLE gameweeks (
    gameweek_id INT PRIMARY KEY,
    season VARCHAR(10) NOT NULL,

    deadline_time TIMESTAMP NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    is_finished BOOLEAN DEFAULT FALSE,

    highest_score INT,
    average_score INT,

    INDEX idx_gw_current (is_current)
);
```

---

## 3. API Specification

### Authentication

```yaml
POST /api/v1/auth/register
  Request:
    phone: "+251911234567"
    password: "securePassword123"
    display_name: "ManagerName"
  Response:
    user_id: "uuid"
    token: "jwt_token"

POST /api/v1/auth/login
  Request:
    phone: "+251911234567"
    password: "securePassword123"
  Response:
    user_id: "uuid"
    token: "jwt_token"
    user: { profile data }

POST /api/v1/auth/verify-phone
  Request:
    phone: "+251911234567"
    code: "123456"
  Response:
    verified: true

POST /api/v1/auth/refresh-token
  Headers:
    Authorization: "Bearer {refresh_token}"
  Response:
    token: "new_jwt_token"
```

### Users & Profile

```yaml
GET /api/v1/users/me
  Response:
    user_id, display_name, avatar_id, xp, level, coins,
    login_streak, achievements[]

PATCH /api/v1/users/me
  Request:
    display_name?: string
    avatar_id?: string
    language?: string
  Response:
    updated user object

GET /api/v1/users/me/stats
  Response:
    total_points, overall_rank, gameweek_points, best_gw,
    transfers_made, leagues_joined

POST /api/v1/users/me/daily-checkin
  Response:
    coins_earned: 25
    xp_earned: 15
    streak: 7
    streak_bonus?: 100
```

### Teams & Squads

```yaml
GET /api/v1/teams/me
  Response:
    team_id, name, budget, total_points,
    squad: [{ player_id, is_bench, is_captain, ... }],
    chips: { wildcard: 2, freehit: 1, ... }

PATCH /api/v1/teams/me
  Request:
    name?: string
    captain_id?: number
    vice_captain_id?: number
  Response:
    updated team

POST /api/v1/teams/me/transfers
  Request:
    transfers: [
      { player_out_id: 123, player_in_id: 456 }
    ]
    chip?: "wildcard" | "freehit"
  Response:
    success: true
    new_budget: 5.2
    cost: 4 # points

POST /api/v1/teams/me/substitute
  Request:
    player_a_id: number
    player_b_id: number
  Response:
    success: true
    formation: "4-4-2"
```

### Leagues

```yaml
GET /api/v1/leagues
  Query:
    type?: string
    city?: string
    page?: number
  Response:
    leagues: [{ league_id, name, type, member_count, ... }]

POST /api/v1/leagues
  Request:
    name: "My League"
    type: "private"
  Response:
    league_id, entry_code

GET /api/v1/leagues/{league_id}
  Response:
    league details, standings[]

POST /api/v1/leagues/{league_id}/join
  Request:
    entry_code?: string
  Response:
    membership_id

GET /api/v1/leagues/{league_id}/standings
  Query:
    page?: number
    gameweek?: number
  Response:
    standings: [{ rank, user_id, display_name, points, ... }]
```

### Contests

```yaml
GET /api/v1/contests
  Query:
    status?: "upcoming" | "active" | "completed"
    type?: string
  Response:
    contests: [{ contest_id, name, entry_fee, prize_structure, ... }]

GET /api/v1/contests/{contest_id}
  Response:
    contest details, my_entry?, leaderboard[]

POST /api/v1/contests/{contest_id}/enter
  Response:
    entry_id
    coins_deducted: 100
    new_balance: 450

POST /api/v1/contests/{contest_id}/claim-prize
  Response:
    prize_coins: 200
    badge?: "champion"
```

### Wallet

```yaml
GET /api/v1/wallet/balance
  Response:
    coins: 500
    pending_coins: 0

GET /api/v1/wallet/transactions
  Query:
    type?: string
    page?: number
  Response:
    transactions: [{ type, amount, description, created_at }]

POST /api/v1/wallet/purchase
  Request:
    bundle_id: "popular"
    provider: "telebirr" | "chapa"
  Response:
    payment_url: "https://..."
    payment_id: "uuid"

POST /api/v1/wallet/webhooks/telebirr
  # Webhook from Telebirr
  Response: 200 OK

POST /api/v1/wallet/webhooks/chapa
  # Webhook from Chapa
  Response: 200 OK
```

### Showrooms

```yaml
GET /api/v1/showrooms
  Query:
    city?: string
    lat?: number
    lng?: number
    radius?: number
  Response:
    showrooms: [{ showroom_id, name, member_count, weekly_score, ... }]

POST /api/v1/showrooms/{showroom_id}/join
  Request:
    qr_token: "ETHFPL-V00123-R7K2M-X9Y"
    latitude: 9.0054
    longitude: 38.7636
  Response:
    membership_id

POST /api/v1/showrooms/scan
  Request:
    qr_token: string
    latitude: number
    longitude: number
    device_fingerprint: string
  Response:
    showroom: { id, name, ... }
    can_join: boolean
    reason?: string

GET /api/v1/showrooms/{showroom_id}/leaderboard
  Response:
    members: [{ rank, user_id, display_name, points }]
```

### Gamification

```yaml
GET /api/v1/gamification/quests
  Response:
    quests: [{ quest_id, type, target, current, reward, is_completed }]

POST /api/v1/gamification/quests/{quest_id}/claim
  Response:
    reward_type: "coins"
    reward_amount: 50

POST /api/v1/gamification/trivia/start
  Response:
    session_id, questions: [{ question_id, question, options }]

POST /api/v1/gamification/trivia/{session_id}/answer
  Request:
    answers: [{ question_id, answer }]
  Response:
    score: 2
    coins_earned: 20
    xp_earned: 15
```

---

## 4. Analytics Event Schema

### Event Structure

```typescript
interface AnalyticsEvent {
  event_name: string;
  user_id: string;
  session_id: string;
  timestamp: string; // ISO 8601
  platform: 'web' | 'ios' | 'android';
  app_version: string;
  properties: Record<string, any>;
}
```

### Core Events

| Event | Trigger | Properties |
|-------|---------|------------|
| `user_registered` | Account created | `method`, `referral_code` |
| `user_logged_in` | Login success | `method` |
| `daily_checkin_completed` | Check-in claimed | `streak`, `coins_earned` |
| `team_created` | First team setup | `team_name` |
| `transfer_made` | Player transfer | `player_in_id`, `player_out_id`, `cost` |
| `captain_changed` | Captain updated | `player_id` |
| `chip_activated` | Chip used | `chip_type` |
| `league_joined` | Joined league | `league_id`, `league_type` |
| `league_created` | Created league | `league_id`, `league_type` |
| `contest_entered` | Contest entry | `contest_id`, `entry_fee` |
| `prize_claimed` | Prize received | `contest_id`, `prize_coins` |
| `coins_purchased` | Payment completed | `bundle_id`, `amount_birr`, `coins` |
| `coins_spent` | Coins used | `spend_type`, `amount` |
| `showroom_joined` | QR scan join | `showroom_id`, `join_method` |
| `trivia_completed` | Trivia session done | `score`, `coins_earned` |
| `quest_completed` | Quest done | `quest_type`, `reward` |
| `minigame_played` | Mini-game session | `game_type`, `score`, `coins_earned` |
| `notification_opened` | Push tap | `notification_type` |
| `screen_viewed` | Page view | `screen_name` |

### Engagement Events

| Event | Properties |
|-------|------------|
| `session_started` | `entry_point` |
| `session_ended` | `duration_seconds`, `screens_viewed` |
| `coffee_hour_claimed` | `bonus_type`, `coins_earned` |
| `streak_milestone` | `streak_days`, `reward` |
| `level_up` | `new_level`, `title` |
| `achievement_unlocked` | `achievement_type` |

### Commerce Events

| Event | Properties |
|-------|------------|
| `purchase_initiated` | `bundle_id`, `provider` |
| `purchase_completed` | `bundle_id`, `amount_birr`, `coins` |
| `purchase_failed` | `bundle_id`, `error_code`, `provider` |
| `survey_completed` | `sponsor_id`, `coins_earned` |

---

## 5. Security & Anti-Fraud Blueprint

### Authentication Security

```yaml
Password Policy:
  - Minimum 8 characters
  - At least 1 number
  - Bcrypt hashing (cost 12)

JWT Configuration:
  - Access token: 15 minutes
  - Refresh token: 30 days
  - Algorithm: RS256
  - Rotation on refresh

Phone Verification:
  - 6-digit OTP via SMS
  - 5 minute expiry
  - Max 3 attempts per phone per hour
```

### Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Team updates | 30 requests | 1 minute |
| Transfers | 10 requests | 1 minute |
| QR scans | 10 requests | 1 hour |
| Coin purchases | 5 requests | 1 hour |
| General API | 100 requests | 1 minute |

### Anti-Fraud Controls

```yaml
Multi-Account Detection:
  - Device fingerprinting (browser + device attributes)
  - Max 2 accounts per device
  - Phone verification required
  - IP-based throttling

QR Join Fraud:
  - GPS proximity verification (500m radius)
  - Mock location detection
  - Rate limit: 5 showroom joins per day
  - Device fingerprint tracking

Contest Fraud:
  - Squad snapshot at entry (no changes after)
  - Transfer pattern analysis
  - Collusion detection (similar squad changes)
  - Prize claiming verification

Payment Fraud:
  - Idempotency keys for all transactions
  - Webhook signature verification
  - Manual review for large purchases (>500 Birr)
  - Refund rate monitoring
```

### Audit Logging

```sql
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
);

-- Log triggers for sensitive operations:
-- coin_transactions, payment_transactions,
-- contest_entries, showroom_memberships, user bans
```

### Data Protection

```yaml
Encryption:
  - At rest: AES-256 (database)
  - In transit: TLS 1.3
  - PII fields: Column-level encryption

PII Handling:
  - Phone numbers: Hashed for lookup, encrypted for display
  - Passwords: Bcrypt (never stored plain)
  - Location: Approximate only (sub-city level)

Data Retention:
  - User data: Until account deletion + 30 days
  - Analytics: 2 years
  - Audit logs: 5 years
  - Payment records: 7 years (compliance)

GDPR-style Rights:
  - Export: GET /api/v1/users/me/export
  - Delete: DELETE /api/v1/users/me (soft delete, then hard delete after 30 days)
```

---

## Key Decisions (Agent 7)

1. **PostgreSQL primary**: Proven, PostGIS support for geo queries
2. **Redis for caching**: Session management, leaderboard caching
3. **ClickHouse for analytics**: High-volume event storage
4. **Microservices-ready**: Services can be extracted as needed
5. **JWT with rotation**: Secure token management

## Assumptions

- Supabase can be used as PostgreSQL provider
- Firebase Cloud Messaging for push notifications
- AWS/GCP or similar cloud infrastructure

## Open Questions

1. Self-hosted vs Supabase for PostgreSQL?
2. Need for message queue (RabbitMQ/Kafka)?
3. CDN strategy for static assets?

---

*Agent 7 Complete. Handoff to Agent 8: UX Lead*
