-- Ethiopian FPL Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- DROP EXISTING TABLES (Fresh Install)
-- ==========================================
DROP TABLE IF EXISTS user_avatars CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS daily_quest_progress CASCADE;
DROP TABLE IF EXISTS login_streaks CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS league_members CASCADE;
DROP TABLE IF EXISTS leagues CASCADE;
DROP TABLE IF EXISTS squad_players CASCADE;
DROP TABLE IF EXISTS fantasy_teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_id VARCHAR(20) DEFAULT 'av1',
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    eth_balance DECIMAL(10, 2) DEFAULT 0.00,
    favorite_team VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. FANTASY TEAMS TABLE
-- ==========================================
CREATE TABLE fantasy_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    season_id VARCHAR(20) DEFAULT '2024-25',
    team_name VARCHAR(100) NOT NULL,
    formation VARCHAR(10) DEFAULT '3-4-3',
    bank_balance DECIMAL(5, 1) DEFAULT 0.0,
    total_value DECIMAL(6, 1) DEFAULT 100.0,
    free_transfers INTEGER DEFAULT 1,
    total_points INTEGER DEFAULT 0,
    overall_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id)
);

-- ==========================================
-- 3. SQUAD PLAYERS TABLE
-- ==========================================
CREATE TABLE squad_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES fantasy_teams(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL,
    is_captain BOOLEAN DEFAULT FALSE,
    is_vice_captain BOOLEAN DEFAULT FALSE,
    is_benched BOOLEAN DEFAULT FALSE,
    bench_order INTEGER,
    purchase_price DECIMAL(4, 1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, player_id)
);

-- ==========================================
-- 4. LEAGUES TABLE
-- ==========================================
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('public', 'private', 'h2h', 'prize', 'city', 'company', 'university')),
    entry_fee DECIMAL(10, 2) DEFAULT 0.00,
    entry_currency VARCHAR(10) DEFAULT 'etb' CHECK (entry_currency IN ('etb', 'coins')),
    prize_pool DECIMAL(12, 2) DEFAULT 0.00,
    min_level INTEGER DEFAULT 1,
    code VARCHAR(20) UNIQUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    location VARCHAR(100),
    organization VARCHAR(100),
    telegram_group_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'upcoming')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. LEAGUE MEMBERS TABLE
-- ==========================================
CREATE TABLE league_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank INTEGER DEFAULT 0,
    previous_rank INTEGER,
    total_points INTEGER DEFAULT 0,
    gameweek_points INTEGER DEFAULT 0,
    h2h_wins INTEGER DEFAULT 0,
    h2h_draws INTEGER DEFAULT 0,
    h2h_losses INTEGER DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(league_id, user_id)
);

-- ==========================================
-- 6. TRANSACTIONS TABLE
-- ==========================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'entry_fee', 'prize', 'refund', 'coin_purchase', 'coin_spend')),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'etb' CHECK (currency IN ('etb', 'coins')),
    reference VARCHAR(100),
    telebirr_reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. LOGIN STREAKS TABLE
-- ==========================================
CREATE TABLE login_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 1,
    longest_streak INTEGER DEFAULT 1,
    last_login_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 8. DAILY QUEST PROGRESS TABLE
-- ==========================================
CREATE TABLE daily_quest_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id VARCHAR(20) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, quest_id, date)
);

-- ==========================================
-- 9. CHAT MESSAGES TABLE
-- ==========================================
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 10. USER AVATARS TABLE
-- ==========================================
CREATE TABLE user_avatars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    avatar_id VARCHAR(20) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, avatar_id)
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_fantasy_teams_user ON fantasy_teams(user_id);
CREATE INDEX idx_squad_players_team ON squad_players(team_id);
CREATE INDEX idx_league_members_league ON league_members(league_id);
CREATE INDEX idx_league_members_user ON league_members(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_chat_messages_league ON chat_messages(league_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX idx_daily_quest_user_date ON daily_quest_progress(user_id, date);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fantasy_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;

-- Users: Can read own data, insert own, update own
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Fantasy Teams: Owner only
CREATE POLICY "Users can CRUD own teams" ON fantasy_teams FOR ALL USING (auth.uid() = user_id);

-- Squad Players: Via team ownership
CREATE POLICY "Users can CRUD own squad" ON squad_players FOR ALL
  USING (EXISTS (SELECT 1 FROM fantasy_teams WHERE fantasy_teams.id = squad_players.team_id AND fantasy_teams.user_id = auth.uid()));

-- Leagues: Public read, creator can update
CREATE POLICY "Anyone can view leagues" ON leagues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create leagues" ON leagues FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update leagues" ON leagues FOR UPDATE USING (auth.uid() = created_by);

-- League Members: Read if member, join/leave own
CREATE POLICY "Members can view league members" ON league_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join leagues" ON league_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave leagues" ON league_members FOR DELETE USING (auth.uid() = user_id);

-- Transactions: Own only
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Login Streaks: Own only
CREATE POLICY "Users can CRUD own streaks" ON login_streaks FOR ALL USING (auth.uid() = user_id);

-- Quest Progress: Own only
CREATE POLICY "Users can CRUD own quests" ON daily_quest_progress FOR ALL USING (auth.uid() = user_id);

-- Chat: Members can read/write to their leagues
CREATE POLICY "League members can view chat" ON chat_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = chat_messages.league_id AND league_members.user_id = auth.uid()));
CREATE POLICY "League members can send messages" ON chat_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = chat_messages.league_id AND league_members.user_id = auth.uid()) AND auth.uid() = user_id);

-- Avatars: Own only
CREATE POLICY "Users can CRUD own avatars" ON user_avatars FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- ENABLE REALTIME
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE league_members;

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fantasy_teams_updated_at BEFORE UPDATE ON fantasy_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle login streak
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id UUID)
RETURNS TABLE(streak INTEGER, bonus INTEGER) AS $$
DECLARE
    v_current_streak INTEGER;
    v_last_login DATE;
    v_bonus INTEGER := 5;
BEGIN
    -- Get current streak data
    SELECT current_streak, last_login_date INTO v_current_streak, v_last_login
    FROM login_streaks WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        -- First login ever
        INSERT INTO login_streaks (user_id, current_streak, longest_streak, last_login_date)
        VALUES (p_user_id, 1, 1, CURRENT_DATE);
        RETURN QUERY SELECT 1, 5;
        RETURN;
    END IF;

    IF v_last_login = CURRENT_DATE THEN
        -- Already logged in today
        RETURN QUERY SELECT v_current_streak, 0;
        RETURN;
    ELSIF v_last_login = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Consecutive day
        v_current_streak := v_current_streak + 1;

        -- Calculate bonus
        IF v_current_streak = 7 THEN v_bonus := 50;
        ELSIF v_current_streak = 14 THEN v_bonus := 100;
        ELSIF v_current_streak = 30 THEN v_bonus := 200;
        ELSE v_bonus := 5;
        END IF;

        UPDATE login_streaks
        SET current_streak = v_current_streak,
            longest_streak = GREATEST(longest_streak, v_current_streak),
            last_login_date = CURRENT_DATE
        WHERE user_id = p_user_id;

        -- Award coins
        UPDATE users SET coins = coins + v_bonus WHERE id = p_user_id;

        RETURN QUERY SELECT v_current_streak, v_bonus;
    ELSE
        -- Streak broken
        UPDATE login_streaks
        SET current_streak = 1,
            last_login_date = CURRENT_DATE
        WHERE user_id = p_user_id;

        -- Award daily bonus
        UPDATE users SET coins = coins + 5 WHERE id = p_user_id;

        RETURN QUERY SELECT 1, 5;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
