import React, { useState, useEffect } from 'react';
import {
  X, Shield, ToggleLeft, ToggleRight, Clock, ChevronDown,
  User, Search, ArrowRight, History
} from 'lucide-react';
import { STAGES } from '../config/featureStages';
import type { FeatureKey } from '../config/featureStages';
import {
  getFeatureFlags,
  toggleFeatureFlag,
  updateFeatureStage,
  getAuditLogs,
  advanceUserStage,
} from '../services/featureFlagService';

interface FeatureFlagRow {
  id: string;
  label: string;
  description: string | null;
  is_enabled: boolean;
  required_stage: number;
  updated_at: string;
}

interface AuditLogRow {
  id: string;
  feature_id: string;
  action: string;
  old_value: any;
  new_value: any;
  created_at: string;
  users?: { display_name: string };
  feature_flags?: { label: string };
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminUserId: string;
  onFlagsChanged: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  adminUserId,
  onFlagsChanged,
}) => {
  const [flags, setFlags] = useState<FeatureFlagRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [activeTab, setActiveTab] = useState<'flags' | 'audit' | 'users'>('flags');
  const [loading, setLoading] = useState(true);
  const [stageUserId, setStageUserId] = useState('');
  const [stageValue, setStageValue] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    const [flagsRes, logsRes] = await Promise.all([
      getFeatureFlags(),
      getAuditLogs(20),
    ]);
    if (flagsRes.data) setFlags(flagsRes.data as FeatureFlagRow[]);
    if (logsRes.data) setAuditLogs(logsRes.data as AuditLogRow[]);
    setLoading(false);
  };

  const handleToggle = async (featureId: string, currentEnabled: boolean) => {
    const { data } = await toggleFeatureFlag(featureId, !currentEnabled, adminUserId);
    if (data?.success) {
      setFlags(prev => prev.map(f =>
        f.id === featureId ? { ...f, is_enabled: !currentEnabled } : f
      ));
      showToast(`${featureId} ${!currentEnabled ? 'enabled' : 'disabled'}`);
      onFlagsChanged();
      loadData(); // Refresh audit logs
    }
  };

  const handleStageChange = async (featureId: string, newStage: number) => {
    const { data } = await updateFeatureStage(featureId, newStage, adminUserId);
    if (data?.success) {
      setFlags(prev => prev.map(f =>
        f.id === featureId ? { ...f, required_stage: newStage } : f
      ));
      showToast(`${featureId} stage updated to ${newStage}`);
      onFlagsChanged();
      loadData();
    }
  };

  const handleAdvanceUser = async () => {
    if (!stageUserId.trim()) return;
    const { data, error } = await advanceUserStage(stageUserId.trim(), stageValue);
    if (data) {
      showToast(`User ${data.display_name} advanced to stage ${stageValue}`);
      setStageUserId('');
    } else if (error) {
      showToast('Error: ' + (error as any).message);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-lg sm:rounded-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shield size={20} />
                Feature Controls
              </h2>
              <p className="text-xs opacity-80">Admin panel — manage feature flags</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {(['flags', 'audit', 'users'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab === 'flags' ? 'Toggles' : tab === 'audit' ? 'Audit Log' : 'Users'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-sm text-gray-400">Loading...</div>
          ) : activeTab === 'flags' ? (
            /* ====== FLAGS TAB ====== */
            <>
              {flags.map(flag => (
                <div key={flag.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800">{flag.label}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{flag.id}</div>
                    </div>
                    <button
                      onClick={() => handleToggle(flag.id, flag.is_enabled)}
                      className="ml-2 flex-shrink-0"
                    >
                      {flag.is_enabled ? (
                        <ToggleRight size={28} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-300" />
                      )}
                    </button>
                  </div>

                  {flag.description && (
                    <p className="text-[10px] text-gray-500 mb-2">{flag.description}</p>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">Required Stage:</span>
                    <select
                      value={flag.required_stage}
                      onChange={(e) => handleStageChange(flag.id, parseInt(e.target.value))}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    >
                      {STAGES.map(s => (
                        <option key={s.stage} value={s.stage}>
                          {s.stage} — {s.name}
                        </option>
                      ))}
                    </select>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      flag.is_enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {flag.is_enabled ? 'LIVE' : 'OFF'}
                    </span>
                  </div>
                </div>
              ))}
            </>
          ) : activeTab === 'audit' ? (
            /* ====== AUDIT TAB ====== */
            <>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  <History size={24} className="mx-auto mb-2 opacity-50" />
                  No audit logs yet
                </div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        log.action === 'ENABLE' ? 'bg-green-100 text-green-700' :
                        log.action === 'DISABLE' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-800 font-medium">
                      {log.feature_flags?.label || log.feature_id}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      by {log.users?.display_name || 'Unknown'} &middot;{' '}
                      {log.old_value && log.new_value
                        ? `${JSON.stringify(log.old_value)} → ${JSON.stringify(log.new_value)}`
                        : 'No details'
                      }
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            /* ====== USERS TAB ====== */
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
                  <User size={14} />
                  Advance User Stage
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase">User ID</label>
                    <div className="relative mt-1">
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={stageUserId}
                        onChange={e => setStageUserId(e.target.value)}
                        placeholder="Paste user UUID..."
                        className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Target Stage</label>
                    <select
                      value={stageValue}
                      onChange={e => setStageValue(parseInt(e.target.value))}
                      className="w-full mt-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                    >
                      {STAGES.map(s => (
                        <option key={s.stage} value={s.stage}>
                          Stage {s.stage}: {s.name} — {s.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAdvanceUser}
                    disabled={!stageUserId.trim()}
                    className="w-full bg-gray-800 text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    Set Stage
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Stage reference */}
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <h4 className="text-xs font-bold text-gray-600 mb-2">Stage Reference</h4>
                <div className="space-y-1">
                  {STAGES.map(s => (
                    <div key={s.stage} className="flex items-center gap-2 text-[10px]">
                      <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {s.stage}
                      </span>
                      <span className="font-bold text-gray-700">{s.name}</span>
                      <span className="text-gray-400">— {s.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-4 left-4 right-4 bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded-lg shadow-lg text-center animate-in fade-in duration-200">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
