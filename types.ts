
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
