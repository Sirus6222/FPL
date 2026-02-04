# Agent 5: Monetization & Economy Architect
## Ethiopian FPL - Compliant Freemium Economy

*Inherits: Compliance rules (Agent 1), XP/Coins balance (Agent 2)*

---

## 1. Coins Economy Design

### Coin Earning Sources (Free)

| Source | Coins/Action | Daily Cap | Monthly Estimate |
|--------|--------------|-----------|------------------|
| Daily Check-in | 10-50 (streak) | 50 | 600 |
| Coffee Hour Bonus | +10 | 20 | 400 |
| Weekly Streak (7 days) | 100 | - | 400 |
| Trivia Correct | 10-30 | 90 | 600 |
| Mini-Games | 5-50 | 75 | 500 |
| Contest Top 50% | 20 | - | 200 |
| Contest Top 10% | 100 | - | 200 |
| Friend Referral | 100 | 200 | 200 |
| Survey Completion | 20-50 | - | 100 |
| Achievement Unlock | 25-100 | - | 100 |
| **Total Free Earning** | | | **~3,300/month** |

### Coin Purchase (Paid via Telebirr/Chapa)

| Bundle | Coins | Price (Birr) | Bonus | Value/Birr | Tag |
|--------|-------|--------------|-------|------------|-----|
| Starter | 100 | 10 | 0 | 10.0 | - |
| Value | 300 | 25 | +30 | 13.2 | Best for new users |
| Popular | 600 | 45 | +75 | 15.0 | ⭐ Most Popular |
| Pro | 1,500 | 100 | +250 | 17.5 | Best Value |
| Elite | 4,000 | 250 | +800 | 19.2 | For power users |
| VIP | 10,000 | 500 | +2,500 | 25.0 | Max value |

### Coin Sinks (Spending)

| Sink Category | Price Range | Purpose |
|---------------|-------------|---------|
| **Contest Entry** | 50-2,000 | Primary sink |
| **Cosmetics** | 50-1,000 | Status/personalization |
| **Functional Items** | 200-500 | Capped advantages |
| **Showroom Boosts** | 100-300 | Venue engagement |
| **Gift Coins** | Min 50 | Social feature |

---

## 2. Contest Pricing & Prizes

### Contest Tiers

| Tier | Entry (Coins) | Entry (Birr eq.) | Guaranteed Prize | Prize Tiers |
|------|---------------|------------------|------------------|-------------|
| **Free** | 0 | 0 | XP + Badges | Top 10% |
| **Micro** | 50 | ~5 | 200 Coins | Top 20% |
| **Standard** | 100 | ~10 | 500 Coins | Top 15% |
| **Premium** | 250 | ~25 | 1,500 Coins | Top 10% |
| **Elite** | 500 | ~50 | 4,000 Coins | Top 5% |
| **Grand** | 1,000 | ~100 | 15,000 Coins + Physical | Top 3% |

### Prize Distribution (Standard Contest Example)

```
Entry: 100 Coins
Prize Pool: 500 Coins guaranteed (platform-funded)

Distribution:
- 1st Place: 200 Coins + "Champion" badge
- 2nd Place: 125 Coins
- 3rd Place: 75 Coins
- 4th-5th: 50 Coins each

Break-even for platform at ~40 entrants
Profitable at 50+ entrants
```

### Prize Catalog (Physical/Sponsor)

| Prize | Sponsor | Contest Tier | Quantity |
|-------|---------|--------------|----------|
| Official EPL Jersey | Nike/Adidas | Grand | 1/week |
| Airpods | Telebirr | Elite | 2/month |
| 500 Birr Voucher | Chapa | Premium | 5/week |
| Coffee Set | Local Café | Standard | 10/week |
| Data Bundle | Ethio Telecom | Micro | 50/week |
| Branded Merch | Platform | All | Unlimited |

### Platform Fee Logic

```
Simplified Model:
- Platform retains 100% of entry fees as service revenue
- Prizes are marketing expense (separate budget line)
- No "rake" calculation shown to users
- Displayed as: "Entry: 100 Coins | Prizes: 500 Coins to Top 5"
```

---

## 3. In-App Purchase Catalog

### Cosmetic Items

| Category | Item | Price (Coins) | Rarity |
|----------|------|---------------|--------|
| **Avatars** | Default Kit | Free | Common |
| | Ethiopia Kit | 100 | Common |
| | EPL Team Kits | 200 | Uncommon |
| | Legend Player | 500 | Rare |
| | Golden Manager | 1,000 | Epic |
| | Animated Avatar | 1,500 | Legendary |
| **Frames** | Bronze Border | 50 | Common |
| | Silver Border | 100 | Uncommon |
| | Gold Border | 250 | Rare |
| | Animated Fire | 500 | Epic |
| | Diamond Crown | 1,000 | Legendary |
| **Effects** | Confetti (win) | 100 | Uncommon |
| | Fireworks | 200 | Rare |
| | Lightning Strike | 400 | Epic |
| **Emotes** | Basic Pack (5) | 75 | Common |
| | Football Pack (10) | 150 | Uncommon |
| | Ethiopian Pack (10) | 200 | Rare |
| **Banners** | Stadium View | 100 | Uncommon |
| | City Skyline | 150 | Uncommon |
| | Custom Upload | 300 | Rare |

### Functional Items (Strictly Capped)

| Item | Price (Coins) | Limit | Effect |
|------|---------------|-------|--------|
| **Extra Transfer** | 500 | 1/season | One additional free transfer |
| **Bench Boost Chip** | 300 | 1/season | Extra chip (if already used free one) |
| **Triple Captain Chip** | 300 | 1/season | Extra chip |
| **Wildcard Chip** | 400 | 1/season | Extra chip |
| **Deadline Reminder+** | 50 | Unlimited | Extra notification 1h before deadline |

### Fairness Rules

```
FUNCTIONAL ITEM CAPS:
1. Maximum 1 extra of each chip per season
2. Free players have access to all chip types (1 each)
3. Paid chips provide backup, not exclusive advantage
4. No "pay to skip" mechanics
5. No items that reveal hidden information (e.g., opponent teams)

COSMETIC ITEMS:
- Unlimited purchases allowed
- No gameplay impact
- Status and personalization only
```

---

## 4. Pricing Matrix

### Ethiopian Sachet Economy Alignment

| Price Point (Birr) | Friction Level | Use Case | Conversion Rate |
|--------------------|----------------|----------|-----------------|
| 5-10 | 🟢 Very Low | Impulse purchase, micro-contest | High (15%) |
| 15-25 | 🟢 Low | Casual engagement, value bundle | Medium (8%) |
| 45-50 | 🟡 Medium | Committed player, popular bundle | Medium (5%) |
| 100 | 🟡 Medium-High | Regular player, pro bundle | Low (3%) |
| 250+ | 🔴 High | Power user, elite bundle | Very Low (1%) |

### Recommended Entry Points

| Target User | Suggested First Purchase | Why |
|-------------|--------------------------|-----|
| Curious Browser | 10 Birr (100 coins) | Low risk trial |
| Engaged Free Player | 25 Birr (330 coins) | Value bundle |
| Contest Competitor | 45 Birr (675 coins) | Enough for 6-7 standard contests |
| Showroom Leader | 100 Birr (1,750 coins) | Status cosmetics + contests |

### Seasonal Promotions

| Event | Discount | Duration |
|-------|----------|----------|
| First Purchase | +50% bonus coins | One-time |
| Gameweek 1 | +25% bonus | 3 days |
| AFCON Launch | +30% bonus | 7 days |
| Ethiopian New Year | +40% bonus | 5 days |
| Timkat | +30% bonus | 3 days |
| Black Friday | +50% bonus | 24 hours |

---

## 5. Store & Contest Microcopy

### Compliant Store Language

| Screen | ❌ Avoid | ✅ Use |
|--------|---------|--------|
| Coin Bundle | "Buy coins to bet" | "Get coins to compete" |
| Best Value | "Maximum winnings" | "Best value bundle" |
| Purchase CTA | "Stake now" | "Get Coins" |
| Contest Entry | "Place your bet" | "Enter Contest" |
| Prize Display | "Win up to 10,000" | "Earn up to 10,000 coins" |

### Contest Screen Copy

```
┌─────────────────────────────────────────────────────────────┐
│  WEEKLY MANAGER CHALLENGE                                    │
│  ─────────────────────────────────────────────────────────  │
│  Entry: 100 Coins                                            │
│                                                              │
│  🏆 GUARANTEED PRIZES                                        │
│  1st: 200 Coins + Champion Badge                            │
│  2nd-3rd: 100 Coins                                         │
│  Top 10%: 50 Coins                                          │
│                                                              │
│  👥 4,521 Managers Competing                                 │
│  ⏰ Deadline: Sat 13:30 EAT                                  │
│                                                              │
│  This is a Game of Skill. Prizes guaranteed by              │
│  Fantasy PL Ethiopia. Not funded by entry fees.             │
│                                                              │
│  [Enter Contest]                                             │
└─────────────────────────────────────────────────────────────┘
```

### Purchase Flow Copy

```
Step 1: Select Bundle
"Choose your coin package. Coins never expire!"

Step 2: Payment
"Complete payment via Telebirr or Chapa"

Step 3: Confirmation
"✓ 330 Coins added to your balance!"
"Use coins to enter contests and unlock items."
```

### Prize Claim Copy

```
"Congratulations! You earned 3rd place in the Weekly Challenge!"
"Your reward: 100 Coins + Bronze Badge"

[Claim Reward]

"Keep competing to climb the rankings!"
```

---

## 6. Purchase Flow Integration

### Telebirr Integration

```
Flow:
1. User selects coin bundle
2. App generates payment request
3. Redirect to Telebirr app (deep link)
4. User confirms payment in Telebirr
5. Telebirr sends webhook to our backend
6. Backend verifies and credits coins
7. User sees confirmation in app

Timeouts:
- 5 minute payment window
- Retry available if timeout
- Support escalation after 3 failures
```

### Chapa Integration

```
Flow:
1. User selects coin bundle
2. In-app web view opens Chapa checkout
3. User enters payment details
4. Chapa processes payment
5. Webhook confirms to backend
6. Coins credited, receipt shown

Payment Methods via Chapa:
- Bank transfer
- Mobile money
- Card (limited)
```

### Failed Payment Handling

| Scenario | Response |
|----------|----------|
| Payment timeout | "Payment not completed. Try again?" |
| Insufficient funds | "Payment failed. Check your balance." |
| Network error | "Connection issue. We'll retry automatically." |
| Duplicate charge | Auto-refund + support ticket |
| Webhook delay | "Processing... Coins will appear shortly." |

---

## Revenue Projections

### Assumptions
- 100,000 Monthly Active Users (MAU)
- 5% conversion to paid (5,000 payers)
- Average purchase: 35 Birr/month

### Monthly Revenue Model

| Stream | Users | ARPU | Revenue (Birr) |
|--------|-------|------|----------------|
| Coin Purchases | 5,000 | 35 | 175,000 |
| Contest Fees (net) | 3,000 | 50 | 150,000 |
| Sponsorship | - | - | 100,000 |
| **Total** | | | **425,000 (~$7,500)** |

### Cost of Goods

| Cost | Monthly (Birr) |
|------|----------------|
| Prize Pool | 100,000 |
| Payment Processing (3%) | 10,000 |
| Server/Infra | 25,000 |
| **Net Margin** | **~290,000 (~68%)** |

---

## Key Decisions (Agent 5)

1. **Coin-first economy**: All transactions use virtual currency
2. **Sachet pricing**: 5-10 Birr entry point for mass market
3. **Guaranteed prizes**: Platform-funded, not pooled
4. **Cosmetics over function**: 80% of IAP is cosmetic
5. **Strict caps**: Functional items limited per season

## Assumptions

- Telebirr/Chapa APIs available and reliable
- Ethiopian users comfortable with mobile payments
- Coin value perception: ~10 coins = 1 Birr mental model

## Open Questions

1. Should coins have expiration? (Recommend: No)
2. Gift coin feature: P2P or only purchase-to-gift?
3. Refund policy for mistaken purchases?

---

*Agent 5 Complete. Handoff to Agent 6: Sponsorship + Data Monetization*
