import React, { useState } from 'react';
import { Search, Shield, UserPlus, UserMinus, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react';
import { UserRole, Sponsor } from '../types';

interface RoleEntry {
  user_id: string;
  user_name: string;
  email: string;
  role: UserRole;
  sponsor_name?: string;
  sponsor_id?: string;
  granted_at: string;
  is_active: boolean;
}

interface AdminRoleManagerProps {
  sponsors: Sponsor[];
  userRole: UserRole;
}

// Mock role data
const MOCK_ROLE_ENTRIES: RoleEntry[] = [
  { user_id: 'u_admin_1', user_name: 'Dawit Bekele', email: 'dawit@ethiopianfpl.com', role: 'admin_super', granted_at: '2025-01-01', is_active: true },
  { user_id: 'u_admin_2', user_name: 'Yonas Gebre', email: 'yonas@ethiopianfpl.com', role: 'admin_analyst', granted_at: '2025-01-05', is_active: true },
  { user_id: 'u_sponsor_1', user_name: 'Sara Hailu', email: 'sara@telebirr.com', role: 'sponsor_manager', sponsor_name: 'Telebirr', sponsor_id: 'sp_telebirr', granted_at: '2025-01-01', is_active: true },
  { user_id: 'u_sponsor_2', user_name: 'Meron Tadesse', email: 'meron@coca-cola.com', role: 'sponsor_manager', sponsor_name: 'Coca-Cola', sponsor_id: 'sp_coca_cola', granted_at: '2025-03-01', is_active: true },
  { user_id: 'u_sponsor_3', user_name: 'Abel Kebede', email: 'abel@heineken.com', role: 'sponsor_viewer', sponsor_name: 'Heineken', sponsor_id: 'sp_heineken', granted_at: '2025-02-01', is_active: true },
  { user_id: 'u_sponsor_4', user_name: 'Hana Lemma', email: 'hana@ethiotelecom.et', role: 'sponsor_manager', sponsor_name: 'Ethio Telecom', sponsor_id: 'sp_ethio_telecom', granted_at: '2025-01-15', is_active: true }
];

const ROLE_COLORS: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-600',
  sponsor_viewer: 'bg-blue-100 text-blue-700',
  sponsor_manager: 'bg-purple-100 text-purple-700',
  admin_analyst: 'bg-orange-100 text-orange-700',
  admin_super: 'bg-red-100 text-red-700'
};

const AdminRoleManager: React.FC<AdminRoleManagerProps> = ({ sponsors, userRole }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('sponsor_viewer');
  const [newSponsor, setNewSponsor] = useState<string>('');
  const [newEmail, setNewEmail] = useState('');

  const isSuper = userRole === 'admin_super';
  const roles: (UserRole | 'all')[] = ['all', 'admin_super', 'admin_analyst', 'sponsor_manager', 'sponsor_viewer'];

  const filtered = MOCK_ROLE_ENTRIES.filter(r => {
    if (roleFilter !== 'all' && r.role !== roleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.user_name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || (r.sponsor_name || '').toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Role Management</h3>
        {isSuper && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold"
          >
            <UserPlus className="w-3 h-3" /> Assign Role
          </button>
        )}
      </div>

      {!isSuper && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 flex items-center gap-2 text-[11px] text-yellow-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Only admin_super users can modify role assignments. You have read-only access.</span>
        </div>
      )}

      {/* Add form */}
      {showAddForm && isSuper && (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-indigo-200">
          <h4 className="text-xs font-bold text-gray-700 mb-2">New Role Assignment</h4>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="User email address"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value as UserRole)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200"
            >
              <option value="sponsor_viewer">Sponsor Viewer</option>
              <option value="sponsor_manager">Sponsor Manager</option>
              <option value="admin_analyst">Admin Analyst</option>
              <option value="admin_super">Admin Super</option>
            </select>
            {(newRole === 'sponsor_viewer' || newRole === 'sponsor_manager') && (
              <select
                value={newSponsor}
                onChange={e => setNewSponsor(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200"
              >
                <option value="">Select sponsor...</option>
                {sponsors.map(s => (
                  <option key={s.sponsor_id} value={s.sponsor_id}>{s.name}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 inline mr-1" /> Assign
              </button>
              <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or sponsor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      {/* Role filters */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {roles.map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
              roleFilter === r ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {r === 'all' ? 'All Roles' : r.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Role entries */}
      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400">No users found</div>
        )}
        {filtered.map(entry => (
          <div key={entry.user_id + entry.role} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {entry.user_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">{entry.user_name}</div>
                  <div className="text-[10px] text-gray-400">{entry.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${ROLE_COLORS[entry.role]}`}>
                  {entry.role.replace(/_/g, ' ')}
                </span>
                {isSuper && (
                  <button className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500" title="Revoke role">
                    <UserMinus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            {entry.sponsor_name && (
              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-500 ml-10">
                <Building2 className="w-3 h-3" />
                <span>Scoped to: <span className="font-medium">{entry.sponsor_name}</span></span>
              </div>
            )}
            <div className="text-[9px] text-gray-400 mt-1 ml-10">
              Granted {new Date(entry.granted_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              {entry.is_active ? (
                <span className="ml-1.5 text-green-500">Active</span>
              ) : (
                <span className="ml-1.5 text-red-400">Inactive</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRoleManager;
