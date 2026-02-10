import { supabase } from './supabaseClient';

// ==========================================
// FEATURE FLAG OPERATIONS
// ==========================================

export const getFeatureFlags = async () => {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .order('required_stage', { ascending: true });
  return { data, error };
};

export const toggleFeatureFlag = async (
  featureId: string,
  enabled: boolean,
  adminUserId: string
) => {
  const { data, error } = await supabase.rpc('toggle_feature_flag', {
    p_admin_user_id: adminUserId,
    p_feature_id: featureId,
    p_enabled: enabled,
  });
  return { data, error };
};

export const updateFeatureStage = async (
  featureId: string,
  newStage: number,
  adminUserId: string
) => {
  const { data, error } = await supabase.rpc('update_feature_stage', {
    p_admin_user_id: adminUserId,
    p_feature_id: featureId,
    p_new_stage: newStage,
  });
  return { data, error };
};

// ==========================================
// AUDIT LOG OPERATIONS
// ==========================================

export const getAuditLogs = async (limit: number = 50) => {
  const { data, error } = await supabase
    .from('feature_flag_audit_logs')
    .select(`
      *,
      users (display_name),
      feature_flags (label)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

// ==========================================
// USER STAGE OPERATIONS
// ==========================================

export const advanceUserStage = async (userId: string, newStage: number) => {
  const { data, error } = await supabase
    .from('users')
    .update({ current_stage: newStage })
    .eq('id', userId)
    .select('id, display_name, current_stage')
    .single();
  return { data, error };
};

export const getUserStage = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('current_stage, role')
    .eq('id', userId)
    .single();
  return { data, error };
};
