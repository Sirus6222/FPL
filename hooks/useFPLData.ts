/**
 * React Hook for FPL Data
 * Provides easy access to live FPL data with automatic fallback to mock data
 */

import { useState, useEffect, useCallback } from 'react';
import { Player, PremierLeagueTeam, Gameweek, TeamStats, Fixture, Position } from '../types';
import {
  loadFPLData,
  FPLData,
  getTopPlayers,
  searchPlayers,
  getTeamFixtures,
} from '../services/fplApiService';

interface UseFPLDataReturn extends FPLData {
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Main hook to load all FPL data
 * Automatically falls back to mock data if API is unavailable
 */
export function useFPLData(): UseFPLDataReturn {
  const [data, setData] = useState<FPLData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loadFPLData();
      setData(result);
    } catch (error) {
      console.error('Failed to load FPL data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Return loading state with empty data structure
  if (!data) {
    return {
      players: [],
      teams: [],
      gameweeks: [],
      teamStats: [],
      fixtures: {},
      isLive: false,
      loading: true,
      refresh,
    };
  }

  return {
    ...data,
    loading,
    refresh,
  };
}

/**
 * Hook to get top players by criteria
 */
export function useTopPlayers(
  sortBy: 'total_points' | 'form' | 'goals_scored' | 'assists' | 'selected_by_percent' = 'total_points',
  limit: number = 20,
  position?: Position
) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      setLoading(true);
      try {
        const result = await getTopPlayers(sortBy, limit, position);
        if (mounted) {
          setPlayers(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch players');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetch();
    return () => { mounted = false; };
  }, [sortBy, limit, position]);

  return { players, loading, error };
}

/**
 * Hook to search players
 */
export function usePlayerSearch(query: string, debounceMs: number = 300) {
  const [results, setResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    let mounted = true;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const players = await searchPlayers(query);
        if (mounted) {
          setResults(players.slice(0, 20)); // Limit results
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [query, debounceMs]);

  return { results, loading };
}

/**
 * Hook to get fixtures for a team
 */
export function useTeamFixtures(teamShortName: string, limit: number = 5) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      setLoading(true);
      try {
        const result = await getTeamFixtures(teamShortName, limit);
        if (mounted) {
          setFixtures(result);
        }
      } catch (error) {
        console.error('Fixtures error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (teamShortName) {
      fetch();
    }

    return () => { mounted = false; };
  }, [teamShortName, limit]);

  return { fixtures, loading };
}

/**
 * Hook to get current gameweek info
 */
export function useCurrentGameweek() {
  const { gameweeks, loading } = useFPLData();

  const currentGameweek = gameweeks.find(gw => gw.is_current) || null;
  const nextDeadline = currentGameweek?.deadline_time
    ? new Date(currentGameweek.deadline_time)
    : null;

  return {
    gameweek: currentGameweek,
    nextDeadline,
    loading,
  };
}

export default useFPLData;
