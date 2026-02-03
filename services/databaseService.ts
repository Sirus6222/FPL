import { supabase } from './supabaseClient';
import type { User, FantasyTeam, League, LeagueMember, Transaction, LoginStreak, ChatMessage } from '../types/database';

// ==========================================
// USER OPERATIONS
// ==========================================

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const createUserProfile = async (userId: string, displayName: string, phone?: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      display_name: displayName,
      phone: phone || null,
      avatar_id: 'av1',
      level: 1,
      xp: 0,
      coins: 0,
      eth_balance: 0
    })
    .select()
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const addCoins = async (userId: string, amount: number) => {
  const { data, error } = await supabase.rpc('add_coins', {
    p_user_id: userId,
    p_amount: amount
  });
  return { data, error };
};

// ==========================================
// FANTASY TEAM OPERATIONS
// ==========================================

export const getFantasyTeam = async (userId: string, seasonId: string = '2024-25') => {
  const { data, error } = await supabase
    .from('fantasy_teams')
    .select(`
      *,
      squad_players (*)
    `)
    .eq('user_id', userId)
    .eq('season_id', seasonId)
    .single();
  return { data, error };
};

export const createFantasyTeam = async (userId: string, teamName: string) => {
  const { data, error } = await supabase
    .from('fantasy_teams')
    .insert({
      user_id: userId,
      team_name: teamName,
      formation: '3-4-3',
      bank_balance: 0.0,
      total_value: 100.0,
      free_transfers: 1
    })
    .select()
    .single();
  return { data, error };
};

export const updateFantasyTeam = async (teamId: string, updates: Partial<FantasyTeam>) => {
  const { data, error } = await supabase
    .from('fantasy_teams')
    .update(updates)
    .eq('id', teamId)
    .select()
    .single();
  return { data, error };
};

// ==========================================
// LEAGUE OPERATIONS
// ==========================================

export const getLeagues = async () => {
  const { data, error } = await supabase
    .from('leagues')
    .select(`
      *,
      league_members (count)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getLeagueById = async (leagueId: string) => {
  const { data, error } = await supabase
    .from('leagues')
    .select(`
      *,
      league_members (
        *,
        users (display_name, avatar_id, level)
      )
    `)
    .eq('id', leagueId)
    .single();
  return { data, error };
};

export const getUserLeagues = async (userId: string) => {
  const { data, error } = await supabase
    .from('league_members')
    .select(`
      *,
      leagues (*)
    `)
    .eq('user_id', userId);
  return { data, error };
};

export const joinLeague = async (leagueId: string, userId: string) => {
  const { data, error } = await supabase
    .from('league_members')
    .insert({
      league_id: leagueId,
      user_id: userId,
      rank: 0,
      total_points: 0,
      gameweek_points: 0
    })
    .select()
    .single();
  return { data, error };
};

export const leaveLeague = async (leagueId: string, userId: string) => {
  const { error } = await supabase
    .from('league_members')
    .delete()
    .eq('league_id', leagueId)
    .eq('user_id', userId);
  return { error };
};

export const getLeagueStandings = async (leagueId: string) => {
  const { data, error } = await supabase
    .from('league_members')
    .select(`
      *,
      users (display_name, avatar_id)
    `)
    .eq('league_id', leagueId)
    .order('total_points', { ascending: false });
  return { data, error };
};

// ==========================================
// TRANSACTION OPERATIONS
// ==========================================

export const createTransaction = async (
  userId: string,
  type: Transaction['type'],
  amount: number,
  currency: 'etb' | 'coins' = 'etb',
  reference?: string
) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type,
      amount,
      currency,
      reference,
      status: 'pending'
    })
    .select()
    .single();
  return { data, error };
};

export const getUserTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: 'completed' | 'failed',
  telebirrReference?: string
) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status,
      telebirr_reference: telebirrReference
    })
    .eq('id', transactionId)
    .select()
    .single();
  return { data, error };
};

// ==========================================
// LOGIN STREAK OPERATIONS
// ==========================================

export const updateLoginStreak = async (userId: string) => {
  // Call the database function
  const { data, error } = await supabase.rpc('update_login_streak', {
    p_user_id: userId
  });
  return { data, error };
};

export const getLoginStreak = async (userId: string) => {
  const { data, error } = await supabase
    .from('login_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

// ==========================================
// DAILY QUEST OPERATIONS
// ==========================================

export const getDailyQuests = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_quest_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today);
  return { data, error };
};

export const completeQuest = async (userId: string, questId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_quest_progress')
    .upsert({
      user_id: userId,
      quest_id: questId,
      date: today,
      is_completed: true,
      claimed_at: new Date().toISOString()
    })
    .select()
    .single();
  return { data, error };
};

// ==========================================
// CHAT OPERATIONS
// ==========================================

export const getLeagueChatMessages = async (leagueId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      users (display_name, avatar_id)
    `)
    .eq('league_id', leagueId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: data?.reverse(), error };
};

export const sendChatMessage = async (leagueId: string, userId: string, message: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      league_id: leagueId,
      user_id: userId,
      message
    })
    .select(`
      *,
      users (display_name, avatar_id)
    `)
    .single();
  return { data, error };
};

// Subscribe to real-time chat messages
export const subscribeToChatMessages = (
  leagueId: string,
  callback: (message: ChatMessage) => void
) => {
  return supabase
    .channel(`chat:${leagueId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `league_id=eq.${leagueId}`
      },
      (payload) => callback(payload.new as ChatMessage)
    )
    .subscribe();
};

// ==========================================
// AVATAR OPERATIONS
// ==========================================

export const getUserAvatars = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_avatars')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

export const unlockAvatar = async (userId: string, avatarId: string) => {
  const { data, error } = await supabase
    .from('user_avatars')
    .insert({
      user_id: userId,
      avatar_id: avatarId,
      is_active: false
    })
    .select()
    .single();
  return { data, error };
};

export const setActiveAvatar = async (userId: string, avatarId: string) => {
  // First, deactivate all avatars
  await supabase
    .from('user_avatars')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Then activate the selected one
  const { data, error } = await supabase
    .from('user_avatars')
    .update({ is_active: true })
    .eq('user_id', userId)
    .eq('avatar_id', avatarId)
    .select()
    .single();

  // Also update the user's avatar_id
  await supabase
    .from('users')
    .update({ avatar_id: avatarId })
    .eq('id', userId);

  return { data, error };
};
