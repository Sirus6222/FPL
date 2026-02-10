-- ==========================================
-- FEATURE FLAGS & PROGRESSIVE UNLOCK
-- Migration: 004_feature_flags.sql
-- ==========================================
-- Adds:
--   1. feature_flags table (global toggles per feature)
--   2. feature_flag_audit_logs (admin action trail)
--   3. users.role and users.current_stage columns
--   4. RLS policies
--   5. check_feature_access RPC function
--   6. Seed data for 6 gated features
-- ==========================================

-- ==========================================
-- 1. ALTER USERS TABLE
-- ==========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'
    CHECK (role IN ('user', 'admin'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_stage INT DEFAULT 0
    CHECK (current_stage >= 0 AND current_stage <= 5);

-- ==========================================
-- 2. FEATURE FLAGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id VARCHAR(40) PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    required_stage INT NOT NULL DEFAULT 0 CHECK (required_stage >= 0 AND required_stage <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. FEATURE FLAG AUDIT LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS feature_flag_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_id VARCHAR(40) NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
    admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('ENABLE', 'DISABLE', 'UPDATE_STAGE')),
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_ff_audit_feature ON feature_flag_audit_logs(feature_id);
CREATE INDEX IF NOT EXISTS idx_ff_audit_admin ON feature_flag_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_ff_audit_created ON feature_flag_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_stage ON users(current_stage);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flag_audit_logs ENABLE ROW LEVEL SECURITY;

-- Feature flags: anyone authenticated can read, only admins can update
CREATE POLICY "Anyone can read feature flags" ON feature_flags
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update feature flags" ON feature_flags
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Audit logs: only admins can read and insert
CREATE POLICY "Admins can read audit logs" ON feature_flag_audit_logs
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can insert audit logs" ON feature_flag_audit_logs
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- ==========================================
-- TRIGGERS
-- ==========================================
CREATE TRIGGER update_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- RPC FUNCTION: Check feature access
-- ==========================================
CREATE OR REPLACE FUNCTION check_feature_access(
    p_user_id UUID,
    p_feature_id VARCHAR
) RETURNS JSONB AS $$
DECLARE
    v_user_stage INT;
    v_flag_enabled BOOLEAN;
    v_flag_stage INT;
    v_accessible BOOLEAN;
BEGIN
    -- Get user's current stage
    SELECT current_stage INTO v_user_stage
    FROM users WHERE id = p_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'accessible', false,
            'reason', 'USER_NOT_FOUND'
        );
    END IF;

    -- Get feature flag state
    SELECT is_enabled, required_stage INTO v_flag_enabled, v_flag_stage
    FROM feature_flags WHERE id = p_feature_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'accessible', false,
            'reason', 'FEATURE_NOT_FOUND'
        );
    END IF;

    -- Check global toggle
    IF NOT v_flag_enabled THEN
        RETURN jsonb_build_object(
            'accessible', false,
            'reason', 'FEATURE_DISABLED',
            'feature_id', p_feature_id
        );
    END IF;

    -- Check stage requirement
    IF v_user_stage < v_flag_stage THEN
        RETURN jsonb_build_object(
            'accessible', false,
            'reason', 'STAGE_NOT_REACHED',
            'feature_id', p_feature_id,
            'required_stage', v_flag_stage,
            'user_stage', v_user_stage
        );
    END IF;

    RETURN jsonb_build_object(
        'accessible', true,
        'feature_id', p_feature_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RPC FUNCTION: Toggle feature flag (admin only)
-- ==========================================
CREATE OR REPLACE FUNCTION toggle_feature_flag(
    p_admin_user_id UUID,
    p_feature_id VARCHAR,
    p_enabled BOOLEAN
) RETURNS JSONB AS $$
DECLARE
    v_old_enabled BOOLEAN;
    v_admin_role VARCHAR;
BEGIN
    -- Verify admin role
    SELECT role INTO v_admin_role FROM users WHERE id = p_admin_user_id;
    IF v_admin_role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;

    -- Get old value
    SELECT is_enabled INTO v_old_enabled FROM feature_flags WHERE id = p_feature_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Feature not found');
    END IF;

    -- Update flag
    UPDATE feature_flags SET is_enabled = p_enabled WHERE id = p_feature_id;

    -- Audit log
    INSERT INTO feature_flag_audit_logs (feature_id, admin_user_id, action, old_value, new_value)
    VALUES (
        p_feature_id,
        p_admin_user_id,
        CASE WHEN p_enabled THEN 'ENABLE' ELSE 'DISABLE' END,
        jsonb_build_object('is_enabled', v_old_enabled),
        jsonb_build_object('is_enabled', p_enabled)
    );

    RETURN jsonb_build_object('success', true, 'feature_id', p_feature_id, 'is_enabled', p_enabled);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RPC FUNCTION: Update feature stage requirement (admin only)
-- ==========================================
CREATE OR REPLACE FUNCTION update_feature_stage(
    p_admin_user_id UUID,
    p_feature_id VARCHAR,
    p_new_stage INT
) RETURNS JSONB AS $$
DECLARE
    v_old_stage INT;
    v_admin_role VARCHAR;
BEGIN
    -- Verify admin role
    SELECT role INTO v_admin_role FROM users WHERE id = p_admin_user_id;
    IF v_admin_role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;

    -- Get old value
    SELECT required_stage INTO v_old_stage FROM feature_flags WHERE id = p_feature_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Feature not found');
    END IF;

    -- Update
    UPDATE feature_flags SET required_stage = p_new_stage WHERE id = p_feature_id;

    -- Audit log
    INSERT INTO feature_flag_audit_logs (feature_id, admin_user_id, action, old_value, new_value)
    VALUES (
        p_feature_id,
        p_admin_user_id,
        'UPDATE_STAGE',
        jsonb_build_object('required_stage', v_old_stage),
        jsonb_build_object('required_stage', p_new_stage)
    );

    RETURN jsonb_build_object('success', true, 'feature_id', p_feature_id, 'required_stage', p_new_stage);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- SEED DATA: 6 Feature Flags
-- ==========================================
INSERT INTO feature_flags (id, label, description, is_enabled, required_stage) VALUES
    ('SHOWROOMS', 'Showroom Leagues', 'Physical venue leagues with city rivalry scoring', TRUE, 4),
    ('COINS_WALLET', 'Coins & Wallet', 'Virtual coin currency, purchasing, and wallet management', TRUE, 3),
    ('REWARDS_DAILY_CLAIM', 'Daily Rewards', 'Login streaks, daily quests, and coffee hour bonuses', TRUE, 2),
    ('MINI_GAMES', 'Mini-Games', 'Penalty shootout, price predictor, and other skill games', TRUE, 2),
    ('CONTESTS_PREMIUM', 'Premium Contests', 'Paid entry tournaments with coin prize pools', TRUE, 5),
    ('SPONSOR_PORTAL', 'Flash Scout & Sponsors', 'Sponsored alerts, flash scout tips, and partner content', TRUE, 5)
ON CONFLICT (id) DO NOTHING;
