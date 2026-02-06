import React, { useState } from 'react';
import { X, BarChart3, Building2, Shield, Users, Activity } from 'lucide-react';
import { AdminPlatformMetrics, Sponsor, AuditLogEntry, UserRole, ROLE_PERMISSIONS, SponsorCampaign, SponsorDashboardMetrics, SponsorAsset } from '../types';
import AdminDashboard from './AdminDashboard';
import AdminSponsorList from './AdminSponsorList';
import AdminAuditLog from './AdminAuditLog';
import AdminRoleManager from './AdminRoleManager';
import SponsorPortal from './SponsorPortal';

interface AdminPortalProps {
  platformMetrics: AdminPlatformMetrics;
  sponsors: Sponsor[];
  campaigns: SponsorCampaign[];
  dashboardMetrics: SponsorDashboardMetrics;
  assets: SponsorAsset[];
  auditLogs: AuditLogEntry[];
  userRole: UserRole;
  onClose: () => void;
}

type AdminTab = 'dashboard' | 'sponsors' | 'audit' | 'roles';

const AdminPortal: React.FC<AdminPortalProps> = ({
  platformMetrics, sponsors, campaigns, dashboardMetrics, assets, auditLogs, userRole, onClose
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [viewingSponsor, setViewingSponsor] = useState<Sponsor | null>(null);

  const canManageUsers = ROLE_PERMISSIONS[userRole]?.includes('admin:manage_users');

  const TABS: { key: AdminTab; label: string; icon: React.ReactNode; visible: boolean }[] = [
    { key: 'dashboard', label: 'Platform', icon: <BarChart3 className="w-3.5 h-3.5" />, visible: true },
    { key: 'sponsors', label: 'Sponsors', icon: <Building2 className="w-3.5 h-3.5" />, visible: true },
    { key: 'audit', label: 'Audit Log', icon: <Shield className="w-3.5 h-3.5" />, visible: true },
    { key: 'roles', label: 'Roles', icon: <Users className="w-3.5 h-3.5" />, visible: canManageUsers || userRole === 'admin_analyst' }
  ];

  // If viewing a specific sponsor, show sponsor portal in admin context
  if (viewingSponsor) {
    return (
      <SponsorPortal
        sponsorId={viewingSponsor.sponsor_id}
        sponsor={viewingSponsor}
        campaigns={campaigns.filter(c => c.sponsor_id === viewingSponsor.sponsor_id)}
        dashboardMetrics={dashboardMetrics}
        assets={assets.filter(a => a.sponsor_id === viewingSponsor.sponsor_id)}
        auditLogs={auditLogs.filter(l => l.sponsor_id === viewingSponsor.sponsor_id)}
        userRole={userRole}
        onClose={() => setViewingSponsor(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-gray-50 w-full max-w-md rounded-t-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-t-2xl p-4 text-white relative">
          <button onClick={onClose} className="absolute right-3 top-3 p-1.5 bg-white/20 rounded-full hover:bg-white/30">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5" />
            <h2 className="text-lg font-bold">Admin Portal</h2>
          </div>
          <p className="text-white/60 text-[11px]">Platform analytics, sponsor management, and administration</p>

          {/* Quick stats */}
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center flex-1">
              <div className="text-sm font-bold">{(platformMetrics.dau / 1000).toFixed(1)}K</div>
              <div className="text-[9px] text-white/60">DAU</div>
            </div>
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center flex-1">
              <div className="text-sm font-bold">{(platformMetrics.total_sponsor_revenue_birr / 1000000).toFixed(1)}M</div>
              <div className="text-[9px] text-white/60">Revenue (ETB)</div>
            </div>
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center flex-1">
              <div className="text-sm font-bold">{platformMetrics.active_sponsors}</div>
              <div className="text-[9px] text-white/60">Sponsors</div>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white/80">
              {userRole.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-2 flex gap-0.5">
          {TABS.filter(t => t.visible).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === 'dashboard' && (
            <AdminDashboard metrics={platformMetrics} sponsors={sponsors} />
          )}

          {activeTab === 'sponsors' && (
            <AdminSponsorList sponsors={sponsors} onSelectSponsor={setViewingSponsor} />
          )}

          {activeTab === 'audit' && (
            <AdminAuditLog logs={auditLogs} />
          )}

          {activeTab === 'roles' && (
            <AdminRoleManager sponsors={sponsors} userRole={userRole} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
