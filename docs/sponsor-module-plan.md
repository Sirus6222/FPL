# Sponsor Module + Sponsor/Admin KPI Portal — Implementation Plan

## Overview

Implement a comprehensive Sponsor Module for the Ethiopian FPL app covering:
1. **User-facing sponsor surfaces** — branded leagues/contests, sponsor activations (coin drops, missions, bonus XP), compliance-safe branding
2. **Sponsor Portal** — Permission-gated dashboard for sponsors to view campaign KPIs
3. **Admin Portal** — Platform-wide analytics, sponsor management, audit logs, role management
4. **RBAC** — Role-based access via Supabase RLS + client-side guards
5. **Full spec document** — Consolidating the 8-agent orchestration pack into one implementation-ready markdown

## Architecture Decisions

- **No new backend server** — All RBAC via Supabase RLS policies + `user_roles` table
- **Charts via SVG** — Pure SVG components (following existing `RadarChart.tsx` pattern), no chart library
- **Portal as modal overlay** — Follows existing ShowroomHub/ContestHub full-screen modal pattern, NOT a new bottom nav tab
- **Portal internal navigation** — Horizontal tab bar inside the modal shell (Dashboard/Campaigns/Assets/Analytics)
- **Dev role switcher** — Floating button for testing roles without real auth, gated behind `FEATURE_FLAGS.DEV_ROLE_SWITCHER`
- **Portal access** — Via header icon (when role != 'user') + ProfileModal "Portal Access" section

---

## Implementation Steps

### Step 1: Types Foundation (`/home/user/FPL/types.ts`)

Add after line 682 (after `COMPLIANCE_TERMS`). New sections:

**RBAC Types (~50 lines)**
- `UserRole` = `'user' | 'sponsor_viewer' | 'sponsor_manager' | 'admin_analyst' | 'admin_super'`
- `PermissionAction` — 11 permission strings
- `UserRoleAssignment` — role assignment record
- `ROLE_PERMISSIONS` — constant mapping roles to permissions

**Sponsor Entity Types (~150 lines)**
- `SponsorTier`, `SponsorStatus`, `CampaignStatus`, `CampaignType`, `AssetType`, `PlacementSlot` — string literal union types
- `Sponsor` — company info, branding (logo, colors), contract dates, tier-based entitlements, denormalized stats
- `SponsorCampaign` — type, status, target audience, budget, linked entities (leagues/contests/showrooms), kpi_targets vs kpi_actuals
- `SponsorAsset` — uploaded brand assets (logo, banner, icon)
- `SponsorPlacement` — where assets appear (home_banner, contest_card, league_badge, etc.)
- `SponsorPrize` — coins, ETB voucher, data bundle, physical product
- `SponsorLeagueLink` — branding config for sponsored leagues

**Analytics & Dashboard Types (~80 lines)**
- `SponsorDashboardMetrics` — reach, engagement, campaign performance, ROI, daily trends
- `AdminPlatformMetrics` — DAU/MAU, revenue, sponsor stats, engagement rates, daily trends
- `AnalyticsEventType` — 14 event types
- `AnalyticsEvent` — event record

**Audit Log Types (~30 lines)**
- `AuditAction` — 18 action types
- `AuditLogEntry` — actor, action, resource, sponsor scope, timestamp

**Sponsor Activation Types (~40 lines)**
- `ActivationType` = `'coin_drop' | 'bonus_xp' | 'mission' | 'flash_deal'`
- `SponsorActivation` — user-facing activation with rewards, mission steps, availability, compliance label

### Step 2: Mock Data (`/home/user/FPL/constants.ts`)

Add after existing mock data (~line 1920). All use Ethiopian context:

| Constant | Items | Key Sponsors |
|---|---|---|
| `MOCK_SPONSORS` | 5 | Telebirr (platinum), Coca-Cola (gold), Heineken (silver), Ethio Telecom (platinum), CBE (bronze) |
| `MOCK_SPONSOR_CAMPAIGNS` | 5 | Telebirr Weekly Challenge, Coca-Cola Showroom Activation, Heineken Match Day, Ethio Telecom Survey, CBE Financial Literacy Mission |
| `MOCK_SPONSOR_ASSETS` | 5 | One per sponsor (logo assets) |
| `MOCK_SPONSOR_PLACEMENTS` | 4 | Home banner, contest card, league badge, showroom header |
| `MOCK_SPONSOR_ACTIVATIONS` | 4 | Coin drop, bonus XP, mission, flash deal |
| `MOCK_SPONSOR_DASHBOARD_METRICS` | 1 | Telebirr sponsor dashboard with daily trends |
| `MOCK_ADMIN_PLATFORM_METRICS` | 1 | Platform-wide metrics |
| `MOCK_AUDIT_LOGS` | 6 | Mixed actions across roles/sponsors |
| `FEATURE_FLAGS` | 1 | Master toggles for sponsor module, portals, dev tools |

### Step 3: Database Schema (`/home/user/FPL/db_schema.sql`)

Add after line 128 (after seed data). New tables:

| # | Table | RLS Policy | Key Fields |
|---|---|---|---|
| 8 | `user_roles` | Users see own roles; admin_super manages all | user_id, role, sponsor_id (scoping), granted_by, expires_at |
| 9 | `sponsors` | Viewable by linked sponsor users + admins | name, slug, tier, status, branding, contract dates, budget |
| 10 | `sponsor_campaigns` | Sponsor-scoped via join to user_roles | sponsor_id, type, status, target_audience (JSONB), kpi_targets/actuals (JSONB) |
| 11 | `sponsor_assets` | Sponsor-scoped | sponsor_id, type, url, is_approved |
| 12 | `sponsor_placements` | Sponsor-scoped | campaign_id, slot, asset_id, impressions, clicks |
| 13 | `audit_logs` | Admins + scoped sponsor_managers; insert-only | actor, action, resource_type/id, sponsor_id, details (JSONB) |
| 14 | `analytics_events` | Insert by authenticated; read by admins/sponsors | event_type, user_id, sponsor_id, campaign_id, metadata (JSONB) |

Plus: Materialized view `mv_sponsor_kpis` and RPC function `check_permission()`.

### Step 4: Shared UI Components (new files in `/home/user/FPL/components/`)

| Component | ~Lines | Purpose |
|---|---|---|
| `KPICard.tsx` | 60 | Metric card: value + label + trend arrow + color |
| `SimpleBarChart.tsx` | 100 | Pure SVG bar chart from `{date, value}[]` |
| `SimpleLineChart.tsx` | 100 | Pure SVG line chart from `{date, value}[]` |
| `DateRangeFilter.tsx` | 50 | Period selector pills: Today / 7d / 30d / All |
| `DataTable.tsx` | 150 | Sortable, scrollable table with column headers |
| `SponsorBrandBanner.tsx` | 80 | Reusable sponsor attribution: inline / badge / card variants with compliance text |

### Step 5: User-Facing Sponsor Surfaces

**New components:**

| Component | ~Lines | Purpose |
|---|---|---|
| `SponsorActivationCard.tsx` | 120 | Card showing coin drop/mission/bonus XP with sponsor branding, reward info, claim button |
| `SponsorActivationHub.tsx` | 200 | Full-screen modal listing all active activations, filterable by type |

**Existing component updates:**

| File | Change |
|---|---|
| `ShowroomCard.tsx` (line 51-55) | Replace inline "Sponsored by" badge with `<SponsorBrandBanner variant="badge">` |
| `ContestCard.tsx` (line 64-70) | Replace inline sponsor logo with `<SponsorBrandBanner variant="inline">` |

**App.tsx Home tab** (after Quick Access Grid, ~line 1336):
- Add "Sponsored Rewards" horizontal scroll section with `SponsorActivationCard` components
- "See All" button opens `SponsorActivationHub`

### Step 6: Sponsor Portal

**New components:**

| Component | ~Lines | Purpose |
|---|---|---|
| `SponsorPortal.tsx` | 350 | Main shell: full-screen modal, sponsor header with branding, tab bar (Dashboard/Campaigns/Assets/Analytics), renders sub-component based on active tab. Role-based tab visibility. |
| `SponsorDashboard.tsx` | 300 | KPI card grid (4 cols), line charts (impressions/engagements over time), campaign performance table |
| `SponsorCampaignList.tsx` | 250 | Campaign list with status badges, type filters, "Create Campaign" button (sponsor_manager only) |
| `SponsorCampaignDetail.tsx` | 300 | Single campaign: KPI progress bars (target vs actual), linked entities, prize tracking |
| `SponsorAssetLibrary.tsx` | 200 | Asset grid with upload button (sponsor_manager only), approval status badges |

### Step 7: Admin Portal

**New components:**

| Component | ~Lines | Purpose |
|---|---|---|
| `AdminPortal.tsx` | 300 | Main shell: full-screen modal, tab bar (Dashboard/Sponsors/Audit/Roles), role-gated |
| `AdminDashboard.tsx` | 300 | Platform KPIs (DAU/MAU, revenue, sponsor count), daily trend charts, tier distribution, top sponsors table |
| `AdminSponsorList.tsx` | 200 | All sponsors table: name, tier, status, active campaigns, total spend. Click to view sponsor portal in admin mode. |
| `AdminAuditLog.tsx` | 200 | Filterable audit log: date range, action type, actor, sponsor. Paginated table. |
| `AdminRoleManager.tsx` | 200 | User search + role assignment/revocation (admin_super only). Shows current roles per user. |

### Step 8: App.tsx Integration

**New imports** (top of file):
- Types: `Sponsor`, `SponsorCampaign`, `UserRole`, `SponsorActivation`, etc.
- Constants: `MOCK_SPONSORS`, `MOCK_SPONSOR_CAMPAIGNS`, `MOCK_SPONSOR_ACTIVATIONS`, `MOCK_SPONSOR_DASHBOARD_METRICS`, `MOCK_ADMIN_PLATFORM_METRICS`, `MOCK_AUDIT_LOGS`, `FEATURE_FLAGS`
- Components: `SponsorPortal`, `AdminPortal`, `SponsorActivationCard`, `SponsorActivationHub`, `SponsorBrandBanner`

**New state** (~line 283, after existing hub states):
```
isSponsorPortalOpen, isAdminPortalOpen, isSponsorActivationsOpen
currentUserRole (UserRole), currentSponsorId (string|null)
devRoleOverride (UserRole|null) — DEV MODE only
effectiveRole = devRoleOverride || currentUserRole
```

**Header area**: Add portal icon button (visible when effectiveRole != 'user')

**Home tab** (~after line 1336): Sponsored Rewards carousel section

**Modal section** (~after line 1843): SponsorPortal, AdminPortal, SponsorActivationHub modals

**DEV MODE**: Floating role-switcher in bottom-left corner, hidden behind FEATURE_FLAGS

### Step 9: Spec Document

Create `/home/user/FPL/docs/sponsor-module-spec.md` (~800 lines) consolidating:
1. Sponsor Feature Catalog (Agent 1 output)
2. RBAC + Permission Matrix (Agent 2 output)
3. DB Schema Reference (Agent 3 output)
4. Event Taxonomy + KPI Definitions + SQL Templates (Agent 4 output)
5. API/Supabase Query Spec (Agent 5 output, adapted)
6. User-Facing UX Spec (Agent 6 output)
7. Portal UX Spec (Agent 7 output)
8. Delivery Backlog + Acceptance Criteria (Agent 8 output)

---

## Critical Files

| File | Action | Est. Lines Changed |
|---|---|---|
| `/home/user/FPL/types.ts` | Modify | +350 |
| `/home/user/FPL/constants.ts` | Modify | +500 |
| `/home/user/FPL/db_schema.sql` | Modify | +180 |
| `/home/user/FPL/App.tsx` | Modify | +60 |
| `/home/user/FPL/components/ShowroomCard.tsx` | Modify | ~5 |
| `/home/user/FPL/components/ContestCard.tsx` | Modify | ~5 |
| `/home/user/FPL/components/KPICard.tsx` | Create | ~60 |
| `/home/user/FPL/components/SimpleBarChart.tsx` | Create | ~100 |
| `/home/user/FPL/components/SimpleLineChart.tsx` | Create | ~100 |
| `/home/user/FPL/components/DateRangeFilter.tsx` | Create | ~50 |
| `/home/user/FPL/components/DataTable.tsx` | Create | ~150 |
| `/home/user/FPL/components/SponsorBrandBanner.tsx` | Create | ~80 |
| `/home/user/FPL/components/SponsorActivationCard.tsx` | Create | ~120 |
| `/home/user/FPL/components/SponsorActivationHub.tsx` | Create | ~200 |
| `/home/user/FPL/components/SponsorPortal.tsx` | Create | ~350 |
| `/home/user/FPL/components/SponsorDashboard.tsx` | Create | ~300 |
| `/home/user/FPL/components/SponsorCampaignList.tsx` | Create | ~250 |
| `/home/user/FPL/components/SponsorCampaignDetail.tsx` | Create | ~300 |
| `/home/user/FPL/components/SponsorAssetLibrary.tsx` | Create | ~200 |
| `/home/user/FPL/components/AdminPortal.tsx` | Create | ~300 |
| `/home/user/FPL/components/AdminDashboard.tsx` | Create | ~300 |
| `/home/user/FPL/components/AdminSponsorList.tsx` | Create | ~200 |
| `/home/user/FPL/components/AdminAuditLog.tsx` | Create | ~200 |
| `/home/user/FPL/components/AdminRoleManager.tsx` | Create | ~200 |
| `/home/user/FPL/docs/sponsor-module-spec.md` | Create | ~800 |

**Total: ~5,000 lines of new code across 4 modified + 21 new files**

---

## Verification Plan

1. **Type checking**: Run `npx vite build` — must compile with zero errors
2. **Visual verification**: `npx vite dev` and manually test:
   - Home tab shows "Sponsored Rewards" carousel
   - Clicking "See All" opens SponsorActivationHub
   - ShowroomCard/ContestCard show SponsorBrandBanner correctly
   - DEV role switcher cycles through all 5 roles
   - Sponsor Portal opens with Dashboard/Campaigns/Assets/Analytics tabs
   - Admin Portal opens with Dashboard/Sponsors/Audit/Roles tabs
   - sponsor_viewer can only see Dashboard tab
   - admin_analyst cannot see Admin Role Manager
3. **Compliance check**: Grep for prohibited terms in all new files
4. **Build size**: Verify bundle stays under 1.2MB gzipped (currently ~224KB)
