
import { Position, MatchStatsSummary } from './types';

// Use MatchStatsSummary from types as it is consistent, 
// but we alias it to MatchStats here for compatibility with internal logic naming
export type MatchStats = MatchStatsSummary;

export const calculateBPS = (stats: MatchStats, position: Position): number => {
  let bps = 0;

  // 1. Minutes Played
  if (stats.minutesPlayed > 0 && stats.minutesPlayed < 60) bps += 3;
  if (stats.minutesPlayed >= 60) bps += 6;

  // 2. Goals Scored
  if (stats.goalsScored > 0) {
    if (position === Position.FWD) bps += stats.goalsScored * 24;
    else if (position === Position.MID) bps += stats.goalsScored * 18;
    else bps += stats.goalsScored * 12; // GK/DEF
  }

  // 3. Assists
  bps += stats.assists * 9;

  // 4. Clean Sheets
  if (stats.cleanSheet && (position === Position.GK || position === Position.DEF)) {
    bps += 12;
  }

  // 5. Saves
  if (position === Position.GK) {
    bps += stats.saves * 2;
  }

  // 6. Penalty Saves
  bps += stats.penaltiesSaved * 15;

  // 7. Penalties Missed
  bps -= stats.penaltiesMissed * 6;

  // 8. Cards
  bps -= stats.yellowCards * 3;
  bps -= stats.redCards * 9;

  // 9. Goals Conceded (Passively handled in random baseline for simplification, or explicit)
  // Baseline Performance (Passes, Tackles, Recoveries, etc.)
  // Range 5 - 25 typically for active players
  if (stats.minutesPlayed > 0) {
     // Better players get better baseline
     const performanceBaseline = Math.floor(Math.random() * 20) + 5; 
     bps += performanceBaseline;
  }

  return bps;
};

export const calculateScore = (stats: MatchStats, position: Position): number => {
  let score = 0;

  // 1. Minutes Played
  if (stats.minutesPlayed > 0) {
    score += stats.minutesPlayed >= 60 ? 2 : 1;
  }

  // 2. Goals Scored
  if (stats.goalsScored > 0) {
    let ptsPerGoal = 4; // FWD
    if (position === Position.GK || position === Position.DEF) ptsPerGoal = 6;
    else if (position === Position.MID) ptsPerGoal = 5;
    score += stats.goalsScored * ptsPerGoal;
  }

  // 3. Assists
  score += stats.assists * 3;

  // 4. Clean Sheets (Only if played >= 60)
  if (stats.cleanSheet && stats.minutesPlayed >= 60) {
    if (position === Position.GK || position === Position.DEF) score += 4;
    else if (position === Position.MID) score += 1;
    // FWD gets 0
  }

  // 5. Goals Conceded (GK/DEF only, -1 per 2 goals)
  if ((position === Position.GK || position === Position.DEF) && stats.goalsConceded >= 2) {
    score -= Math.floor(stats.goalsConceded / 2);
  }

  // 6. Cards
  score -= stats.yellowCards * 1;
  score -= stats.redCards * 3;

  // 7. Penalties
  score += stats.penaltiesSaved * 5;
  score -= stats.penaltiesMissed * 2;

  // 8. Saves (GK only, 1 pt per 3 saves)
  if (position === Position.GK) {
    score += Math.floor(stats.saves / 3);
  }

  // 9. Own Goals
  score -= stats.ownGoals * 2;

  // 10. Bonus Points
  score += stats.bonus;

  return score;
};

// Helper to generate realistic match stats for simulation
export const generateRandomStats = (position: Position): MatchStats => {
  const rand = Math.random();
  
  // Minutes: 15% chance of 0 (did not play), 10% chance < 60 (subbed), 75% chance 90
  let minutes = 90;
  if (rand < 0.15) minutes = 0;
  else if (rand < 0.25) minutes = Math.floor(Math.random() * 59) + 1;

  if (minutes === 0) {
      return { 
          minutesPlayed: 0, goalsScored: 0, assists: 0, cleanSheet: false, 
          goalsConceded: 0, ownGoals: 0, penaltiesSaved: 0, penaltiesMissed: 0, 
          yellowCards: 0, redCards: 0, saves: 0, bonus: 0, bps: 0
      };
  }

  const isGK = position === Position.GK;
  const isDEF = position === Position.DEF;
  const isMID = position === Position.MID;
  const isFWD = position === Position.FWD;

  // Goals Conceded
  const gcRand = Math.random();
  let goalsConceded = 0;
  if (gcRand > 0.3) goalsConceded = 1;
  if (gcRand > 0.6) goalsConceded = 2;
  if (gcRand > 0.8) goalsConceded = 3 + Math.floor(Math.random() * 2);
  
  const cleanSheet = goalsConceded === 0;

  // Goals Scored
  let goals = 0;
  if (isFWD && Math.random() > 0.6) goals = Math.random() > 0.8 ? 2 : 1;
  else if (isMID && Math.random() > 0.8) goals = 1;
  else if (isDEF && Math.random() > 0.95) goals = 1;

  // Assists
  let assists = 0;
  if (!isGK && Math.random() > 0.85) assists = 1;

  // Cards
  const yellow = Math.random() > 0.85 ? 1 : 0;
  const red = Math.random() > 0.99 ? 1 : 0;

  // GK Specifics
  const saves = isGK ? Math.floor(Math.random() * 8) : 0;
  const penSaved = (isGK && Math.random() > 0.95) ? 1 : 0;

  // Temporary Object to calc BPS
  const stats = {
    minutesPlayed: minutes,
    goalsScored: goals,
    assists: assists,
    cleanSheet,
    goalsConceded,
    ownGoals: 0,
    penaltiesSaved: penSaved,
    penaltiesMissed: 0,
    yellowCards: yellow,
    redCards: red,
    saves,
    bonus: 0,
    bps: 0
  };

  // Calculate BPS
  stats.bps = calculateBPS(stats, position);

  // Assign Bonus Points based on BPS relative thresholds (simulating rank)
  if (stats.bps > 40) stats.bonus = 3;
  else if (stats.bps > 30) stats.bonus = 2;
  else if (stats.bps > 25) stats.bonus = 1;

  return stats;
};
