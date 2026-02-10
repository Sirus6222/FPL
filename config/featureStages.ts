// ==========================================
// Feature Stages & Gating Configuration
// ==========================================
// Defines the progressive unlock stages and per-feature metadata.
// Stage-to-feature mapping is a product design decision (hardcoded).
// Actual toggle state (enabled/disabled) lives in DB feature_flags table.

export type FeatureKey =
  | 'SHOWROOMS'
  | 'COINS_WALLET'
  | 'REWARDS_DAILY_CLAIM'
  | 'MINI_GAMES'
  | 'CONTESTS_PREMIUM'
  | 'SPONSOR_PORTAL';

export interface StageDefinition {
  stage: number;
  name: string;
  description: string;
  features: FeatureKey[];
  minLevel: number;
}

export const STAGES: StageDefinition[] = [
  { stage: 0, name: 'Core', description: 'Team, transfers, captain, points', features: [], minLevel: 1 },
  { stage: 1, name: 'Leagues+', description: 'Leagues with tooltips and guidance', features: [], minLevel: 1 },
  { stage: 2, name: 'Rewards', description: 'Daily claims, streaks, mini-games', features: ['REWARDS_DAILY_CLAIM', 'MINI_GAMES'], minLevel: 3 },
  { stage: 3, name: 'Coins', description: 'Coins wallet as soft currency', features: ['COINS_WALLET'], minLevel: 5 },
  { stage: 4, name: 'Showrooms', description: 'Venue leagues + rivalry', features: ['SHOWROOMS'], minLevel: 10 },
  { stage: 5, name: 'Contests', description: 'Premium tournaments, sponsor portal', features: ['CONTESTS_PREMIUM', 'SPONSOR_PORTAL'], minLevel: 15 },
];

export const FEATURE_METADATA: Record<FeatureKey, {
  label: string;
  icon: string;
  lockMessage: string;
  stageRequired: number;
}> = {
  SHOWROOMS: {
    label: 'Showrooms',
    icon: 'MapPin',
    lockMessage: 'Unlock Showrooms at Stage 4',
    stageRequired: 4,
  },
  COINS_WALLET: {
    label: 'Coins & Wallet',
    icon: 'Coins',
    lockMessage: 'Unlock Coins at Stage 3',
    stageRequired: 3,
  },
  REWARDS_DAILY_CLAIM: {
    label: 'Daily Rewards',
    icon: 'Gift',
    lockMessage: 'Unlock Rewards at Stage 2',
    stageRequired: 2,
  },
  MINI_GAMES: {
    label: 'Mini-Games',
    icon: 'Gamepad2',
    lockMessage: 'Unlock Mini-Games at Stage 2',
    stageRequired: 2,
  },
  CONTESTS_PREMIUM: {
    label: 'Contests',
    icon: 'Trophy',
    lockMessage: 'Unlock Contests at Stage 5',
    stageRequired: 5,
  },
  SPONSOR_PORTAL: {
    label: 'Flash Scout',
    icon: 'Zap',
    lockMessage: 'Unlock Flash Scout at Stage 5',
    stageRequired: 5,
  },
};

// Mock fallback when Supabase is unavailable
export const MOCK_FEATURE_FLAGS: Record<FeatureKey, { is_enabled: boolean; required_stage: number }> = {
  SHOWROOMS: { is_enabled: true, required_stage: 4 },
  COINS_WALLET: { is_enabled: true, required_stage: 3 },
  REWARDS_DAILY_CLAIM: { is_enabled: true, required_stage: 2 },
  MINI_GAMES: { is_enabled: true, required_stage: 2 },
  CONTESTS_PREMIUM: { is_enabled: true, required_stage: 5 },
  SPONSOR_PORTAL: { is_enabled: true, required_stage: 5 },
};
