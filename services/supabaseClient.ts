import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gfsehgzgkfizdsgyjswl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc2VoZ3pna2ZpemRzZ3lqc3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTkyMTQsImV4cCI6MjA4NTY5NTIxNH0.ao9IXMGc4nzT7DdIIIvhUQA-ESynnA9WQXJhF0HVVVg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });
  return { data, error };
};

export const verifyOtp = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Real-time subscription helper
export const subscribeToChannel = (
  channelName: string,
  table: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe();
};
