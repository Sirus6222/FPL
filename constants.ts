
import { Player, Position, League, Transaction, TeamFixtures, TeamStats, RankHistory, PremierLeagueTeam, DailyQuest, TriviaQuestion, ChatMessage, Gameweek, LevelInfo, Badge, AvatarItem, LeagueMember, LeagueMatchup, PotInfo } from './types';

export const APP_NAME = "Ethiopian FPL";
export const CURRENCY_SYMBOL = "ETB";

export const TRANSLATIONS = {
  en: {
    home: "Home",
    team: "My Team",
    transfers: "Transfers",
    stats: "Stats",
    leagues: "Leagues",
    wallet: "Wallet",
    points: "Points",
    rank: "Rank",
    balance: "Balance",
    deadline: "Deadline",
    gameweek: "Gameweek",
    deposit: "Top Up",
    withdraw: "Withdraw",
    trending: "Trending in Ethiopia",
    join: "Join",
    bench: "Bench",
    link_telegram: "Link Telegram",
    save_team: "Save Team",
    search_player: "Search player...",
    filter: "Filter",
    price: "Price",
    form: "Form",
    select: "Select",
    captain: "C",
    vice_captain: "V",
    confirm: "Confirm",
    fdr: "Fixture Difficulty",
    difficulty: "Difficulty",
    projected: "Projected",
    safety_score: "Safety Score",
    status_active: "Active: Transfers Open",
    status_locked: "Locked: Matches Live",
    status_processing: "Processing: Updating Tables",
    team_stats: "Team Stats",
    player_stats: "Player Stats",
    goals_conceded: "Goals Conceded",
    goals_scored: "Goals Scored"
  },
  am: {
    home: "መነሻ",
    team: "ቡድኔ",
    transfers: "ዝውውር",
    stats: "ስታትስቲክስ",
    leagues: "ሊጎች",
    wallet: "ቦርሳ",
    points: "ነጥቦች",
    rank: "ደረጃ",
    balance: "ሂሳብ",
    deadline: "ማብቂያ",
    gameweek: "ጨዋታ ሳምንት",
    deposit: "ገንዘብ አስገባ",
    withdraw: "አውጣ",
    trending: "በኢትዮጵያ ተወዳጅ",
    join: "ተቀላቀል",
    bench: "ተጠባባቂ",
    link_telegram: "ቴሌግራም አገናኝ",
    save_team: "ቡድን አስቀምጥ",
    search_player: "ተጫዋች ፈልግ...",
    filter: "አጣራ",
    price: "ዋጋ",
    form: "ብቃት",
    select: "ምረጥ",
    captain: "መሪ",
    vice_captain: "ም/መሪ",
    confirm: "አረጋግጥ",
    fdr: "የጨዋታ ከባድነት",
    difficulty: "ከባድነት",
    projected: "የሚጠበቅ",
    safety_score: "የደህንነት ነጥብ",
    status_active: "ክፍት: ዝውውር ይቻላል",
    status_locked: "ተዘግቷል: ጨዋታ በመካሄድ ላይ",
    status_processing: "በማስላት ላይ: ሰንጠረዥ እየታደሰ ነው",
    team_stats: "የቡድን ስታትስቲክስ",
    player_stats: "የተጫዋች ስታትስቲክስ",
    goals_conceded: "የገባባቸው ጎሎች",
    goals_scored: "ያገቡት ጎሎች"
  }
};

export const LEVELS_CONFIG: LevelInfo[] = [
  { level: 1, title: "Amateur Scout", min_xp: 0, max_xp: 500, rewards: ["Basic Avatar"] },
  { level: 5, title: "Rising Star", min_xp: 500, max_xp: 2000, rewards: ["Bronze Badge", "League Chat"] },
  { level: 10, title: "Team Manager", min_xp: 2000, max_xp: 5000, rewards: ["Silver Badge", "Coffee Avatar", "VIP Leagues"] },
  { level: 20, title: "Tactical Genius", min_xp: 5000, max_xp: 15000, rewards: ["Gold Badge", "Lion Avatar"] },
  { level: 50, title: "Legendary Manager", min_xp: 15000, max_xp: 50000, rewards: ["Platinum Badge", "King Avatar"] },
];

export const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Early Adopter", description: "Joined in the first month", icon: "Medal", color: "text-blue-500" },
  { id: "b2", name: "Bronze Strategist", description: "Reached Level 5", icon: "Shield", color: "text-orange-700" },
  { id: "b3", name: "Top 1k Finish", description: "Finished GW in top 1000", icon: "Trophy", color: "text-yellow-500" },
  { id: "b4", name: "Transfer Guru", description: "Made 10+ profitable transfers", icon: "TrendingUp", color: "text-green-500" },
];

export const MOCK_AVATARS: AvatarItem[] = [
  { id: "av1", name: "Default Kit", url: "https://ui-avatars.com/api/?name=Manager&background=0D8ABC&color=fff", min_level: 1, is_premium: false },
  { id: "av2", name: "Ethio Coffee", url: "https://ui-avatars.com/api/?name=EC&background=5D4037&color=fff", min_level: 10, is_premium: false },
  { id: "av3", name: "St. George", url: "https://ui-avatars.com/api/?name=SG&background=FFD700&color=000", min_level: 10, is_premium: false },
  { id: "av4", name: "Lion of Judah", url: "https://ui-avatars.com/api/?name=Lion&background=FF2882&color=fff", min_level: 20, is_premium: true },
  { id: "av5", name: "Walia Ibex", url: "https://ui-avatars.com/api/?name=Ibex&background=00FF85&color=000", min_level: 50, is_premium: true },
];

export const MOCK_DAILY_QUESTS: DailyQuest[] = [
  { id: '1', label: 'Check 5 Player Profiles', is_completed: true, reward_amount: 50, reward_type: 'xp', icon: 'search' },
  { id: '2', label: 'Make a Transfer Plan', is_completed: false, reward_amount: 10, reward_type: 'coins', icon: 'shuffle' },
  { id: '3', label: 'Share Team on Telegram', is_completed: false, reward_amount: 20, reward_type: 'coins', icon: 'share' },
];

export const MOCK_TRIVIA: TriviaQuestion[] = [
  { id: 1, question: "Who is the top scorer in Premier League history?", options: ["Rooney", "Shearer", "Kane", "Henry"], correct_answer: 1 },
  { id: 2, question: "Which Ethiopian player played for Arsenal?", options: ["Gedion Zelalem", "Shimelis Bekele", "Getaneh Kebede", "Saladin Said"], correct_answer: 0 },
  { id: 3, question: "How many points for a goalkeeper clean sheet?", options: ["3", "4", "5", "6"], correct_answer: 1 },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: '1', user_name: 'Dawit M.', message: 'Did you see Haaland blank? My captaincy is ruined! 😂', timestamp: '10:05', is_me: false, avatar: 'https://i.pravatar.cc/150?u=dawit' },
  { id: '2', user_name: 'Tigist A.', message: 'I told you to pick Salah! 🦁', timestamp: '10:07', is_me: false, avatar: 'https://i.pravatar.cc/150?u=tigist' },
  { id: '3', user_name: 'You', message: 'There goes my rank... time to use the Wildcard?', timestamp: '10:10', is_me: true },
];

// Mock Fixtures Data
export const MOCK_FIXTURES: TeamFixtures = {
  "MCI": [
    { gameweek: 38, opponent: "WHU", is_home: true, difficulty: 2 }, // DGW Match 1
    { gameweek: 38, opponent: "TOT", is_home: false, difficulty: 4 }, // DGW Match 2
    { gameweek: 39, opponent: "BHA", is_home: false, difficulty: 3 },
    { gameweek: 40, opponent: "ARS", is_home: true, difficulty: 5 },
    { gameweek: 41, opponent: "NFO", is_home: false, difficulty: 2 },
    { gameweek: 42, opponent: "WOL", is_home: true, difficulty: 2 },
  ],
  "ARS": [
    { gameweek: 38, opponent: "EVE", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "CRY", is_home: false, difficulty: 2 },
    { gameweek: 40, opponent: "MCI", is_home: false, difficulty: 5 },
    { gameweek: 41, opponent: "LIV", is_home: true, difficulty: 4 },
    { gameweek: 42, opponent: "NEW", is_home: false, difficulty: 4 },
  ],
  "LIV": [
    { gameweek: 38, opponent: "WOL", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "MUN", is_home: false, difficulty: 4 },
    { gameweek: 40, opponent: "CHE", is_home: true, difficulty: 3 },
    { gameweek: 41, opponent: "ARS", is_home: false, difficulty: 5 },
    { gameweek: 42, opponent: "TOT", is_home: true, difficulty: 3 },
  ],
  "LUT": [ // BGW in 38 (Empty)
    { gameweek: 39, opponent: "WHU", is_home: false, difficulty: 3 },
    { gameweek: 40, opponent: "EVE", is_home: true, difficulty: 2 },
    { gameweek: 41, opponent: "BRE", is_home: true, difficulty: 3 },
    { gameweek: 42, opponent: "FUL", is_home: false, difficulty: 2 },
  ],
  "DEFAULT": [
    { gameweek: 38, opponent: "LIV", is_home: false, difficulty: 5 },
    { gameweek: 39, opponent: "MCI", is_home: true, difficulty: 5 },
    { gameweek: 40, opponent: "BUR", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "LUT", is_home: true, difficulty: 1 },
    { gameweek: 42, opponent: "SHU", is_home: false, difficulty: 1 },
  ]
};

export const getTeamFixtures = (teamId: string) => MOCK_FIXTURES[teamId] || MOCK_FIXTURES["DEFAULT"];

// Mock Team Stats for "Deep Dive"
export const MOCK_TEAM_STATS: TeamStats[] = [
  { id: "SHU", name: "Sheffield Utd", short_name: "SHU", goals_scored: 30, goals_conceded: 90, clean_sheets: 1, xg_for: 32.5, xg_against: 85.2, next_opponent: "TOT", next_difficulty: 5 },
  { id: "LUT", name: "Luton Town", short_name: "LUT", goals_scored: 45, goals_conceded: 75, clean_sheets: 2, xg_for: 42.1, xg_against: 78.4, next_opponent: "WHU", next_difficulty: 3 },
  { id: "BUR", name: "Burnley", short_name: "BUR", goals_scored: 35, goals_conceded: 70, clean_sheets: 4, xg_for: 34.2, xg_against: 65.1, next_opponent: "NFO", next_difficulty: 2 },
  { id: "MCI", name: "Man City", short_name: "MCI", goals_scored: 88, goals_conceded: 32, clean_sheets: 12, xg_for: 85.4, xg_against: 30.1, next_opponent: "WHU", next_difficulty: 2 },
  { id: "ARS", name: "Arsenal", short_name: "ARS", goals_scored: 85, goals_conceded: 28, clean_sheets: 16, xg_for: 80.2, xg_against: 25.5, next_opponent: "EVE", next_difficulty: 2 },
];

// Mock Rank History for Trend Tracker
export const MOCK_RANK_HISTORY: RankHistory[] = [
  { gameweek: 30, rank: 25000 },
  { gameweek: 31, rank: 22000 },
  { gameweek: 32, rank: 28000 }, // Red arrow
  { gameweek: 33, rank: 26000 },
  { gameweek: 34, rank: 21000 },
  { gameweek: 35, rank: 18000 }, // Good run
  { gameweek: 36, rank: 14502 }, // Current
];

// Mock Players Database
export const MOCK_PLAYERS: Player[] = [
  { 
    id: 1, name: "Haaland", full_name: "Erling Haaland", team: "MCI", position: Position.FWD, price: 14.0, purchase_price: 13.6,
    points_last_gw: 13, total_points: 152, form: 8.5, selected_by_percent: 82.3, chance_of_price_change: 80, price_trend: 'up',
    is_bench: false, is_captain: true, image: "https://picsum.photos/100/100?random=1",
    status: 'available', minutes_played: 2400, matches_played: 28, yellow_cards: 2, red_cards: 0, bonus_points: 25, price_change_this_week: 0.1,
    goals_scored: 25, assists: 5, clean_sheets: 0,
    stats_xg: 26.4, stats_xa: 3.2, stats_ict: 280.5, stats_goals_conceded: 0,
    stats_radar: { pace: 89, shooting: 95, passing: 65, dribbling: 75, defending: 30, physical: 88 },
    recent_points: [2, 13, 8, 2, 13], projected_points: 10.5, bps: 35
  },
  { 
    id: 2, name: "Salah", full_name: "Mohamed Salah", team: "LIV", position: Position.MID, price: 13.2, purchase_price: 13.0,
    points_last_gw: 8, total_points: 145, form: 7.9, selected_by_percent: 45.1, chance_of_price_change: 20, price_trend: 'stable',
    is_bench: false, is_vice_captain: true, image: "https://picsum.photos/100/100?random=2",
    status: 'available', minutes_played: 2300, matches_played: 27, yellow_cards: 1, red_cards: 0, bonus_points: 20, price_change_this_week: 0.0,
    goals_scored: 18, assists: 10, clean_sheets: 12,
    stats_xg: 19.2, stats_xa: 9.5, stats_ict: 265.1, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 89, passing: 82, dribbling: 86, defending: 40, physical: 70 },
    recent_points: [8, 10, 3, 15, 8], projected_points: 8.2, bps: 28
  },
  { 
    id: 3, name: "Saka", full_name: "Bukayo Saka", team: "ARS", position: Position.MID, price: 10.1, purchase_price: 10.1,
    points_last_gw: 6, total_points: 130, form: 7.2, selected_by_percent: 55.4, 
    is_bench: false, image: "https://picsum.photos/100/100?random=3",
    status: 'available', minutes_played: 2500, matches_played: 30, yellow_cards: 3, red_cards: 0, bonus_points: 18, price_change_this_week: 0.1,
    goals_scored: 15, assists: 9, clean_sheets: 14,
    stats_xg: 14.8, stats_xa: 8.1, stats_ict: 230.4, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 82, passing: 84, dribbling: 88, defending: 55, physical: 68 },
    recent_points: [6, 2, 11, 7, 6], projected_points: 6.8, bps: 24
  },
  { 
    id: 4, name: "Watkins", full_name: "Ollie Watkins", team: "AVL", position: Position.FWD, price: 8.9, purchase_price: 9.2,
    points_last_gw: 2, total_points: 120, form: 5.4, selected_by_percent: 23.0, chance_of_price_change: 90, price_trend: 'down',
    is_bench: false, image: "https://picsum.photos/100/100?random=4",
    status: 'available', minutes_played: 2600, matches_played: 31, yellow_cards: 4, red_cards: 0, bonus_points: 15, price_change_this_week: -0.1,
    goals_scored: 19, assists: 12, clean_sheets: 0,
    stats_xg: 18.5, stats_xa: 4.2, stats_ict: 210.8, stats_goals_conceded: 0,
    stats_radar: { pace: 84, shooting: 83, passing: 70, dribbling: 76, defending: 35, physical: 72 },
    recent_points: [2, 9, 2, 5, 2], projected_points: 5.4, bps: 18
  },
  { 
    id: 5, name: "Onana", full_name: "Andre Onana", team: "MUN", position: Position.GK, price: 4.8, purchase_price: 4.8,
    points_last_gw: 6, total_points: 95, form: 6.0, selected_by_percent: 12.5, 
    is_bench: false, image: "https://picsum.photos/100/100?random=5",
    status: 'available', minutes_played: 2800, matches_played: 32, yellow_cards: 2, red_cards: 0, bonus_points: 8, price_change_this_week: 0.0,
    goals_scored: 0, assists: 0, clean_sheets: 9,
    stats_xg: 0, stats_xa: 0.1, stats_ict: 45.2, stats_goals_conceded: 45, stats_saves: 120,
    recent_points: [2, 6, 2, 3, 6], projected_points: 3.5, bps: 22
  },
  { 
    id: 6, name: "Saliba", full_name: "William Saliba", team: "ARS", position: Position.DEF, price: 5.8, purchase_price: 5.5,
    points_last_gw: 6, total_points: 110, form: 6.8, selected_by_percent: 38.2, 
    is_bench: false, image: "https://picsum.photos/100/100?random=6",
    status: 'available', minutes_played: 2800, matches_played: 32, yellow_cards: 2, red_cards: 0, bonus_points: 12, price_change_this_week: 0.1,
    goals_scored: 2, assists: 1, clean_sheets: 16,
    stats_xg: 1.2, stats_xa: 0.5, stats_ict: 85.3, stats_goals_conceded: 24,
    stats_radar: { pace: 78, shooting: 30, passing: 85, dribbling: 65, defending: 92, physical: 85 },
    recent_points: [6, 6, 1, 6, 6], projected_points: 5.9, bps: 20
  },
  { 
    id: 8, name: "Son", full_name: "Heung-Min Son", team: "TOT", position: Position.MID, price: 9.8, purchase_price: 9.8,
    points_last_gw: 10, total_points: 138, form: 8.1, selected_by_percent: 22.1, 
    is_bench: false, image: "https://picsum.photos/100/100?random=8",
    status: 'available', minutes_played: 2400, matches_played: 29, yellow_cards: 1, red_cards: 0, bonus_points: 19, price_change_this_week: 0.0,
    goals_scored: 17, assists: 9, clean_sheets: 6,
    stats_xg: 13.5, stats_xa: 7.2, stats_ict: 240.1, stats_goals_conceded: 0,
    stats_radar: { pace: 87, shooting: 88, passing: 80, dribbling: 84, defending: 35, physical: 65 },
    recent_points: [2, 10, 3, 11, 10], projected_points: 7.5, bps: 26
  },
  { 
    id: 9, name: "Palmer", full_name: "Cole Palmer", team: "CHE", position: Position.MID, price: 6.2, purchase_price: 5.0,
    points_last_gw: 15, total_points: 160, form: 9.5, selected_by_percent: 60.2, chance_of_price_change: 95, price_trend: 'up',
    is_bench: false, image: "https://picsum.photos/100/100?random=9",
    status: 'available', minutes_played: 2100, matches_played: 26, yellow_cards: 4, red_cards: 0, bonus_points: 22, price_change_this_week: 0.2,
    goals_scored: 21, assists: 10, clean_sheets: 8,
    stats_xg: 18.2, stats_xa: 8.9, stats_ict: 295.2, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 85, passing: 88, dribbling: 82, defending: 45, physical: 65 },
    recent_points: [20, 2, 8, 12, 15], projected_points: 9.1, bps: 42
  },
  { 
    id: 10, name: "Gabriel", full_name: "Gabriel Magalhaes", team: "ARS", position: Position.DEF, price: 5.2, purchase_price: 5.2,
    points_last_gw: 6, total_points: 105, form: 6.5, selected_by_percent: 15.5, 
    is_bench: false, image: "https://picsum.photos/100/100?random=10",
    status: 'available', minutes_played: 2700, matches_played: 31, yellow_cards: 3, red_cards: 0, bonus_points: 10, price_change_this_week: 0.0,
    goals_scored: 4, assists: 0, clean_sheets: 15,
    stats_xg: 3.5, stats_xa: 0.2, stats_ict: 92.1, stats_goals_conceded: 25,
    stats_radar: { pace: 70, shooting: 50, passing: 72, dribbling: 55, defending: 89, physical: 90 },
    recent_points: [6, 6, 1, 15, 6], projected_points: 5.8, bps: 19
  },
  { 
    id: 12, name: "Udogie", full_name: "Destiny Udogie", team: "TOT", position: Position.DEF, price: 4.9, purchase_price: 4.5,
    points_last_gw: 5, total_points: 92, form: 6.1, selected_by_percent: 8.5, 
    is_bench: false, image: "https://picsum.photos/100/100?random=12",
    status: 'available', minutes_played: 2200, matches_played: 28, yellow_cards: 6, red_cards: 0, bonus_points: 8, price_change_this_week: -0.1,
    goals_scored: 2, assists: 3, clean_sheets: 5,
    stats_xg: 1.8, stats_xa: 2.1, stats_ict: 75.4, stats_goals_conceded: 40,
    stats_radar: { pace: 85, shooting: 55, passing: 74, dribbling: 78, defending: 75, physical: 72 },
    recent_points: [1, 5, 2, 8, 5], projected_points: 3.2, bps: 15
  },
  { 
    id: 15, name: "Van Dijk", full_name: "Virgil van Dijk", team: "LIV", position: Position.DEF, price: 6.4, purchase_price: 6.4,
    points_last_gw: 6, total_points: 118, form: 7.0, selected_by_percent: 25.1, 
    is_bench: false, image: "https://picsum.photos/100/100?random=15",
    status: 'available', minutes_played: 2750, matches_played: 31, yellow_cards: 2, red_cards: 1, bonus_points: 11, price_change_this_week: 0.0,
    goals_scored: 3, assists: 2, clean_sheets: 11,
    stats_xg: 2.5, stats_xa: 1.1, stats_ict: 105.6, stats_goals_conceded: 30,
    stats_radar: { pace: 75, shooting: 45, passing: 84, dribbling: 68, defending: 95, physical: 92 },
    recent_points: [6, 2, 6, 0, 6], projected_points: 4.5, bps: 23
  },
  
  // Bench
  { 
    id: 11, name: "Ederson", full_name: "Ederson Moraes", team: "MCI", position: Position.GK, price: 5.5, purchase_price: 5.5,
    points_last_gw: 2, total_points: 80, form: 4.5, selected_by_percent: 9.5, 
    is_bench: true, image: "https://picsum.photos/100/100?random=11",
    status: 'available', minutes_played: 2500, matches_played: 29, yellow_cards: 2, red_cards: 0, bonus_points: 5, price_change_this_week: 0.0,
    goals_scored: 0, assists: 1, clean_sheets: 10,
    stats_xg: 0, stats_xa: 0.2, stats_ict: 35.1, stats_goals_conceded: 28, stats_saves: 85,
    recent_points: [6, 6, 2, 6, 2], projected_points: 4.1, bps: 15
  },
  { 
    id: 7, name: "Trippier", full_name: "Kieran Trippier", team: "NEW", position: Position.DEF, price: 6.2, purchase_price: 6.5,
    points_last_gw: 1, total_points: 88, form: 3.2, selected_by_percent: 18.2, 
    news: "Doubtful - Groin", is_bench: true, image: "https://picsum.photos/100/100?random=7",
    status: 'doubtful', minutes_played: 2300, matches_played: 27, yellow_cards: 5, red_cards: 0, bonus_points: 14, price_change_this_week: -0.2,
    goals_scored: 1, assists: 10, clean_sheets: 7,
    stats_xg: 0.5, stats_xa: 6.5, stats_ict: 145.2, stats_goals_conceded: 42,
    stats_radar: { pace: 72, shooting: 60, passing: 88, dribbling: 70, defending: 78, physical: 68 },
    recent_points: [1, 2, 0, 1, 1], projected_points: 2.5, bps: 8
  },
  { 
    id: 14, name: "Foden", full_name: "Phil Foden", team: "MCI", position: Position.MID, price: 8.2, purchase_price: 8.0,
    points_last_gw: 2, total_points: 125, form: 6.2, selected_by_percent: 14.2, 
    is_bench: true, image: "https://picsum.photos/100/100?random=14",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 1, red_cards: 0, bonus_points: 16, price_change_this_week: 0.0,
    goals_scored: 16, assists: 7, clean_sheets: 10,
    stats_xg: 12.2, stats_xa: 6.5, stats_ict: 210.5, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 84, passing: 86, dribbling: 90, defending: 50, physical: 60 },
    recent_points: [15, 11, 2, 8, 2], projected_points: 6.5, bps: 25
  },
  { 
    id: 13, name: "Isak", full_name: "Alexander Isak", team: "NEW", position: Position.FWD, price: 7.8, purchase_price: 7.8,
    points_last_gw: 9, total_points: 115, form: 7.8, selected_by_percent: 19.5, 
    is_bench: true, image: "https://picsum.photos/100/100?random=13",
    status: 'available', minutes_played: 2100, matches_played: 25, yellow_cards: 2, red_cards: 0, bonus_points: 18, price_change_this_week: 0.2,
    goals_scored: 19, assists: 1, clean_sheets: 0,
    stats_xg: 17.5, stats_xa: 1.2, stats_ict: 185.3, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 86, passing: 70, dribbling: 84, defending: 32, physical: 75 },
    recent_points: [12, 15, 2, 7, 9], projected_points: 6.9, bps: 29
  },
  {
    id: 16, name: "Morris", full_name: "Carlton Morris", team: "LUT", position: Position.FWD, price: 4.8, purchase_price: 4.8,
    points_last_gw: 0, total_points: 85, form: 2.1, selected_by_percent: 5.2,
    is_bench: true, image: "https://picsum.photos/100/100?random=16",
    status: 'available', minutes_played: 1800, matches_played: 32, yellow_cards: 4, red_cards: 0, bonus_points: 5, price_change_this_week: -0.1,
    goals_scored: 9, assists: 4, clean_sheets: 0,
    stats_xg: 8.5, stats_xa: 2.1, stats_ict: 120.5, stats_goals_conceded: 0,
    recent_points: [2, 1, 2, 5, 0], projected_points: 0, bps: 10
  }
];

export const MOCK_LEAGUES: League[] = [
  // 1. Global 'Ethiopia Overall'
  { 
    league_id: 1, name: "Ethiopia Overall", type: "public", 
    rank: 14502, rank_change: -205, members_count: 52400,
    status: 'active', created_at: '2023-08-01',
    user_points: 1452
  },
  // 2. Private 'Amharic Chat' Leagues (H2H)
  { 
    league_id: 2, name: "Amharic Football Chat", type: "h2h", 
    rank: 3, rank_change: 1, members_count: 12, code: "ETH-CHAT", 
    status: 'active', created_at: '2023-08-10',
    user_h2h_record: "5-2-1", user_h2h_points: 17, telegram_group_id: "t.me/amharic_fpl"
  },
  // 2b. Private Classic
  { 
    league_id: 3, name: "Addis Friends", type: "private", 
    rank: 4, rank_change: 0, members_count: 8, code: "ADD-FRI",
    status: 'active', created_at: '2023-08-15',
    user_points: 1452
  },
  // Weekly Jackpot
  { 
    league_id: 4, name: "Weekly Jackpot", type: "prize", 
    rank: 12, rank_change: 3, members_count: 50, entry_fee: 100, prize_pool: 4500, code: "ADD123", manager_of_month: "Abebe B.",
    status: 'active', created_at: '2023-08-10',
    user_points: 65
  },
  // VIP Prize League
  { 
    league_id: 5, name: "VIP Masters League", type: "prize", 
    rank: 0, rank_change: 0, members_count: 25, entry_fee: 500, prize_pool: 25000, code: "VIP999",
    status: 'active', created_at: '2024-01-01', min_level: 10,
    user_points: 0
  },
  // 3. Local Leagues
  {
    league_id: 6, name: "Addis Ababa City", type: "city",
    rank: 1204, rank_change: 50, members_count: 15400,
    status: 'active', created_at: '2023-08-01', location: 'Addis Ababa',
    user_points: 1452
  },
  {
    league_id: 7, name: "Ethio Telecom HQ", type: "company",
    rank: 45, rank_change: 2, members_count: 340,
    status: 'active', created_at: '2023-08-05', organization: 'Ethio Telecom',
    user_points: 1452
  },
  {
    league_id: 8, name: "AAU Students", type: "university",
    rank: 12, rank_change: -1, members_count: 850,
    status: 'active', created_at: '2023-09-01', organization: 'Addis Ababa University',
    user_points: 1452
  }
];

export const MOCK_LEAGUE_MEMBERS: LeagueMember[] = [
    { user_id: '1', manager_name: 'You', team_name: 'My Team', rank: 3, total_points: 1452, gameweek_points: 65, rank_change: 1, is_me: true },
    { user_id: '2', manager_name: 'Dawit T', team_name: 'Bole Ballers', rank: 1, total_points: 1520, gameweek_points: 78, rank_change: 0, is_me: false },
    { user_id: '3', manager_name: 'Sara K', team_name: 'Lucy XI', rank: 2, total_points: 1490, gameweek_points: 55, rank_change: -1, is_me: false },
    { user_id: '4', manager_name: 'Kebede', team_name: 'St. George Fans', rank: 4, total_points: 1400, gameweek_points: 42, rank_change: 2, is_me: false },
    { user_id: '5', manager_name: 'Abebe', team_name: 'Coffee FC', rank: 5, total_points: 1350, gameweek_points: 30, rank_change: -2, is_me: false },
];

export const MOCK_MATCHUPS: LeagueMatchup[] = [
    { 
        id: 'm1', gameweek: 37, status: 'live',
        home_team: { user_id: '1', manager_name: 'You', team_name: 'My Team', rank: 3, total_points: 1452, gameweek_points: 65, rank_change: 1, is_me: true },
        away_team: { user_id: '3', manager_name: 'Sara K', team_name: 'Lucy XI', rank: 2, total_points: 1490, gameweek_points: 55, rank_change: -1, is_me: false },
        home_score: 65, away_score: 55
    },
    { 
        id: 'm2', gameweek: 37, status: 'finished',
        home_team: { user_id: '2', manager_name: 'Dawit T', team_name: 'Bole Ballers', rank: 1, total_points: 1520, gameweek_points: 78, rank_change: 0, is_me: false },
        away_team: { user_id: '4', manager_name: 'Kebede', team_name: 'St. George Fans', rank: 4, total_points: 1400, gameweek_points: 42, rank_change: 2, is_me: false },
        home_score: 78, away_score: 42
    },
];

export const MOCK_POT_INFO: PotInfo = {
    season_pot: 25000,
    weekly_pot: 1200,
    last_week_winner: "Dawit T (78 pts)",
    last_week_payout: 800,
    my_winnings_balance: 150
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { transaction_id: "TX10293", type: "deposit", amount: 500, currency: 'ETB', created_at: "2024-05-10", status: "completed", telebirr_reference: "TB-882910" },
  { transaction_id: "TX10294", type: "entry_fee", amount: 100, currency: 'ETB', created_at: "2024-05-11", status: "completed", telebirr_reference: "LF-AA-ELITE" },
  { transaction_id: "TX10295", type: "prize", amount: 50, currency: 'ETB', created_at: "2024-05-18", status: "pending", telebirr_reference: "GW-36-PRIZE" },
];

export const TEAMS: PremierLeagueTeam[] = [
  { team_id: "ARS", name: "Arsenal", short_name: "ARS", color: "#EF0107", strength_overall: 4, strength_attack: 4, strength_defense: 5 },
  { team_id: "AVL", name: "Aston Villa", short_name: "AVL", color: "#670E36", strength_overall: 3, strength_attack: 4, strength_defense: 3 },
  { team_id: "CHE", name: "Chelsea", short_name: "CHE", color: "#034694", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "LIV", name: "Liverpool", short_name: "LIV", color: "#C8102E", strength_overall: 5, strength_attack: 5, strength_defense: 4 },
  { team_id: "MCI", name: "Man City", short_name: "MCI", color: "#6CABDD", strength_overall: 5, strength_attack: 5, strength_defense: 4 },
  { team_id: "MUN", name: "Man Utd", short_name: "MUN", color: "#DA291C", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "NEW", name: "Newcastle", short_name: "NEW", color: "#241F20", strength_overall: 3, strength_attack: 4, strength_defense: 3 },
  { team_id: "TOT", name: "Spurs", short_name: "TOT", color: "#132257", strength_overall: 4, strength_attack: 4, strength_defense: 3 },
  { team_id: "LUT", name: "Luton Town", short_name: "LUT", color: "#F78F1E", strength_overall: 2, strength_attack: 2, strength_defense: 1 },
];

// Helper to generate a future date for deadline simulation
const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString();
};

export const MOCK_GAMEWEEKS: Gameweek[] = [
  { gameweek_id: 'gw38', gameweek_number: 38, deadline_time: getFutureDate(1), is_current: true, is_finished: false, highest_score: 0, average_score: 0, most_selected_player_id: 1, most_captained_player_id: 1 },
  { gameweek_id: 'gw37', gameweek_number: 37, deadline_time: '2024-05-11', is_current: false, is_finished: true, highest_score: 85, average_score: 45, most_selected_player_id: 1, most_captained_player_id: 1 },
  { gameweek_id: 'gw36', gameweek_number: 36, deadline_time: '2024-05-04', is_current: false, is_finished: true, highest_score: 115, average_score: 62, most_selected_player_id: 1, most_captained_player_id: 1 },
  { gameweek_id: 'gw35', gameweek_number: 35, deadline_time: '2024-04-27', is_current: false, is_finished: true, highest_score: 98, average_score: 55, most_selected_player_id: 9, most_captained_player_id: 2 },
  { gameweek_id: 'gw34', gameweek_number: 34, deadline_time: '2024-04-20', is_current: false, is_finished: true, highest_score: 142, average_score: 78, most_selected_player_id: 3, most_captained_player_id: 3 },
];
