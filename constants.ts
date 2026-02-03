
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
