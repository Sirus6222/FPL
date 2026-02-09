import React, { useState } from 'react';
import { Plus, Search, Calendar, Target, Eye, MousePointerClick, Users, BarChart3 } from 'lucide-react';
import { SponsorCampaign, CampaignType, CampaignStatus, UserRole, ROLE_PERMISSIONS } from '../types';

interface SponsorCampaignListProps {
  campaigns: SponsorCampaign[];
  userRole: UserRole;
  sponsorColor?: string;
  onSelectCampaign: (campaign: SponsorCampaign) => void;
}

const STATUS_STYLES: Record<CampaignStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending_approval: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-orange-100 text-orange-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600'
};

const TYPE_ICONS: Record<CampaignType, React.ReactNode> = {
  branded_league: <Users className="w-3 h-3" />,
  contest_sponsorship: <Target className="w-3 h-3" />,
  showroom_activation: <Eye className="w-3 h-3" />,
  survey: <BarChart3 className="w-3 h-3" />,
  coin_drop: <span className="text-[10px]">🪙</span>,
  bonus_xp: <span className="text-[10px]">⚡</span>,
  mission: <span className="text-[10px]">🎯</span>
};

const SponsorCampaignList: React.FC<SponsorCampaignListProps> = ({ campaigns, userRole, sponsorColor = '#6C5CE7', onSelectCampaign }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');

  const canManage = ROLE_PERMISSIONS[userRole]?.includes('sponsor:manage_campaigns');

  const filtered = campaigns.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statuses: (CampaignStatus | 'all')[] = ['all', 'active', 'draft', 'pending_approval', 'paused', 'completed'];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Campaigns ({campaigns.length})</h3>
        {canManage && (
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold"
            style={{ backgroundColor: sponsorColor }}
          >
            <Plus className="w-3 h-3" /> New Campaign
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1"
          style={{ '--tw-ring-color': sponsorColor } as React.CSSProperties}
        />
      </div>

      {/* Status filters */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
              statusFilter === s
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400">No campaigns found</div>
        )}
        {filtered.map(campaign => {
          const primaryTarget = Object.entries(campaign.kpi_targets).find(([, v]) => v && v > 0);
          const primaryActual = primaryTarget ? (campaign.kpi_actuals as any)[primaryTarget[0]] : 0;
          const progress = primaryTarget && primaryTarget[1] ? (primaryActual / primaryTarget[1]) * 100 : 0;

          return (
            <div
              key={campaign.campaign_id}
              onClick={() => onSelectCampaign(campaign)}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center" style={{ backgroundColor: sponsorColor + '15' }}>
                    {TYPE_ICONS[campaign.type]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{campaign.name}</h4>
                    <span className="text-[9px] text-gray-400">{campaign.type.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${STATUS_STYLES[campaign.status]}`}>
                  {campaign.status.replace('_', ' ')}
                </span>
              </div>

              {campaign.description && (
                <p className="text-[10px] text-gray-500 mb-2 line-clamp-1">{campaign.description}</p>
              )}

              {/* KPI Progress */}
              {primaryTarget && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[9px] text-gray-500 mb-0.5">
                    <span>{primaryTarget[0].replace('_', ' ')}</span>
                    <span>{primaryActual.toLocaleString()} / {primaryTarget[1]!.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%`, backgroundColor: sponsorColor }} />
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-[9px] text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {campaign.kpi_actuals.impressions.toLocaleString()}</span>
                  <span className="flex items-center gap-0.5"><MousePointerClick className="w-2.5 h-2.5" /> {campaign.kpi_actuals.engagements.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{new Date(campaign.start_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })} — {new Date(campaign.end_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorCampaignList;
