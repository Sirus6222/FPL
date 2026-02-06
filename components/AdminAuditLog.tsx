import React, { useState, useMemo } from 'react';
import { Search, Filter, Shield, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { AuditLogEntry, AuditAction, UserRole } from '../types';

interface AdminAuditLogProps {
  logs: AuditLogEntry[];
}

const ACTION_COLORS: Record<string, string> = {
  sponsor_created: 'bg-green-100 text-green-700',
  sponsor_updated: 'bg-blue-100 text-blue-700',
  sponsor_suspended: 'bg-red-100 text-red-600',
  campaign_created: 'bg-green-100 text-green-700',
  campaign_updated: 'bg-blue-100 text-blue-700',
  campaign_activated: 'bg-emerald-100 text-emerald-700',
  campaign_paused: 'bg-yellow-100 text-yellow-700',
  asset_uploaded: 'bg-purple-100 text-purple-700',
  asset_approved: 'bg-green-100 text-green-700',
  asset_rejected: 'bg-red-100 text-red-600',
  role_granted: 'bg-indigo-100 text-indigo-700',
  role_revoked: 'bg-orange-100 text-orange-700',
  data_exported: 'bg-cyan-100 text-cyan-700',
  dashboard_viewed: 'bg-gray-100 text-gray-600',
  prize_allocated: 'bg-yellow-100 text-yellow-700',
  prize_distributed: 'bg-green-100 text-green-700'
};

const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map(l => l.action));
    return ['all', ...Array.from(actions)];
  }, [logs]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(logs.map(l => l.actor_role));
    return ['all', ...Array.from(roles)];
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter(log => {
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      if (roleFilter !== 'all' && log.actor_role !== roleFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return log.actor_name.toLowerCase().includes(s) ||
               log.action.includes(s) ||
               (log.resource_name || '').toLowerCase().includes(s);
      }
      return true;
    });
  }, [logs, actionFilter, roleFilter, search]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Audit Log ({logs.length} entries)</h3>
        <Shield className="w-4 h-4 text-gray-400" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by actor, action, or resource..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="flex-1 text-[10px] px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600"
        >
          {uniqueActions.map(a => (
            <option key={a} value={a}>{a === 'all' ? 'All Actions' : a.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="flex-1 text-[10px] px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600"
        >
          {uniqueRoles.map(r => (
            <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Log entries */}
      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400">No matching entries</div>
        )}
        {filtered.map(log => {
          const isExpanded = expandedLog === log.log_id;
          const actionColor = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600';

          return (
            <div key={log.log_id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedLog(isExpanded ? null : log.log_id)}
                className="w-full p-2.5 flex items-start gap-2 text-left"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-gray-800">{log.actor_name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium ${actionColor}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {log.resource_type}: <span className="font-medium">{log.resource_name || log.resource_id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(log.timestamp).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="px-1 py-0.5 rounded bg-gray-100 text-gray-500">
                      {log.actor_role.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400 mt-1" /> : <ChevronDown className="w-3 h-3 text-gray-400 mt-1" />}
              </button>

              {isExpanded && (
                <div className="px-2.5 pb-2.5 pt-0 border-t border-gray-50">
                  <div className="bg-gray-50 rounded-lg p-2 mt-1.5">
                    <div className="text-[9px] font-medium text-gray-500 uppercase mb-1">Details</div>
                    <div className="space-y-0.5">
                      {Object.entries(log.details).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-400">{key}:</span>
                          <span className="text-gray-700 font-mono">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                        </div>
                      ))}
                    </div>
                    {log.ip_address && (
                      <div className="text-[9px] text-gray-400 mt-1">IP: {log.ip_address}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminAuditLog;
