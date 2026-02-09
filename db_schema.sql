
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

-- =============================================
-- SPONSOR MODULE TABLES
-- =============================================

-- 8. USER ROLES (RBAC)
CREATE TABLE public.user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user','sponsor_viewer','sponsor_manager','admin_analyst','admin_super')),
    sponsor_id UUID,
    granted_by UUID REFERENCES public.profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role, sponsor_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role = 'admin_super' AND ur.is_active = true)
  );

-- 9. SPONSORS
CREATE TABLE public.sponsors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('bronze','silver','gold','platinum')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','churned')),
    company_name TEXT NOT NULL,
    industry TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT,
    contract_start DATE,
    contract_end DATE,
    monthly_budget_birr DECIMAL(12,2) DEFAULT 0,
    prize_budget_birr DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sponsors viewable by linked users and admins" ON public.sponsors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND (ur.sponsor_id = sponsors.id OR ur.role IN ('admin_analyst','admin_super'))
            AND ur.is_active = true)
  );

CREATE INDEX idx_sponsors_slug ON public.sponsors(slug);
CREATE INDEX idx_sponsors_status ON public.sponsors(status);

-- 10. SPONSOR CAMPAIGNS
CREATE TABLE public.sponsor_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sponsor_id UUID REFERENCES public.sponsors(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('branded_league','contest_sponsorship','showroom_activation','survey','coin_drop','bonus_xp','mission')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft','pending_approval','active','paused','completed','cancelled')),
    target_audience JSONB,
    budget_coins INT DEFAULT 0,
    budget_birr DECIMAL(12,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    kpi_targets JSONB DEFAULT '{}',
    kpi_actuals JSONB DEFAULT '{"impressions":0,"engagements":0,"league_joins":0,"contest_entries":0,"survey_completions":0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sponsor_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campaigns viewable by sponsor users and admins" ON public.sponsor_campaigns
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND (ur.sponsor_id = sponsor_campaigns.sponsor_id OR ur.role IN ('admin_analyst','admin_super'))
            AND ur.is_active = true)
  );

CREATE INDEX idx_campaigns_sponsor ON public.sponsor_campaigns(sponsor_id);
CREATE INDEX idx_campaigns_status ON public.sponsor_campaigns(status);

-- 11. SPONSOR ASSETS
CREATE TABLE public.sponsor_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sponsor_id UUID REFERENCES public.sponsors(id) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('logo','banner','icon','video_thumbnail','splash_screen')),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_approved BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sponsor_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assets viewable by sponsor users and admins" ON public.sponsor_assets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND (ur.sponsor_id = sponsor_assets.sponsor_id OR ur.role IN ('admin_analyst','admin_super'))
            AND ur.is_active = true)
  );

-- 12. SPONSOR PLACEMENTS
CREATE TABLE public.sponsor_placements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.sponsor_campaigns(id) NOT NULL,
    sponsor_id UUID REFERENCES public.sponsors(id) NOT NULL,
    slot TEXT NOT NULL,
    asset_id UUID REFERENCES public.sponsor_assets(id),
    click_through_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0
);

ALTER TABLE public.sponsor_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Placements viewable by sponsor users and admins" ON public.sponsor_placements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND (ur.sponsor_id = sponsor_placements.sponsor_id OR ur.role IN ('admin_analyst','admin_super'))
            AND ur.is_active = true)
  );

CREATE INDEX idx_placements_campaign ON public.sponsor_placements(campaign_id);
CREATE INDEX idx_placements_active ON public.sponsor_placements(is_active);

-- 13. AUDIT LOGS
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    actor_user_id UUID REFERENCES public.profiles(id) NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    sponsor_id UUID REFERENCES public.sponsors(id),
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit logs viewable by admins and scoped sponsors" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.is_active = true
            AND (ur.role IN ('admin_analyst','admin_super')
                 OR (ur.sponsor_id = audit_logs.sponsor_id AND ur.role IN ('sponsor_manager'))))
  );
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = actor_user_id);

CREATE INDEX idx_audit_logs_sponsor ON public.audit_logs(sponsor_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- 14. ANALYTICS EVENTS
CREATE TABLE public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    sponsor_id UUID REFERENCES public.sponsors(id),
    campaign_id UUID REFERENCES public.sponsor_campaigns(id),
    placement_id UUID REFERENCES public.sponsor_placements(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events insertable by authenticated" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX idx_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_events_sponsor ON public.analytics_events(sponsor_id);
CREATE INDEX idx_events_created ON public.analytics_events(created_at DESC);

-- 15. MATERIALIZED VIEW: Sponsor Dashboard KPIs
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_sponsor_kpis AS
SELECT
    s.id as sponsor_id,
    s.name as sponsor_name,
    COUNT(DISTINCT ae.user_id) as unique_users,
    COUNT(ae.id) FILTER (WHERE ae.event_type = 'sponsor_impression') as impressions,
    COUNT(ae.id) FILTER (WHERE ae.event_type = 'sponsor_click') as clicks,
    COUNT(ae.id) FILTER (WHERE ae.event_type = 'sponsor_engagement') as engagements,
    COUNT(ae.id) FILTER (WHERE ae.event_type = 'survey_complete') as surveys_completed
FROM public.sponsors s
LEFT JOIN public.analytics_events ae ON ae.sponsor_id = s.id
GROUP BY s.id, s.name;

-- RPC: Check user permission
CREATE OR REPLACE FUNCTION public.check_permission(
    p_user_id UUID,
    p_permission TEXT,
    p_sponsor_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_perm BOOLEAN := false;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = p_user_id
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > now())
        AND (p_sponsor_id IS NULL OR ur.sponsor_id = p_sponsor_id OR ur.role IN ('admin_analyst','admin_super'))
    ) INTO v_has_perm;
    RETURN v_has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Write audit log
CREATE OR REPLACE FUNCTION public.write_audit_log(
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT,
    p_sponsor_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_role TEXT;
    v_log_id UUID;
BEGIN
    SELECT role INTO v_role FROM public.user_roles
    WHERE user_id = auth.uid() AND is_active = true
    ORDER BY CASE role
        WHEN 'admin_super' THEN 1
        WHEN 'admin_analyst' THEN 2
        WHEN 'sponsor_manager' THEN 3
        WHEN 'sponsor_viewer' THEN 4
        ELSE 5
    END
    LIMIT 1;

    INSERT INTO public.audit_logs (actor_user_id, actor_role, action, resource_type, resource_id, sponsor_id, details)
    VALUES (auth.uid(), COALESCE(v_role, 'user'), p_action, p_resource_type, p_resource_id, p_sponsor_id, p_details)
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SEED DATA (Optional Examples)
INSERT INTO public.gameweeks (gameweek_number, deadline_time, is_current)
VALUES (38, NOW() + INTERVAL '7 days', true);

