import { supabase } from './supabaseClient';
import type {
  Showroom,
  ShowroomMembership,
  ShowroomSlot,
  UserShowroomState,
  ShowroomHubData,
  ShowroomLeaderboardEntry,
  ShowroomMembershipType,
  ShowroomSlotUnlockSource,
  SHOWROOM_SLOT_PRICING,
} from '../types';

// ==========================================
// MEMBERSHIP OPERATIONS
// ==========================================

/**
 * POST /showrooms/join
 * Join a showroom by ID or QR token.
 * Auto-assigns PRIMARY if user has none, else SECONDARY if slot available.
 */
export const joinShowroom = async (
  userId: string,
  showroomId: string,
  joinedVia: 'qr_scan' | 'invite_link' | 'admin_add' | 'geo_suggest',
  latitude?: number,
  longitude?: number
) => {
  const { data, error } = await supabase.rpc('join_showroom', {
    p_user_id: userId,
    p_showroom_id: showroomId,
    p_joined_via: joinedVia,
    p_latitude: latitude ?? null,
    p_longitude: longitude ?? null,
  });

  if (error) return { data: null, error };
  return { data: data as {
    success: boolean;
    error?: string;
    membership_id?: string;
    membership_type?: ShowroomMembershipType;
    slot_index?: number;
    switch_locked_until?: string;
  }, error: null };
};

/**
 * POST /showrooms/join (by QR token)
 * Resolves QR token to showroom_id, validates token, then joins.
 */
export const joinShowroomByQRToken = async (
  userId: string,
  tokenCode: string,
  latitude?: number,
  longitude?: number
) => {
  // Validate QR token
  const { data: token, error: tokenError } = await supabase
    .from('qr_tokens')
    .select('*')
    .eq('token_code', tokenCode)
    .eq('is_active', true)
    .single();

  if (tokenError || !token) {
    return { data: null, error: { message: 'Invalid or expired QR code' } };
  }

  // Check expiry
  if (token.expires_at && new Date(token.expires_at) < new Date()) {
    return { data: null, error: { message: 'This QR code has expired. Ask staff for a new code.' } };
  }

  // Check max uses
  if (token.max_uses && token.use_count >= token.max_uses) {
    return { data: null, error: { message: 'This QR code has reached its maximum uses.' } };
  }

  // Join the showroom
  const result = await joinShowroom(userId, token.showroom_id, 'qr_scan', latitude, longitude);

  if (result.data?.success) {
    // Increment QR use count
    await supabase
      .from('qr_tokens')
      .update({ use_count: token.use_count + 1 })
      .eq('id', token.id);
  }

  return result;
};

/**
 * POST /showrooms/set-primary
 * Promote a secondary showroom to primary (swap with current primary).
 * Enforces 30-day cooldown.
 */
export const setPrimaryShowroom = async (userId: string, showroomId: string) => {
  const { data, error } = await supabase.rpc('set_primary_showroom', {
    p_user_id: userId,
    p_showroom_id: showroomId,
  });

  if (error) return { data: null, error };
  return { data: data as {
    success: boolean;
    error?: string;
    new_primary_showroom_id?: string;
    switch_locked_until?: string;
    locked_until?: string;
  }, error: null };
};

/**
 * POST /showrooms/leave
 * Leave a showroom. Frees the slot.
 */
export const leaveShowroom = async (userId: string, showroomId: string) => {
  const { data, error } = await supabase.rpc('leave_showroom', {
    p_user_id: userId,
    p_showroom_id: showroomId,
  });

  if (error) return { data: null, error };
  return { data: data as {
    success: boolean;
    error?: string;
    freed_slot_index?: number;
    was_primary?: boolean;
  }, error: null };
};

/**
 * GET /showrooms/my
 * Returns user's primary + secondary memberships + slot unlock status.
 */
export const getMyShowrooms = async (userId: string): Promise<{
  data: UserShowroomState | null;
  error: any;
}> => {
  // Get all active memberships with showroom data
  const { data: memberships, error: membershipError } = await supabase
    .from('showroom_memberships')
    .select(`
      *,
      showrooms (*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('slot_index', { ascending: true });

  if (membershipError) return { data: null, error: membershipError };

  // Get slot unlock status
  const { data: slots, error: slotError } = await supabase
    .from('user_showroom_slots')
    .select('*')
    .eq('user_id', userId);

  if (slotError) return { data: null, error: slotError };

  // Build state
  const primary = memberships?.find(m => m.membership_type === 'PRIMARY') ?? null;
  const secondaries = memberships?.filter(m => m.membership_type === 'SECONDARY') ?? [];

  const slot1 = slots?.find(s => s.slot_index === 1) ?? null;
  const slot2 = slots?.find(s => s.slot_index === 2) ?? null;

  const state: UserShowroomState = {
    primary: primary ? {
      membership_id: primary.id,
      showroom_id: primary.showroom_id,
      user_id: primary.user_id,
      membership_type: primary.membership_type,
      slot_index: primary.slot_index,
      role: primary.role,
      joined_via: primary.joined_via,
      join_latitude: primary.join_latitude,
      join_longitude: primary.join_longitude,
      switch_locked_until: primary.switch_locked_until,
      is_active: primary.is_active,
      last_active_at: primary.last_active_at,
      points_contributed_this_gw: primary.points_contributed_this_gw,
      created_at: primary.created_at,
      showroom: mapShowroomRow(primary.showrooms),
    } : null,
    secondaries: secondaries.map(s => ({
      membership_id: s.id,
      showroom_id: s.showroom_id,
      user_id: s.user_id,
      membership_type: s.membership_type,
      slot_index: s.slot_index,
      role: s.role,
      joined_via: s.joined_via,
      join_latitude: s.join_latitude,
      join_longitude: s.join_longitude,
      switch_locked_until: s.switch_locked_until,
      is_active: s.is_active,
      last_active_at: s.last_active_at,
      points_contributed_this_gw: s.points_contributed_this_gw,
      created_at: s.created_at,
      showroom: mapShowroomRow(s.showrooms),
    })),
    slots: {
      slot_1: slot1 ? {
        slot_index: 1,
        is_unlocked: slot1.is_unlocked,
        unlock_source: slot1.unlock_source,
        unlock_level: slot1.unlock_level,
        unlocked_at: slot1.unlocked_at,
        wallet_tx_id: slot1.wallet_tx_id,
      } : null,
      slot_2: slot2 ? {
        slot_index: 2,
        is_unlocked: slot2.is_unlocked,
        unlock_source: slot2.unlock_source,
        unlock_level: slot2.unlock_level,
        unlocked_at: slot2.unlocked_at,
        wallet_tx_id: slot2.wallet_tx_id,
      } : null,
    },
  };

  return { data: state, error: null };
};

// ==========================================
// SLOT UNLOCK OPERATIONS
// ==========================================

/**
 * POST /showrooms/slots/unlock
 * Unlock a secondary slot via level achievement or coin purchase.
 */
export const unlockShowroomSlot = async (
  userId: string,
  slotIndex: 1 | 2,
  method: ShowroomSlotUnlockSource,
  idempotencyKey?: string
) => {
  const { data, error } = await supabase.rpc('unlock_showroom_slot', {
    p_user_id: userId,
    p_slot_index: slotIndex,
    p_method: method,
    p_idempotency_key: idempotencyKey ?? null,
  });

  if (error) return { data: null, error };
  return { data: data as {
    success: boolean;
    error?: string;
    slot_index?: number;
    unlock_source?: string;
    coin_price?: number;
    already_unlocked?: boolean;
    required_level?: number;
    current_level?: number;
    required_coins?: number;
    current_coins?: number;
  }, error: null };
};

/**
 * GET /showrooms/slots/status
 * Returns unlock status for both secondary slots.
 */
export const getSlotStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_showroom_slots')
    .select('*')
    .eq('user_id', userId);

  if (error) return { data: null, error };

  return {
    data: {
      slot_1: data?.find(s => s.slot_index === 1) ?? { slot_index: 1, is_unlocked: false },
      slot_2: data?.find(s => s.slot_index === 2) ?? { slot_index: 2, is_unlocked: false },
    },
    error: null,
  };
};

// ==========================================
// MATCHDAY HUB DATA
// ==========================================

/**
 * GET /showrooms/:id/hub
 * Returns showroom hub data with member rankings and contribution info.
 */
export const getShowroomHubData = async (
  showroomId: string,
  mode: 'primary' | 'secondary' = 'primary'
): Promise<{ data: ShowroomHubData | null; error: any }> => {
  // Get showroom
  const { data: showroom, error: showroomError } = await supabase
    .from('showrooms')
    .select('*')
    .eq('id', showroomId)
    .single();

  if (showroomError || !showroom) return { data: null, error: showroomError };

  // Get members with user info
  const { data: members, error: memberError } = await supabase
    .from('showroom_memberships')
    .select(`
      *,
      users (display_name, avatar_id, level)
    `)
    .eq('showroom_id', showroomId)
    .eq('is_active', true)
    .order('points_contributed_this_gw', { ascending: false });

  if (memberError) return { data: null, error: memberError };

  const hubData: ShowroomHubData = {
    showroom: mapShowroomRow(showroom),
    membership_type: mode === 'primary' ? 'PRIMARY' : 'SECONDARY',
    members: (members ?? []).map((m, index) => ({
      user_id: m.user_id,
      display_name: m.users?.display_name ?? 'Unknown',
      avatar_id: m.users?.avatar_id ?? 'av1',
      gameweek_points: m.points_contributed_this_gw,
      total_points: 0, // Would come from fantasy_teams join
      rank: index + 1,
      rank_change: 0,
      is_primary_member: m.membership_type === 'PRIMARY',
    })),
    weekly_score: showroom.weekly_score ?? 0,
    city_rank: showroom.city_rank,
    contributes_to_rivalry: mode === 'primary',
  };

  return { data: hubData, error: null };
};

// ==========================================
// CHECK-IN OPERATIONS
// ==========================================

/**
 * POST /showrooms/:id/checkin
 * Daily check-in. Once per day per user (not per showroom).
 */
export const showroomCheckin = async (
  userId: string,
  showroomId: string,
  latitude?: number,
  longitude?: number
) => {
  const { data, error } = await supabase.rpc('showroom_checkin', {
    p_user_id: userId,
    p_showroom_id: showroomId,
    p_latitude: latitude ?? null,
    p_longitude: longitude ?? null,
  });

  if (error) return { data: null, error };
  return { data: data as {
    success: boolean;
    error?: string;
    checkin_id?: string;
    xp_earned?: number;
    coins_earned?: number;
    is_match_hour_bonus?: boolean;
  }, error: null };
};

/**
 * Check if user has already checked in today.
 */
export const hasCheckedInToday = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('showroom_checkins')
    .select('id')
    .eq('user_id', userId)
    .eq('checkin_date', today)
    .maybeSingle();

  return { hasCheckedIn: !!data, error };
};

// ==========================================
// LEADERBOARD OPERATIONS
// ==========================================

/**
 * GET /leaderboards/showrooms/city
 * Returns city-level showroom leaderboard.
 */
export const getCityLeaderboard = async (
  city: string,
  gameweek?: number
): Promise<{ data: ShowroomLeaderboardEntry[] | null; error: any }> => {
  let query = supabase
    .from('showroom_weekly_scores')
    .select(`
      *,
      showrooms (name, logo_url, member_count, primary_member_count)
    `)
    .eq('city', city)
    .order('weekly_score', { ascending: false });

  if (gameweek) {
    query = query.eq('gameweek', gameweek);
  }

  const { data, error } = await query.limit(50);

  if (error) return { data: null, error };

  const entries: ShowroomLeaderboardEntry[] = (data ?? []).map((row, index) => ({
    showroom_id: row.showroom_id,
    name: row.showrooms?.name ?? 'Unknown',
    logo_url: row.showrooms?.logo_url,
    rank: index + 1,
    weekly_score: row.weekly_score,
    member_count: row.showrooms?.member_count ?? 0,
    primary_member_count: row.showrooms?.primary_member_count ?? 0,
    active_members: row.active_primary_count ?? 0,
  }));

  return { data: entries, error: null };
};

/**
 * GET /leaderboards/showrooms/:id
 * Returns individual showroom's internal leaderboard.
 */
export const getShowroomLeaderboard = async (showroomId: string) => {
  const { data, error } = await supabase
    .from('showroom_memberships')
    .select(`
      *,
      users (display_name, avatar_id, level)
    `)
    .eq('showroom_id', showroomId)
    .eq('is_active', true)
    .order('points_contributed_this_gw', { ascending: false });

  if (error) return { data: null, error };

  return {
    data: (data ?? []).map((m, index) => ({
      user_id: m.user_id,
      display_name: m.users?.display_name ?? 'Unknown',
      avatar_id: m.users?.avatar_id ?? 'av1',
      level: m.users?.level ?? 1,
      gameweek_points: m.points_contributed_this_gw,
      rank: index + 1,
      membership_type: m.membership_type,
      is_primary: m.membership_type === 'PRIMARY',
    })),
    error: null,
  };
};

// ==========================================
// SHOWROOM BROWSE/SEARCH
// ==========================================

/**
 * GET /showrooms (browse all verified showrooms)
 */
export const getVerifiedShowrooms = async (filters?: {
  city?: string;
  venue_type?: string;
  tier?: string;
  search?: string;
}) => {
  let query = supabase
    .from('showrooms')
    .select('*')
    .eq('verification_status', 'verified')
    .order('weekly_score', { ascending: false });

  if (filters?.city) query = query.eq('city', filters.city);
  if (filters?.venue_type) query = query.eq('venue_type', filters.venue_type);
  if (filters?.tier) query = query.eq('tier', filters.tier);
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

  const { data, error } = await query;
  return {
    data: data?.map(mapShowroomRow) ?? null,
    error,
  };
};

// ==========================================
// AGGREGATION JOB (called by scheduled job)
// ==========================================

/**
 * Calculates weekly scores for all showrooms in a city and updates city leaderboard.
 * Should be called by a cron job or BullMQ worker after each gameweek.
 */
export const runCityAggregation = async (city: string, gameweek: number, season: string = '2024-25') => {
  // Get all verified showrooms in city
  const { data: showrooms, error } = await supabase
    .from('showrooms')
    .select('id')
    .eq('city', city)
    .eq('verification_status', 'verified');

  if (error || !showrooms) return { error };

  // Calculate weekly score for each showroom
  const results = [];
  for (const sr of showrooms) {
    const { data } = await supabase.rpc('calculate_showroom_weekly_score', {
      p_showroom_id: sr.id,
      p_gameweek: gameweek,
      p_season: season,
    });
    results.push(data);
  }

  // Build city leaderboard snapshot
  const { data: scores } = await supabase
    .from('showroom_weekly_scores')
    .select(`
      *,
      showrooms (name, logo_url, member_count, primary_member_count)
    `)
    .eq('city', city)
    .eq('gameweek', gameweek)
    .eq('season', season)
    .order('weekly_score', { ascending: false });

  const rankings = (scores ?? []).map((s, index) => ({
    showroom_id: s.showroom_id,
    name: s.showrooms?.name,
    rank: index + 1,
    weekly_score: s.weekly_score,
    primary_member_count: s.primary_member_count,
    active_members: s.active_primary_count,
  }));

  // Update city ranks on showrooms
  for (const r of rankings) {
    await supabase
      .from('showrooms')
      .update({ city_rank: r.rank })
      .eq('id', r.showroom_id);

    await supabase
      .from('showroom_weekly_scores')
      .update({ city_rank: r.rank })
      .eq('showroom_id', r.showroom_id)
      .eq('gameweek', gameweek)
      .eq('season', season);
  }

  // Upsert city leaderboard snapshot
  await supabase
    .from('city_leaderboard_snapshots')
    .upsert({
      city,
      gameweek,
      season,
      rankings: JSON.stringify(rankings),
      total_showrooms: rankings.length,
      total_participants: rankings.reduce((sum, r) => sum + (r.primary_member_count ?? 0), 0),
    }, { onConflict: 'city,gameweek,season' });

  return { data: { city, gameweek, rankings_count: rankings.length }, error: null };
};

// ==========================================
// HELPERS
// ==========================================

function mapShowroomRow(row: any): Showroom {
  return {
    showroom_id: row.id,
    name: row.name,
    slug: row.slug,
    venue_type: row.venue_type,
    tier: row.tier,
    address: row.address,
    city: row.city,
    sub_city: row.sub_city,
    woreda: row.woreda,
    latitude: row.latitude,
    longitude: row.longitude,
    business_license_url: row.business_license_url,
    verification_status: row.verification_status,
    verified_at: row.verified_at,
    logo_url: row.logo_url,
    cover_photo_url: row.cover_photo_url,
    description: row.description,
    max_members: row.max_members,
    join_radius_meters: row.join_radius_meters,
    is_public: row.is_public,
    member_count: row.member_count,
    primary_member_count: row.primary_member_count ?? 0,
    active_member_count: row.active_member_count,
    weekly_score: row.weekly_score,
    city_rank: row.city_rank,
    admin_user_id: row.admin_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
