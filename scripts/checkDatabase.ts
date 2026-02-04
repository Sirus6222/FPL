// Run with: npx tsx scripts/checkDatabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfsehgzgkfizdsgyjswl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc2VoZ3pna2ZpemRzZ3lqc3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTkyMTQsImV4cCI6MjA4NTY5NTIxNH0.ao9IXMGc4nzT7DdIIIvhUQA-ESynnA9WQXJhF0HVVVg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n');

  const tables = [
    'users',
    'fantasy_teams',
    'squad_players',
    'leagues',
    'league_members',
    'transactions',
    'login_streaks',
    'daily_quest_progress',
    'chat_messages',
    'user_avatars'
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ERROR - ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count} rows`);
      }
    } catch (e: any) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }

  // Check specific data
  console.log('\n📊 Sample Data Check:');

  // Check leagues
  const { data: leagues, error: leagueErr } = await supabase
    .from('leagues')
    .select('name, type, entry_fee, entry_currency')
    .limit(5);

  if (leagueErr) {
    console.log('❌ Could not fetch leagues:', leagueErr.message);
  } else if (leagues && leagues.length > 0) {
    console.log('\nLeagues:');
    leagues.forEach(l => console.log(`  - ${l.name} (${l.type}) - ${l.entry_fee} ${l.entry_currency}`));
  }

  // Check users
  const { data: users, error: userErr } = await supabase
    .from('users')
    .select('display_name, level, coins')
    .limit(5);

  if (userErr) {
    console.log('❌ Could not fetch users:', userErr.message);
  } else if (users && users.length > 0) {
    console.log('\nSample Users:');
    users.forEach(u => console.log(`  - ${u.display_name} (Level ${u.level}, ${u.coins} coins)`));
  }

  console.log('\n✨ Database check complete!');
}

checkDatabase();
