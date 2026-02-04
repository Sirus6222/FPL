
import { createClient } from '@supabase/supabase-js';

// Configuration provided for Ethiopian FPL Project
const supabaseUrl = 'https://gfsehgzgkfizdsgyjswl.supabase.co';
const supabaseKey = 'sb_secret_AlODl431oZgztgYeDW5bQQ_b0D-hURL';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper types for database tables
export type Tables = {
  profiles: {
    id: string;
    full_name: string | null;
    team_name: string | null;
    wallet_balance: number;
    level: number;
    xp: number;
  };
  players: {
    id: number;
    name: string;
    team: string;
    position: string;
    price: number;
    total_points: number;
  };
  leagues: {
    id: number;
    name: string;
    type: string;
    code: string | null;
  };
};
