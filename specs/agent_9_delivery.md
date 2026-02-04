# Agent 9: Delivery Manager / Scrum Lead
## Ethiopian FPL - Execution Backlog & Delivery Plan

*Inherits requirements from all previous agents*

---

## 1. Epics Overview

| Epic ID | Epic Name | Goal | Dependencies | Priority |
|---------|-----------|------|--------------|----------|
| E1 | Core Authentication | Secure user registration & login | None | P0 - MVP |
| E2 | Team Management | Squad building & transfers | E1 | P0 - MVP |
| E3 | Scoring Engine | Points calculation & live updates | E2 | P0 - MVP |
| E4 | Leagues System | Private/public league functionality | E1, E2 | P0 - MVP |
| E5 | Gamification Core | XP, levels, daily check-in, streaks | E1 | P0 - MVP |
| E6 | Coin Economy | Virtual currency + payments | E1, E5 | P0 - MVP |
| E7 | Contests & Prizes | Skill-based competitions | E2, E6 | P1 - v1 |
| E8 | Showroom Leagues | QR-based venue leagues | E1, E4 | P1 - v1 |
| E9 | Mini-Games & Trivia | Engagement features | E5, E6 | P1 - v1 |
| E10 | Tournament Mode | AFCON/WC seasonal modes | E2, E3, E7 | P2 - vNext |
| E11 | Sponsorship Platform | B2B tools & analytics | E7, E8 | P2 - vNext |
| E12 | Advanced Analytics | Data products & insights | E11 | P3 - Future |

---

## 2. User Stories by Epic

### Epic 1: Core Authentication (P0 - MVP)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E1-S1 | As a new user, I want to register with my phone number so I can create an account | - Phone input with +251 prefix<br>- OTP sent via SMS<br>- 6-digit verification<br>- Error handling for invalid/existing phone |
| E1-S2 | As a user, I want to set a password during registration so my account is secure | - Minimum 8 characters<br>- At least 1 number<br>- Password strength indicator<br>- Confirmation field |
| E1-S3 | As a returning user, I want to log in with phone + password so I can access my account | - Phone + password form<br>- "Forgot password" link<br>- JWT token returned<br>- Error messages for invalid credentials |
| E1-S4 | As a user, I want to reset my password via SMS OTP so I can recover my account | - Phone input<br>- OTP verification<br>- New password entry<br>- Success confirmation |
| E1-S5 | As a user, I want to stay logged in so I don't need to re-enter credentials | - 30-day refresh token<br>- Auto-refresh on app open<br>- Secure token storage |
| E1-S6 | As a user, I want to create a manager profile with name and avatar so I have an identity | - Display name input (3-20 chars)<br>- Avatar selection from defaults<br>- Profile preview |

### Epic 2: Team Management (P0 - MVP)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E2-S1 | As a manager, I want to view all available players so I can build my squad | - Player list with filters (position, team, price)<br>- Search by name<br>- Sort by points/price<br>- Pagination |
| E2-S2 | As a manager, I want to add players to my squad so I can compete | - Add button per player<br>- Budget validation<br>- Position limits (2 GK, 5 DEF, 5 MID, 3 FWD)<br>- Max 3 from same team |
| E2-S3 | As a manager, I want to view my current squad on a pitch layout so I can see my team | - Pitch visualization<br>- Starters vs bench<br>- Captain/VC indicators<br>- Points per player |
| E2-S4 | As a manager, I want to select a captain so they earn double points | - Tap player → captain option<br>- Visual indicator (C)<br>- Only one captain at a time |
| E2-S5 | As a manager, I want to make transfers so I can improve my team | - Select player to remove<br>- Search for replacement<br>- Confirm transfer<br>- Free transfer count display |
| E2-S6 | As a manager, I want to swap bench and starting players so I can adjust my formation | - Drag/tap to swap<br>- Formation validation (3+ DEF, 2+ MID, 1+ FWD)<br>- Undo option |
| E2-S7 | As a manager, I want to activate chips (Wildcard, Bench Boost, etc.) so I can gain advantages | - Chip inventory display<br>- Activation confirmation<br>- Chip effects explained<br>- Usage tracking |
| E2-S8 | As a manager, I want to see player details so I can make informed decisions | - Player modal with stats<br>- Fixture list<br>- Price history<br>- Ownership % |

### Epic 3: Scoring Engine (P0 - MVP)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E3-S1 | As a manager, I want to see my gameweek points so I know how my team performed | - Total points display<br>- Points per player<br>- Captain bonus shown<br>- Auto-sub indicators |
| E3-S2 | As a manager, I want to see live points during matches so I can track progress | - Real-time updates (polling)<br>- BPS display<br>- Bonus points added at match end |
| E3-S3 | As a manager, I want to see my total season points so I can track overall progress | - Cumulative total<br>- GW history chart<br>- Best/worst GW |
| E3-S4 | As an admin, I want the system to calculate points correctly based on FPL rules | - All scoring rules implemented<br>- Edge cases handled<br>- Audit trail |
| E3-S5 | As a manager, I want auto-substitutions to work when my starters don't play | - Auto-sub logic per FPL rules<br>- Bench order respected<br>- Formation validity checked |

### Epic 4: Leagues System (P0 - MVP)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E4-S1 | As a manager, I want to create a private league so I can compete with friends | - League name input<br>- Entry code generated<br>- Share options |
| E4-S2 | As a manager, I want to join a league with a code so I can compete | - Code input<br>- Validation<br>- Confirmation with league details |
| E4-S3 | As a manager, I want to view league standings so I can see my rank | - Ranked list of members<br>- Points display<br>- Rank change indicator |
| E4-S4 | As a manager, I want to browse public leagues so I can join communities | - League directory<br>- City filter<br>- Type filter |
| E4-S5 | As a league admin, I want to manage members so I can moderate my league | - Member list<br>- Remove member option<br>- Transfer ownership |

### Epic 5: Gamification Core (P0 - MVP)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E5-S1 | As a manager, I want to earn XP for actions so I can level up | - XP awarded per action<br>- XP notification<br>- Daily caps enforced |
| E5-S2 | As a manager, I want to see my level and progress so I know my status | - Level display<br>- XP bar to next level<br>- Level title |
| E5-S3 | As a manager, I want to check in daily so I can earn rewards | - Daily check-in button<br>- Streak tracking<br>- Reward display |
| E5-S4 | As a manager, I want streak bonuses so I'm rewarded for consistency | - 7/14/21/30 day milestones<br>- Bonus coins<br>- Streak protection (1 day) |
| E5-S5 | As a manager, I want to see my achievements so I feel accomplished | - Achievement list<br>- Locked/unlocked states<br>- Reward per achievement |
| E5-S6 | As a manager, I want Coffee Hour bonuses so I'm encouraged to play at peak times | - Time-based detection (9-10am, 3-4pm EAT)<br>- Bonus multiplier<br>- Visual indicator |

### Epic 6: Coin Economy (P0 - MVP)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E6-S1 | As a manager, I want to see my coin balance so I know my spending power | - Balance in header<br>- Wallet screen detail<br>- Transaction history |
| E6-S2 | As a manager, I want to earn coins from gameplay so I can spend them | - Coins from check-in, quests, contests<br>- Notifications<br>- Balance updates |
| E6-S3 | As a manager, I want to buy coins with real money so I can access more features | - Bundle selection<br>- Telebirr/Chapa integration<br>- Purchase confirmation |
| E6-S4 | As a manager, I want to see my transaction history so I can track spending | - List of transactions<br>- Type/amount/date<br>- Filter options |
| E6-S5 | As the platform, I want to process Telebirr webhooks so payments are verified | - Webhook endpoint<br>- Signature validation<br>- Coin crediting<br>- Error handling |
| E6-S6 | As the platform, I want to process Chapa webhooks so payments are verified | - Webhook endpoint<br>- Signature validation<br>- Coin crediting<br>- Error handling |

### Epic 7: Contests & Prizes (P1 - v1)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E7-S1 | As a manager, I want to browse available contests so I can find competitions | - Contest list<br>- Filters (type, entry fee)<br>- Status indicator |
| E7-S2 | As a manager, I want to enter a contest with coins so I can compete for prizes | - Entry fee deduction<br>- Confirmation<br>- Squad snapshot saved |
| E7-S3 | As a manager, I want to see contest leaderboards so I know my standing | - Ranked participant list<br>- My rank highlighted<br>- Prize threshold indicators |
| E7-S4 | As a manager, I want to claim my prize so I receive my reward | - Prize notification<br>- Claim button<br>- Coins credited<br>- Badge awarded |
| E7-S5 | As an admin, I want to create contests so I can run competitions | - Contest creation form<br>- Prize structure config<br>- Scheduling |
| E7-S6 | As the system, I want to calculate contest rankings so prizes are distributed | - Score aggregation<br>- Tie-breaking rules<br>- Prize distribution logic |

### Epic 8: Showroom Leagues (P1 - v1)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E8-S1 | As a venue owner, I want to register my venue so I can host a showroom | - Registration form<br>- Business license upload<br>- Location verification<br>- Approval workflow |
| E8-S2 | As a venue admin, I want to generate QR codes so customers can join | - QR code generation<br>- Printable format<br>- Rotation option |
| E8-S3 | As a manager, I want to scan a QR code so I can join a showroom league | - Camera access<br>- QR parsing<br>- GPS verification<br>- Join confirmation |
| E8-S4 | As a manager, I want to see my showroom leaderboard so I can compete locally | - Member rankings<br>- Weekly scores<br>- Venue prizes |
| E8-S5 | As a manager, I want to see city-wide showroom rankings so I can see venue competition | - Showroom leaderboard<br>- Aggregate scores<br>- City filter |
| E8-S6 | As the system, I want to detect GPS spoofing so I can prevent fraud | - Mock location detection<br>- Distance validation<br>- Rate limiting<br>- Ban mechanism |

### Epic 9: Mini-Games & Trivia (P1 - v1)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E9-S1 | As a manager, I want to play trivia so I can earn coins | - Question display<br>- Multiple choice<br>- Timer<br>- Score + reward |
| E9-S2 | As a manager, I want to play Penalty Shootout so I can earn coins | - Aim mechanic<br>- 5 shots<br>- Score-based reward<br>- Daily limit |
| E9-S3 | As a manager, I want to play Price Predictor so I can earn coins | - Player selection<br>- Rise/Fall prediction<br>- Result after price change<br>- Reward |
| E9-S4 | As a manager, I want to see daily quests so I have goals | - Quest list<br>- Progress indicators<br>- Claim button<br>- Reset at midnight |
| E9-S5 | As a manager, I want to complete quests for rewards so I'm engaged daily | - Quest completion logic<br>- Auto-tracking<br>- Reward distribution |

### Epic 10: Tournament Mode (P2 - vNext)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E10-S1 | As a manager, I want to opt into AFCON mode so I can play during the tournament | - Tournament mode toggle<br>- Separate squad<br>- Tournament-specific players |
| E10-S2 | As a manager, I want to make daily picks during tournament so I can compete | - Matchday squad selection<br>- 1 free transfer<br>- Deadline per matchday |
| E10-S3 | As a manager, I want to see tournament leaderboards so I know my ranking | - Tournament-specific rankings<br>- Matchday scores<br>- Overall tournament score |
| E10-S4 | As the platform, I want to funnel tournament users to EPL mode so I retain them | - Bridge content<br>- XP/coins carry over<br>- Conversion tracking |
| E10-S5 | As the platform, I want to run tournament-themed content so I increase engagement | - Themed trivia<br>- Predictions mini-game<br>- Achievement badges |

### Epic 11: Sponsorship Platform (P2 - vNext)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E11-S1 | As a sponsor, I want to create a branded league so I can engage users | - Sponsor admin portal<br>- League customization<br>- Branding upload |
| E11-S2 | As a sponsor, I want to fund prizes so users have incentives | - Prize budget allocation<br>- Prize catalog selection<br>- Approval workflow |
| E11-S3 | As a sponsor, I want to see engagement metrics so I know my ROI | - Dashboard with impressions, joins, entries<br>- Export option |
| E11-S4 | As a sponsor, I want to run surveys so I can gather insights | - Survey builder<br>- Targeting options<br>- Response aggregation |
| E11-S5 | As a manager, I want to complete surveys for coins so I earn rewards | - Survey invitation<br>- Question flow<br>- Coin reward<br>- Fraud prevention |

### Epic 12: Advanced Analytics (P3 - Future)

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| E12-S1 | As an admin, I want to see platform-wide metrics so I can monitor health | - User growth<br>- Engagement rates<br>- Revenue metrics |
| E12-S2 | As a data buyer, I want to purchase aggregated insights so I can inform decisions | - Data product catalog<br>- Purchase flow<br>- Delivery mechanism |
| E12-S3 | As the platform, I want to anonymize user data so I maintain privacy | - K-anonymity enforcement<br>- PII stripping<br>- Audit logging |

---

## 3. Release Prioritization

### MVP (v0.1) - 8-10 weeks
*Goal: Core fantasy experience with monetization foundation*

| Epic | Stories | Notes |
|------|---------|-------|
| E1 | All (E1-S1 to E1-S6) | Full auth flow |
| E2 | All (E2-S1 to E2-S8) | Full team management |
| E3 | E3-S1, E3-S3, E3-S4, E3-S5 | Basic scoring (no live) |
| E4 | E4-S1 to E4-S4 | Leagues without admin tools |
| E5 | E5-S1 to E5-S4 | Core gamification |
| E6 | E6-S1 to E6-S4 | Coins without payment integration |

**MVP Deliverable**: Users can register, build teams, join leagues, earn XP/coins.

### v1.0 - 6-8 weeks post-MVP
*Goal: Monetization live, skill-based contests, showroom leagues*

| Epic | Stories | Notes |
|------|---------|-------|
| E3 | E3-S2 | Live scoring |
| E5 | E5-S5, E5-S6 | Achievements, Coffee Hour |
| E6 | E6-S5, E6-S6 | Payment webhooks |
| E7 | All (E7-S1 to E7-S6) | Full contest system |
| E8 | All (E8-S1 to E8-S6) | Full showroom system |
| E9 | E9-S1, E9-S4, E9-S5 | Trivia + quests |

**v1.0 Deliverable**: Full monetization, contests, showroom leagues.

### v1.5 - 4-6 weeks post-v1
*Goal: Enhanced engagement, full mini-games*

| Epic | Stories | Notes |
|------|---------|-------|
| E4 | E4-S5 | League admin tools |
| E9 | E9-S2, E9-S3 | More mini-games |

### vNext (v2.0+) - Post-v1.5
*Goal: Tournament modes, sponsorship platform*

| Epic | Stories | Notes |
|------|---------|-------|
| E10 | All | Tournament mode |
| E11 | All | Sponsorship platform |
| E12 | All | Advanced analytics |

---

## 4. Risk Register

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| R1 | **Compliance classification as gambling** | Medium | Critical | Agent 1 compliance gate, legal review before launch, conservative language |
| R2 | **Payment integration delays** | High | High | Build coin economy without real-money first, stub payment providers |
| R3 | **QR/GPS spoofing abuse** | High | Medium | Multi-layer fraud detection (Agent 3), ban mechanisms |
| R4 | **Multi-accounting for contest prizes** | High | High | Phone verification, device fingerprinting, behavioral analysis |
| R5 | **FPL API rate limits or blocks** | Medium | High | Caching layer, fallback to cached data, negotiate API access |
| R6 | **Low user retention** | Medium | High | Gamification (Agent 2), daily hooks, push notifications |
| R7 | **Payment provider outages** | Medium | Medium | Multiple providers (Telebirr + Chapa), graceful degradation |
| R8 | **Sponsor expectations not met** | Low | Medium | Clear KPI definitions, regular reporting, pilot period |
| R9 | **App store rejection** | Low | High | Compliance language, no gambling terminology, skill-game positioning |
| R10 | **Data breach** | Low | Critical | Encryption, access controls, audit logging, incident response plan |

---

## 5. Definition of Done Checklists

### Feature DoD

- [ ] Code complete and peer-reviewed
- [ ] Unit tests written (>80% coverage for business logic)
- [ ] Integration tests for API endpoints
- [ ] UI matches design specs
- [ ] Accessibility checks passed (contrast, touch targets)
- [ ] Low-bandwidth tested (3G simulation)
- [ ] Amharic translations complete
- [ ] Analytics events implemented
- [ ] Error handling and edge cases covered
- [ ] Documentation updated (API, README)
- [ ] Security review passed (for auth/payment features)
- [ ] Compliance review passed (for contest/prize features)
- [ ] QA sign-off
- [ ] Product owner acceptance

### Sprint DoD

- [ ] All committed stories meet Feature DoD
- [ ] No critical or high-severity bugs
- [ ] Sprint demo completed
- [ ] Retrospective held
- [ ] Backlog refined for next sprint
- [ ] Deployment to staging successful
- [ ] Performance benchmarks met

### Release DoD

- [ ] All Sprint DoD criteria met
- [ ] Regression test suite passed
- [ ] Load testing passed (target: 10,000 concurrent users)
- [ ] Security penetration testing passed
- [ ] Compliance audit passed
- [ ] Release notes prepared
- [ ] Monitoring and alerting configured
- [ ] Rollback plan documented
- [ ] Support team briefed
- [ ] Marketing assets ready
- [ ] App store submission prepared (if applicable)

---

## Sprint Capacity Planning

### Recommended Team Structure

| Role | Count | Focus |
|------|-------|-------|
| Product Manager | 1 | Backlog, stakeholders, compliance |
| Tech Lead | 1 | Architecture, code reviews, unblocks |
| Full-Stack Dev | 3 | Feature development |
| Mobile Dev | 1 | React Native / PWA optimization |
| QA Engineer | 1 | Testing, automation |
| Designer | 1 | UX, visual design, Amharic |
| DevOps | 0.5 | Infrastructure, deployments |

### Sprint Velocity Estimate

- **Sprint length**: 2 weeks
- **Story points per sprint**: 40-50 (team of 5 devs)
- **MVP (150 points)**: ~4 sprints (8 weeks)
- **v1.0 (120 points)**: ~3 sprints (6 weeks)

---

## Key Decisions (Agent 9)

1. **12 epics total**: Clear separation of concerns
2. **MVP is playable**: Users can compete meaningfully without payments
3. **Payments in v1**: De-risk monetization separately
4. **Showroom in v1**: Key differentiator, but not MVP-blocking
5. **Tournament vNext**: Seasonal, can wait for core stability

## Assumptions

- Team of ~6-7 people
- 2-week sprints
- React 19 + TypeScript (web-first, PWA)
- Supabase or similar for backend

## Open Questions

1. Do we need iOS/Android native apps for v1?
2. What's the go-live target date?
3. Who handles customer support at launch?

---

*Agent 9 Complete. Returning to Orchestrator for Final Merge.*
