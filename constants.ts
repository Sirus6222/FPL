
import { Player, Position, League, Transaction, TeamFixtures, TeamStats, RankHistory, PremierLeagueTeam, DailyQuest, TriviaQuestion, ChatMessage, Gameweek, LevelInfo, Badge, AvatarItem, LeagueMember, LeagueMatchup, PotInfo, Showroom, Contest, CoinBundle, MiniGameConfig, Survey, XPAction, CoffeeHourConfig, Sponsor, SponsorCampaign, SponsorAsset, SponsorPlacement, SponsorDashboardMetrics, AdminPlatformMetrics, AuditLogEntry, SponsorActivation, FeatureFlags } from './types';

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
    goals_scored: "Goals Scored",
    feature_locked: "Feature Locked",
    coming_soon: "Coming Soon",
    unlock_at: "Unlock at Stage",
    admin_panel: "Admin Panel"
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
    goals_scored: "ያገቡት ጎሎች",
    feature_locked: "ባህሪው ተቆልፏል",
    coming_soon: "በቅርቡ ይመጣል",
    unlock_at: "በደረጃ ይከፈታል",
    admin_panel: "የአስተዳዳሪ ፓነል"
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
  { id: "av1", name: "Default Kit", url: "https://ui-avatars.com/api/?name=Manager&background=0D8ABC&color=fff", min_level: 1, is_premium: false, price: 0 },
  { id: "av2", name: "Ethio Coffee", url: "https://ui-avatars.com/api/?name=EC&background=5D4037&color=fff", min_level: 1, is_premium: false, price: 100 },
  { id: "av3", name: "St. George", url: "https://ui-avatars.com/api/?name=SG&background=FFD700&color=000", min_level: 5, is_premium: false, price: 200 },
  { id: "av4", name: "Ethiopia FC", url: "https://ui-avatars.com/api/?name=ETH&background=006B3F&color=fff", min_level: 5, is_premium: false, price: 200 },
  { id: "av5", name: "Blue Nile", url: "https://ui-avatars.com/api/?name=BN&background=1E90FF&color=fff", min_level: 10, is_premium: false, price: 350 },
  { id: "av6", name: "Addis Gold", url: "https://ui-avatars.com/api/?name=AG&background=DAA520&color=000", min_level: 10, is_premium: false, price: 350 },
  { id: "av7", name: "Lion of Judah", url: "https://ui-avatars.com/api/?name=Lion&background=FF2882&color=fff", min_level: 20, is_premium: true, price: 500 },
  { id: "av8", name: "Walia Ibex", url: "https://ui-avatars.com/api/?name=Ibex&background=00FF85&color=000", min_level: 20, is_premium: true, price: 500 },
  { id: "av9", name: "Crown Master", url: "https://ui-avatars.com/api/?name=CM&background=8B008B&color=FFD700", min_level: 50, is_premium: true, price: 1000 },
];

export const MOCK_DAILY_QUESTS: DailyQuest[] = [
  { id: '1', label: 'Check 5 Player Profiles', is_completed: true, reward_amount: 50, reward_type: 'xp', icon: 'search' },
  { id: '2', label: 'Make a Transfer Plan', is_completed: false, reward_amount: 10, reward_type: 'coins', icon: 'shuffle' },
  { id: '3', label: 'Share Team on Telegram', is_completed: false, reward_amount: 20, reward_type: 'coins', icon: 'share' },
];

export const MOCK_TRIVIA: TriviaQuestion[] = [
  // Premier League History
  { id: 1, question: "Who is the top scorer in Premier League history?", options: ["Rooney", "Shearer", "Kane", "Henry"], correct_answer: 1 },
  { id: 2, question: "Which team has won the most Premier League titles?", options: ["Liverpool", "Chelsea", "Man United", "Man City"], correct_answer: 2 },
  { id: 3, question: "Who holds the record for most assists in PL history?", options: ["Giggs", "Fabregas", "De Bruyne", "Beckham"], correct_answer: 0 },
  { id: 4, question: "Which player has the most Premier League appearances?", options: ["Lampard", "Gerrard", "Gareth Barry", "James Milner"], correct_answer: 2 },
  { id: 5, question: "What year did the Premier League start?", options: ["1990", "1991", "1992", "1993"], correct_answer: 2 },
  { id: 6, question: "Who scored the fastest hat-trick in PL history?", options: ["Mane", "Defoe", "Aguero", "Van Persie"], correct_answer: 0 },
  { id: 7, question: "Which team went unbeaten for an entire PL season?", options: ["Man United", "Chelsea", "Arsenal", "Liverpool"], correct_answer: 2 },
  { id: 8, question: "Who has kept the most clean sheets in PL history?", options: ["De Gea", "Cech", "Seaman", "Schmeichel"], correct_answer: 1 },

  // FPL Specific
  { id: 9, question: "How many points for a goalkeeper clean sheet?", options: ["3", "4", "5", "6"], correct_answer: 1 },
  { id: 10, question: "How many points for a defender goal?", options: ["4", "5", "6", "7"], correct_answer: 2 },
  { id: 11, question: "What is the maximum squad size in FPL?", options: ["11", "13", "15", "18"], correct_answer: 2 },
  { id: 12, question: "How many free transfers do you get per gameweek?", options: ["0", "1", "2", "3"], correct_answer: 1 },
  { id: 13, question: "What is the budget for a new FPL team?", options: ["80m", "90m", "100m", "110m"], correct_answer: 2 },
  { id: 14, question: "How many players from one team can you have?", options: ["2", "3", "4", "5"], correct_answer: 1 },
  { id: 15, question: "How many points does the captain earn bonus?", options: ["1x", "1.5x", "2x", "3x"], correct_answer: 2 },
  { id: 16, question: "What chip lets you make unlimited transfers?", options: ["Bench Boost", "Free Hit", "Wildcard", "Triple Captain"], correct_answer: 2 },

  // Ethiopian Football
  { id: 17, question: "Which Ethiopian player played for Arsenal?", options: ["Gedion Zelalem", "Shimelis Bekele", "Getaneh Kebede", "Saladin Said"], correct_answer: 0 },
  { id: 18, question: "What is the name of Ethiopia's top football league?", options: ["Premier League", "Super League", "Betking Premier", "Ethiopian Premier"], correct_answer: 3 },
  { id: 19, question: "Which Ethiopian club has the most league titles?", options: ["Ethiopia Coffee", "St. George", "Fasil Kenema", "Sidama Coffee"], correct_answer: 1 },
  { id: 20, question: "What is the nickname of the Ethiopian national team?", options: ["Lions", "Walias", "Eagles", "Panthers"], correct_answer: 1 },
  { id: 21, question: "In what year did Ethiopia reach the AFCON?", options: ["2012", "2013", "2014", "2015"], correct_answer: 1 },
  { id: 22, question: "Which stadium hosts Ethiopia's home games?", options: ["Bahir Dar", "Addis Ababa", "Dire Dawa", "Hawassa"], correct_answer: 1 },
  { id: 23, question: "Who is Ethiopia's all-time top scorer?", options: ["Getaneh Kebede", "Saladin Said", "Oumed Ukri", "Fikru Teferra"], correct_answer: 0 },

  // Current Season
  { id: 24, question: "Who won the 2023-24 Premier League Golden Boot?", options: ["Salah", "Haaland", "Son", "Watkins"], correct_answer: 1 },
  { id: 25, question: "Which promoted team finished highest in 23-24?", options: ["Burnley", "Luton", "Sheffield Utd", "None survived"], correct_answer: 1 },
  { id: 26, question: "Who won PL Player of the Season 2023-24?", options: ["Rice", "Palmer", "Foden", "Saliba"], correct_answer: 2 },
  { id: 27, question: "Which manager won Manager of the Season 23-24?", options: ["Arteta", "Guardiola", "Slot", "Emery"], correct_answer: 1 },
  { id: 28, question: "How many goals did Haaland score in 23-24?", options: ["27", "30", "36", "40"], correct_answer: 0 },

  // General Football
  { id: 29, question: "How many players are on the pitch per team?", options: ["10", "11", "12", "13"], correct_answer: 1 },
  { id: 30, question: "How long is a standard football match?", options: ["80 mins", "85 mins", "90 mins", "100 mins"], correct_answer: 2 },
  { id: 31, question: "What is an own goal called in FPL points?", options: ["-1", "-2", "-3", "0"], correct_answer: 1 },
  { id: 32, question: "What color card results in a sending off?", options: ["Yellow", "Red", "Orange", "Blue"], correct_answer: 1 },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: '1', user_name: 'Dawit M.', message: 'Did you see Haaland blank? My captaincy is ruined!', timestamp: '10:05', is_me: false, avatar: 'https://i.pravatar.cc/150?u=dawit' },
  { id: '2', user_name: 'Tigist A.', message: 'I told you to pick Salah!', timestamp: '10:07', is_me: false, avatar: 'https://i.pravatar.cc/150?u=tigist' },
  { id: '3', user_name: 'You', message: 'There goes my rank... time to use the Wildcard?', timestamp: '10:10', is_me: true },
  { id: '4', user_name: 'Abebe K.', message: 'Palmer is on fire this season. 160 points already!', timestamp: '10:12', is_me: false, avatar: 'https://i.pravatar.cc/150?u=abebe' },
  { id: '5', user_name: 'Mekdes F.', message: 'Anyone else bringing in TAA for the double?', timestamp: '10:15', is_me: false, avatar: 'https://i.pravatar.cc/150?u=mekdes' },
  { id: '6', user_name: 'Yonas T.', message: 'I need differentials. Thinking about Mbeumo', timestamp: '10:18', is_me: false, avatar: 'https://i.pravatar.cc/150?u=yonas' },
  { id: '7', user_name: 'Selam B.', message: 'City fixtures are so good. Triple up?', timestamp: '10:22', is_me: false, avatar: 'https://i.pravatar.cc/150?u=selam' },
  { id: '8', user_name: 'You', message: 'Gvardiol is a must at that price', timestamp: '10:25', is_me: true },
];

// Mock Fixtures Data
export const MOCK_FIXTURES: TeamFixtures = {
  "MCI": [
    { gameweek: 38, opponent: "WHU", is_home: true, difficulty: 2 },
    { gameweek: 38, opponent: "TOT", is_home: false, difficulty: 4 }, // DGW
    { gameweek: 39, opponent: "BHA", is_home: false, difficulty: 3 },
    { gameweek: 40, opponent: "ARS", is_home: true, difficulty: 5 },
    { gameweek: 41, opponent: "NFO", is_home: false, difficulty: 2 },
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
  "CHE": [
    { gameweek: 38, opponent: "BOU", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "NFO", is_home: false, difficulty: 2 },
    { gameweek: 40, opponent: "LIV", is_home: false, difficulty: 5 },
    { gameweek: 41, opponent: "AVL", is_home: true, difficulty: 3 },
    { gameweek: 42, opponent: "MUN", is_home: false, difficulty: 4 },
  ],
  "TOT": [
    { gameweek: 38, opponent: "MCI", is_home: true, difficulty: 5 },
    { gameweek: 39, opponent: "LEI", is_home: false, difficulty: 2 },
    { gameweek: 40, opponent: "EVE", is_home: true, difficulty: 2 },
    { gameweek: 41, opponent: "BRE", is_home: false, difficulty: 3 },
    { gameweek: 42, opponent: "LIV", is_home: false, difficulty: 5 },
  ],
  "MUN": [
    { gameweek: 38, opponent: "BHA", is_home: true, difficulty: 3 },
    { gameweek: 39, opponent: "LIV", is_home: true, difficulty: 5 },
    { gameweek: 40, opponent: "FUL", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "CRY", is_home: true, difficulty: 2 },
    { gameweek: 42, opponent: "CHE", is_home: true, difficulty: 3 },
  ],
  "NEW": [
    { gameweek: 38, opponent: "FUL", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "AVL", is_home: false, difficulty: 3 },
    { gameweek: 40, opponent: "BRE", is_home: true, difficulty: 3 },
    { gameweek: 41, opponent: "WOL", is_home: false, difficulty: 2 },
    { gameweek: 42, opponent: "ARS", is_home: true, difficulty: 5 },
  ],
  "AVL": [
    { gameweek: 38, opponent: "CRY", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "NEW", is_home: true, difficulty: 4 },
    { gameweek: 40, opponent: "BOU", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "CHE", is_home: false, difficulty: 3 },
    { gameweek: 42, opponent: "BHA", is_home: true, difficulty: 3 },
  ],
  "BHA": [
    { gameweek: 38, opponent: "IPS", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "MCI", is_home: true, difficulty: 5 },
    { gameweek: 40, opponent: "WHU", is_home: false, difficulty: 3 },
    { gameweek: 41, opponent: "FUL", is_home: true, difficulty: 2 },
    { gameweek: 42, opponent: "AVL", is_home: false, difficulty: 3 },
  ],
  "WHU": [
    { gameweek: 38, opponent: "MCI", is_home: false, difficulty: 5 },
    { gameweek: 39, opponent: "SOU", is_home: true, difficulty: 2 },
    { gameweek: 40, opponent: "BHA", is_home: true, difficulty: 3 },
    { gameweek: 41, opponent: "IPS", is_home: false, difficulty: 2 },
    { gameweek: 42, opponent: "NFO", is_home: true, difficulty: 2 },
  ],
  "BOU": [
    { gameweek: 38, opponent: "CHE", is_home: false, difficulty: 3 },
    { gameweek: 39, opponent: "BRE", is_home: true, difficulty: 3 },
    { gameweek: 40, opponent: "AVL", is_home: true, difficulty: 3 },
    { gameweek: 41, opponent: "LEI", is_home: false, difficulty: 2 },
    { gameweek: 42, opponent: "EVE", is_home: true, difficulty: 2 },
  ],
  "FUL": [
    { gameweek: 38, opponent: "NEW", is_home: false, difficulty: 4 },
    { gameweek: 39, opponent: "CRY", is_home: true, difficulty: 2 },
    { gameweek: 40, opponent: "MUN", is_home: true, difficulty: 4 },
    { gameweek: 41, opponent: "BHA", is_home: false, difficulty: 3 },
    { gameweek: 42, opponent: "LEI", is_home: true, difficulty: 2 },
  ],
  "CRY": [
    { gameweek: 38, opponent: "AVL", is_home: false, difficulty: 3 },
    { gameweek: 39, opponent: "ARS", is_home: true, difficulty: 5 },
    { gameweek: 40, opponent: "SOU", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "MUN", is_home: false, difficulty: 4 },
    { gameweek: 42, opponent: "WOL", is_home: true, difficulty: 2 },
  ],
  "BRE": [
    { gameweek: 38, opponent: "LEI", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "BOU", is_home: false, difficulty: 2 },
    { gameweek: 40, opponent: "NEW", is_home: false, difficulty: 4 },
    { gameweek: 41, opponent: "TOT", is_home: true, difficulty: 4 },
    { gameweek: 42, opponent: "IPS", is_home: false, difficulty: 2 },
  ],
  "WOL": [
    { gameweek: 38, opponent: "LIV", is_home: false, difficulty: 5 },
    { gameweek: 39, opponent: "EVE", is_home: true, difficulty: 2 },
    { gameweek: 40, opponent: "IPS", is_home: true, difficulty: 2 },
    { gameweek: 41, opponent: "NEW", is_home: true, difficulty: 4 },
    { gameweek: 42, opponent: "CRY", is_home: false, difficulty: 2 },
  ],
  "NFO": [
    { gameweek: 38, opponent: "SOU", is_home: true, difficulty: 2 },
    { gameweek: 39, opponent: "CHE", is_home: true, difficulty: 3 },
    { gameweek: 40, opponent: "LEI", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "MCI", is_home: true, difficulty: 5 },
    { gameweek: 42, opponent: "WHU", is_home: false, difficulty: 3 },
  ],
  "EVE": [
    { gameweek: 38, opponent: "ARS", is_home: false, difficulty: 5 },
    { gameweek: 39, opponent: "WOL", is_home: false, difficulty: 2 },
    { gameweek: 40, opponent: "TOT", is_home: false, difficulty: 4 },
    { gameweek: 41, opponent: "SOU", is_home: true, difficulty: 2 },
    { gameweek: 42, opponent: "BOU", is_home: false, difficulty: 2 },
  ],
  "LEI": [
    { gameweek: 38, opponent: "BRE", is_home: false, difficulty: 3 },
    { gameweek: 39, opponent: "TOT", is_home: true, difficulty: 4 },
    { gameweek: 40, opponent: "NFO", is_home: true, difficulty: 2 },
    { gameweek: 41, opponent: "BOU", is_home: true, difficulty: 2 },
    { gameweek: 42, opponent: "FUL", is_home: false, difficulty: 2 },
  ],
  "IPS": [
    { gameweek: 38, opponent: "BHA", is_home: false, difficulty: 3 },
    { gameweek: 39, opponent: "SOU", is_home: false, difficulty: 2 },
    { gameweek: 40, opponent: "WOL", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "WHU", is_home: true, difficulty: 3 },
    { gameweek: 42, opponent: "BRE", is_home: true, difficulty: 3 },
  ],
  "SOU": [
    { gameweek: 38, opponent: "NFO", is_home: false, difficulty: 2 },
    { gameweek: 39, opponent: "IPS", is_home: true, difficulty: 2 },
    { gameweek: 40, opponent: "CRY", is_home: true, difficulty: 2 },
    { gameweek: 41, opponent: "EVE", is_home: false, difficulty: 2 },
    { gameweek: 42, opponent: "MCI", is_home: true, difficulty: 5 },
  ],
  "DEFAULT": [
    { gameweek: 38, opponent: "LIV", is_home: false, difficulty: 5 },
    { gameweek: 39, opponent: "MCI", is_home: true, difficulty: 5 },
    { gameweek: 40, opponent: "EVE", is_home: false, difficulty: 2 },
    { gameweek: 41, opponent: "IPS", is_home: true, difficulty: 2 },
    { gameweek: 42, opponent: "SOU", is_home: false, difficulty: 2 },
  ]
};

export const getTeamFixtures = (teamId: string) => MOCK_FIXTURES[teamId] || MOCK_FIXTURES["DEFAULT"];

// Mock Team Stats for "Deep Dive" - All 20 teams
export const MOCK_TEAM_STATS: TeamStats[] = [
  // Top teams
  { id: "MCI", name: "Man City", short_name: "MCI", goals_scored: 88, goals_conceded: 32, clean_sheets: 12, xg_for: 85.4, xg_against: 30.1, next_opponent: "WHU", next_difficulty: 2 },
  { id: "ARS", name: "Arsenal", short_name: "ARS", goals_scored: 85, goals_conceded: 28, clean_sheets: 16, xg_for: 80.2, xg_against: 25.5, next_opponent: "EVE", next_difficulty: 2 },
  { id: "LIV", name: "Liverpool", short_name: "LIV", goals_scored: 82, goals_conceded: 30, clean_sheets: 13, xg_for: 78.5, xg_against: 28.2, next_opponent: "WOL", next_difficulty: 2 },
  { id: "CHE", name: "Chelsea", short_name: "CHE", goals_scored: 65, goals_conceded: 42, clean_sheets: 9, xg_for: 62.8, xg_against: 40.5, next_opponent: "BOU", next_difficulty: 2 },
  { id: "TOT", name: "Spurs", short_name: "TOT", goals_scored: 68, goals_conceded: 52, clean_sheets: 7, xg_for: 65.2, xg_against: 48.5, next_opponent: "MCI", next_difficulty: 5 },
  { id: "MUN", name: "Man Utd", short_name: "MUN", goals_scored: 52, goals_conceded: 48, clean_sheets: 9, xg_for: 55.8, xg_against: 45.2, next_opponent: "BHA", next_difficulty: 3 },
  // Mid-table
  { id: "AVL", name: "Aston Villa", short_name: "AVL", goals_scored: 72, goals_conceded: 48, clean_sheets: 8, xg_for: 68.5, xg_against: 45.2, next_opponent: "CRY", next_difficulty: 2 },
  { id: "NEW", name: "Newcastle", short_name: "NEW", goals_scored: 72, goals_conceded: 42, clean_sheets: 8, xg_for: 70.2, xg_against: 40.5, next_opponent: "FUL", next_difficulty: 2 },
  { id: "BHA", name: "Brighton", short_name: "BHA", goals_scored: 58, goals_conceded: 48, clean_sheets: 7, xg_for: 55.8, xg_against: 45.5, next_opponent: "IPS", next_difficulty: 2 },
  { id: "WHU", name: "West Ham", short_name: "WHU", goals_scored: 52, goals_conceded: 55, clean_sheets: 5, xg_for: 50.2, xg_against: 52.5, next_opponent: "MCI", next_difficulty: 5 },
  { id: "BOU", name: "Bournemouth", short_name: "BOU", goals_scored: 55, goals_conceded: 55, clean_sheets: 5, xg_for: 52.8, xg_against: 52.2, next_opponent: "CHE", next_difficulty: 3 },
  { id: "FUL", name: "Fulham", short_name: "FUL", goals_scored: 48, goals_conceded: 48, clean_sheets: 7, xg_for: 45.5, xg_against: 45.8, next_opponent: "NEW", next_difficulty: 4 },
  { id: "CRY", name: "Crystal Palace", short_name: "CRY", goals_scored: 45, goals_conceded: 52, clean_sheets: 6, xg_for: 42.8, xg_against: 50.5, next_opponent: "AVL", next_difficulty: 3 },
  { id: "BRE", name: "Brentford", short_name: "BRE", goals_scored: 52, goals_conceded: 55, clean_sheets: 5, xg_for: 50.2, xg_against: 52.8, next_opponent: "LEI", next_difficulty: 2 },
  { id: "WOL", name: "Wolves", short_name: "WOL", goals_scored: 42, goals_conceded: 55, clean_sheets: 5, xg_for: 40.5, xg_against: 52.5, next_opponent: "LIV", next_difficulty: 5 },
  { id: "NFO", name: "Nottm Forest", short_name: "NFO", goals_scored: 45, goals_conceded: 52, clean_sheets: 7, xg_for: 42.5, xg_against: 50.2, next_opponent: "SOU", next_difficulty: 2 },
  { id: "EVE", name: "Everton", short_name: "EVE", goals_scored: 35, goals_conceded: 48, clean_sheets: 8, xg_for: 32.8, xg_against: 45.5, next_opponent: "ARS", next_difficulty: 5 },
  // Bottom teams
  { id: "LEI", name: "Leicester", short_name: "LEI", goals_scored: 42, goals_conceded: 58, clean_sheets: 4, xg_for: 40.2, xg_against: 55.8, next_opponent: "BRE", next_difficulty: 3 },
  { id: "IPS", name: "Ipswich", short_name: "IPS", goals_scored: 32, goals_conceded: 62, clean_sheets: 3, xg_for: 30.5, xg_against: 60.2, next_opponent: "BHA", next_difficulty: 3 },
  { id: "SOU", name: "Southampton", short_name: "SOU", goals_scored: 28, goals_conceded: 68, clean_sheets: 2, xg_for: 25.8, xg_against: 65.5, next_opponent: "NFO", next_difficulty: 2 },
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

// Mock Players Database - 100+ players across all 20 teams
export const MOCK_PLAYERS: Player[] = [
  // ============ FORWARDS (20) ============
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
  },

  // ============ ADDITIONAL FORWARDS ============
  {
    id: 17, name: "Darwin", full_name: "Darwin Nunez", team: "LIV", position: Position.FWD, price: 7.5,
    points_last_gw: 8, total_points: 105, form: 6.8, selected_by_percent: 15.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=17",
    status: 'available', minutes_played: 1800, matches_played: 28, yellow_cards: 3, red_cards: 0, bonus_points: 12,
    goals_scored: 14, assists: 6, clean_sheets: 0,
    stats_xg: 16.2, stats_xa: 4.1, stats_ict: 175.2, stats_goals_conceded: 0,
    stats_radar: { pace: 92, shooting: 78, passing: 62, dribbling: 74, defending: 28, physical: 80 },
    recent_points: [2, 8, 5, 11, 8], projected_points: 6.2, bps: 22
  },
  {
    id: 18, name: "Jackson", full_name: "Nicolas Jackson", team: "CHE", position: Position.FWD, price: 7.8,
    points_last_gw: 6, total_points: 115, form: 6.5, selected_by_percent: 18.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=18",
    status: 'available', minutes_played: 2200, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 14,
    goals_scored: 15, assists: 5, clean_sheets: 0,
    stats_xg: 14.8, stats_xa: 3.5, stats_ict: 180.5, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 80, passing: 68, dribbling: 78, defending: 32, physical: 75 },
    recent_points: [6, 2, 9, 5, 6], projected_points: 5.8, bps: 19
  },
  {
    id: 19, name: "Havertz", full_name: "Kai Havertz", team: "ARS", position: Position.FWD, price: 8.2,
    points_last_gw: 9, total_points: 125, form: 7.2, selected_by_percent: 28.4,
    is_bench: false, image: "https://picsum.photos/100/100?random=19",
    status: 'available', minutes_played: 2350, matches_played: 29, yellow_cards: 4, red_cards: 0, bonus_points: 15,
    goals_scored: 13, assists: 7, clean_sheets: 14,
    stats_xg: 12.5, stats_xa: 5.8, stats_ict: 195.3, stats_goals_conceded: 0,
    stats_radar: { pace: 75, shooting: 82, passing: 80, dribbling: 80, defending: 55, physical: 78 },
    recent_points: [5, 9, 2, 12, 9], projected_points: 6.5, bps: 24
  },
  {
    id: 20, name: "Solanke", full_name: "Dominic Solanke", team: "TOT", position: Position.FWD, price: 7.6,
    points_last_gw: 5, total_points: 98, form: 5.8, selected_by_percent: 12.1,
    is_bench: false, image: "https://picsum.photos/100/100?random=20",
    status: 'available', minutes_played: 2100, matches_played: 27, yellow_cards: 2, red_cards: 0, bonus_points: 10,
    goals_scored: 12, assists: 4, clean_sheets: 0,
    stats_xg: 13.2, stats_xa: 3.8, stats_ict: 155.8, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 80, passing: 70, dribbling: 72, defending: 35, physical: 82 },
    recent_points: [2, 5, 8, 3, 5], projected_points: 5.2, bps: 16
  },
  {
    id: 21, name: "Cunha", full_name: "Matheus Cunha", team: "WOL", position: Position.FWD, price: 7.2,
    points_last_gw: 7, total_points: 110, form: 6.9, selected_by_percent: 14.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=21",
    status: 'available', minutes_played: 2300, matches_played: 29, yellow_cards: 5, red_cards: 1, bonus_points: 13,
    goals_scored: 12, assists: 8, clean_sheets: 0,
    stats_xg: 11.5, stats_xa: 6.2, stats_ict: 168.4, stats_goals_conceded: 0,
    stats_radar: { pace: 82, shooting: 78, passing: 75, dribbling: 84, defending: 30, physical: 72 },
    recent_points: [7, 2, 11, 5, 7], projected_points: 5.8, bps: 21
  },
  {
    id: 22, name: "Richarlison", full_name: "Richarlison", team: "TOT", position: Position.FWD, price: 6.8,
    points_last_gw: 2, total_points: 68, form: 4.2, selected_by_percent: 5.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=22",
    status: 'doubtful', news: "Hamstring - 50% chance", minutes_played: 1200, matches_played: 18, yellow_cards: 3, red_cards: 0, bonus_points: 6,
    goals_scored: 6, assists: 2, clean_sheets: 0,
    stats_xg: 7.8, stats_xa: 2.1, stats_ict: 95.2, stats_goals_conceded: 0,
    stats_radar: { pace: 84, shooting: 79, passing: 65, dribbling: 78, defending: 38, physical: 76 },
    recent_points: [0, 2, 0, 2, 2], projected_points: 3.5, bps: 10
  },
  {
    id: 23, name: "Awoniyi", full_name: "Taiwo Awoniyi", team: "NFO", position: Position.FWD, price: 6.0,
    points_last_gw: 5, total_points: 82, form: 5.2, selected_by_percent: 4.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=23",
    status: 'available', minutes_played: 1900, matches_played: 26, yellow_cards: 2, red_cards: 0, bonus_points: 8,
    goals_scored: 9, assists: 3, clean_sheets: 0,
    stats_xg: 10.2, stats_xa: 2.5, stats_ict: 115.8, stats_goals_conceded: 0,
    stats_radar: { pace: 80, shooting: 76, passing: 58, dribbling: 68, defending: 32, physical: 82 },
    recent_points: [5, 2, 7, 2, 5], projected_points: 4.5, bps: 14
  },
  {
    id: 24, name: "Calvert-Lewin", full_name: "Dominic Calvert-Lewin", team: "EVE", position: Position.FWD, price: 5.8,
    points_last_gw: 2, total_points: 72, form: 4.0, selected_by_percent: 3.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=24",
    status: 'available', minutes_played: 1700, matches_played: 25, yellow_cards: 3, red_cards: 0, bonus_points: 5,
    goals_scored: 7, assists: 2, clean_sheets: 0,
    stats_xg: 9.5, stats_xa: 1.8, stats_ict: 98.2, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 78, passing: 55, dribbling: 62, defending: 40, physical: 85 },
    recent_points: [2, 0, 5, 2, 2], projected_points: 3.8, bps: 11
  },
  {
    id: 25, name: "Welbeck", full_name: "Danny Welbeck", team: "BHA", position: Position.FWD, price: 5.9,
    points_last_gw: 6, total_points: 95, form: 5.8, selected_by_percent: 6.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=25",
    status: 'available', minutes_played: 2000, matches_played: 28, yellow_cards: 1, red_cards: 0, bonus_points: 9,
    goals_scored: 10, assists: 4, clean_sheets: 0,
    stats_xg: 9.2, stats_xa: 3.5, stats_ict: 125.4, stats_goals_conceded: 0,
    stats_radar: { pace: 82, shooting: 75, passing: 68, dribbling: 74, defending: 35, physical: 78 },
    recent_points: [2, 6, 5, 8, 6], projected_points: 4.8, bps: 17
  },
  {
    id: 26, name: "Evanilson", full_name: "Evanilson", team: "BOU", position: Position.FWD, price: 6.2,
    points_last_gw: 5, total_points: 78, form: 5.5, selected_by_percent: 5.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=26",
    status: 'available', minutes_played: 1800, matches_played: 24, yellow_cards: 2, red_cards: 0, bonus_points: 7,
    goals_scored: 8, assists: 3, clean_sheets: 0,
    stats_xg: 9.8, stats_xa: 2.8, stats_ict: 105.2, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 77, passing: 65, dribbling: 72, defending: 28, physical: 75 },
    recent_points: [5, 2, 6, 2, 5], projected_points: 4.2, bps: 14
  },
  {
    id: 27, name: "Jimenez", full_name: "Raul Jimenez", team: "FUL", position: Position.FWD, price: 5.8,
    points_last_gw: 3, total_points: 88, form: 5.0, selected_by_percent: 4.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=27",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 4, red_cards: 0, bonus_points: 8,
    goals_scored: 9, assists: 5, clean_sheets: 0,
    stats_xg: 8.5, stats_xa: 4.2, stats_ict: 118.5, stats_goals_conceded: 0,
    stats_radar: { pace: 72, shooting: 80, passing: 68, dribbling: 70, defending: 35, physical: 82 },
    recent_points: [3, 6, 2, 5, 3], projected_points: 4.0, bps: 15
  },
  {
    id: 28, name: "Mateta", full_name: "Jean-Philippe Mateta", team: "CRY", position: Position.FWD, price: 7.0,
    points_last_gw: 9, total_points: 115, form: 7.5, selected_by_percent: 15.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=28",
    status: 'available', minutes_played: 2200, matches_played: 28, yellow_cards: 2, red_cards: 0, bonus_points: 14,
    goals_scored: 14, assists: 3, clean_sheets: 0,
    stats_xg: 12.8, stats_xa: 2.5, stats_ict: 165.8, stats_goals_conceded: 0,
    stats_radar: { pace: 82, shooting: 82, passing: 58, dribbling: 70, defending: 30, physical: 85 },
    recent_points: [9, 2, 12, 5, 9], projected_points: 5.8, bps: 22
  },
  {
    id: 29, name: "Mbeumo", full_name: "Bryan Mbeumo", team: "BRE", position: Position.FWD, price: 7.8,
    points_last_gw: 8, total_points: 128, form: 7.2, selected_by_percent: 22.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=29",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 3, red_cards: 0, bonus_points: 16,
    goals_scored: 15, assists: 6, clean_sheets: 0,
    stats_xg: 14.2, stats_xa: 5.5, stats_ict: 185.2, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 82, passing: 72, dribbling: 80, defending: 28, physical: 68 },
    recent_points: [8, 5, 10, 6, 8], projected_points: 6.2, bps: 24
  },

  // ============ ADDITIONAL MIDFIELDERS ============
  {
    id: 30, name: "Eze", full_name: "Eberechi Eze", team: "CRY", position: Position.MID, price: 7.0,
    points_last_gw: 7, total_points: 115, form: 6.8, selected_by_percent: 18.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=30",
    status: 'available', minutes_played: 2300, matches_played: 29, yellow_cards: 2, red_cards: 0, bonus_points: 14,
    goals_scored: 10, assists: 5, clean_sheets: 8,
    stats_xg: 9.5, stats_xa: 4.8, stats_ict: 175.5, stats_goals_conceded: 0,
    stats_radar: { pace: 82, shooting: 80, passing: 82, dribbling: 88, defending: 35, physical: 65 },
    recent_points: [7, 3, 9, 5, 7], projected_points: 5.8, bps: 20
  },
  {
    id: 31, name: "B.Fernandes", full_name: "Bruno Fernandes", team: "MUN", position: Position.MID, price: 8.5,
    points_last_gw: 5, total_points: 125, form: 6.2, selected_by_percent: 22.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=31",
    status: 'available', minutes_played: 2600, matches_played: 32, yellow_cards: 6, red_cards: 0, bonus_points: 15,
    goals_scored: 10, assists: 8, clean_sheets: 8,
    stats_xg: 11.2, stats_xa: 7.5, stats_ict: 195.8, stats_goals_conceded: 0,
    stats_radar: { pace: 72, shooting: 85, passing: 90, dribbling: 82, defending: 55, physical: 68 },
    recent_points: [5, 8, 3, 10, 5], projected_points: 5.5, bps: 22
  },
  {
    id: 32, name: "Odegaard", full_name: "Martin Odegaard", team: "ARS", position: Position.MID, price: 8.8,
    points_last_gw: 8, total_points: 135, form: 7.5, selected_by_percent: 32.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=32",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 18,
    goals_scored: 9, assists: 10, clean_sheets: 14,
    stats_xg: 8.5, stats_xa: 9.2, stats_ict: 210.5, stats_goals_conceded: 0,
    stats_radar: { pace: 75, shooting: 82, passing: 92, dribbling: 86, defending: 50, physical: 62 },
    recent_points: [8, 6, 10, 5, 8], projected_points: 6.5, bps: 26
  },
  {
    id: 33, name: "Mac Allister", full_name: "Alexis Mac Allister", team: "LIV", position: Position.MID, price: 6.5,
    points_last_gw: 6, total_points: 112, form: 6.5, selected_by_percent: 15.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=33",
    status: 'available', minutes_played: 2500, matches_played: 31, yellow_cards: 4, red_cards: 0, bonus_points: 12,
    goals_scored: 6, assists: 5, clean_sheets: 12,
    stats_xg: 5.8, stats_xa: 4.5, stats_ict: 145.2, stats_goals_conceded: 0,
    stats_radar: { pace: 72, shooting: 75, passing: 85, dribbling: 78, defending: 70, physical: 72 },
    recent_points: [6, 3, 8, 5, 6], projected_points: 5.2, bps: 18
  },
  {
    id: 34, name: "Szoboszlai", full_name: "Dominik Szoboszlai", team: "LIV", position: Position.MID, price: 6.8,
    points_last_gw: 5, total_points: 95, form: 5.8, selected_by_percent: 10.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=34",
    status: 'available', minutes_played: 2200, matches_played: 29, yellow_cards: 3, red_cards: 0, bonus_points: 10,
    goals_scored: 5, assists: 6, clean_sheets: 10,
    stats_xg: 6.2, stats_xa: 5.5, stats_ict: 135.8, stats_goals_conceded: 0,
    stats_radar: { pace: 80, shooting: 78, passing: 82, dribbling: 80, defending: 55, physical: 75 },
    recent_points: [2, 5, 6, 3, 5], projected_points: 4.8, bps: 15
  },
  {
    id: 35, name: "Maddison", full_name: "James Maddison", team: "TOT", position: Position.MID, price: 7.5,
    points_last_gw: 6, total_points: 108, form: 6.2, selected_by_percent: 12.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=35",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 5, red_cards: 0, bonus_points: 12,
    goals_scored: 7, assists: 8, clean_sheets: 6,
    stats_xg: 6.8, stats_xa: 7.2, stats_ict: 162.5, stats_goals_conceded: 0,
    stats_radar: { pace: 70, shooting: 82, passing: 88, dribbling: 82, defending: 40, physical: 62 },
    recent_points: [3, 6, 5, 9, 6], projected_points: 5.2, bps: 18
  },
  {
    id: 36, name: "Diaz", full_name: "Luis Diaz", team: "LIV", position: Position.MID, price: 8.0,
    points_last_gw: 9, total_points: 125, form: 7.5, selected_by_percent: 18.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=36",
    status: 'available', minutes_played: 2350, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 15,
    goals_scored: 12, assists: 5, clean_sheets: 11,
    stats_xg: 11.5, stats_xa: 4.8, stats_ict: 185.2, stats_goals_conceded: 0,
    stats_radar: { pace: 90, shooting: 80, passing: 75, dribbling: 88, defending: 35, physical: 70 },
    recent_points: [9, 5, 11, 6, 9], projected_points: 6.2, bps: 23
  },
  {
    id: 37, name: "Jota", full_name: "Diogo Jota", team: "LIV", position: Position.MID, price: 7.2,
    points_last_gw: 0, total_points: 85, form: 3.5, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=37",
    status: 'injured', news: "Knee - Out for season", minutes_played: 1200, matches_played: 18, yellow_cards: 1, red_cards: 0, bonus_points: 10,
    goals_scored: 8, assists: 3, clean_sheets: 6,
    stats_xg: 9.2, stats_xa: 2.8, stats_ict: 125.5, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 85, passing: 72, dribbling: 82, defending: 32, physical: 72 },
    recent_points: [0, 0, 0, 0, 0], projected_points: 0, bps: 0
  },
  {
    id: 38, name: "Gordon", full_name: "Anthony Gordon", team: "NEW", position: Position.MID, price: 7.5,
    points_last_gw: 7, total_points: 118, form: 6.8, selected_by_percent: 16.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=38",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 3, red_cards: 0, bonus_points: 14,
    goals_scored: 10, assists: 8, clean_sheets: 7,
    stats_xg: 9.8, stats_xa: 7.2, stats_ict: 172.5, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 78, passing: 75, dribbling: 85, defending: 40, physical: 68 },
    recent_points: [7, 5, 9, 3, 7], projected_points: 5.8, bps: 21
  },
  {
    id: 39, name: "Neto", full_name: "Pedro Neto", team: "CHE", position: Position.MID, price: 6.8,
    points_last_gw: 5, total_points: 98, form: 5.8, selected_by_percent: 10.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=39",
    status: 'available', minutes_played: 2000, matches_played: 27, yellow_cards: 2, red_cards: 0, bonus_points: 10,
    goals_scored: 6, assists: 7, clean_sheets: 8,
    stats_xg: 5.5, stats_xa: 6.8, stats_ict: 145.8, stats_goals_conceded: 0,
    stats_radar: { pace: 92, shooting: 72, passing: 78, dribbling: 88, defending: 30, physical: 62 },
    recent_points: [5, 3, 8, 2, 5], projected_points: 4.8, bps: 16
  },
  {
    id: 40, name: "Kudus", full_name: "Mohammed Kudus", team: "WHU", position: Position.MID, price: 6.5,
    points_last_gw: 6, total_points: 105, form: 6.2, selected_by_percent: 12.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=40",
    status: 'available', minutes_played: 2200, matches_played: 28, yellow_cards: 5, red_cards: 1, bonus_points: 12,
    goals_scored: 8, assists: 5, clean_sheets: 5,
    stats_xg: 7.8, stats_xa: 4.5, stats_ict: 155.2, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 78, passing: 72, dribbling: 88, defending: 40, physical: 75 },
    recent_points: [6, 2, 9, 5, 6], projected_points: 5.0, bps: 18
  },
  {
    id: 41, name: "Mitoma", full_name: "Kaoru Mitoma", team: "BHA", position: Position.MID, price: 6.5,
    points_last_gw: 5, total_points: 95, form: 5.5, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=41",
    status: 'available', minutes_played: 1800, matches_played: 25, yellow_cards: 1, red_cards: 0, bonus_points: 9,
    goals_scored: 6, assists: 6, clean_sheets: 6,
    stats_xg: 5.8, stats_xa: 5.5, stats_ict: 135.8, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 72, passing: 75, dribbling: 90, defending: 32, physical: 58 },
    recent_points: [5, 2, 7, 3, 5], projected_points: 4.5, bps: 15
  },
  {
    id: 42, name: "Semenyo", full_name: "Antoine Semenyo", team: "BOU", position: Position.MID, price: 5.5,
    points_last_gw: 6, total_points: 92, form: 5.8, selected_by_percent: 6.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=42",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 3, red_cards: 0, bonus_points: 10,
    goals_scored: 7, assists: 5, clean_sheets: 4,
    stats_xg: 6.8, stats_xa: 4.5, stats_ict: 125.5, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 75, passing: 68, dribbling: 80, defending: 35, physical: 75 },
    recent_points: [6, 3, 8, 2, 6], projected_points: 4.5, bps: 16
  },
  {
    id: 43, name: "Iwobi", full_name: "Alex Iwobi", team: "FUL", position: Position.MID, price: 5.8,
    points_last_gw: 5, total_points: 88, form: 5.2, selected_by_percent: 5.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=43",
    status: 'available', minutes_played: 2300, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 8,
    goals_scored: 5, assists: 6, clean_sheets: 6,
    stats_xg: 4.8, stats_xa: 5.5, stats_ict: 118.2, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 70, passing: 78, dribbling: 82, defending: 55, physical: 72 },
    recent_points: [5, 2, 6, 3, 5], projected_points: 4.2, bps: 14
  },
  {
    id: 44, name: "Elanga", full_name: "Anthony Elanga", team: "NFO", position: Position.MID, price: 5.2,
    points_last_gw: 5, total_points: 78, form: 5.0, selected_by_percent: 4.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=44",
    status: 'available', minutes_played: 2000, matches_played: 28, yellow_cards: 2, red_cards: 0, bonus_points: 7,
    goals_scored: 5, assists: 4, clean_sheets: 5,
    stats_xg: 5.2, stats_xa: 3.8, stats_ict: 105.5, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 68, passing: 70, dribbling: 80, defending: 35, physical: 68 },
    recent_points: [5, 2, 6, 2, 5], projected_points: 4.0, bps: 12
  },
  {
    id: 45, name: "McNeil", full_name: "Dwight McNeil", team: "EVE", position: Position.MID, price: 5.5,
    points_last_gw: 3, total_points: 75, form: 4.5, selected_by_percent: 3.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=45",
    status: 'available', minutes_played: 2200, matches_played: 29, yellow_cards: 3, red_cards: 0, bonus_points: 6,
    goals_scored: 4, assists: 5, clean_sheets: 5,
    stats_xg: 4.2, stats_xa: 4.8, stats_ict: 98.5, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 70, passing: 78, dribbling: 80, defending: 45, physical: 65 },
    recent_points: [3, 2, 5, 2, 3], projected_points: 3.8, bps: 11
  },
  {
    id: 46, name: "Bernardo", full_name: "Bernardo Silva", team: "MCI", position: Position.MID, price: 6.5,
    points_last_gw: 5, total_points: 105, form: 5.8, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=46",
    status: 'available', minutes_played: 2400, matches_played: 31, yellow_cards: 2, red_cards: 0, bonus_points: 12,
    goals_scored: 6, assists: 8, clean_sheets: 12,
    stats_xg: 5.5, stats_xa: 7.2, stats_ict: 145.8, stats_goals_conceded: 0,
    stats_radar: { pace: 75, shooting: 78, passing: 90, dribbling: 90, defending: 55, physical: 58 },
    recent_points: [5, 3, 7, 4, 5], projected_points: 4.8, bps: 17
  },

  // ============ ADDITIONAL DEFENDERS ============
  {
    id: 47, name: "Alexander-Arnold", full_name: "Trent Alexander-Arnold", team: "LIV", position: Position.DEF, price: 7.2,
    points_last_gw: 9, total_points: 125, form: 7.5, selected_by_percent: 28.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=47",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 3, red_cards: 0, bonus_points: 16,
    goals_scored: 3, assists: 12, clean_sheets: 11,
    stats_xg: 2.5, stats_xa: 10.5, stats_ict: 185.2, stats_goals_conceded: 28,
    stats_radar: { pace: 75, shooting: 68, passing: 95, dribbling: 78, defending: 72, physical: 68 },
    recent_points: [9, 6, 2, 12, 9], projected_points: 5.8, bps: 24
  },
  {
    id: 48, name: "Robertson", full_name: "Andrew Robertson", team: "LIV", position: Position.DEF, price: 6.0,
    points_last_gw: 6, total_points: 105, form: 6.2, selected_by_percent: 15.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=48",
    status: 'available', minutes_played: 2300, matches_played: 29, yellow_cards: 4, red_cards: 0, bonus_points: 12,
    goals_scored: 1, assists: 8, clean_sheets: 11,
    stats_xg: 0.8, stats_xa: 7.5, stats_ict: 135.8, stats_goals_conceded: 26,
    stats_radar: { pace: 82, shooting: 55, passing: 85, dribbling: 75, defending: 80, physical: 75 },
    recent_points: [6, 2, 6, 5, 6], projected_points: 4.8, bps: 18
  },
  {
    id: 49, name: "Gvardiol", full_name: "Josko Gvardiol", team: "MCI", position: Position.DEF, price: 6.2,
    points_last_gw: 8, total_points: 115, form: 7.0, selected_by_percent: 22.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=49",
    status: 'available', minutes_played: 2500, matches_played: 31, yellow_cards: 2, red_cards: 0, bonus_points: 14,
    goals_scored: 5, assists: 4, clean_sheets: 12,
    stats_xg: 3.8, stats_xa: 3.2, stats_ict: 125.5, stats_goals_conceded: 28,
    stats_radar: { pace: 78, shooting: 60, passing: 80, dribbling: 72, defending: 88, physical: 85 },
    recent_points: [8, 6, 2, 9, 8], projected_points: 5.2, bps: 21
  },
  {
    id: 50, name: "Dias", full_name: "Ruben Dias", team: "MCI", position: Position.DEF, price: 5.8,
    points_last_gw: 6, total_points: 105, form: 6.5, selected_by_percent: 12.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=50",
    status: 'available', minutes_played: 2600, matches_played: 32, yellow_cards: 3, red_cards: 0, bonus_points: 11,
    goals_scored: 2, assists: 1, clean_sheets: 12,
    stats_xg: 1.8, stats_xa: 0.8, stats_ict: 82.5, stats_goals_conceded: 28,
    stats_radar: { pace: 72, shooting: 45, passing: 82, dribbling: 65, defending: 92, physical: 88 },
    recent_points: [6, 6, 1, 6, 6], projected_points: 4.8, bps: 18
  },
  {
    id: 51, name: "Timber", full_name: "Jurrien Timber", team: "ARS", position: Position.DEF, price: 5.5,
    points_last_gw: 6, total_points: 95, form: 6.2, selected_by_percent: 10.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=51",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 4, red_cards: 0, bonus_points: 10,
    goals_scored: 1, assists: 3, clean_sheets: 14,
    stats_xg: 0.8, stats_xa: 2.5, stats_ict: 78.5, stats_goals_conceded: 22,
    stats_radar: { pace: 80, shooting: 50, passing: 82, dribbling: 78, defending: 85, physical: 78 },
    recent_points: [6, 6, 1, 6, 6], projected_points: 4.5, bps: 16
  },
  {
    id: 52, name: "White", full_name: "Ben White", team: "ARS", position: Position.DEF, price: 5.8,
    points_last_gw: 6, total_points: 108, form: 6.5, selected_by_percent: 15.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=52",
    status: 'available', minutes_played: 2500, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 12,
    goals_scored: 1, assists: 4, clean_sheets: 15,
    stats_xg: 0.5, stats_xa: 3.5, stats_ict: 92.5, stats_goals_conceded: 23,
    stats_radar: { pace: 78, shooting: 45, passing: 80, dribbling: 72, defending: 88, physical: 80 },
    recent_points: [6, 6, 1, 7, 6], projected_points: 5.0, bps: 18
  },
  {
    id: 53, name: "Cucurella", full_name: "Marc Cucurella", team: "CHE", position: Position.DEF, price: 5.2,
    points_last_gw: 5, total_points: 88, form: 5.5, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=53",
    status: 'available', minutes_played: 2200, matches_played: 28, yellow_cards: 5, red_cards: 0, bonus_points: 9,
    goals_scored: 1, assists: 3, clean_sheets: 8,
    stats_xg: 0.8, stats_xa: 2.8, stats_ict: 75.5, stats_goals_conceded: 38,
    stats_radar: { pace: 80, shooting: 48, passing: 78, dribbling: 75, defending: 80, physical: 75 },
    recent_points: [5, 2, 6, 3, 5], projected_points: 4.0, bps: 14
  },
  {
    id: 54, name: "Colwill", full_name: "Levi Colwill", team: "CHE", position: Position.DEF, price: 4.8,
    points_last_gw: 6, total_points: 95, form: 6.0, selected_by_percent: 12.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=54",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 3, red_cards: 0, bonus_points: 10,
    goals_scored: 2, assists: 1, clean_sheets: 9,
    stats_xg: 1.5, stats_xa: 0.8, stats_ict: 72.5, stats_goals_conceded: 36,
    stats_radar: { pace: 78, shooting: 45, passing: 75, dribbling: 68, defending: 85, physical: 82 },
    recent_points: [6, 6, 1, 6, 6], projected_points: 4.5, bps: 16
  },
  {
    id: 55, name: "Romero", full_name: "Cristian Romero", team: "TOT", position: Position.DEF, price: 5.2,
    points_last_gw: 2, total_points: 78, form: 4.8, selected_by_percent: 6.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=55",
    status: 'available', minutes_played: 2100, matches_played: 27, yellow_cards: 8, red_cards: 1, bonus_points: 7,
    goals_scored: 1, assists: 0, clean_sheets: 6,
    stats_xg: 0.8, stats_xa: 0.2, stats_ict: 58.5, stats_goals_conceded: 42,
    stats_radar: { pace: 80, shooting: 40, passing: 72, dribbling: 65, defending: 88, physical: 85 },
    recent_points: [2, 1, 6, 2, 2], projected_points: 3.5, bps: 11
  },
  {
    id: 56, name: "Cash", full_name: "Matty Cash", team: "AVL", position: Position.DEF, price: 4.8,
    points_last_gw: 5, total_points: 85, form: 5.2, selected_by_percent: 5.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=56",
    status: 'available', minutes_played: 2200, matches_played: 28, yellow_cards: 4, red_cards: 0, bonus_points: 8,
    goals_scored: 2, assists: 3, clean_sheets: 6,
    stats_xg: 1.5, stats_xa: 2.8, stats_ict: 88.5, stats_goals_conceded: 40,
    stats_radar: { pace: 85, shooting: 58, passing: 72, dribbling: 75, defending: 78, physical: 78 },
    recent_points: [5, 2, 6, 3, 5], projected_points: 4.0, bps: 14
  },
  {
    id: 57, name: "Konsa", full_name: "Ezri Konsa", team: "AVL", position: Position.DEF, price: 4.8,
    points_last_gw: 6, total_points: 92, form: 5.8, selected_by_percent: 7.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=57",
    status: 'available', minutes_played: 2500, matches_played: 31, yellow_cards: 2, red_cards: 0, bonus_points: 9,
    goals_scored: 2, assists: 1, clean_sheets: 7,
    stats_xg: 1.8, stats_xa: 0.5, stats_ict: 72.5, stats_goals_conceded: 38,
    stats_radar: { pace: 78, shooting: 48, passing: 75, dribbling: 68, defending: 85, physical: 82 },
    recent_points: [6, 6, 1, 6, 6], projected_points: 4.2, bps: 15
  },
  {
    id: 58, name: "Murillo", full_name: "Murillo", team: "NFO", position: Position.DEF, price: 4.5,
    points_last_gw: 6, total_points: 88, form: 5.8, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=58",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 4, red_cards: 0, bonus_points: 9,
    goals_scored: 1, assists: 1, clean_sheets: 6,
    stats_xg: 0.8, stats_xa: 0.5, stats_ict: 62.5, stats_goals_conceded: 42,
    stats_radar: { pace: 80, shooting: 42, passing: 72, dribbling: 65, defending: 85, physical: 85 },
    recent_points: [6, 2, 6, 3, 6], projected_points: 4.0, bps: 14
  },
  {
    id: 59, name: "Andersen", full_name: "Joachim Andersen", team: "CRY", position: Position.DEF, price: 4.5,
    points_last_gw: 2, total_points: 72, form: 4.2, selected_by_percent: 4.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=59",
    status: 'available', minutes_played: 2300, matches_played: 29, yellow_cards: 3, red_cards: 0, bonus_points: 6,
    goals_scored: 1, assists: 0, clean_sheets: 5,
    stats_xg: 0.8, stats_xa: 0.2, stats_ict: 52.5, stats_goals_conceded: 45,
    stats_radar: { pace: 72, shooting: 40, passing: 78, dribbling: 62, defending: 85, physical: 82 },
    recent_points: [2, 1, 6, 2, 2], projected_points: 3.5, bps: 10
  },
  {
    id: 60, name: "Collins", full_name: "Nathan Collins", team: "BRE", position: Position.DEF, price: 4.5,
    points_last_gw: 5, total_points: 82, form: 5.2, selected_by_percent: 5.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=60",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 5, red_cards: 0, bonus_points: 8,
    goals_scored: 2, assists: 0, clean_sheets: 5,
    stats_xg: 1.8, stats_xa: 0.2, stats_ict: 65.5, stats_goals_conceded: 48,
    stats_radar: { pace: 78, shooting: 48, passing: 70, dribbling: 58, defending: 85, physical: 88 },
    recent_points: [5, 2, 6, 2, 5], projected_points: 3.8, bps: 13
  },

  // ============ ADDITIONAL GOALKEEPERS ============
  {
    id: 61, name: "Raya", full_name: "David Raya", team: "ARS", position: Position.GK, price: 5.5,
    points_last_gw: 7, total_points: 120, form: 7.0, selected_by_percent: 25.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=61",
    status: 'available', minutes_played: 2700, matches_played: 30, yellow_cards: 1, red_cards: 0, bonus_points: 14, stats_saves: 95,
    goals_scored: 0, assists: 0, clean_sheets: 16,
    stats_xg: 0, stats_xa: 0, stats_ict: 55.5, stats_goals_conceded: 22,
    recent_points: [7, 6, 2, 8, 7], projected_points: 5.5, bps: 22
  },
  {
    id: 62, name: "Alisson", full_name: "Alisson Becker", team: "LIV", position: Position.GK, price: 5.5,
    points_last_gw: 6, total_points: 110, form: 6.5, selected_by_percent: 18.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=62",
    status: 'available', minutes_played: 2500, matches_played: 28, yellow_cards: 0, red_cards: 0, bonus_points: 12, stats_saves: 75,
    goals_scored: 0, assists: 1, clean_sheets: 12,
    stats_xg: 0, stats_xa: 0.2, stats_ict: 45.5, stats_goals_conceded: 26,
    recent_points: [6, 6, 2, 7, 6], projected_points: 5.0, bps: 19
  },
  {
    id: 63, name: "Martinez", full_name: "Emiliano Martinez", team: "AVL", position: Position.GK, price: 5.2,
    points_last_gw: 5, total_points: 105, form: 6.0, selected_by_percent: 15.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=63",
    status: 'available', minutes_played: 2700, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 11, stats_saves: 98,
    goals_scored: 0, assists: 0, clean_sheets: 8,
    stats_xg: 0, stats_xa: 0, stats_ict: 48.5, stats_goals_conceded: 38,
    recent_points: [5, 2, 6, 3, 5], projected_points: 4.5, bps: 17
  },
  {
    id: 64, name: "Sanchez", full_name: "Robert Sanchez", team: "CHE", position: Position.GK, price: 4.8,
    points_last_gw: 3, total_points: 85, form: 5.0, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=64",
    status: 'available', minutes_played: 2400, matches_played: 28, yellow_cards: 1, red_cards: 0, bonus_points: 8, stats_saves: 88,
    goals_scored: 0, assists: 0, clean_sheets: 9,
    stats_xg: 0, stats_xa: 0, stats_ict: 42.5, stats_goals_conceded: 36,
    recent_points: [3, 2, 6, 2, 3], projected_points: 3.8, bps: 14
  },
  {
    id: 65, name: "Pickford", full_name: "Jordan Pickford", team: "EVE", position: Position.GK, price: 4.5,
    points_last_gw: 5, total_points: 92, form: 5.5, selected_by_percent: 10.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=65",
    status: 'available', minutes_played: 2700, matches_played: 30, yellow_cards: 2, red_cards: 0, bonus_points: 10, stats_saves: 115,
    goals_scored: 0, assists: 0, clean_sheets: 7,
    stats_xg: 0, stats_xa: 0, stats_ict: 52.5, stats_goals_conceded: 42,
    recent_points: [5, 6, 2, 5, 5], projected_points: 4.2, bps: 16
  },
  {
    id: 66, name: "Pope", full_name: "Nick Pope", team: "NEW", position: Position.GK, price: 5.0,
    points_last_gw: 0, total_points: 65, form: 2.5, selected_by_percent: 5.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=66",
    status: 'injured', news: "Shoulder - Expected back March", minutes_played: 1200, matches_played: 14, yellow_cards: 0, red_cards: 0, bonus_points: 6, stats_saves: 45,
    goals_scored: 0, assists: 0, clean_sheets: 5,
    stats_xg: 0, stats_xa: 0, stats_ict: 32.5, stats_goals_conceded: 18,
    recent_points: [0, 0, 0, 0, 0], projected_points: 0, bps: 0
  },
  {
    id: 67, name: "Fabianski", full_name: "Lukasz Fabianski", team: "WHU", position: Position.GK, price: 4.2,
    points_last_gw: 3, total_points: 72, form: 4.2, selected_by_percent: 3.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=67",
    status: 'available', minutes_played: 2100, matches_played: 24, yellow_cards: 0, red_cards: 0, bonus_points: 5, stats_saves: 78,
    goals_scored: 0, assists: 0, clean_sheets: 4,
    stats_xg: 0, stats_xa: 0, stats_ict: 35.5, stats_goals_conceded: 42,
    recent_points: [3, 2, 3, 2, 3], projected_points: 3.2, bps: 10
  },
  {
    id: 68, name: "Henderson", full_name: "Dean Henderson", team: "CRY", position: Position.GK, price: 4.5,
    points_last_gw: 5, total_points: 85, form: 5.2, selected_by_percent: 6.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=68",
    status: 'available', minutes_played: 2500, matches_played: 28, yellow_cards: 1, red_cards: 0, bonus_points: 8, stats_saves: 102,
    goals_scored: 0, assists: 0, clean_sheets: 5,
    stats_xg: 0, stats_xa: 0, stats_ict: 48.5, stats_goals_conceded: 45,
    recent_points: [5, 2, 6, 3, 5], projected_points: 3.8, bps: 14
  },
  {
    id: 69, name: "Flekken", full_name: "Mark Flekken", team: "BRE", position: Position.GK, price: 4.5,
    points_last_gw: 3, total_points: 78, form: 4.8, selected_by_percent: 4.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=69",
    status: 'available', minutes_played: 2400, matches_played: 28, yellow_cards: 1, red_cards: 0, bonus_points: 7, stats_saves: 95,
    goals_scored: 0, assists: 0, clean_sheets: 5,
    stats_xg: 0, stats_xa: 0, stats_ict: 42.5, stats_goals_conceded: 48,
    recent_points: [3, 2, 5, 2, 3], projected_points: 3.5, bps: 12
  },
  {
    id: 70, name: "Verbruggen", full_name: "Bart Verbruggen", team: "BHA", position: Position.GK, price: 4.5,
    points_last_gw: 5, total_points: 88, form: 5.5, selected_by_percent: 7.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=70",
    status: 'available', minutes_played: 2500, matches_played: 28, yellow_cards: 0, red_cards: 0, bonus_points: 9, stats_saves: 92,
    goals_scored: 0, assists: 0, clean_sheets: 6,
    stats_xg: 0, stats_xa: 0, stats_ict: 45.5, stats_goals_conceded: 40,
    recent_points: [5, 3, 6, 3, 5], projected_points: 4.0, bps: 15
  },

  // ============ MORE BUDGET OPTIONS ============
  {
    id: 71, name: "Bowen", full_name: "Jarrod Bowen", team: "WHU", position: Position.MID, price: 7.2,
    points_last_gw: 6, total_points: 108, form: 6.2, selected_by_percent: 14.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=71",
    status: 'available', minutes_played: 2400, matches_played: 30, yellow_cards: 3, red_cards: 0, bonus_points: 13,
    goals_scored: 10, assists: 7, clean_sheets: 4,
    stats_xg: 9.5, stats_xa: 6.5, stats_ict: 168.5, stats_goals_conceded: 0,
    stats_radar: { pace: 82, shooting: 80, passing: 75, dribbling: 82, defending: 40, physical: 72 },
    recent_points: [6, 5, 8, 4, 6], projected_points: 5.2, bps: 19
  },
  {
    id: 72, name: "Rogers", full_name: "Morgan Rogers", team: "AVL", position: Position.MID, price: 5.5,
    points_last_gw: 7, total_points: 95, form: 6.5, selected_by_percent: 10.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=72",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 2, red_cards: 0, bonus_points: 10,
    goals_scored: 6, assists: 6, clean_sheets: 5,
    stats_xg: 5.8, stats_xa: 5.5, stats_ict: 135.5, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 72, passing: 75, dribbling: 85, defending: 35, physical: 72 },
    recent_points: [7, 3, 9, 4, 7], projected_points: 5.0, bps: 17
  },
  {
    id: 73, name: "Mainoo", full_name: "Kobbie Mainoo", team: "MUN", position: Position.MID, price: 5.2,
    points_last_gw: 3, total_points: 72, form: 4.8, selected_by_percent: 5.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=73",
    status: 'available', minutes_played: 1900, matches_played: 25, yellow_cards: 3, red_cards: 0, bonus_points: 6,
    goals_scored: 3, assists: 2, clean_sheets: 7,
    stats_xg: 2.8, stats_xa: 2.2, stats_ict: 85.5, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 68, passing: 80, dribbling: 82, defending: 72, physical: 75 },
    recent_points: [3, 2, 5, 3, 3], projected_points: 3.8, bps: 12
  },
  {
    id: 74, name: "Mazraoui", full_name: "Noussair Mazraoui", team: "MUN", position: Position.DEF, price: 4.8,
    points_last_gw: 5, total_points: 82, form: 5.2, selected_by_percent: 6.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=74",
    status: 'available', minutes_played: 2100, matches_played: 27, yellow_cards: 3, red_cards: 0, bonus_points: 8,
    goals_scored: 1, assists: 3, clean_sheets: 8,
    stats_xg: 0.8, stats_xa: 2.8, stats_ict: 72.5, stats_goals_conceded: 35,
    stats_radar: { pace: 82, shooting: 55, passing: 80, dribbling: 78, defending: 78, physical: 72 },
    recent_points: [5, 2, 6, 3, 5], projected_points: 4.0, bps: 14
  },
  {
    id: 75, name: "Joao Pedro", full_name: "Joao Pedro", team: "BHA", position: Position.FWD, price: 5.8,
    points_last_gw: 5, total_points: 88, form: 5.5, selected_by_percent: 8.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=75",
    status: 'available', minutes_played: 2000, matches_played: 27, yellow_cards: 2, red_cards: 0, bonus_points: 9,
    goals_scored: 8, assists: 4, clean_sheets: 0,
    stats_xg: 8.5, stats_xa: 3.5, stats_ict: 125.5, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 78, passing: 72, dribbling: 82, defending: 30, physical: 72 },
    recent_points: [5, 2, 8, 3, 5], projected_points: 4.5, bps: 15
  },
  {
    id: 76, name: "Burn", full_name: "Dan Burn", team: "NEW", position: Position.DEF, price: 4.5,
    points_last_gw: 6, total_points: 85, form: 5.5, selected_by_percent: 6.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=76",
    status: 'available', minutes_played: 2300, matches_played: 29, yellow_cards: 4, red_cards: 0, bonus_points: 8,
    goals_scored: 2, assists: 1, clean_sheets: 7,
    stats_xg: 1.8, stats_xa: 0.5, stats_ict: 62.5, stats_goals_conceded: 38,
    stats_radar: { pace: 68, shooting: 42, passing: 65, dribbling: 52, defending: 85, physical: 92 },
    recent_points: [6, 2, 6, 3, 6], projected_points: 4.0, bps: 14
  },
  {
    id: 77, name: "Lewis", full_name: "Rico Lewis", team: "MCI", position: Position.DEF, price: 4.8,
    points_last_gw: 5, total_points: 82, form: 5.2, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=77",
    status: 'available', minutes_played: 1800, matches_played: 25, yellow_cards: 2, red_cards: 0, bonus_points: 8,
    goals_scored: 1, assists: 3, clean_sheets: 10,
    stats_xg: 0.5, stats_xa: 2.8, stats_ict: 75.5, stats_goals_conceded: 20,
    stats_radar: { pace: 80, shooting: 58, passing: 82, dribbling: 78, defending: 75, physical: 68 },
    recent_points: [5, 3, 6, 2, 5], projected_points: 4.2, bps: 14
  },
  {
    id: 78, name: "Toney", full_name: "Ivan Toney", team: "BRE", position: Position.FWD, price: 7.5,
    points_last_gw: 6, total_points: 65, form: 5.5, selected_by_percent: 5.2,
    is_bench: false, image: "https://picsum.photos/100/100?random=78",
    status: 'available', minutes_played: 1200, matches_played: 16, yellow_cards: 2, red_cards: 0, bonus_points: 6,
    goals_scored: 6, assists: 2, clean_sheets: 0,
    stats_xg: 6.8, stats_xa: 1.8, stats_ict: 95.5, stats_goals_conceded: 0,
    stats_radar: { pace: 72, shooting: 88, passing: 72, dribbling: 75, defending: 38, physical: 82 },
    recent_points: [6, 2, 8, 3, 6], projected_points: 5.2, bps: 16
  },
  {
    id: 79, name: "Leno", full_name: "Bernd Leno", team: "FUL", position: Position.GK, price: 4.5,
    points_last_gw: 5, total_points: 95, form: 5.8, selected_by_percent: 8.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=79",
    status: 'available', minutes_played: 2700, matches_played: 30, yellow_cards: 1, red_cards: 0, bonus_points: 10, stats_saves: 108,
    goals_scored: 0, assists: 0, clean_sheets: 7,
    stats_xg: 0, stats_xa: 0, stats_ict: 52.5, stats_goals_conceded: 42,
    recent_points: [5, 3, 6, 4, 5], projected_points: 4.2, bps: 16
  },
  {
    id: 80, name: "Sels", full_name: "Matz Sels", team: "NFO", position: Position.GK, price: 4.5,
    points_last_gw: 5, total_points: 92, form: 5.8, selected_by_percent: 9.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=80",
    status: 'available', minutes_played: 2600, matches_played: 30, yellow_cards: 0, red_cards: 0, bonus_points: 10, stats_saves: 105,
    goals_scored: 0, assists: 0, clean_sheets: 6,
    stats_xg: 0, stats_xa: 0, stats_ict: 48.5, stats_goals_conceded: 42,
    recent_points: [5, 3, 6, 3, 5], projected_points: 4.0, bps: 15
  },

  // ============ BOTTOM TEAM PLAYERS ============
  {
    id: 81, name: "Delap", full_name: "Liam Delap", team: "IPS", position: Position.FWD, price: 5.5,
    points_last_gw: 5, total_points: 75, form: 5.2, selected_by_percent: 4.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=81",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 3, red_cards: 0, bonus_points: 7,
    goals_scored: 8, assists: 2, clean_sheets: 0,
    stats_xg: 9.2, stats_xa: 1.8, stats_ict: 108.5, stats_goals_conceded: 0,
    stats_radar: { pace: 82, shooting: 78, passing: 62, dribbling: 72, defending: 28, physical: 78 },
    recent_points: [5, 2, 7, 2, 5], projected_points: 4.2, bps: 13
  },
  {
    id: 82, name: "Hutchinson", full_name: "Omari Hutchinson", team: "IPS", position: Position.MID, price: 5.2,
    points_last_gw: 5, total_points: 72, form: 5.0, selected_by_percent: 3.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=82",
    status: 'available', minutes_played: 2000, matches_played: 27, yellow_cards: 2, red_cards: 0, bonus_points: 6,
    goals_scored: 5, assists: 4, clean_sheets: 2,
    stats_xg: 5.5, stats_xa: 3.8, stats_ict: 98.5, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 70, passing: 72, dribbling: 85, defending: 32, physical: 62 },
    recent_points: [5, 2, 6, 2, 5], projected_points: 3.8, bps: 12
  },
  {
    id: 83, name: "Armstrong", full_name: "Adam Armstrong", team: "SOU", position: Position.FWD, price: 5.2,
    points_last_gw: 2, total_points: 62, form: 4.0, selected_by_percent: 2.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=83",
    status: 'available', minutes_played: 1800, matches_played: 26, yellow_cards: 2, red_cards: 0, bonus_points: 5,
    goals_scored: 6, assists: 1, clean_sheets: 0,
    stats_xg: 7.5, stats_xa: 1.2, stats_ict: 85.5, stats_goals_conceded: 0,
    stats_radar: { pace: 85, shooting: 75, passing: 58, dribbling: 72, defending: 25, physical: 68 },
    recent_points: [2, 5, 2, 2, 2], projected_points: 3.2, bps: 10
  },
  {
    id: 84, name: "Vardy", full_name: "Jamie Vardy", team: "LEI", position: Position.FWD, price: 5.5,
    points_last_gw: 5, total_points: 78, form: 5.0, selected_by_percent: 4.8,
    is_bench: false, image: "https://picsum.photos/100/100?random=84",
    status: 'available', minutes_played: 1900, matches_played: 27, yellow_cards: 3, red_cards: 0, bonus_points: 7,
    goals_scored: 8, assists: 2, clean_sheets: 0,
    stats_xg: 7.8, stats_xa: 1.5, stats_ict: 105.5, stats_goals_conceded: 0,
    stats_radar: { pace: 88, shooting: 82, passing: 55, dribbling: 70, defending: 28, physical: 68 },
    recent_points: [5, 2, 8, 2, 5], projected_points: 4.0, bps: 14
  },
  {
    id: 85, name: "Buonanotte", full_name: "Facundo Buonanotte", team: "LEI", position: Position.MID, price: 5.0,
    points_last_gw: 5, total_points: 75, form: 5.2, selected_by_percent: 3.5,
    is_bench: false, image: "https://picsum.photos/100/100?random=85",
    status: 'available', minutes_played: 2100, matches_played: 28, yellow_cards: 2, red_cards: 0, bonus_points: 7,
    goals_scored: 4, assists: 5, clean_sheets: 3,
    stats_xg: 4.2, stats_xa: 4.5, stats_ict: 98.5, stats_goals_conceded: 0,
    stats_radar: { pace: 78, shooting: 72, passing: 78, dribbling: 85, defending: 35, physical: 58 },
    recent_points: [5, 2, 6, 3, 5], projected_points: 3.8, bps: 13
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
    { user_id: '2', manager_name: 'Dawit Tekle', team_name: 'Bole Ballers', rank: 1, total_points: 1520, gameweek_points: 78, rank_change: 0, is_me: false },
    { user_id: '3', manager_name: 'Sara Kebede', team_name: 'Lucy XI', rank: 2, total_points: 1490, gameweek_points: 55, rank_change: -1, is_me: false },
    { user_id: '4', manager_name: 'Kebede Mulugeta', team_name: 'St. George Fans', rank: 4, total_points: 1400, gameweek_points: 42, rank_change: 2, is_me: false },
    { user_id: '5', manager_name: 'Abebe Girma', team_name: 'Coffee FC', rank: 5, total_points: 1350, gameweek_points: 30, rank_change: -2, is_me: false },
    { user_id: '6', manager_name: 'Tigist Haile', team_name: 'Addis United', rank: 6, total_points: 1320, gameweek_points: 52, rank_change: 3, is_me: false },
    { user_id: '7', manager_name: 'Yonas Mekonnen', team_name: 'Gunners Ethiopia', rank: 7, total_points: 1285, gameweek_points: 48, rank_change: -1, is_me: false },
    { user_id: '8', manager_name: 'Mekdes Assefa', team_name: 'Merkato Magic', rank: 8, total_points: 1260, gameweek_points: 62, rank_change: 5, is_me: false },
    { user_id: '9', manager_name: 'Henok Desta', team_name: 'Habesha Hotshots', rank: 9, total_points: 1245, gameweek_points: 38, rank_change: -3, is_me: false },
    { user_id: '10', manager_name: 'Selam Bekele', team_name: 'Ethio Lions', rank: 10, total_points: 1220, gameweek_points: 45, rank_change: 0, is_me: false },
    { user_id: '11', manager_name: 'Bereket Tadesse', team_name: 'Piassa Pros', rank: 11, total_points: 1195, gameweek_points: 35, rank_change: -2, is_me: false },
    { user_id: '12', manager_name: 'Hanna Solomon', team_name: 'Walia Warriors', rank: 12, total_points: 1180, gameweek_points: 58, rank_change: 4, is_me: false },
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
  // Top 6
  { team_id: "ARS", name: "Arsenal", short_name: "ARS", color: "#EF0107", strength_overall: 4, strength_attack: 4, strength_defense: 5 },
  { team_id: "CHE", name: "Chelsea", short_name: "CHE", color: "#034694", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "LIV", name: "Liverpool", short_name: "LIV", color: "#C8102E", strength_overall: 5, strength_attack: 5, strength_defense: 4 },
  { team_id: "MCI", name: "Man City", short_name: "MCI", color: "#6CABDD", strength_overall: 5, strength_attack: 5, strength_defense: 4 },
  { team_id: "MUN", name: "Man Utd", short_name: "MUN", color: "#DA291C", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "TOT", name: "Spurs", short_name: "TOT", color: "#132257", strength_overall: 4, strength_attack: 4, strength_defense: 3 },
  // Mid-table
  { team_id: "AVL", name: "Aston Villa", short_name: "AVL", color: "#670E36", strength_overall: 3, strength_attack: 4, strength_defense: 3 },
  { team_id: "NEW", name: "Newcastle", short_name: "NEW", color: "#241F20", strength_overall: 3, strength_attack: 4, strength_defense: 3 },
  { team_id: "BHA", name: "Brighton", short_name: "BHA", color: "#0057B8", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "WHU", name: "West Ham", short_name: "WHU", color: "#7A263A", strength_overall: 3, strength_attack: 3, strength_defense: 2 },
  { team_id: "BOU", name: "Bournemouth", short_name: "BOU", color: "#DA291C", strength_overall: 3, strength_attack: 3, strength_defense: 2 },
  { team_id: "FUL", name: "Fulham", short_name: "FUL", color: "#000000", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "CRY", name: "Crystal Palace", short_name: "CRY", color: "#1B458F", strength_overall: 3, strength_attack: 3, strength_defense: 3 },
  { team_id: "BRE", name: "Brentford", short_name: "BRE", color: "#D20000", strength_overall: 3, strength_attack: 3, strength_defense: 2 },
  { team_id: "WOL", name: "Wolves", short_name: "WOL", color: "#FDB913", strength_overall: 2, strength_attack: 2, strength_defense: 3 },
  { team_id: "NFO", name: "Nottm Forest", short_name: "NFO", color: "#DD0000", strength_overall: 2, strength_attack: 2, strength_defense: 2 },
  { team_id: "EVE", name: "Everton", short_name: "EVE", color: "#003399", strength_overall: 2, strength_attack: 2, strength_defense: 2 },
  // Bottom
  { team_id: "LEI", name: "Leicester", short_name: "LEI", color: "#003090", strength_overall: 2, strength_attack: 2, strength_defense: 2 },
  { team_id: "IPS", name: "Ipswich", short_name: "IPS", color: "#3A64A3", strength_overall: 2, strength_attack: 2, strength_defense: 1 },
  { team_id: "SOU", name: "Southampton", short_name: "SOU", color: "#D71920", strength_overall: 2, strength_attack: 2, strength_defense: 1 },
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

// ============ SHOWROOM VENUES ============
export const MOCK_SHOWROOMS: Showroom[] = [
  {
    showroom_id: 'sr_001',
    name: 'Tomoca Coffee - Bole',
    slug: 'tomoca-bole',
    venue_type: 'coffee_shop',
    tier: 'gold',
    location: {
      city: 'Addis Ababa',
      sub_city: 'Bole',
      address: 'Bole Road, Near Edna Mall',
      coordinates: { lat: 8.9806, lng: 38.7578 }
    },
    qr_code: 'SR_TOMOCA_BOLE_001',
    verification: {
      method: 'qr_scan',
      gps_required: true,
      gps_radius_meters: 100,
      check_in_cooldown_hours: 1
    },
    branding: {
      logo_url: 'https://picsum.photos/100/100?random=sr1',
      primary_color: '#4A2C2A',
      secondary_color: '#D4A574',
      sponsor_name: 'Telebirr'
    },
    stats: {
      total_members: 342,
      active_this_week: 89,
      all_time_points: 45200,
      rank_in_city: 3
    },
    operating_hours: { open: '07:00', close: '22:00' },
    created_at: '2024-01-15'
  },
  {
    showroom_id: 'sr_002',
    name: 'Kaldi\'s Coffee - Kazanchis',
    slug: 'kaldis-kazanchis',
    venue_type: 'coffee_shop',
    tier: 'silver',
    location: {
      city: 'Addis Ababa',
      sub_city: 'Kirkos',
      address: 'Kazanchis, Near Hilton',
      coordinates: { lat: 9.0147, lng: 38.7632 }
    },
    qr_code: 'SR_KALDIS_KAZ_002',
    verification: {
      method: 'qr_scan',
      gps_required: true,
      gps_radius_meters: 75,
      check_in_cooldown_hours: 1
    },
    branding: {
      logo_url: 'https://picsum.photos/100/100?random=sr2',
      primary_color: '#2D5016',
      secondary_color: '#8BC34A'
    },
    stats: {
      total_members: 215,
      active_this_week: 52,
      all_time_points: 28700,
      rank_in_city: 8
    },
    operating_hours: { open: '06:30', close: '21:00' },
    created_at: '2024-02-10'
  },
  {
    showroom_id: 'sr_003',
    name: 'Walia Sports Bar - Piassa',
    slug: 'walia-piassa',
    venue_type: 'sports_bar',
    tier: 'platinum',
    location: {
      city: 'Addis Ababa',
      sub_city: 'Arada',
      address: 'Piassa, Churchill Avenue',
      coordinates: { lat: 9.0358, lng: 38.7531 }
    },
    qr_code: 'SR_WALIA_PIASSA_003',
    verification: {
      method: 'qr_scan',
      gps_required: true,
      gps_radius_meters: 50,
      check_in_cooldown_hours: 2
    },
    branding: {
      logo_url: 'https://picsum.photos/100/100?random=sr3',
      primary_color: '#006400',
      secondary_color: '#FFD700',
      sponsor_name: 'Heineken'
    },
    stats: {
      total_members: 567,
      active_this_week: 178,
      all_time_points: 89400,
      rank_in_city: 1
    },
    operating_hours: { open: '15:00', close: '02:00' },
    created_at: '2023-11-01'
  },
  {
    showroom_id: 'sr_004',
    name: 'AAU Engineering Campus',
    slug: 'aau-engineering',
    venue_type: 'university',
    tier: 'gold',
    location: {
      city: 'Addis Ababa',
      sub_city: 'Yeka',
      address: 'AAU 5 Kilo Campus',
      coordinates: { lat: 9.0380, lng: 38.7630 }
    },
    qr_code: 'SR_AAU_ENG_004',
    verification: {
      method: 'wifi_check',
      gps_required: false,
      wifi_ssid: 'AAU-Student',
      check_in_cooldown_hours: 4
    },
    branding: {
      logo_url: 'https://picsum.photos/100/100?random=sr4',
      primary_color: '#1A237E',
      secondary_color: '#FFFFFF'
    },
    stats: {
      total_members: 1250,
      active_this_week: 320,
      all_time_points: 156000,
      rank_in_city: 2
    },
    created_at: '2023-09-15'
  },
  {
    showroom_id: 'sr_005',
    name: 'Ethio Telecom HQ Lounge',
    slug: 'ethio-telecom-hq',
    venue_type: 'corporate',
    tier: 'platinum',
    location: {
      city: 'Addis Ababa',
      sub_city: 'Kirkos',
      address: 'Churchill Road, Ethio Telecom Tower',
      coordinates: { lat: 9.0120, lng: 38.7580 }
    },
    qr_code: 'SR_ET_HQ_005',
    verification: {
      method: 'qr_scan',
      gps_required: true,
      gps_radius_meters: 200,
      check_in_cooldown_hours: 8
    },
    branding: {
      logo_url: 'https://picsum.photos/100/100?random=sr5',
      primary_color: '#FF6600',
      secondary_color: '#003366',
      sponsor_name: 'Ethio Telecom'
    },
    stats: {
      total_members: 890,
      active_this_week: 245,
      all_time_points: 112000,
      rank_in_city: 4
    },
    operating_hours: { open: '08:00', close: '18:00' },
    created_at: '2024-01-01'
  }
];

// ============ CONTESTS ============
export const MOCK_CONTESTS: Contest[] = [
  {
    contest_id: 'ct_001',
    name: 'Daily Free Contest',
    type: 'free',
    entry_fee_coins: 0,
    prize_structure: [
      { position: 1, prize_coins: 100, prize_label: '1st Place' },
      { position: 2, prize_coins: 50, prize_label: '2nd Place' },
      { position: 3, prize_coins: 25, prize_label: '3rd Place' }
    ],
    max_entries: 0,
    current_entries: 12450,
    start_time: getFutureDate(0),
    end_time: getFutureDate(1),
    status: 'active',
    contest_rules: ['One entry per user', 'Points based on GW performance', 'Ties split prizes'],
    is_guaranteed: true
  },
  {
    contest_id: 'ct_002',
    name: 'Micro Stakes Challenge',
    type: 'micro',
    entry_fee_coins: 10,
    prize_structure: [
      { position: 1, prize_coins: 50, prize_label: 'Champion' },
      { position: 2, prize_coins: 30, prize_label: 'Runner-up' },
      { position: 3, prize_coins: 15, prize_label: '3rd Place' }
    ],
    max_entries: 100,
    current_entries: 67,
    start_time: getFutureDate(0),
    end_time: getFutureDate(1),
    status: 'active',
    contest_rules: ['Max 1 entry per user', 'Top 3 win prizes'],
    is_guaranteed: true
  },
  {
    contest_id: 'ct_003',
    name: 'Telebirr Weekly Cup',
    type: 'standard',
    entry_fee_coins: 50,
    sponsor: { name: 'Telebirr', logo_url: 'https://picsum.photos/50/50?random=telebir' },
    prize_structure: [
      { position: 1, prize_coins: 500, prize_label: 'Champion', prize_etb: 200 },
      { position: 2, prize_coins: 250, prize_label: 'Runner-up', prize_etb: 100 },
      { position: 3, prize_coins: 100, prize_label: '3rd Place', prize_etb: 50 }
    ],
    max_entries: 500,
    current_entries: 342,
    start_time: getFutureDate(-2),
    end_time: getFutureDate(5),
    status: 'active',
    contest_rules: ['Sponsored by Telebirr', 'Top 3 win coins + ETB prizes', 'Prize guaranteed'],
    is_guaranteed: true
  },
  {
    contest_id: 'ct_004',
    name: 'Premium Showroom Battle',
    type: 'premium',
    entry_fee_coins: 100,
    showroom_id: 'sr_003',
    prize_structure: [
      { position: 1, prize_coins: 1000, prize_label: 'Showroom Champion' },
      { position: 2, prize_coins: 500, prize_label: 'Runner-up' },
      { position: 3, prize_coins: 250, prize_label: '3rd Place' },
      { position: 10, prize_coins: 50, prize_label: 'Top 10' }
    ],
    max_entries: 50,
    current_entries: 38,
    start_time: getFutureDate(0),
    end_time: getFutureDate(1),
    status: 'active',
    min_level: 5,
    contest_rules: ['Showroom members only', 'Must check in to enter', 'Level 5+ required'],
    is_guaranteed: true
  },
  {
    contest_id: 'ct_005',
    name: 'Elite Masters League',
    type: 'elite',
    entry_fee_coins: 250,
    prize_structure: [
      { position: 1, prize_coins: 2500, prize_label: 'Elite Champion', prize_etb: 1000 },
      { position: 2, prize_coins: 1500, prize_label: 'Elite Runner-up', prize_etb: 500 },
      { position: 3, prize_coins: 750, prize_label: 'Elite 3rd', prize_etb: 250 }
    ],
    max_entries: 100,
    current_entries: 45,
    start_time: getFutureDate(-1),
    end_time: getFutureDate(6),
    status: 'active',
    min_level: 10,
    contest_rules: ['Level 10+ only', 'Weekly format', 'Big prizes guaranteed'],
    is_guaranteed: true
  },
  {
    contest_id: 'ct_006',
    name: 'Grand Championship',
    type: 'grand',
    entry_fee_coins: 500,
    sponsor: { name: 'Coca-Cola', logo_url: 'https://picsum.photos/50/50?random=coke' },
    prize_structure: [
      { position: 1, prize_coins: 10000, prize_label: 'Grand Champion', prize_etb: 5000 },
      { position: 2, prize_coins: 5000, prize_label: 'Grand Runner-up', prize_etb: 2500 },
      { position: 3, prize_coins: 2500, prize_label: 'Grand 3rd', prize_etb: 1000 },
      { position: 10, prize_coins: 500, prize_label: 'Top 10', prize_etb: 200 }
    ],
    max_entries: 200,
    current_entries: 156,
    start_time: getFutureDate(-3),
    end_time: getFutureDate(4),
    status: 'active',
    min_level: 15,
    contest_rules: ['Monthly championship', 'Level 15+ required', 'Massive guaranteed prizes'],
    is_guaranteed: true
  }
];

// ============ COIN BUNDLES ============
export const COIN_BUNDLES: CoinBundle[] = [
  {
    bundle_id: 'bundle_starter',
    name: 'Starter Pack',
    coins: 100,
    bonus_coins: 0,
    price_etb: 20,
    price_display: '20 Birr',
    discount_percent: 0,
    is_popular: false,
    is_best_value: false
  },
  {
    bundle_id: 'bundle_basic',
    name: 'Basic Bundle',
    coins: 500,
    bonus_coins: 25,
    price_etb: 95,
    price_display: '95 Birr',
    discount_percent: 5,
    is_popular: false,
    is_best_value: false
  },
  {
    bundle_id: 'bundle_popular',
    name: 'Popular Pack',
    coins: 1000,
    bonus_coins: 100,
    price_etb: 180,
    price_display: '180 Birr',
    discount_percent: 10,
    is_popular: true,
    is_best_value: false
  },
  {
    bundle_id: 'bundle_value',
    name: 'Value Bundle',
    coins: 2500,
    bonus_coins: 375,
    price_etb: 425,
    price_display: '425 Birr',
    discount_percent: 15,
    is_popular: false,
    is_best_value: true
  },
  {
    bundle_id: 'bundle_premium',
    name: 'Premium Pack',
    coins: 5000,
    bonus_coins: 1000,
    price_etb: 800,
    price_display: '800 Birr',
    discount_percent: 20,
    is_popular: false,
    is_best_value: false
  },
  {
    bundle_id: 'bundle_elite',
    name: 'Elite Bundle',
    coins: 10000,
    bonus_coins: 2500,
    price_etb: 1500,
    price_display: '1,500 Birr',
    discount_percent: 25,
    is_popular: false,
    is_best_value: false
  }
];

// ============ MINI-GAMES CONFIGURATION ============
export const MINI_GAMES: MiniGameConfig[] = [
  {
    id: 'penalty_shootout',
    name: 'Penalty Shootout',
    description: 'Score 5 penalties against the AI goalkeeper',
    icon: '⚽',
    unlock_level: 1,
    cost_coins: 0,
    daily_limit: 3,
    max_reward_coins: 50,
    xp_reward: 10,
    rules: [
      'Swipe to aim your shot',
      'Tap to adjust power',
      'Score as many as you can in 5 attempts',
      '3+ goals = coins reward'
    ]
  },
  {
    id: 'price_predictor',
    name: 'Price Predictor',
    description: 'Predict if player prices will rise or fall',
    icon: '📈',
    unlock_level: 3,
    cost_coins: 5,
    daily_limit: 5,
    max_reward_coins: 100,
    xp_reward: 15,
    rules: [
      'Pick 5 players',
      'Predict: Rise, Fall, or Same',
      'Correct predictions earn coins',
      '5/5 correct = jackpot bonus'
    ]
  },
  {
    id: 'formation_puzzle',
    name: 'Formation Puzzle',
    description: 'Arrange players in the correct formation',
    icon: '🧩',
    unlock_level: 5,
    cost_coins: 10,
    daily_limit: 3,
    max_reward_coins: 75,
    xp_reward: 20,
    rules: [
      'Given 11 players, arrange in formation',
      'Beat the clock for bonus',
      'Fewer moves = higher score',
      'Daily puzzles refresh at midnight'
    ]
  },
  {
    id: 'match_predictor',
    name: 'Match Predictor',
    description: 'Predict match results for bonus coins',
    icon: '🏆',
    unlock_level: 7,
    cost_coins: 20,
    daily_limit: 3,
    max_reward_coins: 200,
    xp_reward: 25,
    rules: [
      'Predict exact scores',
      'Partial credit for correct result',
      'Bonus for correct scorers',
      'Available before each GW'
    ]
  },
  {
    id: 'captain_roulette',
    name: 'Captain Roulette',
    description: 'Spin for a random captain suggestion',
    icon: '🎰',
    unlock_level: 10,
    cost_coins: 25,
    daily_limit: 2,
    max_reward_coins: 150,
    xp_reward: 30,
    rules: [
      'Spin the wheel',
      'Get a captain suggestion',
      'Use it for 2x bonus if they score big',
      'Risk/reward mechanic'
    ]
  }
];

// ============ XP ACTIONS ============
export const XP_ACTIONS: XPAction[] = [
  { action: 'daily_login', xp: 10, daily_limit: 1, description: 'Log in daily' },
  { action: 'complete_trivia', xp: 5, daily_limit: 5, description: 'Answer trivia correctly' },
  { action: 'make_transfer', xp: 3, daily_limit: 10, description: 'Make a transfer' },
  { action: 'set_captain', xp: 5, daily_limit: 1, description: 'Set your captain' },
  { action: 'join_league', xp: 25, daily_limit: 3, description: 'Join a new league' },
  { action: 'invite_friend', xp: 50, daily_limit: 5, description: 'Invite a friend who joins' },
  { action: 'complete_quest', xp: 20, daily_limit: 3, description: 'Complete daily quest' },
  { action: 'win_h2h', xp: 15, daily_limit: 10, description: 'Win H2H matchup' },
  { action: 'showroom_checkin', xp: 25, daily_limit: 2, description: 'Check in at showroom' },
  { action: 'contest_entry', xp: 10, daily_limit: 5, description: 'Enter a contest' },
  { action: 'contest_win', xp: 100, daily_limit: 10, description: 'Win a contest (top 3)' },
  { action: 'mini_game', xp: 10, daily_limit: 5, description: 'Play a mini-game' },
  { action: 'survey_complete', xp: 15, daily_limit: 3, description: 'Complete a survey' },
  { action: 'share_achievement', xp: 5, daily_limit: 3, description: 'Share to social media' },
  { action: 'first_purchase', xp: 100, daily_limit: 1, description: 'Make first coin purchase' }
];

// ============ COFFEE HOUR CONFIGURATION ============
export const COFFEE_HOUR_CONFIG: CoffeeHourConfig = {
  enabled: true,
  start_hour: 6,
  end_hour: 9,
  timezone: 'Africa/Addis_Ababa',
  bonus_multiplier: 1.5,
  bonus_types: ['xp', 'coins', 'trivia_rewards'],
  special_rewards: [
    { type: 'coins', amount: 10, chance: 0.3 },
    { type: 'xp', amount: 25, chance: 0.5 },
    { type: 'badge', badge_id: 'early_bird', chance: 0.05 }
  ]
};

// ============ SURVEYS ============
export const MOCK_SURVEYS: Survey[] = [
  {
    survey_id: 'survey_001',
    sponsor: { name: 'Coca-Cola', logo_url: 'https://picsum.photos/50/50?random=coke' },
    title: 'Beverage Preferences',
    description: 'Share your soft drink preferences and earn coins!',
    reward_coins: 50,
    estimated_minutes: 2,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'How often do you buy soft drinks?',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
        required: true
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Which brand do you prefer?',
        options: ['Coca-Cola', 'Pepsi', 'Mirinda', 'Sprite', 'Other'],
        required: true
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'Rate your satisfaction with available options (1-5)',
        min: 1,
        max: 5,
        required: false
      }
    ],
    expiry_date: getFutureDate(7),
    cooldown_days: 7,
    status: 'active'
  },
  {
    survey_id: 'survey_002',
    sponsor: { name: 'Ethio Telecom', logo_url: 'https://picsum.photos/50/50?random=et' },
    title: 'Mobile Data Usage',
    description: 'Tell us about your data habits!',
    reward_coins: 75,
    estimated_minutes: 3,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'How much mobile data do you use monthly?',
        options: ['<1GB', '1-5GB', '5-10GB', '10GB+'],
        required: true
      },
      {
        id: 'q2',
        type: 'text',
        question: 'What apps use most of your data?',
        max_length: 200,
        required: true
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'Rate your network satisfaction (1-5)',
        min: 1,
        max: 5,
        required: true
      }
    ],
    expiry_date: getFutureDate(14),
    cooldown_days: 14,
    status: 'active'
  }
];

// =============================================
// FEATURE FLAGS
// =============================================

export const FEATURE_FLAGS: FeatureFlags = {
  SPONSOR_MODULE: true,
  SPONSOR_ACTIVATIONS: true,
  SPONSOR_PORTAL: true,
  ADMIN_PORTAL: true,
  DEV_ROLE_SWITCHER: true,
  SPONSOR_PUSH_NOTIFICATIONS: false,
  REAL_ANALYTICS: false,
};

// =============================================
// SPONSOR MODULE — MOCK DATA
// =============================================

export const MOCK_SPONSORS: Sponsor[] = [
  {
    sponsor_id: 'sp_telebirr',
    name: 'Telebirr',
    slug: 'telebirr',
    tier: 'platinum',
    status: 'active',
    company_name: 'Ethio Telecom — Telebirr',
    industry: 'Fintech / Telecom',
    contact_email: 'partnerships@telebirr.com',
    contact_phone: '+251-11-551-0000',
    logo_url: 'https://picsum.photos/200/200?random=telebirr',
    primary_color: '#00A651',
    secondary_color: '#FFC107',
    contract_start: '2025-01-01',
    contract_end: '2025-12-31',
    monthly_budget_birr: 500000,
    prize_budget_birr: 200000,
    max_leagues: 999,
    max_campaigns: 999,
    has_push_notifications: true,
    has_survey_access: true,
    has_showroom_activation: true,
    has_realtime_dashboard: true,
    total_impressions: 2450000,
    total_engagements: 182000,
    active_campaigns_count: 4,
    created_at: '2025-01-01',
    updated_at: '2025-02-01'
  },
  {
    sponsor_id: 'sp_coca_cola',
    name: 'Coca-Cola',
    slug: 'coca-cola',
    tier: 'gold',
    status: 'active',
    company_name: 'Coca-Cola Ethiopia',
    industry: 'FMCG / Beverages',
    contact_email: 'ethiopia@coca-cola.com',
    logo_url: 'https://picsum.photos/200/200?random=coke',
    primary_color: '#E61E2A',
    secondary_color: '#FFFFFF',
    contract_start: '2025-03-01',
    contract_end: '2025-09-30',
    monthly_budget_birr: 300000,
    prize_budget_birr: 120000,
    max_leagues: 10,
    max_campaigns: 20,
    has_push_notifications: true,
    has_survey_access: true,
    has_showroom_activation: true,
    has_realtime_dashboard: false,
    total_impressions: 1820000,
    total_engagements: 134000,
    active_campaigns_count: 3,
    created_at: '2025-03-01',
    updated_at: '2025-03-15'
  },
  {
    sponsor_id: 'sp_heineken',
    name: 'Heineken',
    slug: 'heineken',
    tier: 'silver',
    status: 'active',
    company_name: 'Heineken Breweries Ethiopia',
    industry: 'Beverages',
    contact_email: 'ethiopia@heineken.com',
    logo_url: 'https://picsum.photos/200/200?random=heineken',
    primary_color: '#00A100',
    secondary_color: '#E8E8E8',
    contract_start: '2025-02-01',
    contract_end: '2025-08-31',
    monthly_budget_birr: 150000,
    prize_budget_birr: 60000,
    max_leagues: 5,
    max_campaigns: 10,
    has_push_notifications: false,
    has_survey_access: true,
    has_showroom_activation: false,
    has_realtime_dashboard: false,
    total_impressions: 920000,
    total_engagements: 67000,
    active_campaigns_count: 2,
    created_at: '2025-02-01',
    updated_at: '2025-02-20'
  },
  {
    sponsor_id: 'sp_ethio_telecom',
    name: 'Ethio Telecom',
    slug: 'ethio-telecom',
    tier: 'platinum',
    status: 'active',
    company_name: 'Ethio Telecom',
    industry: 'Telecommunications',
    contact_email: 'sponsorships@ethiotelecom.et',
    logo_url: 'https://picsum.photos/200/200?random=ethiotel',
    primary_color: '#0066B3',
    secondary_color: '#FFD700',
    contract_start: '2025-01-15',
    contract_end: '2025-12-31',
    monthly_budget_birr: 450000,
    prize_budget_birr: 180000,
    max_leagues: 999,
    max_campaigns: 999,
    has_push_notifications: true,
    has_survey_access: true,
    has_showroom_activation: true,
    has_realtime_dashboard: true,
    total_impressions: 2100000,
    total_engagements: 158000,
    active_campaigns_count: 3,
    created_at: '2025-01-15',
    updated_at: '2025-02-10'
  },
  {
    sponsor_id: 'sp_cbe',
    name: 'CBE',
    slug: 'cbe',
    tier: 'bronze',
    status: 'active',
    company_name: 'Commercial Bank of Ethiopia',
    industry: 'Banking / Finance',
    contact_email: 'digital@combanketh.et',
    logo_url: 'https://picsum.photos/200/200?random=cbe',
    primary_color: '#1B3A5C',
    secondary_color: '#C5A55A',
    contract_start: '2025-04-01',
    contract_end: '2025-10-31',
    monthly_budget_birr: 80000,
    prize_budget_birr: 30000,
    max_leagues: 3,
    max_campaigns: 5,
    has_push_notifications: false,
    has_survey_access: false,
    has_showroom_activation: false,
    has_realtime_dashboard: false,
    total_impressions: 410000,
    total_engagements: 28000,
    active_campaigns_count: 1,
    created_at: '2025-04-01',
    updated_at: '2025-04-10'
  }
];

export const MOCK_SPONSOR_CAMPAIGNS: SponsorCampaign[] = [
  {
    campaign_id: 'camp_001',
    sponsor_id: 'sp_telebirr',
    name: 'Telebirr Weekly Challenge',
    description: 'Branded H2H league with weekly coin rewards for top managers',
    type: 'branded_league',
    status: 'active',
    target_audience: { min_level: 1 },
    budget_coins: 50000,
    budget_birr: 100000,
    prizes_allocated: [
      { prize_id: 'pr_001', campaign_id: 'camp_001', sponsor_id: 'sp_telebirr', name: 'Weekly Winner Coins', description: '500 coins for weekly league winner', type: 'coins', value_birr: 0, value_coins: 500, quantity: 38, quantity_claimed: 12 },
      { prize_id: 'pr_002', campaign_id: 'camp_001', sponsor_id: 'sp_telebirr', name: 'Season Grand Prize', description: '5,000 ETB Telebirr voucher for season champion', type: 'etb_voucher', value_birr: 5000, quantity: 1, quantity_claimed: 0 }
    ],
    start_date: '2025-01-01',
    end_date: '2025-05-31',
    linked_league_ids: ['league_telebirr_h2h'],
    kpi_targets: { impressions: 500000, engagements: 50000, league_joins: 10000 },
    kpi_actuals: { impressions: 340000, engagements: 32000, league_joins: 7200, contest_entries: 0, survey_completions: 0 },
    created_at: '2025-01-01',
    updated_at: '2025-02-15'
  },
  {
    campaign_id: 'camp_002',
    sponsor_id: 'sp_coca_cola',
    name: 'Coca-Cola Showroom Activation',
    description: 'Check in at partner venues for bonus coins and a chance to earn exclusive prizes',
    type: 'showroom_activation',
    status: 'active',
    target_audience: { cities: ['Addis Ababa', 'Hawassa'] },
    budget_coins: 30000,
    budget_birr: 80000,
    prizes_allocated: [
      { prize_id: 'pr_003', campaign_id: 'camp_002', sponsor_id: 'sp_coca_cola', name: 'Coca-Cola Merch Pack', description: 'Branded jersey and cap', type: 'physical_product', value_birr: 1500, quantity: 50, quantity_claimed: 18 }
    ],
    start_date: '2025-03-01',
    end_date: '2025-06-30',
    linked_showroom_ids: ['sr_001', 'sr_002', 'sr_003'],
    kpi_targets: { impressions: 200000, engagements: 25000 },
    kpi_actuals: { impressions: 142000, engagements: 18500, league_joins: 0, contest_entries: 0, survey_completions: 0 },
    created_at: '2025-03-01',
    updated_at: '2025-03-20'
  },
  {
    campaign_id: 'camp_003',
    sponsor_id: 'sp_heineken',
    name: 'Heineken Match Day Contest',
    description: 'Predict the exact score during live matches for bonus rewards',
    type: 'contest_sponsorship',
    status: 'active',
    budget_coins: 20000,
    budget_birr: 50000,
    prizes_allocated: [
      { prize_id: 'pr_004', campaign_id: 'camp_003', sponsor_id: 'sp_heineken', name: 'Match Day Bonus', description: '200 coins per match prediction contest', type: 'coins', value_birr: 0, value_coins: 200, quantity: 100, quantity_claimed: 42 }
    ],
    start_date: '2025-02-01',
    end_date: '2025-05-31',
    linked_contest_ids: ['ct_001', 'ct_002'],
    kpi_targets: { impressions: 150000, contest_entries: 8000 },
    kpi_actuals: { impressions: 98000, engagements: 12000, league_joins: 0, contest_entries: 5200, survey_completions: 0 },
    created_at: '2025-02-01',
    updated_at: '2025-03-05'
  },
  {
    campaign_id: 'camp_004',
    sponsor_id: 'sp_ethio_telecom',
    name: 'Ethio Telecom Data Survey',
    description: 'Complete surveys about mobile data usage for data bundle rewards',
    type: 'survey',
    status: 'active',
    budget_coins: 15000,
    budget_birr: 40000,
    prizes_allocated: [
      { prize_id: 'pr_005', campaign_id: 'camp_004', sponsor_id: 'sp_ethio_telecom', name: '2GB Data Bundle', description: 'Free 2GB mobile data for survey completion', type: 'data_bundle', value_birr: 200, quantity: 200, quantity_claimed: 87 }
    ],
    start_date: '2025-01-15',
    end_date: '2025-04-30',
    linked_survey_id: 'survey_002',
    kpi_targets: { survey_completions: 5000 },
    kpi_actuals: { impressions: 180000, engagements: 9000, league_joins: 0, contest_entries: 0, survey_completions: 3200 },
    created_at: '2025-01-15',
    updated_at: '2025-02-20'
  },
  {
    campaign_id: 'camp_005',
    sponsor_id: 'sp_cbe',
    name: 'CBE Financial Literacy Mission',
    description: 'Complete financial literacy steps to earn coins and learn about CBE services',
    type: 'mission',
    status: 'draft',
    budget_coins: 10000,
    budget_birr: 25000,
    prizes_allocated: [
      { prize_id: 'pr_006', campaign_id: 'camp_005', sponsor_id: 'sp_cbe', name: 'CBE Bonus Coins', description: '100 coins for mission completion', type: 'coins', value_birr: 0, value_coins: 100, quantity: 500, quantity_claimed: 0 }
    ],
    start_date: '2025-05-01',
    end_date: '2025-07-31',
    kpi_targets: { engagements: 10000 },
    kpi_actuals: { impressions: 0, engagements: 0, league_joins: 0, contest_entries: 0, survey_completions: 0 },
    created_at: '2025-04-01',
    updated_at: '2025-04-01'
  }
];

export const MOCK_SPONSOR_ASSETS: SponsorAsset[] = [
  { asset_id: 'ast_001', sponsor_id: 'sp_telebirr', type: 'logo', name: 'Telebirr Logo', url: 'https://picsum.photos/200/200?random=telebirr_logo', alt_text: 'Telebirr logo', width: 200, height: 200, file_size_kb: 45, is_approved: true, uploaded_at: '2025-01-01' },
  { asset_id: 'ast_002', sponsor_id: 'sp_telebirr', type: 'banner', name: 'Telebirr Home Banner', url: 'https://picsum.photos/600/200?random=telebirr_banner', alt_text: 'Telebirr weekly challenge banner', width: 600, height: 200, file_size_kb: 120, is_approved: true, uploaded_at: '2025-01-02' },
  { asset_id: 'ast_003', sponsor_id: 'sp_coca_cola', type: 'logo', name: 'Coca-Cola Logo', url: 'https://picsum.photos/200/200?random=coke_logo', alt_text: 'Coca-Cola logo', width: 200, height: 200, file_size_kb: 38, is_approved: true, uploaded_at: '2025-03-01' },
  { asset_id: 'ast_004', sponsor_id: 'sp_heineken', type: 'logo', name: 'Heineken Logo', url: 'https://picsum.photos/200/200?random=heineken_logo', alt_text: 'Heineken logo', width: 200, height: 200, file_size_kb: 42, is_approved: true, uploaded_at: '2025-02-01' },
  { asset_id: 'ast_005', sponsor_id: 'sp_ethio_telecom', type: 'banner', name: 'Ethio Telecom Survey Banner', url: 'https://picsum.photos/600/200?random=ethiotel_banner', alt_text: 'Ethio Telecom data survey', width: 600, height: 200, file_size_kb: 95, is_approved: true, uploaded_at: '2025-01-15' },
  { asset_id: 'ast_006', sponsor_id: 'sp_cbe', type: 'logo', name: 'CBE Logo', url: 'https://picsum.photos/200/200?random=cbe_logo', alt_text: 'CBE logo', width: 200, height: 200, file_size_kb: 35, is_approved: false, uploaded_at: '2025-04-01' }
];

export const MOCK_SPONSOR_PLACEMENTS: SponsorPlacement[] = [
  { placement_id: 'pl_001', campaign_id: 'camp_001', sponsor_id: 'sp_telebirr', slot: 'home_banner', asset_id: 'ast_002', click_through_url: '#telebirr-league', start_date: '2025-01-01', end_date: '2025-05-31', is_active: true, impressions: 340000, clicks: 18200, ctr: 5.35 },
  { placement_id: 'pl_002', campaign_id: 'camp_002', sponsor_id: 'sp_coca_cola', slot: 'showroom_header', asset_id: 'ast_003', start_date: '2025-03-01', end_date: '2025-06-30', is_active: true, impressions: 142000, clicks: 9800, ctr: 6.90 },
  { placement_id: 'pl_003', campaign_id: 'camp_003', sponsor_id: 'sp_heineken', slot: 'contest_card', asset_id: 'ast_004', start_date: '2025-02-01', end_date: '2025-05-31', is_active: true, impressions: 98000, clicks: 7100, ctr: 7.24 },
  { placement_id: 'pl_004', campaign_id: 'camp_004', sponsor_id: 'sp_ethio_telecom', slot: 'survey_header', asset_id: 'ast_005', start_date: '2025-01-15', end_date: '2025-04-30', is_active: true, impressions: 180000, clicks: 11400, ctr: 6.33 }
];

const generateDailyData = (days: number, baseValue: number, variance: number): { date: string; value: number }[] => {
  const data: { date: string; value: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(baseValue + (Math.random() - 0.4) * variance)
    });
  }
  return data;
};

export const MOCK_SPONSOR_DASHBOARD_METRICS: SponsorDashboardMetrics = {
  sponsor_id: 'sp_telebirr',
  period: '30d',
  total_impressions: 340000,
  unique_users_reached: 82000,
  total_engagements: 32000,
  engagement_rate: 9.41,
  avg_session_duration_seconds: 245,
  active_campaigns: 4,
  total_campaigns: 6,
  campaign_completion_rate: 33.3,
  sponsored_league_members: 7200,
  league_join_rate: 8.78,
  sponsored_contest_entries: 5200,
  contest_entry_rate: 6.34,
  survey_completions: 3200,
  survey_completion_rate: 64.0,
  avg_survey_score: 4.2,
  cost_per_engagement_birr: 3.12,
  cost_per_impression_birr: 0.29,
  daily_impressions: generateDailyData(30, 11000, 4000),
  daily_engagements: generateDailyData(30, 1050, 400)
};

export const MOCK_ADMIN_PLATFORM_METRICS: AdminPlatformMetrics = {
  period: '30d',
  total_users: 125000,
  dau: 34000,
  mau: 98000,
  dau_mau_ratio: 34.7,
  new_registrations: 4200,
  total_sponsor_revenue_birr: 1580000,
  total_coin_purchases_birr: 620000,
  arpu_birr: 17.6,
  total_sponsors: 5,
  active_sponsors: 4,
  sponsor_retention_rate: 80.0,
  avg_sessions_per_day: 2.8,
  avg_session_duration_seconds: 312,
  contest_participation_rate: 42.5,
  showroom_checkin_rate: 18.3,
  sponsor_tier_distribution: [
    { tier: 'platinum', count: 2 },
    { tier: 'gold', count: 1 },
    { tier: 'silver', count: 1 },
    { tier: 'bronze', count: 1 }
  ],
  top_sponsors_by_spend: [
    { sponsor_id: 'sp_telebirr', name: 'Telebirr', spend: 600000 },
    { sponsor_id: 'sp_ethio_telecom', name: 'Ethio Telecom', spend: 490000 },
    { sponsor_id: 'sp_coca_cola', name: 'Coca-Cola', spend: 300000 },
    { sponsor_id: 'sp_heineken', name: 'Heineken', spend: 150000 },
    { sponsor_id: 'sp_cbe', name: 'CBE', spend: 40000 }
  ],
  daily_active_users: generateDailyData(30, 34000, 8000),
  daily_revenue: generateDailyData(30, 73000, 25000)
};

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { log_id: 'audit_001', actor_user_id: 'u_admin_1', actor_name: 'Dawit Bekele', actor_role: 'admin_super', action: 'sponsor_created', resource_type: 'sponsor', resource_id: 'sp_telebirr', resource_name: 'Telebirr', details: { tier: 'platinum', contract_value: 500000 }, timestamp: '2025-01-01T09:00:00Z' },
  { log_id: 'audit_002', actor_user_id: 'u_sponsor_1', actor_name: 'Sara Hailu', actor_role: 'sponsor_manager', action: 'campaign_created', resource_type: 'campaign', resource_id: 'camp_001', resource_name: 'Telebirr Weekly Challenge', sponsor_id: 'sp_telebirr', details: { type: 'branded_league', budget_birr: 100000 }, timestamp: '2025-01-02T10:30:00Z' },
  { log_id: 'audit_003', actor_user_id: 'u_admin_1', actor_name: 'Dawit Bekele', actor_role: 'admin_super', action: 'campaign_activated', resource_type: 'campaign', resource_id: 'camp_001', resource_name: 'Telebirr Weekly Challenge', sponsor_id: 'sp_telebirr', details: { previous_status: 'pending_approval' }, timestamp: '2025-01-03T14:00:00Z' },
  { log_id: 'audit_004', actor_user_id: 'u_sponsor_2', actor_name: 'Meron Tadesse', actor_role: 'sponsor_manager', action: 'asset_uploaded', resource_type: 'asset', resource_id: 'ast_003', resource_name: 'Coca-Cola Logo', sponsor_id: 'sp_coca_cola', details: { type: 'logo', file_size_kb: 38 }, timestamp: '2025-03-01T11:15:00Z' },
  { log_id: 'audit_005', actor_user_id: 'u_admin_2', actor_name: 'Yonas Gebre', actor_role: 'admin_analyst', action: 'dashboard_viewed', resource_type: 'sponsor', resource_id: 'sp_telebirr', resource_name: 'Telebirr', sponsor_id: 'sp_telebirr', details: { page: 'sponsor_dashboard', period: '30d' }, timestamp: '2025-02-15T08:45:00Z' },
  { log_id: 'audit_006', actor_user_id: 'u_admin_1', actor_name: 'Dawit Bekele', actor_role: 'admin_super', action: 'role_granted', resource_type: 'role', resource_id: 'u_sponsor_1', resource_name: 'Sara Hailu', sponsor_id: 'sp_telebirr', details: { role: 'sponsor_manager', sponsor_id: 'sp_telebirr' }, timestamp: '2025-01-01T08:30:00Z' }
];

export const MOCK_SPONSOR_ACTIVATIONS: SponsorActivation[] = [
  {
    activation_id: 'act_001',
    sponsor_id: 'sp_telebirr',
    sponsor_name: 'Telebirr',
    sponsor_logo_url: 'https://picsum.photos/100/100?random=telebirr_act',
    sponsor_color: '#00A651',
    campaign_id: 'camp_001',
    type: 'coin_drop',
    title: 'Telebirr Coin Drop',
    description: 'Claim 50 free coins — courtesy of Telebirr!',
    reward_coins: 50,
    start_date: '2025-02-01',
    end_date: '2025-05-31',
    is_active: true,
    max_claims: 10000,
    claims_count: 4200,
    user_claimed: false,
    compliance_label: 'Sponsored reward by Telebirr'
  },
  {
    activation_id: 'act_002',
    sponsor_id: 'sp_coca_cola',
    sponsor_name: 'Coca-Cola',
    sponsor_logo_url: 'https://picsum.photos/100/100?random=coke_act',
    sponsor_color: '#E61E2A',
    campaign_id: 'camp_002',
    type: 'bonus_xp',
    title: 'Coca-Cola Double XP Hour',
    description: 'Earn 2x XP on all actions for the next 60 minutes!',
    reward_xp: 200,
    start_date: '2025-03-01',
    end_date: '2025-06-30',
    is_active: true,
    max_claims: 5000,
    claims_count: 1800,
    user_claimed: false,
    compliance_label: 'Sponsored reward by Coca-Cola'
  },
  {
    activation_id: 'act_003',
    sponsor_id: 'sp_ethio_telecom',
    sponsor_name: 'Ethio Telecom',
    sponsor_logo_url: 'https://picsum.photos/100/100?random=ethiotel_act',
    sponsor_color: '#0066B3',
    campaign_id: 'camp_004',
    type: 'mission',
    title: 'Ethio Telecom Data Quest',
    description: 'Complete 3 steps to earn a free 2GB data bundle!',
    reward_coins: 75,
    mission_steps: [
      { step_id: 'ms_001', description: 'Complete the Mobile Data survey', action_type: 'complete_survey', target_id: 'survey_002', is_completed: false },
      { step_id: 'ms_002', description: 'Check in at any Showroom venue', action_type: 'check_in', is_completed: false },
      { step_id: 'ms_003', description: 'Enter any sponsored contest', action_type: 'enter_contest', is_completed: false }
    ],
    start_date: '2025-01-15',
    end_date: '2025-04-30',
    is_active: true,
    max_claims: 2000,
    claims_count: 870,
    user_claimed: false,
    compliance_label: 'Sponsored reward by Ethio Telecom'
  },
  {
    activation_id: 'act_004',
    sponsor_id: 'sp_heineken',
    sponsor_name: 'Heineken',
    sponsor_logo_url: 'https://picsum.photos/100/100?random=heineken_act',
    sponsor_color: '#00A100',
    campaign_id: 'camp_003',
    type: 'flash_deal',
    title: 'Heineken Match Day Flash',
    description: 'Enter the match day prediction contest at 50% off entry fee!',
    reward_coins: 25,
    start_date: '2025-02-01',
    end_date: '2025-05-31',
    is_active: true,
    max_claims: 3000,
    claims_count: 1100,
    user_claimed: false,
    compliance_label: 'Sponsored reward by Heineken'
  }
];

