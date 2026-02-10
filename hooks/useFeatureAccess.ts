import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { FeatureKey, MOCK_FEATURE_FLAGS, FEATURE_METADATA } from '../config/featureStages';

interface FeatureFlag {
  id: string;
  is_enabled: boolean;
  required_stage: number;
  label?: string;
  description?: string;
}

export interface FeatureStatus {
  key: FeatureKey;
  isAccessible: boolean;
  isGloballyEnabled: boolean;
  isStageUnlocked: boolean;
  requiredStage: number;
  userStage: number;
  lockMessage: string;
}

interface UseFeatureAccessReturn {
  canAccess: (key: FeatureKey) => boolean;
  getStatus: (key: FeatureKey) => FeatureStatus;
  allFlags: Record<string, FeatureFlag>;
  userStage: number;
  loading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
}

export function useFeatureAccess(
  userId: string | null,
  userStageOverride?: number
): UseFeatureAccessReturn {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>(() => {
    // Initialize with mock data so features are accessible immediately
    const initial: Record<string, FeatureFlag> = {};
    for (const [key, val] of Object.entries(MOCK_FEATURE_FLAGS)) {
      initial[key] = { id: key, ...val };
    }
    return initial;
  });
  const [userStage, setUserStage] = useState(userStageOverride ?? 5);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync with override when it changes (mock mode)
  useEffect(() => {
    if (userStageOverride !== undefined) {
      setUserStage(userStageOverride);
    }
  }, [userStageOverride]);

  const loadMockFlags = useCallback(() => {
    const mockFlags: Record<string, FeatureFlag> = {};
    for (const [key, val] of Object.entries(MOCK_FEATURE_FLAGS)) {
      mockFlags[key] = { id: key, ...val };
    }
    setFlags(mockFlags);
    if (userStageOverride !== undefined) {
      setUserStage(userStageOverride);
    } else {
      setUserStage(5); // All unlocked in mock
    }
    setLoading(false);
  }, [userStageOverride]);

  const refresh = useCallback(async () => {
    if (!userId) {
      loadMockFlags();
      return;
    }

    try {
      const [flagsRes, userRes] = await Promise.all([
        supabase.from('feature_flags').select('*'),
        supabase.from('users').select('current_stage, role').eq('id', userId).single(),
      ]);

      if (flagsRes.data && flagsRes.data.length > 0) {
        const flagMap: Record<string, FeatureFlag> = {};
        for (const f of flagsRes.data) {
          flagMap[f.id] = f;
        }
        setFlags(flagMap);
      }

      if (userRes.data) {
        setUserStage(userRes.data.current_stage ?? 0);
        setIsAdmin(userRes.data.role === 'admin');
      }
    } catch {
      // Supabase unavailable — use mock fallback
      loadMockFlags();
    } finally {
      setLoading(false);
    }
  }, [userId, loadMockFlags]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const canAccess = useCallback((key: FeatureKey): boolean => {
    const flag = flags[key];
    if (!flag) return false;
    return flag.is_enabled && userStage >= flag.required_stage;
  }, [flags, userStage]);

  const getStatus = useCallback((key: FeatureKey): FeatureStatus => {
    const flag = flags[key];
    const meta = FEATURE_METADATA[key];
    const reqStage = flag?.required_stage ?? meta.stageRequired;
    const enabled = flag?.is_enabled ?? false;
    const stageOk = userStage >= reqStage;
    return {
      key,
      isAccessible: enabled && stageOk,
      isGloballyEnabled: enabled,
      isStageUnlocked: stageOk,
      requiredStage: reqStage,
      userStage,
      lockMessage: !enabled
        ? 'Coming Soon'
        : meta.lockMessage,
    };
  }, [flags, userStage]);

  return { canAccess, getStatus, allFlags: flags, userStage, loading, isAdmin, refresh };
}
