# Ethiopian FPL - Final Integrated Deliverable Pack
## Multi-Agent Orchestrated Specification v1.0.0

**Generated**: 2026-02-04
**Agents Executed**: 9 specialized agents + orchestrator
**Status**: Complete

---

# Executive Summary

## What We're Building

**Ethiopian Fantasy Premier League (FPL Ethiopia)** - A mobile-first fantasy football application for the Ethiopian market that:

1. **Avoids gambling classification** by positioning as a Game of Skill
2. **Uses dual currency** - Coins (virtual) for gameplay, ETB for purchases
3. **Offers Showroom Leagues** - Physical venue integration via QR codes
4. **Provides rich gamification** - XP, levels, streaks, daily quests, mini-games
5. **Supports seasonal tournaments** - AFCON, World Cup modes
6. **Monetizes compliantly** - Freemium + microtransactions, sponsor-guaranteed prizes

## Success Criteria Met

| Criteria | Status | Evidence |
|----------|--------|----------|
| Terminology purge defined | ✅ | Agent 1: 16 prohibited terms with replacements |
| Skill-based justification | ✅ | Agent 1: 10 skill signals mapped |
| Coins economy complete | ✅ | Agent 5: Sources, sinks, bundles, inflation controls |
| Showroom system complete | ✅ | Agent 3: QR flows, scoring, anti-fraud, data model |
| Tournament mode defined | ✅ | Agent 4: Lifecycle, engagement, funnel |
| Technical architecture | ✅ | Agent 7: 12 services, 20+ tables, 50+ endpoints |
| UX flows documented | ✅ | Agent 8: 5 key flows, screen inventory, microcopy |
| Backlog ready | ✅ | Agent 9: 12 epics, 60+ stories with AC |

---

# Pack 1: Integrated Product Spec (MVP)

## Core Features

| Feature | MVP | v1 | vNext |
|---------|-----|-----|-------|
| Phone registration + OTP | ✅ | | |
| Squad building (15 players) | ✅ | | |
| Transfers + budget | ✅ | | |
| Captain selection | ✅ | | |
| Chips (Wildcard, BB, TC, FH) | ✅ | | |
| Points calculation | ✅ | | |
| Private leagues | ✅ | | |
| Public leagues | ✅ | | |
| XP + Levels (1-50) | ✅ | | |
| Daily check-in + streaks | ✅ | | |
| Coin balance | ✅ | | |
| Live scoring | | ✅ | |
| Coin purchases (Telebirr/Chapa) | | ✅ | |
| Skill-based contests | | ✅ | |
| Showroom leagues + QR | | ✅ | |
| Trivia + quests | | ✅ | |
| Mini-games | | ✅ | |
| Tournament mode (AFCON/WC) | | | ✅ |
| Sponsor platform | | | ✅ |
| Data products | | | ✅ |

## Target Metrics

| Metric | MVP Target | v1 Target |
|--------|------------|-----------|
| Registered users | 10,000 | 100,000 |
| DAU/MAU ratio | 20% | 30% |
| Paying users | - | 5% |
| ARPU (payers) | - | 35 Birr/month |
| 7-day retention | 30% | 40% |
| 30-day retention | 15% | 25% |

---

# Pack 2: Compliance Pack

## Terminology Replacement Table

| ❌ Prohibited | ✅ Compliant | Context |
|--------------|--------------|---------|
| Bet/Betting | Entry/Entering | Contest participation |
| Stake | Entry Fee | Cost to join |
| Wager | Compete/Participate | Activity description |
| Odds | Chances/Likelihood | Informational |
| Payout | Prize/Reward | Achievement language |
| Pot/Prize Pool | Guaranteed Prize | Sponsor-funded |
| Jackpot | Grand Prize | Major reward |
| Win (gambling) | Earn/Achieve/Claim | Outcome framing |
| Cash Out | Withdraw Earnings | Financial action |
| Accumulator | Multi-Match Challenge | Game mechanic |
| Tipster | Analyst/Expert | Professional term |
| Punter | Manager/Player | User role |
| House Edge | Platform Fee | Transparent fee |
| Gamble | Compete/Play | Activity verb |
| Lucky | Skilled/Strategic | Skill emphasis |

## Skill-Based Justification

**Fantasy football qualifies as a Game of Skill because:**

1. **Captain Selection** - Strategic analysis of fixtures, form, opponent
2. **Transfer Market** - Budget allocation, price prediction, form analysis
3. **Formation Choice** - Tactical decisions based on fixture difficulty
4. **Chip Timing** - Wildcard, Bench Boost require gameweek analysis
5. **Bench Order** - Priority judgment affects auto-substitutions
6. **Fixture Analysis** - DGW/BGW planning, opponent assessment
7. **Price Tracking** - Market intelligence for optimal transfers
8. **Player Statistics** - Data-driven decisions (xG, xA, clean sheets)
9. **League Strategy** - Differential picks for competitive advantage
10. **Season Planning** - Long-term strategy over 38 gameweeks

**Skill Intensity Score: 9/10** - Multiple independent skill decisions required.

## Compliant Contest Model

```
FINANCIAL FLOW (COMPLIANT):

User ─── Coin Purchase (50 Birr) ───► Platform Revenue

Platform Budget ─── Guaranteed Prizes ───► Top Performers

KEY PRINCIPLE:
Entry fees ≠ Prize money (separate budget lines)
```

## Required Disclaimers

**Contest Screen Footer:**
```
"This is a Game of Skill. Prizes are guaranteed by
[Platform/Sponsor Name] and are not funded by pooled
entry fees. Performance is determined by your strategic
decisions as a fantasy football manager."
```

---

# Pack 3: Economy Pack

## Coin Flow Summary

### Earning (Monthly estimate for active user)

| Source | Coins | % |
|--------|-------|---|
| Daily Check-in | 600 | 18% |
| Coffee Hour Bonus | 400 | 12% |
| Streaks | 400 | 12% |
| Trivia | 600 | 18% |
| Mini-Games | 500 | 15% |
| Contests | 400 | 12% |
| Referrals | 200 | 6% |
| Surveys/Other | 200 | 6% |
| **Total Free** | **~3,300** | 100% |

### Spending (Monthly target)

| Sink | Coins | Notes |
|------|-------|-------|
| Contest Entries | 800-1,200 | Primary sink |
| Cosmetics | 300-500 | Secondary |
| Functional Items | 0-300 | Capped |
| **Target Outflow** | **~1,500** | Balance with earning |

### Purchase Bundles

| Bundle | Coins | Birr | Value/Birr |
|--------|-------|------|------------|
| Starter | 100 | 10 | 10.0 |
| Value | 330 | 25 | 13.2 |
| Popular ⭐ | 675 | 45 | 15.0 |
| Pro | 1,750 | 100 | 17.5 |
| Elite | 4,800 | 250 | 19.2 |
| VIP | 12,500 | 500 | 25.0 |

### Contest Pricing

| Tier | Entry | Prize | Sponsor |
|------|-------|-------|---------|
| Free | 0 | XP + Badges | Platform |
| Micro | 50 | 200 Coins | Platform |
| Standard | 100 | 500 Coins | Platform |
| Premium | 250 | 1,500 Coins | Platform + Sponsor |
| Elite | 500 | 4,000 Coins | Sponsor |
| Grand | 1,000 | 15,000+ Coins | Major Sponsor |

---

# Pack 4: Showroom Pack

## QR Join Flow

```
1. User at venue sees QR code
2. Opens app camera/scanner
3. Scans QR: ETHFPL-V00123-R7K2M-X9Y
4. GPS verification (500m radius)
5. Showroom preview shown
6. User confirms "Join Showroom"
7. +50 XP awarded
```

## Showroom Scoring

```
Weekly Score = Σ(Member GW Points) / Active Members

Where:
- Active = Logged in + 1+ team change in 7 days
- Minimum 5 active for ranking
- Maximum 50 members counted
```

## Anti-Fraud Controls

| Check | Threshold | Action |
|-------|-----------|--------|
| GPS distance | > 500m | Reject |
| Mock location | Detected | Block + warn |
| Joins/day | > 5 | Rate limit |
| Same device | > 2 accounts | Flag |
| Bulk joins | 10+ same minute | Block all |

## Data Model (Key Tables)

- `showrooms` - Venue info, verification status, scores
- `showroom_memberships` - User-venue relationships
- `qr_tokens` - Token management, rotation
- `city_leaderboards` - Aggregate rankings

---

# Pack 5: Tournament Pack

## AFCON/WC Mode Lifecycle

```
PRE-TOURNAMENT (T-14 to T-0)
├── Announcement + early registration bonus
├── Squad builder with tournament players
└── Prediction mini-game

GROUP STAGE (Matchdays 1-3)
├── Daily/match-by-match picks
├── 1 free transfer per matchday
├── Group stage leaderboard
└── Bottom 50% eliminated from contests

KNOCKOUT (R16 → Final)
├── Matchday squads
├── Wildcard refresh at R16
├── Point multipliers (QF=1.5x, SF=2x, F=3x)
└── Final showdown leaderboard

POST-TOURNAMENT (T+1 to T+7)
├── Final rankings + prizes
├── Achievement badges
├── "Transfer to EPL" funnel
└── Feedback survey
```

## Conversion Funnel

| Stage | Target |
|-------|--------|
| Tournament signup | 100% |
| Tournament completion | 60% |
| EPL team creation | 30% |
| EPL active at 30 days | 15% |

---

# Pack 6: Tech Pack

## Architecture Summary

```
┌─────────────────────┐
│  React 19 PWA       │  Client
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  API Gateway        │  Kong/AWS
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  12 Microservices   │
│  Auth, Users, Teams │
│  Leagues, Contests  │
│  Wallet, Showroom   │
│  Gamification, etc. │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  PostgreSQL + Redis │
│  + ClickHouse       │  Data Layer
└─────────────────────┘
```

## Key Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | phone, xp, level, coins |
| `teams` | Fantasy squads | budget, points, chips |
| `squad_players` | Squad composition | player_id, is_captain |
| `leagues` | League definitions | type, entry_fee, sponsor |
| `contests` | Competitions | prize_structure, status |
| `coin_transactions` | Wallet history | type, amount |
| `showrooms` | Venues | location, verification |
| `qr_tokens` | Join codes | token_code, use_count |

## Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Phone registration |
| `/teams/me` | GET/PATCH | Squad management |
| `/teams/me/transfers` | POST | Make transfers |
| `/leagues` | GET/POST | League operations |
| `/contests/{id}/enter` | POST | Contest entry |
| `/wallet/purchase` | POST | Coin purchase |
| `/showrooms/scan` | POST | QR join |
| `/gamification/quests` | GET | Daily quests |

## Analytics Events

| Event | Properties |
|-------|------------|
| `user_registered` | method, referral_code |
| `daily_checkin_completed` | streak, coins_earned |
| `transfer_made` | player_in, player_out, cost |
| `contest_entered` | contest_id, entry_fee |
| `coins_purchased` | bundle_id, amount_birr |
| `showroom_joined` | showroom_id, join_method |

---

# Pack 7: UX Pack

## Key User Flows

1. **Onboarding** (5-7 min) - Phone → OTP → Profile → Squad Builder → Captain → Complete
2. **Daily Check-in** - App open → Modal → Claim reward → Coffee Hour bonus
3. **Showroom Join** - Scan QR → GPS verify → Preview → Join → Success
4. **Contest Entry** - Browse → Details → Confirm → Deduct coins → Success
5. **Coin Purchase** - Shop → Bundle → Payment method → Process → Complete

## Screen Inventory

| Screen | Primary CTA |
|--------|-------------|
| Home | Claim Reward |
| My Team | Save Team |
| Transfers | Confirm Transfers |
| Leagues | Join League |
| Contests | Enter Contest |
| Wallet | Get Coins |
| Profile | Save Changes |

## Compliance Microcopy

**Contest Entry:**
- ✅ "Enter Contest - 100 Coins"
- ❌ "Place Your Bet"

**Prize Display:**
- ✅ "Guaranteed Prizes - Sponsored by [Name]"
- ❌ "Win up to 5000 Coins"

**Reward Claim:**
- ✅ "You earned 3rd place!"
- ❌ "You won 3rd place!"

---

# Pack 8: Delivery Pack

## Release Roadmap

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **MVP** | 8-10 weeks | Core fantasy + gamification |
| **v1.0** | +6-8 weeks | Payments + contests + showrooms |
| **v1.5** | +4-6 weeks | Full mini-games + admin tools |
| **v2.0** | +8-12 weeks | Tournament mode + sponsors |

## Epic Summary

| Epic | Priority | Stories |
|------|----------|---------|
| E1: Auth | P0-MVP | 6 |
| E2: Teams | P0-MVP | 8 |
| E3: Scoring | P0-MVP | 5 |
| E4: Leagues | P0-MVP | 5 |
| E5: Gamification | P0-MVP | 6 |
| E6: Coins | P0-MVP | 6 |
| E7: Contests | P1-v1 | 6 |
| E8: Showrooms | P1-v1 | 6 |
| E9: Mini-Games | P1-v1 | 5 |
| E10: Tournaments | P2 | 5 |
| E11: Sponsors | P2 | 5 |
| E12: Analytics | P3 | 3 |
| **Total** | | **66** |

## Top Risks

| Risk | Mitigation |
|------|------------|
| Gambling classification | Compliance gate, legal review |
| Payment delays | Build coins-only MVP first |
| GPS spoofing | Multi-layer fraud detection |
| Multi-accounting | Phone verify + fingerprinting |
| Low retention | Rich gamification, daily hooks |

---

# Decision Log

| ID | Decision | Rationale | Agent |
|----|----------|-----------|-------|
| D1 | Dual currency (Coins + ETB) | Compliance + flexibility | A1, A5 |
| D2 | Guaranteed prizes | Avoids pooling / gambling | A1 |
| D3 | 500m GPS radius | Balance access + fraud prevention | A3 |
| D4 | 50-member scoring cap | Fair for small venues | A3 |
| D5 | Coffee Hour bonus | Cultural relevance | A2 |
| D6 | Cosmetics > function | Minimize pay-to-win | A2, A5 |
| D7 | Tournament XP carries over | Retention across modes | A4 |
| D8 | PostgreSQL primary | Proven, PostGIS support | A7 |
| D9 | Survey cap 3/week | Prevent user fatigue | A6 |
| D10 | MVP without payments | De-risk monetization | A9 |

---

# Open Questions

| ID | Question | Owner | Priority |
|----|----------|-------|----------|
| Q1 | Legal counsel sign-off required? | PM | P0 |
| Q2 | Age restriction for purchases (18+)? | Legal | P0 |
| Q3 | Spending limits per user per month? | Product | P1 |
| Q4 | Ethiopian calendar in deadline display? | UX | P1 |
| Q5 | Native apps or PWA only for v1? | Tech Lead | P1 |
| Q6 | Go-live target date? | PM | P0 |
| Q7 | Customer support handling at launch? | Ops | P1 |

---

# Dependency Map

```
E1 (Auth) ──────────────────────────────────┐
    │                                        │
    ├──► E2 (Teams) ──► E3 (Scoring)        │
    │         │                              │
    │         └──────────────────────┐       │
    │                                │       │
    ├──► E4 (Leagues) ◄──────────────┤       │
    │         │                      │       │
    ├──► E5 (Gamification)           │       │
    │         │                      │       │
    └──► E6 (Coins) ◄────────────────┘       │
              │                              │
              ├──► E7 (Contests) ◄───────────┤
              │         │                    │
              │         └──► E10 (Tournaments)
              │                              │
              └──► E8 (Showrooms) ◄──────────┘
                        │
                        └──► E11 (Sponsors) ──► E12 (Analytics)
```

---

# Appendix: File Index

| File | Agent | Content |
|------|-------|---------|
| `agent_1_compliance.md` | Compliance | Terms, checklist, microcopy |
| `agent_2_game_systems.md` | Game Systems | XP, levels, streaks, mini-games |
| `agent_3_showroom_leagues.md` | Showroom | QR, scoring, anti-fraud, data model |
| `agent_4_tournament_modes.md` | Tournament | Lifecycle, engagement, ops |
| `agent_5_monetization.md` | Monetization | Coins, bundles, contests, pricing |
| `agent_6_sponsorship.md` | Sponsorship | B2B packages, surveys, data products |
| `agent_7_tech_architecture.md` | Tech | Architecture, schema, APIs, security |
| `agent_8_ux.md` | UX | Flows, screens, microcopy, accessibility |
| `agent_9_delivery.md` | Delivery | Epics, stories, risks, DoD |
| `FINAL_DELIVERABLE_PACK.md` | Orchestrator | This integrated document |

---

**Document Complete**

*Ethiopian FPL Multi-Agent Orchestrated Spec Pack v1.0.0*
*Generated by Claude Agent Orchestrator*
