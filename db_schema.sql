
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
-- Stores user-specific game data linked to their auth account
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    phone_number TEXT,
    team_name TEXT DEFAULT 'My Team',
    wallet_balance DECIMAL(10, 2) DEFAULT 100.00, -- Telebirr Balance
    coins INT DEFAULT 0, -- Game Currency
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Profiles are viewable by everyone (for leaderboards), editable only by owner
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. GAMEWEEKS
-- Stores deadline info and state
CREATE TABLE public.gameweeks (
    id SERIAL PRIMARY KEY,
    gameweek_number INT NOT NULL,
    deadline_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'active', 'processing', 'finished'
    is_current BOOLEAN DEFAULT false
);

-- 3. PLAYERS (Master Data)
-- Real-world players
CREATE TABLE public.players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    team_code TEXT NOT NULL, -- ARS, MCI, etc.
    position TEXT NOT NULL, -- GK, DEF, MID, FWD
    price DECIMAL(4, 1) NOT NULL,
    total_points INT DEFAULT 0,
    form DECIMAL(4, 1) DEFAULT 0.0,
    goals_scored INT DEFAULT 0,
    assists INT DEFAULT 0,
    clean_sheets INT DEFAULT 0,
    minutes_played INT DEFAULT 0,
    image_url TEXT,
    status TEXT DEFAULT 'available' -- available, injured, etc.
);

-- RLS: Players are viewable by everyone, only admins (service role) can update
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players are viewable by everyone" ON public.players FOR SELECT USING (true);

-- 4. USER TEAMS
-- The squad selected by a user for a specific gameweek
CREATE TABLE public.user_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    gameweek_id INT REFERENCES public.gameweeks(id),
    squad_json JSONB NOT NULL, -- Array of 15 player IDs and their state (is_bench, etc.)
    captain_id INT REFERENCES public.players(id),
    vice_captain_id INT REFERENCES public.players(id),
    active_chip TEXT, -- 'wildcard', 'freehit', etc.
    points_scored INT DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS: Users can see and manage their own teams. Others can see locked teams (history).
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own teams" ON public.user_teams USING (auth.uid() = user_id);

-- 5. LEAGUES
CREATE TABLE public.leagues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'public', 'private', 'h2h', 'prize'
    code TEXT UNIQUE, -- For joining private leagues
    admin_id UUID REFERENCES public.profiles(id),
    entry_fee DECIMAL(10, 2) DEFAULT 0,
    prize_pool DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS: Leagues viewable by everyone
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leagues are viewable by everyone" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create leagues" ON public.leagues FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. LEAGUE MEMBERS
CREATE TABLE public.league_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    league_id INT REFERENCES public.leagues(id),
    user_id UUID REFERENCES public.profiles(id),
    total_points INT DEFAULT 0,
    rank INT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(league_id, user_id)
);

-- RLS
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memberships viewable by everyone" ON public.league_members FOR SELECT USING (true);
CREATE POLICY "Users can join leagues" ON public.league_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. TRIGGER: Create Profile on Auth Signup
-- Automatically creates a row in public.profiles when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED DATA (Optional Examples)
INSERT INTO public.gameweeks (gameweek_number, deadline_time, is_current)
VALUES (38, NOW() + INTERVAL '7 days', true);

