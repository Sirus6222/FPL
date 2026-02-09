-- ==========================================
-- SHOWROOMS PHASE 2: Primary + Secondary Slots
-- Migration: 003_showrooms_phase2.sql
-- ==========================================
-- This migration adds:
--   1. showrooms table (venues)
--   2. showroom_memberships (PRIMARY/SECONDARY with slot_index)
--   3. user_showroom_slots (slot unlock tracking)
--   4. showroom_slot_unlock_transactions (wallet ledger link)
--   5. showroom_checkins (daily check-in, once per user per day)
--   6. showroom_weekly_scores (aggregation snapshots)
--   7. city_leaderboard_snapshots (rivalry leaderboards)
--   8. showroom_audit_logs (audit trail for all membership changes)
--   9. qr_tokens (QR code validation)
-- ==========================================

-- Enable PostGIS if available (for geo queries) — optional, graceful skip
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ==========================================
-- 1. SHOWROOMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS showrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    venue_type VARCHAR(20) NOT NULL CHECK (venue_type IN (
        'coffee_shop', 'sports_bar', 'betting_shop',
        'university', 'corporate', 'stadium'
    )),
    tier VARCHAR(10) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),

    -- Location
    address TEXT,
    city VARCHAR(50) NOT NULL,
    sub_city VARCHAR(50),
    woreda VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Verification
    business_license_url TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
        verification_status IN ('pending', 'verified', 'suspended', 'rejected')
    ),
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Branding
    logo_url TEXT,
    cover_photo_url TEXT,
    description TEXT,

    -- Settings
    max_members INT DEFAULT 500,
    join_radius_meters INT DEFAULT 500,
    is_public BOOLEAN DEFAULT TRUE,

    -- Stats (denormalized for performance)
    member_count INT DEFAULT 0,
    primary_member_count INT DEFAULT 0,
    active_member_count INT DEFAULT 0,
    weekly_score DECIMAL(10, 2) DEFAULT 0,
    city_rank INT,

    -- Admin
    admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. SHOWROOM MEMBERSHIPS TABLE
-- Supports PRIMARY (slot_index=0) and SECONDARY (slot_index=1,2)
-- ==========================================
CREATE TABLE IF NOT EXISTS showroom_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    showroom_id UUID NOT NULL REFERENCES showrooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Membership type and slot
    membership_type VARCHAR(10) NOT NULL CHECK (membership_type IN ('PRIMARY', 'SECONDARY')),
    slot_index INT NOT NULL CHECK (slot_index IN (0, 1, 2)),
    -- slot_index 0 = PRIMARY, 1 = Secondary #1, 2 = Secondary #2

    -- Role within showroom
    role VARCHAR(10) DEFAULT 'member' CHECK (role IN ('member', 'co_admin', 'admin')),

    -- Join verification
    joined_via VARCHAR(20) NOT NULL CHECK (joined_via IN (
        'qr_scan', 'invite_link', 'admin_add', 'geo_suggest'
    )),
    join_latitude DECIMAL(10, 8),
    join_longitude DECIMAL(11, 8),

    -- Switching cooldown
    switch_locked_until TIMESTAMP WITH TIME ZONE,
    -- PRIMARY: 30 days from join/switch
    -- SECONDARY: 7 days from join/switch

    -- Activity
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points_contributed_this_gw INT DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    -- Each user can have only ONE membership in a given showroom
    UNIQUE(showroom_id, user_id),
    -- Each user can have only ONE PRIMARY membership
    -- (enforced via partial unique index below)
    -- Each user's slot_index must be unique
    UNIQUE(user_id, slot_index)
);

-- Partial unique index: only one PRIMARY per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_per_user
    ON showroom_memberships (user_id)
    WHERE membership_type = 'PRIMARY';

-- ==========================================
-- 3. USER SHOWROOM SLOTS (unlock tracking)
-- ==========================================
CREATE TABLE IF NOT EXISTS user_showroom_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_index INT NOT NULL CHECK (slot_index IN (1, 2)),
    -- slot 0 (PRIMARY) is always available, no unlock needed

    is_unlocked BOOLEAN DEFAULT FALSE,
    unlock_source VARCHAR(10) CHECK (unlock_source IN ('LEVEL', 'PURCHASE')),
    unlock_level INT, -- The level at which it was unlocked (if LEVEL)
    unlocked_at TIMESTAMP WITH TIME ZONE,

    -- Link to wallet transaction if purchased
    wallet_tx_id UUID, -- References transactions(id)

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Each user can have one record per slot
    UNIQUE(user_id, slot_index)
);

-- ==========================================
-- 4. SHOWROOM SLOT UNLOCK TRANSACTIONS
-- Links slot unlocks to wallet ledger for audit
-- ==========================================
CREATE TABLE IF NOT EXISTS showroom_slot_unlock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_index INT NOT NULL CHECK (slot_index IN (1, 2)),

    -- Pricing at time of purchase
    coin_amount INT NOT NULL,
    birr_equivalent DECIMAL(10, 2),

    -- Idempotency
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    -- Format: "slot_unlock:{user_id}:{slot_index}"

    -- Wallet transaction reference
    wallet_tx_id UUID REFERENCES transactions(id),

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(user_id, slot_index)
);

-- ==========================================
-- 5. SHOWROOM CHECKINS
-- Once per user per day (NOT per showroom)
-- ==========================================
CREATE TABLE IF NOT EXISTS showroom_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    showroom_id UUID NOT NULL REFERENCES showrooms(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Verification
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Rewards
    xp_earned INT DEFAULT 25,
    coins_earned INT DEFAULT 5,
    is_match_hour_bonus BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- CRITICAL: One check-in per user per day (regardless of showroom)
    UNIQUE(user_id, checkin_date)
);

-- ==========================================
-- 6. SHOWROOM WEEKLY SCORES (aggregation snapshots)
-- ==========================================
CREATE TABLE IF NOT EXISTS showroom_weekly_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    showroom_id UUID NOT NULL REFERENCES showrooms(id) ON DELETE CASCADE,
    gameweek INT NOT NULL,
    season VARCHAR(10) NOT NULL DEFAULT '2024-25',

    -- Aggregation data
    primary_member_count INT DEFAULT 0,
    active_primary_count INT DEFAULT 0,
    top_n_count INT DEFAULT 0, -- MIN(25, active_primary_count)
    total_top_n_points INT DEFAULT 0,
    average_score DECIMAL(10, 2) DEFAULT 0,

    -- Final weighted score
    weekly_score DECIMAL(10, 2) DEFAULT 0,

    -- Rank within city
    city VARCHAR(50),
    city_rank INT,

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(showroom_id, gameweek, season)
);

-- ==========================================
-- 7. CITY LEADERBOARD SNAPSHOTS
-- ==========================================
CREATE TABLE IF NOT EXISTS city_leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(50) NOT NULL,
    gameweek INT NOT NULL,
    season VARCHAR(10) NOT NULL DEFAULT '2024-25',

    -- Rankings stored as JSONB
    rankings JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Format: [{ showroom_id, name, rank, weekly_score, primary_member_count, active_members }]

    total_showrooms INT DEFAULT 0,
    total_participants INT DEFAULT 0,

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(city, gameweek, season)
);

-- ==========================================
-- 8. SHOWROOM AUDIT LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS showroom_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    showroom_id UUID REFERENCES showrooms(id) ON DELETE SET NULL,

    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'JOIN',
        'LEAVE',
        'SET_PRIMARY',
        'SWITCH_PRIMARY',
        'SWITCH_SECONDARY',
        'SLOT_UNLOCK_LEVEL',
        'SLOT_UNLOCK_PURCHASE',
        'CHECKIN',
        'COOLDOWN_RESET',
        'ADMIN_ACTION',
        'SHOWROOM_SUSPENDED'
    )),

    -- Context
    slot_index INT,
    previous_showroom_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Can store: { reason, old_membership_type, new_membership_type, cooldown_until, etc. }

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 9. QR TOKENS
-- ==========================================
CREATE TABLE IF NOT EXISTS qr_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    showroom_id UUID NOT NULL REFERENCES showrooms(id) ON DELETE CASCADE,

    token_code VARCHAR(50) UNIQUE NOT NULL,
    -- Format: ETHFPL-{showroom_id_short}-{rotation_key}-{checksum}
    token_type VARCHAR(20) DEFAULT 'permanent' CHECK (
        token_type IN ('permanent', 'temporary', 'single_use')
    ),

    -- Validity
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    max_uses INT, -- NULL = unlimited
    use_count INT DEFAULT 0,

    -- Rotation tracking
    rotation_key VARCHAR(10) NOT NULL,
    rotated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Showrooms
CREATE INDEX IF NOT EXISTS idx_showrooms_city ON showrooms(city);
CREATE INDEX IF NOT EXISTS idx_showrooms_tier ON showrooms(tier);
CREATE INDEX IF NOT EXISTS idx_showrooms_verification ON showrooms(verification_status);
CREATE INDEX IF NOT EXISTS idx_showrooms_weekly_score ON showrooms(weekly_score DESC);
CREATE INDEX IF NOT EXISTS idx_showrooms_admin ON showrooms(admin_user_id);

-- Memberships
CREATE INDEX IF NOT EXISTS idx_memberships_user ON showroom_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_showroom ON showroom_memberships(showroom_id);
CREATE INDEX IF NOT EXISTS idx_memberships_type ON showroom_memberships(user_id, membership_type);
CREATE INDEX IF NOT EXISTS idx_memberships_active ON showroom_memberships(showroom_id, is_active);
CREATE INDEX IF NOT EXISTS idx_memberships_slot ON showroom_memberships(user_id, slot_index);

-- Slots
CREATE INDEX IF NOT EXISTS idx_slots_user ON user_showroom_slots(user_id);

-- Check-ins
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON showroom_checkins(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_checkins_showroom ON showroom_checkins(showroom_id, checkin_date);

-- Weekly Scores
CREATE INDEX IF NOT EXISTS idx_weekly_scores_showroom ON showroom_weekly_scores(showroom_id, gameweek);
CREATE INDEX IF NOT EXISTS idx_weekly_scores_city ON showroom_weekly_scores(city, gameweek, weekly_score DESC);

-- City Leaderboard
CREATE INDEX IF NOT EXISTS idx_city_lb_city_gw ON city_leaderboard_snapshots(city, gameweek);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_user ON showroom_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_showroom ON showroom_audit_logs(showroom_id);
CREATE INDEX IF NOT EXISTS idx_audit_event ON showroom_audit_logs(event_type, created_at DESC);

-- QR Tokens
CREATE INDEX IF NOT EXISTS idx_qr_token_code ON qr_tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_qr_showroom ON qr_tokens(showroom_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE showrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_showroom_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_slot_unlock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_weekly_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;

-- Showrooms: Public read (verified), admin can update own
CREATE POLICY "Anyone can view verified showrooms" ON showrooms
    FOR SELECT TO authenticated USING (verification_status = 'verified' OR admin_user_id = auth.uid());
CREATE POLICY "Admins can update own showrooms" ON showrooms
    FOR UPDATE USING (admin_user_id = auth.uid());

-- Memberships: Users can see their own + showroom members
CREATE POLICY "Users can view own memberships" ON showroom_memberships
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can view co-members" ON showroom_memberships
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM showroom_memberships sm
        WHERE sm.showroom_id = showroom_memberships.showroom_id
        AND sm.user_id = auth.uid()
    ));
CREATE POLICY "Users can insert own memberships" ON showroom_memberships
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own memberships" ON showroom_memberships
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own memberships" ON showroom_memberships
    FOR DELETE USING (user_id = auth.uid());

-- Slots: Own data only
CREATE POLICY "Users can CRUD own slots" ON user_showroom_slots
    FOR ALL USING (user_id = auth.uid());

-- Unlock transactions: Own data only
CREATE POLICY "Users can view own unlock txs" ON showroom_slot_unlock_transactions
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own unlock txs" ON showroom_slot_unlock_transactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Check-ins: Own data only
CREATE POLICY "Users can CRUD own checkins" ON showroom_checkins
    FOR ALL USING (user_id = auth.uid());

-- Weekly Scores: Public read
CREATE POLICY "Anyone can view weekly scores" ON showroom_weekly_scores
    FOR SELECT TO authenticated USING (true);

-- City Leaderboards: Public read
CREATE POLICY "Anyone can view city leaderboards" ON city_leaderboard_snapshots
    FOR SELECT TO authenticated USING (true);

-- Audit Logs: Own data only
CREATE POLICY "Users can view own audit logs" ON showroom_audit_logs
    FOR SELECT USING (user_id = auth.uid());

-- QR Tokens: Showroom admin can manage, authenticated can read active
CREATE POLICY "Authenticated can read active QR tokens" ON qr_tokens
    FOR SELECT TO authenticated USING (is_active = TRUE);
CREATE POLICY "Showroom admins can manage QR tokens" ON qr_tokens
    FOR ALL USING (EXISTS (
        SELECT 1 FROM showrooms s
        WHERE s.id = qr_tokens.showroom_id
        AND s.admin_user_id = auth.uid()
    ));

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE showroom_memberships;
ALTER PUBLICATION supabase_realtime ADD TABLE showroom_checkins;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-update updated_at for showrooms
CREATE TRIGGER update_showrooms_updated_at
    BEFORE UPDATE ON showrooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for memberships
CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON showroom_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function: Join showroom (handles primary/secondary logic)
CREATE OR REPLACE FUNCTION join_showroom(
    p_user_id UUID,
    p_showroom_id UUID,
    p_joined_via VARCHAR(20),
    p_latitude DECIMAL(10, 8) DEFAULT NULL,
    p_longitude DECIMAL(11, 8) DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_has_primary BOOLEAN;
    v_membership_type VARCHAR(10);
    v_slot_index INT;
    v_available_slot INT;
    v_slot_unlocked BOOLEAN;
    v_membership_id UUID;
    v_switch_locked_until TIMESTAMP WITH TIME ZONE;
    v_showroom_member_count INT;
    v_showroom_max_members INT;
BEGIN
    -- Check if showroom exists and is verified
    SELECT member_count, max_members INTO v_showroom_member_count, v_showroom_max_members
    FROM showrooms WHERE id = p_showroom_id AND verification_status = 'verified';
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Showroom not found or not verified');
    END IF;

    -- Check max members
    IF v_showroom_member_count >= v_showroom_max_members THEN
        RETURN jsonb_build_object('success', false, 'error', 'Showroom is full');
    END IF;

    -- Check if user already in this showroom
    IF EXISTS (SELECT 1 FROM showroom_memberships WHERE user_id = p_user_id AND showroom_id = p_showroom_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Already a member of this showroom');
    END IF;

    -- Check if user has a primary showroom
    SELECT EXISTS(
        SELECT 1 FROM showroom_memberships
        WHERE user_id = p_user_id AND membership_type = 'PRIMARY' AND is_active = TRUE
    ) INTO v_has_primary;

    IF NOT v_has_primary THEN
        -- Assign as PRIMARY (slot 0)
        v_membership_type := 'PRIMARY';
        v_slot_index := 0;
        v_switch_locked_until := NOW() + INTERVAL '30 days';
    ELSE
        -- Find available secondary slot
        v_available_slot := NULL;

        -- Check slot 1
        IF NOT EXISTS (SELECT 1 FROM showroom_memberships WHERE user_id = p_user_id AND slot_index = 1) THEN
            -- Check if slot 1 is unlocked
            SELECT is_unlocked INTO v_slot_unlocked
            FROM user_showroom_slots WHERE user_id = p_user_id AND slot_index = 1;
            IF v_slot_unlocked = TRUE THEN
                v_available_slot := 1;
            END IF;
        END IF;

        -- Check slot 2 if slot 1 not available
        IF v_available_slot IS NULL AND NOT EXISTS (SELECT 1 FROM showroom_memberships WHERE user_id = p_user_id AND slot_index = 2) THEN
            SELECT is_unlocked INTO v_slot_unlocked
            FROM user_showroom_slots WHERE user_id = p_user_id AND slot_index = 2;
            IF v_slot_unlocked = TRUE THEN
                v_available_slot := 2;
            END IF;
        END IF;

        IF v_available_slot IS NULL THEN
            RETURN jsonb_build_object('success', false, 'error', 'No available showroom slots. Unlock a secondary slot first.');
        END IF;

        v_membership_type := 'SECONDARY';
        v_slot_index := v_available_slot;
        v_switch_locked_until := NOW() + INTERVAL '7 days';
    END IF;

    -- Insert membership
    INSERT INTO showroom_memberships (
        showroom_id, user_id, membership_type, slot_index, role,
        joined_via, join_latitude, join_longitude, switch_locked_until,
        is_active
    ) VALUES (
        p_showroom_id, p_user_id, v_membership_type, v_slot_index, 'member',
        p_joined_via, p_latitude, p_longitude, v_switch_locked_until,
        TRUE
    ) RETURNING id INTO v_membership_id;

    -- Update showroom member count
    UPDATE showrooms SET
        member_count = member_count + 1,
        primary_member_count = CASE WHEN v_membership_type = 'PRIMARY'
            THEN primary_member_count + 1 ELSE primary_member_count END
    WHERE id = p_showroom_id;

    -- Audit log
    INSERT INTO showroom_audit_logs (user_id, showroom_id, event_type, slot_index, metadata)
    VALUES (p_user_id, p_showroom_id, 'JOIN', v_slot_index,
        jsonb_build_object(
            'membership_type', v_membership_type,
            'joined_via', p_joined_via,
            'switch_locked_until', v_switch_locked_until
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'membership_id', v_membership_id,
        'membership_type', v_membership_type,
        'slot_index', v_slot_index,
        'switch_locked_until', v_switch_locked_until
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Leave showroom
CREATE OR REPLACE FUNCTION leave_showroom(
    p_user_id UUID,
    p_showroom_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_membership showroom_memberships%ROWTYPE;
BEGIN
    SELECT * INTO v_membership
    FROM showroom_memberships
    WHERE user_id = p_user_id AND showroom_id = p_showroom_id AND is_active = TRUE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a member of this showroom');
    END IF;

    -- Delete membership
    DELETE FROM showroom_memberships
    WHERE id = v_membership.id;

    -- Update showroom member count
    UPDATE showrooms SET
        member_count = GREATEST(member_count - 1, 0),
        primary_member_count = CASE WHEN v_membership.membership_type = 'PRIMARY'
            THEN GREATEST(primary_member_count - 1, 0) ELSE primary_member_count END
    WHERE id = p_showroom_id;

    -- Audit log
    INSERT INTO showroom_audit_logs (user_id, showroom_id, event_type, slot_index, metadata)
    VALUES (p_user_id, p_showroom_id, 'LEAVE', v_membership.slot_index,
        jsonb_build_object('membership_type', v_membership.membership_type)
    );

    RETURN jsonb_build_object(
        'success', true,
        'freed_slot_index', v_membership.slot_index,
        'was_primary', v_membership.membership_type = 'PRIMARY'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Set primary showroom
CREATE OR REPLACE FUNCTION set_primary_showroom(
    p_user_id UUID,
    p_showroom_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_current_primary showroom_memberships%ROWTYPE;
    v_target_membership showroom_memberships%ROWTYPE;
    v_available_secondary_slot INT;
BEGIN
    -- Get current primary
    SELECT * INTO v_current_primary
    FROM showroom_memberships
    WHERE user_id = p_user_id AND membership_type = 'PRIMARY' AND is_active = TRUE;

    -- Check cooldown on current primary
    IF FOUND AND v_current_primary.switch_locked_until > NOW() THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Primary switch is on cooldown',
            'locked_until', v_current_primary.switch_locked_until
        );
    END IF;

    -- Get target membership (must be an existing secondary)
    SELECT * INTO v_target_membership
    FROM showroom_memberships
    WHERE user_id = p_user_id AND showroom_id = p_showroom_id AND is_active = TRUE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a member of this showroom');
    END IF;

    IF v_target_membership.membership_type = 'PRIMARY' THEN
        RETURN jsonb_build_object('success', false, 'error', 'This is already your primary showroom');
    END IF;

    -- Swap: demote current primary to the secondary slot, promote target to primary
    IF v_current_primary.id IS NOT NULL THEN
        -- Demote old primary to the secondary's slot_index
        UPDATE showroom_memberships SET
            membership_type = 'SECONDARY',
            slot_index = v_target_membership.slot_index,
            switch_locked_until = NOW() + INTERVAL '7 days'
        WHERE id = v_current_primary.id;

        -- Update old showroom's primary count
        UPDATE showrooms SET primary_member_count = GREATEST(primary_member_count - 1, 0)
        WHERE id = v_current_primary.showroom_id;
    END IF;

    -- Promote target to primary
    UPDATE showroom_memberships SET
        membership_type = 'PRIMARY',
        slot_index = 0,
        switch_locked_until = NOW() + INTERVAL '30 days'
    WHERE id = v_target_membership.id;

    -- Update new showroom's primary count
    UPDATE showrooms SET primary_member_count = primary_member_count + 1
    WHERE id = p_showroom_id;

    -- Audit log
    INSERT INTO showroom_audit_logs (user_id, showroom_id, event_type, slot_index, previous_showroom_id, metadata)
    VALUES (p_user_id, p_showroom_id, 'SWITCH_PRIMARY', 0,
        v_current_primary.showroom_id,
        jsonb_build_object(
            'previous_primary_showroom_id', v_current_primary.showroom_id,
            'new_primary_showroom_id', p_showroom_id
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'new_primary_showroom_id', p_showroom_id,
        'switch_locked_until', NOW() + INTERVAL '30 days'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Unlock showroom slot
CREATE OR REPLACE FUNCTION unlock_showroom_slot(
    p_user_id UUID,
    p_slot_index INT,
    p_method VARCHAR(10), -- 'LEVEL' or 'PURCHASE'
    p_idempotency_key VARCHAR(100) DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_level INT;
    v_user_coins INT;
    v_required_level INT;
    v_coin_price INT;
    v_tx_id UUID;
    v_wallet_tx_id UUID;
BEGIN
    -- Validate slot index
    IF p_slot_index NOT IN (1, 2) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid slot index');
    END IF;

    -- Check if already unlocked
    IF EXISTS (SELECT 1 FROM user_showroom_slots WHERE user_id = p_user_id AND slot_index = p_slot_index AND is_unlocked = TRUE) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Slot already unlocked', 'already_unlocked', true);
    END IF;

    -- Get user data
    SELECT level, coins INTO v_user_level, v_user_coins
    FROM users WHERE id = p_user_id;

    -- Set requirements based on slot
    IF p_slot_index = 1 THEN
        v_required_level := 10;
        v_coin_price := 100;
    ELSE
        v_required_level := 25;
        v_coin_price := 400;
    END IF;

    IF p_method = 'LEVEL' THEN
        IF v_user_level < v_required_level THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Level requirement not met',
                'required_level', v_required_level,
                'current_level', v_user_level
            );
        END IF;

        -- Unlock via level
        INSERT INTO user_showroom_slots (user_id, slot_index, is_unlocked, unlock_source, unlock_level, unlocked_at)
        VALUES (p_user_id, p_slot_index, TRUE, 'LEVEL', v_user_level, NOW())
        ON CONFLICT (user_id, slot_index) DO UPDATE SET
            is_unlocked = TRUE,
            unlock_source = 'LEVEL',
            unlock_level = v_user_level,
            unlocked_at = NOW();

        -- Audit
        INSERT INTO showroom_audit_logs (user_id, event_type, slot_index, metadata)
        VALUES (p_user_id, 'SLOT_UNLOCK_LEVEL', p_slot_index,
            jsonb_build_object('level', v_user_level));

    ELSIF p_method = 'PURCHASE' THEN
        -- Idempotency check
        IF p_idempotency_key IS NOT NULL THEN
            IF EXISTS (SELECT 1 FROM showroom_slot_unlock_transactions WHERE idempotency_key = p_idempotency_key AND status = 'completed') THEN
                RETURN jsonb_build_object('success', true, 'message', 'Already processed', 'already_unlocked', true);
            END IF;
        ELSE
            p_idempotency_key := 'slot_unlock:' || p_user_id::text || ':' || p_slot_index::text;
        END IF;

        -- Check coins
        IF v_user_coins < v_coin_price THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Insufficient coins',
                'required_coins', v_coin_price,
                'current_coins', v_user_coins
            );
        END IF;

        -- Debit coins
        UPDATE users SET coins = coins - v_coin_price WHERE id = p_user_id;

        -- Create wallet transaction
        INSERT INTO transactions (user_id, type, amount, currency, reference, status)
        VALUES (p_user_id, 'coin_spend', v_coin_price, 'coins',
            'Showroom slot ' || p_slot_index || ' unlock', 'completed')
        RETURNING id INTO v_wallet_tx_id;

        -- Record unlock transaction
        INSERT INTO showroom_slot_unlock_transactions (
            user_id, slot_index, coin_amount, birr_equivalent,
            idempotency_key, wallet_tx_id, status, completed_at
        ) VALUES (
            p_user_id, p_slot_index, v_coin_price,
            CASE WHEN p_slot_index = 1 THEN 10.00 ELSE 40.00 END,
            p_idempotency_key, v_wallet_tx_id, 'completed', NOW()
        ) ON CONFLICT (idempotency_key) DO NOTHING;

        -- Unlock slot
        INSERT INTO user_showroom_slots (user_id, slot_index, is_unlocked, unlock_source, wallet_tx_id, unlocked_at)
        VALUES (p_user_id, p_slot_index, TRUE, 'PURCHASE', v_wallet_tx_id, NOW())
        ON CONFLICT (user_id, slot_index) DO UPDATE SET
            is_unlocked = TRUE,
            unlock_source = 'PURCHASE',
            wallet_tx_id = v_wallet_tx_id,
            unlocked_at = NOW();

        -- Audit
        INSERT INTO showroom_audit_logs (user_id, event_type, slot_index, metadata)
        VALUES (p_user_id, 'SLOT_UNLOCK_PURCHASE', p_slot_index,
            jsonb_build_object('coin_amount', v_coin_price, 'wallet_tx_id', v_wallet_tx_id));
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Invalid unlock method');
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'slot_index', p_slot_index,
        'unlock_source', p_method,
        'coin_price', CASE WHEN p_method = 'PURCHASE' THEN v_coin_price ELSE 0 END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Daily check-in (once per user per day)
CREATE OR REPLACE FUNCTION showroom_checkin(
    p_user_id UUID,
    p_showroom_id UUID,
    p_latitude DECIMAL(10, 8) DEFAULT NULL,
    p_longitude DECIMAL(11, 8) DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_xp INT := 25;
    v_coins INT := 5;
    v_is_match_hour BOOLEAN := FALSE;
    v_checkin_id UUID;
BEGIN
    -- Check membership
    IF NOT EXISTS (
        SELECT 1 FROM showroom_memberships
        WHERE user_id = p_user_id AND showroom_id = p_showroom_id AND is_active = TRUE
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a member of this showroom');
    END IF;

    -- Check if already checked in today (any showroom)
    IF EXISTS (
        SELECT 1 FROM showroom_checkins
        WHERE user_id = p_user_id AND checkin_date = CURRENT_DATE
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Already checked in today');
    END IF;

    -- Optional: Match hour bonus (between 18:00 and 23:00 EAT)
    IF EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Africa/Addis_Ababa') BETWEEN 18 AND 23 THEN
        v_is_match_hour := TRUE;
        v_xp := v_xp * 2;
    END IF;

    -- Record check-in
    INSERT INTO showroom_checkins (user_id, showroom_id, checkin_date, latitude, longitude,
        xp_earned, coins_earned, is_match_hour_bonus)
    VALUES (p_user_id, p_showroom_id, CURRENT_DATE, p_latitude, p_longitude,
        v_xp, v_coins, v_is_match_hour)
    RETURNING id INTO v_checkin_id;

    -- Award XP and coins
    UPDATE users SET
        xp = xp + v_xp,
        coins = coins + v_coins
    WHERE id = p_user_id;

    -- Audit log
    INSERT INTO showroom_audit_logs (user_id, showroom_id, event_type, metadata)
    VALUES (p_user_id, p_showroom_id, 'CHECKIN',
        jsonb_build_object('xp_earned', v_xp, 'coins_earned', v_coins, 'match_hour_bonus', v_is_match_hour));

    RETURN jsonb_build_object(
        'success', true,
        'checkin_id', v_checkin_id,
        'xp_earned', v_xp,
        'coins_earned', v_coins,
        'is_match_hour_bonus', v_is_match_hour
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Calculate showroom weekly score (PRIMARY members only)
CREATE OR REPLACE FUNCTION calculate_showroom_weekly_score(
    p_showroom_id UUID,
    p_gameweek INT,
    p_season VARCHAR(10) DEFAULT '2024-25'
) RETURNS JSONB AS $$
DECLARE
    v_primary_count INT;
    v_active_count INT;
    v_top_n INT;
    v_total_points INT;
    v_avg_score DECIMAL(10, 2);
    v_city VARCHAR(50);
BEGIN
    -- Get showroom city
    SELECT city INTO v_city FROM showrooms WHERE id = p_showroom_id;

    -- Count primary members
    SELECT COUNT(*) INTO v_primary_count
    FROM showroom_memberships
    WHERE showroom_id = p_showroom_id AND membership_type = 'PRIMARY' AND is_active = TRUE;

    -- Count active primary members (logged in within 7 days + have GW points)
    SELECT COUNT(*) INTO v_active_count
    FROM showroom_memberships sm
    JOIN users u ON u.id = sm.user_id
    WHERE sm.showroom_id = p_showroom_id
      AND sm.membership_type = 'PRIMARY'
      AND sm.is_active = TRUE
      AND sm.last_active_at >= NOW() - INTERVAL '7 days';

    -- Top N = MIN(25, active_primary_count)
    v_top_n := LEAST(25, v_active_count);

    IF v_top_n = 0 THEN
        v_total_points := 0;
        v_avg_score := 0;
    ELSE
        -- Sum top N primary member GW points
        SELECT COALESCE(SUM(points_contributed_this_gw), 0) INTO v_total_points
        FROM (
            SELECT sm.points_contributed_this_gw
            FROM showroom_memberships sm
            WHERE sm.showroom_id = p_showroom_id
              AND sm.membership_type = 'PRIMARY'
              AND sm.is_active = TRUE
              AND sm.last_active_at >= NOW() - INTERVAL '7 days'
            ORDER BY sm.points_contributed_this_gw DESC
            LIMIT v_top_n
        ) top_members;

        v_avg_score := v_total_points::DECIMAL / v_top_n;
    END IF;

    -- Upsert weekly score
    INSERT INTO showroom_weekly_scores (
        showroom_id, gameweek, season,
        primary_member_count, active_primary_count, top_n_count,
        total_top_n_points, average_score, weekly_score, city
    ) VALUES (
        p_showroom_id, p_gameweek, p_season,
        v_primary_count, v_active_count, v_top_n,
        v_total_points, v_avg_score, v_avg_score, v_city
    ) ON CONFLICT (showroom_id, gameweek, season) DO UPDATE SET
        primary_member_count = EXCLUDED.primary_member_count,
        active_primary_count = EXCLUDED.active_primary_count,
        top_n_count = EXCLUDED.top_n_count,
        total_top_n_points = EXCLUDED.total_top_n_points,
        average_score = EXCLUDED.average_score,
        weekly_score = EXCLUDED.weekly_score,
        calculated_at = NOW();

    -- Update showroom's denormalized weekly_score
    UPDATE showrooms SET weekly_score = v_avg_score WHERE id = p_showroom_id;

    RETURN jsonb_build_object(
        'showroom_id', p_showroom_id,
        'gameweek', p_gameweek,
        'primary_member_count', v_primary_count,
        'active_primary_count', v_active_count,
        'top_n', v_top_n,
        'total_points', v_total_points,
        'average_score', v_avg_score
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
