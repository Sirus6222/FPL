import React, { useState } from 'react';
import { Eye, MousePointerClick, Users, TrendingUp, Award, BarChart3, Target } from 'lucide-react';
import { SponsorDashboardMetrics, SponsorCampaign } from '../types';
import KPICard from './KPICard';
import SimpleLineChart from './SimpleLineChart';
import DateRangeFilter from './DateRangeFilter';
import DataTable from './DataTable';

interface SponsorDashboardProps {
  metrics: SponsorDashboardMetrics;
  campaigns: SponsorCampaign[];
  sponsorColor?: string;
}

const SponsorDashboard: React.FC<SponsorDashboardProps> = ({ metrics, campaigns, sponsorColor = '#6C5CE7' }) => {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'all_time'>('30d');

  const activeCampaigns = campaigns.filter(c => c.status === 'active');

  const campaignColumns = [
    { key: 'name', label: 'Campaign', sortable: true, render: (c: SponsorCampaign) => (
      <div>
        <div className="font-semibold text-gray-800">{c.name}</div>
        <div className="text-[9px] text-gray-400">{c.type.replace('_', ' ')}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (c: SponsorCampaign) => (
      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
        c.status === 'active' ? 'bg-green-100 text-green-700' :
        c.status === 'draft' ? 'bg-gray-100 text-gray-600' :
        c.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
        'bg-blue-100 text-blue-700'
      }`}>{c.status}</span>
    )},
    { key: 'impressions', label: 'Impressions', sortable: true, align: 'right' as const, render: (c: SponsorCampaign) => (
      <span className="font-mono">{c.kpi_actuals.impressions.toLocaleString()}</span>
    )},
    { key: 'engagements', label: 'Engagements', sortable: true, align: 'right' as const, render: (c: SponsorCampaign) => (
      <span className="font-mono">{c.kpi_actuals.engagements.toLocaleString()}</span>
    )}
  ];

  return (
    <div className="space-y-4">
      {/* Period Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Overview</h3>
        <DateRangeFilter value={period} onChange={setPeriod} />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        <KPICard
          label="Impressions"
          value={metrics.total_impressions}
          trend={12.4}
          trendDirection="up"
          icon={<Eye className="w-3 h-3" style={{ color: sponsorColor }} />}
          color={sponsorColor}
          subtitle="vs prev period"
        />
        <KPICard
          label="Engagements"
          value={metrics.total_engagements}
          trend={8.2}
          trendDirection="up"
          icon={<MousePointerClick className="w-3 h-3" style={{ color: sponsorColor }} />}
          color={sponsorColor}
          subtitle="vs prev period"
        />
        <KPICard
          label="Engagement Rate"
          value={`${metrics.engagement_rate}%`}
          trend={2.1}
          trendDirection="up"
          icon={<TrendingUp className="w-3 h-3" style={{ color: sponsorColor }} />}
          color={sponsorColor}
        />
        <KPICard
          label="Unique Users"
          value={metrics.unique_users_reached}
          trend={5.7}
          trendDirection="up"
          icon={<Users className="w-3 h-3" style={{ color: sponsorColor }} />}
          color={sponsorColor}
        />
      </div>

      {/* Cost Efficiency */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Cost / Engagement</div>
          <div className="text-lg font-bold text-gray-900">{metrics.cost_per_engagement_birr.toFixed(2)} ETB</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Cost / Impression</div>
          <div className="text-lg font-bold text-gray-900">{metrics.cost_per_impression_birr.toFixed(2)} ETB</div>
        </div>
      </div>

      {/* Impressions Chart */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <SimpleLineChart
          data={metrics.daily_impressions}
          color={sponsorColor}
          label="Daily Impressions"
          height={140}
        />
      </div>

      {/* Engagements Chart */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <SimpleLineChart
          data={metrics.daily_engagements}
          color="#10B981"
          label="Daily Engagements"
          height={140}
        />
      </div>

      {/* Campaign Breakdown */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <h4 className="text-xs font-bold text-gray-700">Campaign Performance</h4>
        </div>
        {/* KPI progress for each active campaign */}
        <div className="space-y-3">
          {activeCampaigns.map(c => {
            const targetKey = Object.keys(c.kpi_targets).find(k => (c.kpi_targets as any)[k] > 0);
            const targetVal = targetKey ? (c.kpi_targets as any)[targetKey] : 0;
            const actualVal = targetKey ? (c.kpi_actuals as any)[targetKey] : 0;
            const progress = targetVal > 0 ? (actualVal / targetVal) * 100 : 0;
            return (
              <div key={c.campaign_id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-gray-700">{c.name}</span>
                  <span className="text-[10px] text-gray-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, progress)}%`, backgroundColor: sponsorColor }}
                  />
                </div>
                {targetKey && (
                  <div className="text-[9px] text-gray-400 mt-0.5">
                    {actualVal.toLocaleString()} / {targetVal.toLocaleString()} {targetKey.replace('_', ' ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* League & Contest stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Award className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-medium text-gray-500">League Members</span>
          </div>
          <div className="text-lg font-bold">{metrics.sponsored_league_members.toLocaleString()}</div>
          <div className="text-[9px] text-gray-400">{metrics.league_join_rate}% join rate</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-green-500" />
            <span className="text-[10px] font-medium text-gray-500">Contest Entries</span>
          </div>
          <div className="text-lg font-bold">{metrics.sponsored_contest_entries.toLocaleString()}</div>
          <div className="text-[9px] text-gray-400">{metrics.contest_entry_rate}% entry rate</div>
        </div>
      </div>

      {/* All Campaigns Table */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 mb-2">All Campaigns</h4>
        <DataTable
          columns={campaignColumns}
          data={campaigns}
          keyField="campaign_id"
          compact
        />
      </div>
    </div>
  );
};

export default SponsorDashboard;
