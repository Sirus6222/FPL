/**
 * FPL API Integration Service
 * Fetches real data from the official Fantasy Premier League API
 * and transforms it to match the app's existing types.
 *
 * Note: This API works client-side (browser) but may be blocked server-side.
 * For SSR/server usage, consider using a CORS proxy.
 */

import { Player, Position, PremierLeagueTeam, Gameweek, Fixture, TeamStats } from '../types';

const FPL_API_BASE = 'https://fantasy.premierleague.com/api';

// ============ RAW API TYPES ============

interface FPLElement {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team: number;
  element_type: number; // 1=GK, 2=DEF, 3=MID, 4=FWD
  now_cost: number; // Price in 0.1m
  cost_change_event: number;
  total_points: number;
  event_points: number;
  form: string;
  selected_by_percent: string;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  minutes: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  status: string; // a=available, i=injured, d=doubtful, s=suspended, u=unavailable
  news: string;
  news_added: string | null;
  chance_of_playing_next_round: number | null;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  ict_index: string;
  influence: string;
  creativity: string;
  threat: string;
  photo: string;
}

interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

interface FPLEvent {
  id: number;
  name: string;
  deadline_time: string;
  finished: boolean;
  is_current: boolean;
  is_next: boolean;
  is_previous: boolean;
  average_entry_score: number;
  highest_score: number;
  most_selected: number | null;
  most_captained: number | null;
}

interface FPLFixture {
  id: number;
  event: number | null;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  kickoff_time: string;
  finished: boolean;
  team_h_difficulty: number;
  team_a_difficulty: number;
}

interface FPLBootstrapData {
  elements: FPLElement[];
  teams: FPLTeam[];
  events: FPLEvent[];
  element_types: { id: number; singular_name: string; plural_name: string }[];
}

// ============ TEAM COLORS (not in API) ============

const TEAM_COLORS: Record<string, string> = {
  'ARS': '#EF0107', 'AVL': '#670E36', 'BOU': '#DA291C', 'BRE': '#D20000',
  'BHA': '#0057B8', 'CHE': '#034694', 'CRY': '#1B458F', 'EVE': '#003399',
  'FUL': '#000000', 'IPS': '#3A64A3', 'LEI': '#003090', 'LIV': '#C8102E',
  'MCI': '#6CABDD', 'MUN': '#DA291C', 'NEW': '#241F20', 'NFO': '#DD0000',
  'SOU': '#D71920', 'TOT': '#132257', 'WHU': '#7A263A', 'WOL': '#FDB913',
};

// ============ TRANSFORMATION FUNCTIONS ============

const positionMap: Record<number, Position> = {
  1: Position.GK,
  2: Position.DEF,
  3: Position.MID,
  4: Position.FWD,
};

const statusMap: Record<string, 'available' | 'injured' | 'suspended' | 'doubtful'> = {
  'a': 'available',
  'i': 'injured',
  's': 'suspended',
  'd': 'doubtful',
  'u': 'injured', // unavailable -> injured for UI
};

let teamIdToShortName: Record<number, string> = {};

function transformPlayer(element: FPLElement, teams: FPLTeam[]): Player {
  const team = teams.find(t => t.id === element.team);
  const teamShortName = team?.short_name || 'UNK';

  // Store mapping for fixtures
  if (team) {
    teamIdToShortName[team.id] = team.short_name;
  }

  // Generate placeholder radar stats (API doesn't provide these)
  const baseStats = {
    pace: Math.min(99, Math.floor(50 + Math.random() * 40)),
    shooting: Math.min(99, Math.floor(30 + (element.goals_scored * 2) + Math.random() * 30)),
    passing: Math.min(99, Math.floor(40 + (element.assists * 3) + Math.random() * 30)),
    dribbling: Math.min(99, Math.floor(50 + Math.random() * 40)),
    defending: element.element_type <= 2 ? Math.min(99, Math.floor(60 + Math.random() * 30)) : Math.floor(20 + Math.random() * 40),
    physical: Math.min(99, Math.floor(50 + Math.random() * 40)),
  };

  return {
    id: element.id,
    name: element.web_name,
    full_name: `${element.first_name} ${element.second_name}`,
    team: teamShortName,
    position: positionMap[element.element_type] || Position.MID,
    price: element.now_cost / 10,
    total_points: element.total_points,
    points_last_gw: element.event_points,
    form: parseFloat(element.form) || 0,
    selected_by_percent: parseFloat(element.selected_by_percent) || 0,
    goals_scored: element.goals_scored,
    assists: element.assists,
    clean_sheets: element.clean_sheets,
    yellow_cards: element.yellow_cards,
    red_cards: element.red_cards,
    minutes_played: element.minutes,
    matches_played: Math.ceil(element.minutes / 90),
    bonus_points: element.bonus,
    bps: element.bps,
    status: statusMap[element.status] || 'available',
    news: element.news || undefined,
    image: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${element.photo?.replace('.jpg', '')}.png`,
    price_change_this_week: element.cost_change_event / 10,
    chance_of_price_change: element.chance_of_playing_next_round ?? undefined,

    // Advanced stats
    stats_xg: parseFloat(element.expected_goals) || 0,
    stats_xa: parseFloat(element.expected_assists) || 0,
    stats_ict: parseFloat(element.ict_index) || 0,
    stats_goals_conceded: element.goals_conceded,
    stats_saves: element.element_type === 1 ? element.saves : undefined,
    stats_radar: baseStats,

    // Projected (simple estimation)
    projected_points: parseFloat(element.form) * 0.8 + (element.element_type === 4 ? 2 : 1),

    // Defaults for UI state
    is_bench: false,
    is_captain: false,
    is_vice_captain: false,
  };
}

function transformTeam(team: FPLTeam): PremierLeagueTeam {
  const strengthOverall = Math.round((team.strength_overall_home + team.strength_overall_away) / 400);
  const strengthAttack = Math.round((team.strength_attack_home + team.strength_attack_away) / 400);
  const strengthDefense = Math.round((team.strength_defence_home + team.strength_defence_away) / 400);

  return {
    team_id: team.short_name,
    name: team.name,
    short_name: team.short_name,
    color: TEAM_COLORS[team.short_name] || '#333333',
    strength_overall: Math.min(5, Math.max(1, strengthOverall)),
    strength_attack: Math.min(5, Math.max(1, strengthAttack)),
    strength_defense: Math.min(5, Math.max(1, strengthDefense)),
  };
}

function transformGameweek(event: FPLEvent): Gameweek {
  return {
    gameweek_id: `gw${event.id}`,
    gameweek_number: event.id,
    deadline_time: event.deadline_time,
    is_current: event.is_current,
    is_finished: event.finished,
    highest_score: event.highest_score || undefined,
    average_score: event.average_entry_score || undefined,
    most_selected_player_id: event.most_selected || undefined,
    most_captained_player_id: event.most_captained || undefined,
  };
}

function transformFixture(fixture: FPLFixture, forTeamId: number): Fixture {
  const isHome = fixture.team_h === forTeamId;
  const opponentId = isHome ? fixture.team_a : fixture.team_h;
  const difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty;

  return {
    fixture_id: `fix${fixture.id}`,
    gameweek: fixture.event || 0,
    opponent: teamIdToShortName[opponentId] || 'UNK',
    is_home: isHome,
    home_team_id: teamIdToShortName[fixture.team_h],
    away_team_id: teamIdToShortName[fixture.team_a],
    kickoff_time: fixture.kickoff_time,
    home_score: fixture.team_h_score ?? undefined,
    away_score: fixture.team_a_score ?? undefined,
    status: fixture.finished ? 'finished' : 'scheduled',
    difficulty: Math.min(5, Math.max(1, difficulty)) as 1 | 2 | 3 | 4 | 5,
  };
}

// ============ API FETCHING ============

let cachedData: FPLBootstrapData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchBootstrapData(): Promise<FPLBootstrapData> {
  // Return cached data if fresh
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  const response = await fetch(`${FPL_API_BASE}/bootstrap-static/`);
  if (!response.ok) {
    throw new Error(`FPL API error: ${response.status}`);
  }

  cachedData = await response.json();
  cacheTimestamp = Date.now();

  // Build team ID mapping
  cachedData!.teams.forEach(team => {
    teamIdToShortName[team.id] = team.short_name;
  });

  return cachedData!;
}

export async function fetchFixtures(): Promise<FPLFixture[]> {
  const response = await fetch(`${FPL_API_BASE}/fixtures/`);
  if (!response.ok) {
    throw new Error(`FPL API error: ${response.status}`);
  }
  return response.json();
}

// ============ PUBLIC API ============

/**
 * Fetch all players from FPL API, transformed to app format
 */
export async function getPlayers(): Promise<Player[]> {
  const data = await fetchBootstrapData();
  return data.elements.map(el => transformPlayer(el, data.teams));
}

/**
 * Fetch all teams from FPL API, transformed to app format
 */
export async function getTeams(): Promise<PremierLeagueTeam[]> {
  const data = await fetchBootstrapData();
  return data.teams.map(transformTeam);
}

/**
 * Fetch all gameweeks from FPL API, transformed to app format
 */
export async function getGameweeks(): Promise<Gameweek[]> {
  const data = await fetchBootstrapData();
  return data.events.map(transformGameweek);
}

/**
 * Get the current gameweek
 */
export async function getCurrentGameweek(): Promise<Gameweek | null> {
  const gameweeks = await getGameweeks();
  return gameweeks.find(gw => gw.is_current) || null;
}

/**
 * Fetch fixtures for a specific team
 */
export async function getTeamFixtures(teamShortName: string, limit: number = 5): Promise<Fixture[]> {
  const data = await fetchBootstrapData();
  const team = data.teams.find(t => t.short_name === teamShortName);
  if (!team) return [];

  const fixtures = await fetchFixtures();
  const currentGW = data.events.find(e => e.is_current)?.id || 1;

  return fixtures
    .filter(f => (f.team_h === team.id || f.team_a === team.id) && (f.event || 0) >= currentGW)
    .slice(0, limit)
    .map(f => transformFixture(f, team.id));
}

/**
 * Fetch all fixtures grouped by team (for TeamFixtures type)
 */
export async function getAllTeamFixtures(limit: number = 5): Promise<Record<string, Fixture[]>> {
  const data = await fetchBootstrapData();
  const fixtures = await fetchFixtures();
  const currentGW = data.events.find(e => e.is_current)?.id || 1;

  const result: Record<string, Fixture[]> = {};

  for (const team of data.teams) {
    result[team.short_name] = fixtures
      .filter(f => (f.team_h === team.id || f.team_a === team.id) && (f.event || 0) >= currentGW)
      .slice(0, limit)
      .map(f => transformFixture(f, team.id));
  }

  return result;
}

/**
 * Generate team stats from player data (API doesn't provide team-level xG directly)
 */
export async function getTeamStats(): Promise<TeamStats[]> {
  const data = await fetchBootstrapData();
  const fixtures = await fetchFixtures();
  const currentGW = data.events.find(e => e.is_current)?.id || 1;

  return data.teams.map(team => {
    const teamPlayers = data.elements.filter(p => p.team === team.id);
    const goalsScored = teamPlayers.reduce((sum, p) => sum + p.goals_scored, 0);
    const goalsConceded = teamPlayers.filter(p => p.element_type <= 2).reduce((sum, p) => sum + p.goals_conceded, 0) / 3; // Approx
    const cleanSheets = teamPlayers.filter(p => p.element_type <= 2).reduce((sum, p) => sum + p.clean_sheets, 0) / 4; // Approx
    const xgFor = teamPlayers.reduce((sum, p) => sum + parseFloat(p.expected_goals || '0'), 0);
    const xgAgainst = teamPlayers.filter(p => p.element_type <= 2).reduce((sum, p) => sum + parseFloat(p.expected_goals_conceded || '0'), 0) / 3;

    // Find next fixture
    const nextFixture = fixtures.find(f =>
      (f.team_h === team.id || f.team_a === team.id) &&
      (f.event || 0) >= currentGW &&
      !f.finished
    );

    const isHome = nextFixture?.team_h === team.id;
    const opponentId = nextFixture ? (isHome ? nextFixture.team_a : nextFixture.team_h) : null;
    const difficulty = nextFixture ? (isHome ? nextFixture.team_h_difficulty : nextFixture.team_a_difficulty) : 3;

    return {
      id: team.short_name,
      name: team.name,
      short_name: team.short_name,
      goals_scored: goalsScored,
      goals_conceded: Math.round(goalsConceded),
      clean_sheets: Math.round(cleanSheets),
      xg_for: Math.round(xgFor * 10) / 10,
      xg_against: Math.round(xgAgainst * 10) / 10,
      next_opponent: opponentId ? teamIdToShortName[opponentId] || 'TBD' : 'TBD',
      next_difficulty: difficulty,
    };
  });
}

/**
 * Get top players by various criteria
 */
export async function getTopPlayers(
  sortBy: 'total_points' | 'form' | 'goals_scored' | 'assists' | 'selected_by_percent' = 'total_points',
  limit: number = 20,
  position?: Position
): Promise<Player[]> {
  let players = await getPlayers();

  if (position) {
    players = players.filter(p => p.position === position);
  }

  return players
    .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
    .slice(0, limit);
}

/**
 * Search players by name
 */
export async function searchPlayers(query: string): Promise<Player[]> {
  const players = await getPlayers();
  const lowerQuery = query.toLowerCase();

  return players.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.full_name.toLowerCase().includes(lowerQuery)
  );
}

// ============ DATA LOADER WITH FALLBACK ============

import { MOCK_PLAYERS, MOCK_GAMEWEEKS, TEAMS as MOCK_TEAMS, MOCK_TEAM_STATS, MOCK_FIXTURES } from '../constants';

export interface FPLData {
  players: Player[];
  teams: PremierLeagueTeam[];
  gameweeks: Gameweek[];
  teamStats: TeamStats[];
  fixtures: Record<string, Fixture[]>;
  isLive: boolean;
  error?: string;
}

/**
 * Load all FPL data with automatic fallback to mock data
 * Use this as the main entry point for data loading
 */
export async function loadFPLData(): Promise<FPLData> {
  try {
    const [players, teams, gameweeks, teamStats, fixtures] = await Promise.all([
      getPlayers(),
      getTeams(),
      getGameweeks(),
      getTeamStats(),
      getAllTeamFixtures(),
    ]);

    return {
      players,
      teams,
      gameweeks,
      teamStats,
      fixtures,
      isLive: true,
    };
  } catch (error) {
    console.warn('FPL API unavailable, using mock data:', error);

    // Return mock data as fallback
    return {
      players: MOCK_PLAYERS,
      teams: MOCK_TEAMS,
      gameweeks: MOCK_GAMEWEEKS,
      teamStats: MOCK_TEAM_STATS,
      fixtures: MOCK_FIXTURES,
      isLive: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * React hook-friendly data loader
 * Returns a promise that resolves to FPLData
 */
export function useFPLData() {
  return loadFPLData();
}
