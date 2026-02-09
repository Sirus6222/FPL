import React, { useState } from 'react';
import { X, BarChart3, Megaphone, Image, Activity, Download, Shield } from 'lucide-react';
import { Sponsor, SponsorCampaign, SponsorDashboardMetrics, SponsorAsset, AuditLogEntry, UserRole, ROLE_PERMISSIONS } from '../types';
import SponsorDashboard from './SponsorDashboard';
import SponsorCampaignList from './SponsorCampaignList';
import SponsorCampaignDetail from './SponsorCampaignDetail';
import SponsorAssetLibrary from './SponsorAssetLibrary';

interface SponsorPortalProps {
  sponsorId: string;
  sponsor: Sponsor;
  campaigns: SponsorCampaign[];
  dashboardMetrics: SponsorDashboardMetrics;
  assets: SponsorAsset[];
  auditLogs: AuditLogEntry[];
  userRole: UserRole;
  onClose: () => void;
}

type PortalTab = 'dashboard' | 'campaigns' | 'assets' | 'analytics';

const SponsorPortal: React.FC<SponsorPortalProps> = ({
  sponsor, campaigns, dashboardMetrics, assets, auditLogs, userRole, onClose
}) => {
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<SponsorCampaign | null>(null);

  const canManage = ROLE_PERMISSIONS[userRole]?.includes('sponsor:manage_campaigns');
  const canExport = ROLE_PERMISSIONS[userRole]?.includes('sponsor:export_data');

  const TABS: { key: PortalTab; label: string; icon: React.ReactNode; requiresPermission?: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { key: 'campaigns', label: 'Campaigns', icon: <Megaphone className="w-3.5 h-3.5" /> },
    { key: 'assets', label: 'Assets', icon: <Image className="w-3.5 h-3.5" />, requiresPermission: 'sponsor:manage_assets' },
    { key: 'analytics', label: 'Analytics', icon: <Activity className="w-3.5 h-3.5" />, requiresPermission: 'sponsor:view_analytics' },
  ];

  const visibleTabs = TABS.filter(t => {
    if (!t.requiresPermission) return true;
    return ROLE_PERMISSIONS[userRole]?.includes(t.requiresPermission as any);
  });

  const tierColors: Record<string, string> = {
    platinum: 'from-gray-700 to-gray-900',
    gold: 'from-yellow-500 to-amber-600',
    silver: 'from-gray-400 to-gray-500',
    bronze: 'from-orange-600 to-orange-700'
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-gray-50 w-full max-w-md rounded-t-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${tierColors[sponsor.tier] || 'from-gray-700 to-gray-900'} rounded-t-2xl p-4 text-white relative`}>
          <button onClick={onClose} className="absolute right-3 top-3 p-1.5 bg-white/20 rounded-full hover:bg-white/30">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <img src={sponsor.logo_url} alt={sponsor.name} className="w-10 h-10 rounded-xl bg-white/20 p-0.5 object-cover" />
            <div>
              <h2 className="text-base font-bold">{sponsor.name}</h2>
              <div className="flex items-center gap-2 text-white/70 text-[10px]">
                <span className="flex items-center gap-0.5">
                  <Shield className="w-3 h-3" />
                  {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Sponsor
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{sponsor.active_campaigns_count} active campaigns</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center flex-1">
              <div className="text-sm font-bold">{(sponsor.total_impressions / 1000000).toFixed(1)}M</div>
              <div className="text-[9px] text-white/60">Impressions</div>
            </div>
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center flex-1">
              <div className="text-sm font-bold">{(sponsor.total_engagements / 1000).toFixed(0)}K</div>
              <div className="text-[9px] text-white/60">Engagements</div>
            </div>
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center flex-1">
              <div className="text-sm font-bold">{campaigns.length}</div>
              <div className="text-[9px] text-white/60">Campaigns</div>
            </div>
          </div>

          {/* Role badge */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white/80">
              {userRole.replace('_', ' ')}
            </span>
            {canExport && (
              <button className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white/80 flex items-center gap-0.5 hover:bg-white/30">
                <Download className="w-2.5 h-2.5" /> Export
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-2 flex gap-0.5">
          {visibleTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedCampaign(null); }}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-gray-800 text-gray-800'
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
            <SponsorDashboard
              metrics={dashboardMetrics}
              campaigns={campaigns}
              sponsorColor={sponsor.primary_color}
            />
          )}

          {activeTab === 'campaigns' && !selectedCampaign && (
            <SponsorCampaignList
              campaigns={campaigns}
              userRole={userRole}
              sponsorColor={sponsor.primary_color}
              onSelectCampaign={setSelectedCampaign}
            />
          )}

          {activeTab === 'campaigns' && selectedCampaign && (
            <SponsorCampaignDetail
              campaign={selectedCampaign}
              sponsorColor={sponsor.primary_color}
              onBack={() => setSelectedCampaign(null)}
            />
          )}

          {activeTab === 'assets' && (
            <SponsorAssetLibrary
              assets={assets}
              userRole={userRole}
              sponsorColor={sponsor.primary_color}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Detailed Analytics</h3>
              {/* Survey performance */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 mb-3">Survey Performance</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{dashboardMetrics.survey_completions.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-400">Completions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{dashboardMetrics.survey_completion_rate}%</div>
                    <div className="text-[9px] text-gray-400">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{dashboardMetrics.avg_survey_score}/5</div>
                    <div className="text-[9px] text-gray-400">Avg Score</div>
                  </div>
                </div>
              </div>

              {/* Placement performance */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 mb-3">Session Engagement</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="text-sm font-bold">{Math.round(dashboardMetrics.avg_session_duration_seconds / 60)}m {dashboardMetrics.avg_session_duration_seconds % 60}s</div>
                    <div className="text-[9px] text-gray-400">Avg Session</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="text-sm font-bold">{dashboardMetrics.campaign_completion_rate}%</div>
                    <div className="text-[9px] text-gray-400">Campaign Completion</div>
                  </div>
                </div>
              </div>

              {/* Recent Audit Logs */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.log_id} className="flex items-start gap-2 text-[10px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">{log.actor_name}</span>
                        <span className="text-gray-400"> {log.action.replace(/_/g, ' ')} </span>
                        {log.resource_name && <span className="font-medium text-gray-600">{log.resource_name}</span>}
                      </div>
                      <span className="text-[9px] text-gray-400 flex-shrink-0">
                        {new Date(log.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorPortal;
