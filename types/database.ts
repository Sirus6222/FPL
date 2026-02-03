// Database types for Supabase
// These types map to the SQL schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string | null;
          email: string | null;
          display_name: string;
          avatar_id: string;
          level: number;
          xp: number;
          coins: number;
          eth_balance: number;
          favorite_team: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          display_name: string;
          avatar_id?: string;
          level?: number;
          xp?: number;
          coins?: number;
          eth_balance?: number;
          favorite_team?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          display_name?: string;
          avatar_id?: string;
          level?: number;
          xp?: number;
          coins?: number;
          eth_balance?: number;
          favorite_team?: string | null;
          updated_at?: string;
        };
      };
      fantasy_teams: {
        Row: {
          id: string;
          user_id: string;
          season_id: string;
          team_name: string;
          formation: string;
          bank_balance: number;
          total_value: number;
          free_transfers: number;
          total_points: number;
          overall_rank: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          season_id?: string;
          team_name: string;
          formation?: string;
          bank_balance?: number;
          total_value?: number;
          free_transfers?: number;
          total_points?: number;
          overall_rank?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          team_name?: string;
          formation?: string;
          bank_balance?: number;
          total_value?: number;
          free_transfers?: number;
          total_points?: number;
          overall_rank?: number | null;
          updated_at?: string;
        };
      };
      squad_players: {
        Row: {
          id: string;
          team_id: string;
          player_id: number;
          is_captain: boolean;
          is_vice_captain: boolean;
          is_benched: boolean;
          bench_order: number | null;
          purchase_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          player_id: number;
          is_captain?: boolean;
          is_vice_captain?: boolean;
          is_benched?: boolean;
          bench_order?: number | null;
          purchase_price: number;
          created_at?: string;
        };
        Update: {
          is_captain?: boolean;
          is_vice_captain?: boolean;
          is_benched?: boolean;
          bench_order?: number | null;
        };
      };
      leagues: {
        Row: {
          id: string;
          name: string;
          type: 'public' | 'private' | 'h2h' | 'prize' | 'city' | 'company' | 'university';
          entry_fee: number;
          entry_currency: 'etb' | 'coins';
          prize_pool: number;
          min_level: number;
          code: string | null;
          created_by: string | null;
          location: string | null;
          organization: string | null;
          telegram_group_id: string | null;
          status: 'active' | 'closed' | 'upcoming';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'public' | 'private' | 'h2h' | 'prize' | 'city' | 'company' | 'university';
          entry_fee?: number;
          entry_currency?: 'etb' | 'coins';
          prize_pool?: number;
          min_level?: number;
          code?: string | null;
          created_by?: string | null;
          location?: string | null;
          organization?: string | null;
          telegram_group_id?: string | null;
          status?: 'active' | 'closed' | 'upcoming';
          created_at?: string;
        };
        Update: {
          name?: string;
          entry_fee?: number;
          prize_pool?: number;
          status?: 'active' | 'closed' | 'upcoming';
        };
      };
      league_members: {
        Row: {
          id: string;
          league_id: string;
          user_id: string;
          rank: number;
          previous_rank: number | null;
          total_points: number;
          gameweek_points: number;
          h2h_wins: number;
          h2h_draws: number;
          h2h_losses: number;
          joined_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          user_id: string;
          rank?: number;
          previous_rank?: number | null;
          total_points?: number;
          gameweek_points?: number;
          h2h_wins?: number;
          h2h_draws?: number;
          h2h_losses?: number;
          joined_at?: string;
        };
        Update: {
          rank?: number;
          previous_rank?: number | null;
          total_points?: number;
          gameweek_points?: number;
          h2h_wins?: number;
          h2h_draws?: number;
          h2h_losses?: number;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'deposit' | 'withdraw' | 'entry_fee' | 'prize' | 'refund' | 'coin_purchase' | 'coin_spend';
          amount: number;
          currency: 'etb' | 'coins';
          reference: string | null;
          telebirr_reference: string | null;
          status: 'pending' | 'completed' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'deposit' | 'withdraw' | 'entry_fee' | 'prize' | 'refund' | 'coin_purchase' | 'coin_spend';
          amount: number;
          currency?: 'etb' | 'coins';
          reference?: string | null;
          telebirr_reference?: string | null;
          status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
        };
        Update: {
          status?: 'pending' | 'completed' | 'failed';
          telebirr_reference?: string | null;
        };
      };
      login_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_login_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_login_date?: string;
          created_at?: string;
        };
        Update: {
          current_streak?: number;
          longest_streak?: number;
          last_login_date?: string;
        };
      };
      daily_quest_progress: {
        Row: {
          id: string;
          user_id: string;
          quest_id: string;
          date: string;
          is_completed: boolean;
          claimed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_id: string;
          date?: string;
          is_completed?: boolean;
          claimed_at?: string | null;
        };
        Update: {
          is_completed?: boolean;
          claimed_at?: string | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          league_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          message?: string;
        };
      };
      user_avatars: {
        Row: {
          id: string;
          user_id: string;
          avatar_id: string;
          unlocked_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          avatar_id: string;
          unlocked_at?: string;
          is_active?: boolean;
        };
        Update: {
          is_active?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type FantasyTeam = Database['public']['Tables']['fantasy_teams']['Row'];
export type SquadPlayer = Database['public']['Tables']['squad_players']['Row'];
export type League = Database['public']['Tables']['leagues']['Row'];
export type LeagueMember = Database['public']['Tables']['league_members']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type LoginStreak = Database['public']['Tables']['login_streaks']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
