
export enum Position {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  FWD = 'FWD'
}

export enum GameweekStatus {
  ACTIVE = 'ACTIVE',       // Pre-deadline, transfers allowed
  LOCKED = 'LOCKED',       // Matches in progress
  PROCESSING = 'PROCESSING' // Post-match calculations
}

export type ChipType = 'wildcard' | 'freehit' | 'benchboost' | 'triplecaptain';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface AvatarItem {
  id: string;
  name: string;
  url: string;
  min_level: number;
  is_premium: boolean;
  price?: number; // Coin price (0 = free)
}

export interface LevelInfo {
  level: number;
  title: string;
  min_xp: number;
  max_xp: number; // For progress bar calc
  rewards: string[];
}

export interface User {
  user_id: string; // PK
  phone_number: string; // Unique, Indexed
  telegram_id?: string; // Unique, Nullable
  email?: string; // Nullable
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  favorite_team_id: string; // FK
  registration_date: string;
  last_login?: string;
  account_status: 'active' | 'suspended' | 'deleted';
  notification_preferences: {
    deadline_reminder: boolean;
    price_changes: boolean;
    gameweek_results: boolean;
  };
  wallet_balance: number;
  language: 'en' | 'am';
  
  // Gamification Fields
  level: number;
  xp: number;
  next_level_xp: number;
  login_streak: number;
  coins: number; // App currency (non-monetary)
  badges: string[]; // IDs of earned badges
  unlocked_avatars: string[]; // IDs of unlocked avatars
}

export interface DailyQuest {
  id: string;
  label: string;
  is_completed: boolean;
  reward_amount: number;
  reward_type: 'coins' | 'xp';
  icon?: string;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number; // index
}

export interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  timestamp: string;
  is_me: boolean;
  avatar?: string;
}

export interface FantasyTeam {
  team_id: string; // PK
  user_id: string; // FK
  team_name: string;
  formation: string; // e.g. "4-4-2"
  players: number[]; // JSON array of 15 player_ids
  captain_id: number; // FK
  vice_captain_id: number; // FK
  bench_order: number[]; // JSON array
  total_value: number;
  bank_balance: number;
  transfers_made_this_week: number;
  gameweek_points: number;
  total_points: number;
  overall_rank: number;
  created_at: string;
  updated_at: string;
}

// Re-export MatchStats here to avoid circular dependencies if needed by Player,
// but usually it's better to keep it in scoring.ts or here. 
// For simplicity, defining a basic shape here for the Player interface usage.
export interface MatchStatsSummary {
  minutesPlayed: number;
  goalsScored: number;
  assists: number;
  cleanSheet: boolean;
  goalsConceded: number;
  ownGoals: number;
  penaltiesSaved: number;
  penaltiesMissed: number;
  yellowCards: number;
  redCards: number;
  saves: number;
  bonus: number;
  bps: number; // Bonus Points System Score
}

export interface Player {
  id: number; // PK (player_id in schema, mapped here for UI consistency)
  name: string; // display name
  full_name: string;
  team: string; // team_id (FK)
  position: Position;
  price: number; // Current Market Price
  
  // Economy / Market fields
  purchase_price?: number; // Price when user bought them
  chance_of_price_change?: number; // 0-100% (High means about to change)
  price_trend?: 'up' | 'down' | 'stable';

  total_points: number;
  form: number;
  status: 'available' | 'injured' | 'suspended' | 'doubtful';
  
  // Stats
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  matches_played: number; // Added for PPM calculation
  bonus_points: number;
  bps: number; // Current Season BPS or Last Match BPS
  
  // Market
  selected_by_percent: number;
  price_change_this_week?: number;
  
  // UI/Extra
  image: string; // photo_url
  news?: string;
  points_last_gw: number;
  
  // Logic Props (UI only, not in DB table per se, but derived)
  is_bench?: boolean;
  is_captain?: boolean;
  is_vice_captain?: boolean;
  
  // Advanced Stats (Derived or in separate analytics table)
  stats_xg: number;
  stats_xa: number;
  stats_ict: number;
  stats_goals_conceded: number;
  stats_saves?: number;
  
  // Radar Chart Stats (0-100 normalized)
  stats_radar?: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  
  recent_points?: number[];
  projected_points?: number;
  
  // Gameweek specific data
  last_match_stats?: MatchStatsSummary;
  upcoming_fixtures?: Fixture[]; // Added for DGW/BGW logic
}

export interface PremierLeagueTeam {
  team_id: string; // PK
  name: string;
  short_name: string;
  logo_url?: string;
  stadium?: string;
  strength_overall: number;
  strength_attack: number;
  strength_defense: number;
  // UI Helpers
  color?: string;
}

export interface Gameweek {
  gameweek_id: string; // PK
  gameweek_number: number;
  deadline_time: string;
  is_current: boolean;
  is_finished: boolean;
  highest_score?: number;
  average_score?: number;
  most_selected_player_id?: number;
  most_captained_player_id?: number;
}

export interface Fixture {
  fixture_id?: string; // PK
  gameweek: number; // gameweek_id (FK)
  // For UI ticker simplicity we keep opponent/is_home, but DB has home_team_id/away_team_id
  opponent: string; 
  is_home: boolean;
  home_team_id?: string;
  away_team_id?: string;
  kickoff_time?: string;
  home_score?: number;
  away_score?: number;
  status?: 'scheduled' | 'live' | 'finished';
  difficulty: 1 | 2 | 3 | 4 | 5; // Derived from difficulty_home/away based on user team
}

export interface TeamFixtures {
  [teamId: string]: Fixture[];
}

export interface TeamStats {
  id: string; // team_id
  name: string;
  short_name: string;
  goals_scored: number;
  goals_conceded: number;
  clean_sheets: number;
  xg_for: number;
  xg_against: number;
  next_opponent: string;
  next_difficulty: number;
}

export interface League {
  league_id: number; // PK
  name: string; // league_name
  code?: string; // league_code
  type: 'public' | 'private' | 'h2h' | 'prize' | 'city' | 'company' | 'university'; // league_type
  commissioner_user_id?: string; // FK
  entry_fee?: number;
  prize_pool?: number;
  max_members?: number;
  members_count: number; // current_members_count
  telegram_group_id?: string;
  start_gameweek?: number;
  created_at?: string;
  status?: 'active' | 'completed' | 'cancelled';
  
  // Localized Fields
  location?: string;
  organization?: string;
  
  // UI Helpers for current user context
  rank: number;
  rank_change: number;
  user_points?: number;
  user_h2h_record?: string; // "W-D-L"
  user_h2h_points?: number; // 3 pts for win, 1 for draw
  manager_of_month?: string;
  min_level?: number; // Leveling Requirement
}

export interface LeagueMembership {
  membership_id: string; // PK
  league_id: number; // FK
  user_id: string; // FK
  joined_at: string;
  rank: number;
  total_points: number;
  h2h_wins?: number;
  h2h_draws?: number;
  h2h_losses?: number;
}

export interface LeagueMember {
  user_id: string;
  team_name: string;
  manager_name: string;
  rank: number;
  total_points: number;
  gameweek_points: number;
  rank_change: number; // Positive = Green Arrow
  is_me: boolean;
}

export interface LeagueMatchup {
  id: string;
  gameweek: number;
  home_team: LeagueMember;
  away_team: LeagueMember;
  home_score: number;
  away_score: number;
  status: 'live' | 'finished' | 'scheduled';
}

export interface PotInfo {
  season_pot: number;
  weekly_pot: number;
  last_week_winner: string;
  last_week_payout: number;
  my_winnings_balance: number;
}

export interface Transaction {
  transaction_id: string; // PK
  user_id?: string; // FK
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize' | 'refund' | 'bonus';
  amount: number;
  currency: 'ETB';
  status: 'pending' | 'completed' | 'failed';
  telebirr_reference?: string;
  description?: string;
  created_at: string;
  completed_at?: string;
}

export interface Transfer {
  transfer_id: string; // PK
  team_id: string; // FK
  gameweek_id: string; // FK
  player_in_id: number; // FK
  player_out_id: number; // FK
  transfer_cost: number;
  timestamp: string;
}

export interface Notification {
  notification_id: string; // PK
  user_id: string; // FK
  type: 'deadline' | 'rank_change' | 'prize' | 'injury' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  telegram_sent: boolean;
  created_at: string;
}

export interface RankHistory {
  gameweek: number;
  rank: number;
}

// =============================================
// SHOWROOM LEAGUES (from Spec Pack - Agent 3)
// Phase 2: Primary + Secondary Slots
// =============================================

export type ShowroomVenueType = 'coffee_shop' | 'sports_bar' | 'betting_shop' | 'university' | 'corporate' | 'stadium';
export type ShowroomTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type ShowroomVerificationStatus = 'pending' | 'verified' | 'suspended' | 'rejected';
export type ShowroomMembershipType = 'PRIMARY' | 'SECONDARY';
export type ShowroomSlotUnlockSource = 'LEVEL' | 'PURCHASE';

export interface Showroom {
  showroom_id: string;
  name: string;
  slug: string;
  venue_type: ShowroomVenueType;
  tier: ShowroomTier;

  // Location
  address?: string;
  city: string;
  sub_city?: string;
  woreda?: string;
  latitude?: number;
  longitude?: number;

  // Verification
  business_license_url?: string;
  verification_status: ShowroomVerificationStatus;
  verified_at?: string;

  // Branding
  logo_url?: string;
  cover_photo_url?: string;
  description?: string;

  // Settings
  max_members: number;
  join_radius_meters: number;
  is_public: boolean;

  // Stats
  member_count: number;
  primary_member_count: number;
  active_member_count: number;
  weekly_score: number;
  city_rank?: number;

  // Admin
  admin_user_id?: string;

  created_at: string;
  updated_at: string;
}

export interface ShowroomMembership {
  membership_id: string;
  showroom_id: string;
  user_id: string;
  membership_type: ShowroomMembershipType;
  slot_index: 0 | 1 | 2; // 0=PRIMARY, 1=Secondary#1, 2=Secondary#2
  role: 'member' | 'co_admin' | 'admin';
  joined_via: 'qr_scan' | 'invite_link' | 'admin_add' | 'geo_suggest';
  join_latitude?: number;
  join_longitude?: number;
  switch_locked_until?: string; // ISO timestamp — cooldown expiry
  is_active: boolean;
  last_active_at: string;
  points_contributed_this_gw: number;
  created_at: string;
}

// Phase 2: Slot unlock tracking
export interface ShowroomSlot {
  slot_index: 1 | 2;
  is_unlocked: boolean;
  unlock_source?: ShowroomSlotUnlockSource;
  unlock_level?: number;
  unlocked_at?: string;
  wallet_tx_id?: string;
}

// Phase 2: User's complete showroom state
export interface UserShowroomState {
  primary: (ShowroomMembership & { showroom: Showroom }) | null;
  secondaries: (ShowroomMembership & { showroom: Showroom })[];
  slots: {
    slot_1: ShowroomSlot | null;
    slot_2: ShowroomSlot | null;
  };
}

export interface QRToken {
  token_id: string;
  showroom_id: string;
  token_code: string; // Format: ETHFPL-V00123-R7K2M-X9Y
  token_type: 'permanent' | 'temporary' | 'single_use';
  is_active: boolean;
  expires_at?: string;
  max_uses?: number;
  use_count: number;
  created_at: string;
}

export interface ShowroomLeaderboardEntry {
  showroom_id: string;
  name: string;
  logo_url?: string;
  rank: number;
  weekly_score: number;
  member_count: number;
  primary_member_count: number;
  active_members: number;
}

// Phase 2: Slot pricing config
export const SHOWROOM_SLOT_PRICING = {
  slot_1: {
    slot_index: 1 as const,
    level_requirement: 10,
    coin_price: 100,
    birr_equivalent: 10,
  },
  slot_2: {
    slot_index: 2 as const,
    level_requirement: 25,
    coin_price: 400,
    birr_equivalent: 40,
  },
} as const;

// Phase 2: Showroom hub matchday data
export interface ShowroomHubData {
  showroom: Showroom;
  membership_type: ShowroomMembershipType;
  members: ShowroomHubMember[];
  weekly_score: number;
  city_rank?: number;
  contributes_to_rivalry: boolean;
}

export interface ShowroomHubMember {
  user_id: string;
  display_name: string;
  avatar_id: string;
  gameweek_points: number;
  total_points: number;
  rank: number;
  rank_change: number;
  is_primary_member: boolean;
}

// Phase 2: Audit event types
export type ShowroomAuditEventType =
  | 'JOIN'
  | 'LEAVE'
  | 'SET_PRIMARY'
  | 'SWITCH_PRIMARY'
  | 'SWITCH_SECONDARY'
  | 'SLOT_UNLOCK_LEVEL'
  | 'SLOT_UNLOCK_PURCHASE'
  | 'CHECKIN'
  | 'COOLDOWN_RESET'
  | 'ADMIN_ACTION'
  | 'SHOWROOM_SUSPENDED';

// =============================================
// CONTESTS & COMPETITIONS (from Spec Pack - Agent 5)
// =============================================

export type ContestType = 'free' | 'micro' | 'standard' | 'premium' | 'elite' | 'grand';
export type ContestStatus = 'upcoming' | 'active' | 'calculating' | 'completed' | 'cancelled';

export interface ContestPrize {
  rank_range: string; // e.g., "1", "2-3", "4-10", "top_10%"
  coins: number;
  badge_id?: string;
  physical_prize?: string;
}

export interface Contest {
  contest_id: string;
  name: string;
  description?: string;
  type: ContestType;

  // Entry
  entry_fee_coins: number;
  max_entries?: number;

  // Prizes
  prize_structure: ContestPrize[];
  total_prize_pool_coins: number;
  sponsor_name?: string;

  // Timing
  gameweek?: number;
  start_time: string;
  end_time: string;

  // Status
  status: ContestStatus;
  entry_count: number;

  // User-specific
  user_entered?: boolean;
  user_rank?: number;
  user_prize?: number;

  created_at: string;
}

export interface ContestEntry {
  entry_id: string;
  contest_id: string;
  user_id: string;
  team_id: string;
  squad_snapshot: Player[];
  points: number;
  rank?: number;
  prize_coins: number;
  prize_claimed: boolean;
  entered_at: string;
}

// =============================================
// MINI-GAMES (from Spec Pack - Agent 2)
// =============================================

export type MiniGameType = 'penalty_shootout' | 'free_kick' | 'tactics_quiz' | 'price_predictor' | 'captain_roulette';

export interface MiniGameConfig {
  id: MiniGameType;
  name: string;
  description: string;
  unlock_level: number;
  daily_limit: number;
  time_seconds: number;
  data_kb: number;
}

export interface MiniGameSession {
  session_id: string;
  user_id: string;
  game_type: MiniGameType;
  score: number;
  max_score: number;
  coins_earned: number;
  xp_earned: number;
  completed_at: string;
}

export interface PenaltyShootoutState {
  shots_taken: number;
  goals_scored: number;
  current_aim: { x: number; y: number };
}

export interface PricePrediction {
  player_id: number;
  player_name: string;
  current_price: number;
  prediction: 'rise' | 'fall' | 'stay';
  actual_result?: 'rise' | 'fall' | 'stay';
  correct?: boolean;
}

// =============================================
// SURVEYS & SPONSORSHIP (from Spec Pack - Agent 6)
// =============================================

export interface Survey {
  survey_id: string;
  sponsor_id?: string;
  sponsor_name: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  reward_coins: number;
  estimated_time_seconds: number;
  is_active: boolean;
  expires_at?: string;
}

export interface SurveyQuestion {
  question_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'rating' | 'text';
  options?: string[];
  is_required: boolean;
}

export interface SurveyResponse {
  response_id: string;
  survey_id: string;
  user_id: string;
  answers: { question_id: string; answer: string | number }[];
  coins_earned: number;
  completed_at: string;
}

// =============================================
// COFFEE HOUR & TIME-BASED BONUSES (from Spec Pack - Agent 2)
// =============================================

export interface CoffeeHourConfig {
  morning_start: string; // "09:00"
  morning_end: string;   // "10:00"
  afternoon_start: string; // "15:00"
  afternoon_end: string;   // "16:00"
  bonus_coins: number;
  bonus_xp_multiplier: number;
}

// =============================================
// TOURNAMENT MODE (from Spec Pack - Agent 4)
// =============================================

export type TournamentType = 'afcon' | 'world_cup' | 'champions_league' | 'europa_league';
export type TournamentPhase = 'pre' | 'group_stage' | 'knockout' | 'post';

export interface Tournament {
  tournament_id: string;
  name: string;
  type: TournamentType;
  phase: TournamentPhase;
  start_date: string;
  end_date: string;
  is_active: boolean;
  current_matchday?: number;
  total_matchdays: number;
}

export interface TournamentEntry {
  entry_id: string;
  tournament_id: string;
  user_id: string;
  total_points: number;
  rank?: number;
  matchday_scores: { matchday: number; points: number }[];
}

// =============================================
// COIN BUNDLES (from Spec Pack - Agent 5)
// =============================================

export interface CoinBundle {
  bundle_id: string;
  name: string;
  coins: number;
  bonus_coins: number;
  price_birr: number;
  tag?: 'popular' | 'best_value' | 'starter';
  is_active: boolean;
}

// =============================================
// XP ACTIONS (from Spec Pack - Agent 2)
// =============================================

export interface XPAction {
  action_type: string;
  xp_amount: number;
  daily_cap: number;
  description: string;
}

// =============================================
// COMPLIANCE TERMINOLOGY (from Spec Pack - Agent 1)
// =============================================

export const COMPLIANCE_TERMS = {
  // Gambling terms → Compliant replacements
  prohibited: ['bet', 'betting', 'stake', 'wager', 'odds', 'payout', 'pot', 'jackpot', 'cash out', 'accumulator', 'tipster', 'punter', 'house edge', 'gamble', 'lucky'],
  replacements: {
    'bet': 'entry',
    'betting': 'entering',
    'stake': 'entry fee',
    'wager': 'compete',
    'odds': 'chances',
    'payout': 'reward',
    'pot': 'guaranteed prize',
    'jackpot': 'grand prize',
    'cash out': 'withdraw earnings',
    'accumulator': 'multi-match challenge',
    'tipster': 'analyst',
    'punter': 'manager',
    'house edge': 'platform fee',
    'gamble': 'compete',
    'lucky': 'skilled',
    'win': 'earn'
  }
} as const;

// =============================================
// RBAC & PERMISSIONS (Sponsor Module)
// =============================================

export type UserRole = 'user' | 'sponsor_viewer' | 'sponsor_manager' | 'admin_analyst' | 'admin_super';

export type PermissionAction =
  | 'sponsor:view_dashboard'
  | 'sponsor:manage_campaigns'
  | 'sponsor:manage_assets'
  | 'sponsor:manage_surveys'
  | 'sponsor:view_analytics'
  | 'sponsor:export_data'
  | 'admin:view_all_sponsors'
  | 'admin:manage_users'
  | 'admin:view_platform_analytics'
  | 'admin:manage_feature_flags'
  | 'admin:view_audit_logs';

export interface UserRoleAssignment {
  assignment_id: string;
  user_id: string;
  role: UserRole;
  sponsor_id?: string;
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  user: [],
  sponsor_viewer: ['sponsor:view_dashboard', 'sponsor:view_analytics'],
  sponsor_manager: [
    'sponsor:view_dashboard', 'sponsor:manage_campaigns',
    'sponsor:manage_assets', 'sponsor:manage_surveys',
    'sponsor:view_analytics', 'sponsor:export_data'
  ],
  admin_analyst: [
    'admin:view_all_sponsors', 'admin:view_platform_analytics',
    'admin:view_audit_logs'
  ],
  admin_super: [
    'admin:view_all_sponsors', 'admin:manage_users',
    'admin:view_platform_analytics', 'admin:manage_feature_flags',
    'admin:view_audit_logs', 'sponsor:view_dashboard',
    'sponsor:manage_campaigns', 'sponsor:manage_assets',
    'sponsor:manage_surveys', 'sponsor:view_analytics',
    'sponsor:export_data'
  ]
};

// =============================================
// SPONSOR ENTITIES
// =============================================

export type SponsorTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type SponsorStatus = 'pending' | 'active' | 'suspended' | 'churned';
export type CampaignStatus = 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignType = 'branded_league' | 'contest_sponsorship' | 'showroom_activation' | 'survey' | 'coin_drop' | 'bonus_xp' | 'mission';
export type AssetType = 'logo' | 'banner' | 'icon' | 'video_thumbnail' | 'splash_screen';
export type PlacementSlot =
  | 'home_banner' | 'contest_card' | 'league_badge'
  | 'showroom_header' | 'survey_header' | 'mini_game_interstitial'
  | 'coin_shop_featured' | 'notification_sponsor';

export interface Sponsor {
  sponsor_id: string;
  name: string;
  slug: string;
  tier: SponsorTier;
  status: SponsorStatus;
  company_name: string;
  industry: string;
  contact_email: string;
  contact_phone?: string;
  logo_url: string;
  primary_color: string;
  secondary_color?: string;
  contract_start: string;
  contract_end: string;
  monthly_budget_birr: number;
  prize_budget_birr: number;
  max_leagues: number;
  max_campaigns: number;
  has_push_notifications: boolean;
  has_survey_access: boolean;
  has_showroom_activation: boolean;
  has_realtime_dashboard: boolean;
  total_impressions: number;
  total_engagements: number;
  active_campaigns_count: number;
  created_at: string;
  updated_at: string;
}

export interface SponsorCampaign {
  campaign_id: string;
  sponsor_id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  target_audience?: {
    min_level?: number;
    max_level?: number;
    cities?: string[];
    venue_types?: string[];
  };
  budget_coins: number;
  budget_birr: number;
  prizes_allocated: SponsorPrize[];
  start_date: string;
  end_date: string;
  linked_league_ids?: string[];
  linked_contest_ids?: string[];
  linked_showroom_ids?: string[];
  linked_survey_id?: string;
  kpi_targets: {
    impressions?: number;
    engagements?: number;
    league_joins?: number;
    contest_entries?: number;
    survey_completions?: number;
  };
  kpi_actuals: {
    impressions: number;
    engagements: number;
    league_joins: number;
    contest_entries: number;
    survey_completions: number;
  };
  created_at: string;
  updated_at: string;
}

export interface SponsorAsset {
  asset_id: string;
  sponsor_id: string;
  type: AssetType;
  name: string;
  url: string;
  alt_text: string;
  width?: number;
  height?: number;
  file_size_kb?: number;
  is_approved: boolean;
  uploaded_at: string;
}

export interface SponsorPlacement {
  placement_id: string;
  campaign_id: string;
  sponsor_id: string;
  slot: PlacementSlot;
  asset_id: string;
  click_through_url?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface SponsorPrize {
  prize_id: string;
  campaign_id: string;
  sponsor_id: string;
  name: string;
  description: string;
  type: 'coins' | 'etb_voucher' | 'data_bundle' | 'physical_product' | 'experience';
  value_birr: number;
  value_coins?: number;
  quantity: number;
  quantity_claimed: number;
  image_url?: string;
}

export interface SponsorLeagueLink {
  link_id: string;
  sponsor_id: string;
  campaign_id: string;
  league_id: number;
  branding_config: {
    show_logo: boolean;
    show_banner: boolean;
    custom_name_prefix?: string;
    custom_color?: string;
  };
  is_active: boolean;
  created_at: string;
}

// =============================================
// SPONSOR ANALYTICS & KPI DASHBOARDS
// =============================================

export interface DailyDataPoint {
  date: string;
  value: number;
}

export interface SponsorDashboardMetrics {
  sponsor_id: string;
  period: 'today' | '7d' | '30d' | 'all_time';
  total_impressions: number;
  unique_users_reached: number;
  total_engagements: number;
  engagement_rate: number;
  avg_session_duration_seconds: number;
  active_campaigns: number;
  total_campaigns: number;
  campaign_completion_rate: number;
  sponsored_league_members: number;
  league_join_rate: number;
  sponsored_contest_entries: number;
  contest_entry_rate: number;
  survey_completions: number;
  survey_completion_rate: number;
  avg_survey_score: number;
  cost_per_engagement_birr: number;
  cost_per_impression_birr: number;
  daily_impressions: DailyDataPoint[];
  daily_engagements: DailyDataPoint[];
}

export interface AdminPlatformMetrics {
  period: 'today' | '7d' | '30d' | 'all_time';
  total_users: number;
  dau: number;
  mau: number;
  dau_mau_ratio: number;
  new_registrations: number;
  total_sponsor_revenue_birr: number;
  total_coin_purchases_birr: number;
  arpu_birr: number;
  total_sponsors: number;
  active_sponsors: number;
  sponsor_retention_rate: number;
  avg_sessions_per_day: number;
  avg_session_duration_seconds: number;
  contest_participation_rate: number;
  showroom_checkin_rate: number;
  sponsor_tier_distribution: { tier: SponsorTier; count: number }[];
  top_sponsors_by_spend: { sponsor_id: string; name: string; spend: number }[];
  daily_active_users: DailyDataPoint[];
  daily_revenue: DailyDataPoint[];
}

export type AnalyticsEventType =
  | 'sponsor_impression' | 'sponsor_click' | 'sponsor_engagement'
  | 'campaign_view' | 'league_join_sponsored' | 'contest_enter_sponsored'
  | 'survey_start' | 'survey_complete' | 'survey_skip'
  | 'coin_drop_claim' | 'bonus_xp_earn' | 'mission_complete'
  | 'placement_impression' | 'placement_click';

export interface AnalyticsEvent {
  event_id: string;
  event_type: AnalyticsEventType;
  user_id: string;
  sponsor_id?: string;
  campaign_id?: string;
  placement_id?: string;
  metadata?: Record<string, string | number>;
  timestamp: string;
}

// =============================================
// AUDIT LOGS
// =============================================

export type AuditAction =
  | 'sponsor_created' | 'sponsor_updated' | 'sponsor_suspended'
  | 'campaign_created' | 'campaign_updated' | 'campaign_activated' | 'campaign_paused'
  | 'asset_uploaded' | 'asset_approved' | 'asset_rejected'
  | 'placement_created' | 'placement_updated'
  | 'survey_created' | 'survey_published'
  | 'role_granted' | 'role_revoked'
  | 'data_exported' | 'dashboard_viewed'
  | 'prize_allocated' | 'prize_distributed';

export interface AuditLogEntry {
  log_id: string;
  actor_user_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: AuditAction;
  resource_type: 'sponsor' | 'campaign' | 'asset' | 'placement' | 'survey' | 'role' | 'prize';
  resource_id: string;
  resource_name?: string;
  sponsor_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  timestamp: string;
}

// =============================================
// SPONSOR ACTIVATIONS (User-Facing)
// =============================================

export type ActivationType = 'coin_drop' | 'bonus_xp' | 'mission' | 'flash_deal';

export interface SponsorActivation {
  activation_id: string;
  sponsor_id: string;
  sponsor_name: string;
  sponsor_logo_url: string;
  sponsor_color: string;
  campaign_id: string;
  type: ActivationType;
  title: string;
  description: string;
  reward_coins?: number;
  reward_xp?: number;
  reward_badge_id?: string;
  mission_steps?: {
    step_id: string;
    description: string;
    action_type: string;
    target_id?: string;
    is_completed: boolean;
  }[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  max_claims?: number;
  claims_count: number;
  user_claimed?: boolean;
  compliance_label: string;
}

// =============================================
// FEATURE FLAGS
// =============================================

export interface FeatureFlags {
  SPONSOR_MODULE: boolean;
  SPONSOR_ACTIVATIONS: boolean;
  SPONSOR_PORTAL: boolean;
  ADMIN_PORTAL: boolean;
  DEV_ROLE_SWITCHER: boolean;
  SPONSOR_PUSH_NOTIFICATIONS: boolean;
  REAL_ANALYTICS: boolean;
}
