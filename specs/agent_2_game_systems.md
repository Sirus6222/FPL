# Agent 2: Game Systems Designer
## Ethiopian FPL - Progression & Retention Systems

*Inherits compliance from Agent 1: Uses "earn/achieve" language, skill-based rewards*

---

## 1. XP System

### XP-Earning Actions

| Action | XP Earned | Daily Cap | Weekly Cap | Anti-Abuse |
|--------|-----------|-----------|------------|------------|
| **Daily Login** | 10 | 10 | 70 | 1x per calendar day (EAT timezone) |
| **Complete Daily Check-in** | 15 | 15 | 105 | Requires app open for 5s minimum |
| **Save Team Changes** | 20 | 40 | - | Max 2 saves per day |
| **Make Transfer** | 25 | 100 | - | Max 4 transfers per day |
| **Set Captain** | 10 | 10 | - | Once per GW |
| **Complete Trivia (any score)** | 15 | 45 | - | Max 3 trivia sessions/day |
| **Trivia Perfect Score (3/3)** | +30 bonus | 30 | - | Skill bonus |
| **Enter Contest** | 50 | 150 | - | Max 3 contests/day |
| **Finish Top 10% in Contest** | 100 | - | 300 | Skill reward |
| **Finish Top 3 in Contest** | 200 | - | 600 | Skill reward |
| **Win Contest (1st Place)** | 300 | - | 900 | Skill reward |
| **Join a League** | 50 | 100 | - | Max 2 leagues/day |
| **Invite Friend (verified)** | 100 | 200 | - | Friend must complete setup |
| **Complete Mini-Game** | 10 | 30 | - | Max 3 mini-games/day |
| **Share to Social** | 20 | 40 | - | Max 2 shares/day |
| **GW Points > 50** | 50 | - | 50 | Once per GW |
| **GW Points > 70** | 100 | - | 100 | Once per GW |
| **Monthly Top 1000 Ethiopia** | 500 | - | - | Monthly milestone |

### XP Anti-Abuse Controls

- **Rate Limiting**: Actions must have 5-second minimum gap
- **Device Fingerprint**: Suspicious multi-account detection
- **IP Throttling**: Max 500 XP per IP per hour
- **Behavioral Analysis**: Flag accounts with XP-only actions (no actual gameplay)
- **Cap Enforcement**: Hard caps prevent grinding exploits

---

## 2. Level Thresholds (1-50)

| Level | Min XP | Total XP Needed | Title | Unlock |
|-------|--------|-----------------|-------|--------|
| 1 | 0 | 0 | Rookie Manager | Default avatar |
| 2 | 100 | 100 | Rookie Manager | Profile frame: Bronze |
| 3 | 250 | 350 | Rookie Manager | Mini-game: Penalty Kicks |
| 4 | 450 | 800 | Rookie Manager | Chat in leagues |
| 5 | 700 | 1,500 | Amateur Manager | Avatar: Ethiopia Kit |
| 6 | 1,000 | 2,500 | Amateur Manager | Streak badge display |
| 7 | 1,400 | 3,900 | Amateur Manager | Custom team name colors |
| 8 | 1,900 | 5,800 | Amateur Manager | Mini-game: Free Kick |
| 9 | 2,500 | 8,300 | Amateur Manager | Profile banner slot |
| 10 | 3,200 | 11,500 | **Semi-Pro Manager** | **Create Private Leagues** |
| 11 | 4,000 | 15,500 | Semi-Pro Manager | Victory animation |
| 12 | 5,000 | 20,500 | Semi-Pro Manager | Profile effects (subtle) |
| 13 | 6,200 | 26,700 | Semi-Pro Manager | Mini-game: Corner Kick |
| 14 | 7,600 | 34,300 | Semi-Pro Manager | League chat reactions |
| 15 | 9,200 | 43,500 | **Pro Manager** | **Verified League Badge** |
| 16 | 11,000 | 54,500 | Pro Manager | Premium avatar set access |
| 17 | 13,000 | 67,500 | Pro Manager | GW summary card style |
| 18 | 15,500 | 83,000 | Pro Manager | Mini-game: Tactics Quiz |
| 19 | 18,500 | 101,500 | Pro Manager | Animated profile frame |
| 20 | 22,000 | 123,500 | **Elite Manager** | **Showroom League Creation** |
| 21-25 | +4,500/lvl | - | Elite Manager | Cosmetic bundles |
| 26-30 | +6,000/lvl | - | Master Manager | Exclusive effects |
| 31-35 | +8,000/lvl | - | Master Manager | Legend frames |
| 36-40 | +10,000/lvl | - | Legend Manager | Custom emotes |
| 41-45 | +12,000/lvl | - | Legend Manager | Hall of Fame eligibility |
| 46-49 | +15,000/lvl | - | Icon Manager | Beta feature access |
| 50 | 500,000 | 500,000 | **Icon Manager** | **Permanent leaderboard badge** |

---

## 3. Reward Unlock Matrix

| Unlock Type | Level Required | Paid Alternative | Notes |
|-------------|----------------|------------------|-------|
| **Status/Cosmetic** ||||
| Basic Avatars | 1-5 | - | Free with progression |
| Premium Avatars | 10+ | 100-500 Coins | Purchasable early |
| Profile Frames | 2-20 | 50-300 Coins | Level unlocks free versions |
| Victory Animations | 11+ | 200 Coins | Cosmetic only |
| Chat Reactions | 14+ | Free at level | Social feature |
| **Privileges** ||||
| Create Private League | 10 | - | Cannot be purchased |
| Verified League Badge | 15 | - | Requires level + moderation |
| Create Showroom League | 20 | - | Requires level + venue approval |
| Beta Feature Access | 46+ | - | Exclusive to high-level |
| **Functional (Capped)** ||||
| Extra Transfer (1/season) | 25 | 500 Coins | Max 1 per season, fairness preserved |
| Bench Boost Chip | Default | 300 Coins | Everyone has 1 free; buy backup |

### Fairness Preservation Rules

1. **No pay-to-win chips**: All chips available to free players
2. **Functional purchases capped**: Max 1 extra transfer purchasable per season
3. **Cosmetics unlimited**: No limit on cosmetic purchases
4. **Level gates for privileges**: Cannot buy your way to league creation

---

## 4. Daily Check-in & Streak Design

### Daily Check-in Flow

```
┌──────────────────────────────────────────────────────────────┐
│  DAILY CHECK-IN (Resets 00:00 EAT)                           │
├──────────────────────────────────────────────────────────────┤
│  Day 1: 10 Coins                                             │
│  Day 2: 15 Coins                                             │
│  Day 3: 20 Coins                                             │
│  Day 4: 25 Coins                                             │
│  Day 5: 30 Coins                                             │
│  Day 6: 40 Coins                                             │
│  Day 7: 50 Coins + Mystery Box (cosmetic)                    │
│  ───────────────────────────────────────────────────────────│
│  Week 2: 10% bonus on all daily rewards                      │
│  Week 3: 15% bonus                                           │
│  Week 4: 20% bonus + Exclusive Monthly Avatar                │
│  ───────────────────────────────────────────────────────────│
│  STREAK PROTECTION: Miss 1 day = warning, streak preserved   │
│                      Miss 2 days = streak resets              │
└──────────────────────────────────────────────────────────────┘
```

### Coffee Hour Bonus ☕

```
Ethiopian Coffee Time: 09:00 - 10:00 EAT (Morning)
                       15:00 - 16:00 EAT (Afternoon)

During Coffee Hour:
  - Daily Check-in XP: 15 → 25 (+67%)
  - Daily Check-in Coins: +10 bonus
  - Trivia rewards: +20% coins
  - Special "Coffee Break" trivia set available
```

### Streak Rewards

| Streak | Reward | Type |
|--------|--------|------|
| 7 days | 100 Coins + Badge | Currency + Status |
| 14 days | 200 Coins + Frame | Currency + Cosmetic |
| 21 days | 300 Coins + Avatar | Currency + Cosmetic |
| 30 days | 500 Coins + Title "Dedicated" | Currency + Status |
| 60 days | 1000 Coins + Animated Frame | Currency + Premium Cosmetic |
| 90 days | 2000 Coins + Exclusive Kit | Currency + Ultra-Rare Cosmetic |

---

## 5. Mini-Games Catalog

### Mini-Game 1: Penalty Shootout 🎯
- **Unlock**: Level 3
- **Time**: 15-20 seconds
- **Rules**: Tap to aim, tap to shoot. 5 penalties.
- **Skill Element**: Timing and aim precision
- **Rewards**:
  - 0-2 goals: 5 Coins
  - 3-4 goals: 10 Coins
  - 5 goals (perfect): 25 Coins + "Clinical" badge
- **Daily Limit**: 3 attempts
- **Data**: ~50KB per session

### Mini-Game 2: Free Kick Master ⚽
- **Unlock**: Level 8
- **Time**: 20-25 seconds
- **Rules**: Swipe to curve ball around wall. 3 attempts.
- **Skill Element**: Gesture accuracy
- **Rewards**:
  - 0 goals: 3 Coins
  - 1 goal: 8 Coins
  - 2 goals: 15 Coins
  - 3 goals: 30 Coins + "Set Piece Specialist" badge
- **Daily Limit**: 3 attempts
- **Data**: ~60KB per session

### Mini-Game 3: Tactics Quiz 🧠
- **Unlock**: Level 18
- **Time**: 30 seconds
- **Rules**: Answer 3 FPL strategy questions
- **Skill Element**: Game knowledge
- **Rewards**:
  - 1/3 correct: 5 Coins
  - 2/3 correct: 15 Coins
  - 3/3 correct: 30 Coins + 30 XP bonus
- **Daily Limit**: 3 attempts
- **Data**: ~20KB per session

### Mini-Game 4: Price Predictor 📈
- **Unlock**: Level 12
- **Time**: 20 seconds
- **Rules**: Predict if 3 players' prices will rise/fall/stay
- **Skill Element**: Market knowledge
- **Rewards**:
  - Per correct prediction: 10 Coins
  - All 3 correct: 50 Coins + "Market Analyst" badge
- **Daily Limit**: 1 attempt (results after price changes)
- **Data**: ~15KB per session

### Mini-Game 5: Captain Roulette 🎰
- **Unlock**: Level 5
- **Time**: 10 seconds
- **Rules**: Pick between 2 captain options; higher scorer wins
- **Skill Element**: Form analysis (shown briefly before choice)
- **Rewards**:
  - Wrong choice: 5 Coins (participation)
  - Correct choice: 20 Coins
- **Daily Limit**: 1 attempt per matchday
- **Data**: ~10KB per session

---

## 6. Economy Balance Notes

### Coin Sources (Inflow)

| Source | Coins/Month (Active User) | % of Inflow |
|--------|---------------------------|-------------|
| Daily Check-in (avg) | 500 | 35% |
| Streak Bonuses | 150 | 10% |
| Mini-Games | 300 | 20% |
| Trivia | 200 | 14% |
| Contest Rewards | 200 | 14% |
| Referrals | 100 | 7% |
| **Total Free Inflow** | **~1,450** | 100% |

### Coin Sinks (Outflow)

| Sink | Coins/Month (Active User) | Notes |
|------|---------------------------|-------|
| Contest Entries | 600-1000 | Primary sink |
| Cosmetic Purchases | 200-500 | Secondary sink |
| Chip Purchases | 0-300 | Occasional |
| **Target Outflow** | **~1,200-1,500** | Balanced with inflow |

### Inflation Controls

1. **Daily Caps**: Hard limits on XP and Coin earning per day
2. **Sink Variety**: Multiple attractive purchase options
3. **Limited-Time Items**: FOMO cosmetics that expire from shop
4. **Seasonal Resets**: Some rewards reset each EPL season
5. **Contest Scaling**: Higher-tier contests require more coins
6. **No Coin Trading**: Coins cannot be transferred between users

### Economy Health Metrics

- **Target**: Free players earn ~75% of coins needed for casual play
- **Conversion Goal**: 5-10% of users purchase coins monthly
- **ARPU Target**: 15-30 Birr/month for purchasers
- **Churn Risk**: If free coin income < 50% of typical sink, adjust sources

---

## Key Decisions (Agent 2)

1. **Leveling is rewarding but not pay-to-skip**: Critical privileges require level
2. **Coffee Hour**: Culturally relevant bonus timing for Ethiopia
3. **Mini-games < 30 seconds**: Respect user time, low data
4. **Cosmetics over function**: Pay mostly for status, not advantage
5. **Streak protection**: 1-day grace period to reduce frustration

## Assumptions

- Average session: 5-10 minutes per day
- Target demographic checks app during commute and evening
- Ethiopian users value status display highly (profile frames, badges)

## Open Questions

1. Should Coffee Hour times adjust for weekends?
2. How many levels before soft cap causes boredom?
3. Need player research on preferred mini-game types

---

*Agent 2 Complete. Handoff to Agent 3: Showroom Leagues Architect*
