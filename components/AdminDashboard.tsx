import React, { useState } from 'react';
import { Users, DollarSign, Building2, TrendingUp, Activity, BarChart3, Smartphone, Trophy, MapPin } from 'lucide-react';
import { AdminPlatformMetrics, Sponsor } from '../types';
import KPICard from './KPICard';
import SimpleLineChart from './SimpleLineChart';
import SimpleBarChart from './SimpleBarChart';
import DateRangeFilter from './DateRangeFilter';
import DataTable from './DataTable';

interface AdminDashboardProps {
  metrics: AdminPlatformMetrics;
  sponsors: Sponsor[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ metrics, sponsors }) => {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'all_time'>('30d');

  const sponsorColumns = [
    { key: 'name', label: 'Sponsor', sortable: true, render: (s: { sponsor_id: string; name: string; spend: number }) => (
      <span className="font-semibold text-gray-800">{s.name}</span>
    )},
    { key: 'spend', label: 'Spend (ETB)', sortable: true, align: 'right' as const, render: (s: { sponsor_id: string; name: string; spend: number }) => (
      <span className="font-mono font-semibold text-green-700">{s.spend.toLocaleString()}</span>
    )}
  ];

  return (
    <div className="space-y-4">
      {/* Period Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Platform Overview</h3>
        <DateRangeFilter value={period} onChange={setPeriod} />
      </div>

      {/* User KPIs */}
      <div className="grid grid-cols-2 gap-2">
        <KPICard
          label="DAU"
          value={metrics.dau}
          trend={4.2}
          trendDirection="up"
          icon={<Users className="w-3 h-3 text-blue-600" />}
          color="#2563EB"
          subtitle="daily active"
        />
        <KPICard
          label="MAU"
          value={metrics.mau}
          trend={8.1}
          trendDirection="up"
          icon={<Users className="w-3 h-3 text-indigo-600" />}
          color="#4F46E5"
          subtitle="monthly active"
        />
        <KPICard
          label="New Users"
          value={metrics.new_registrations}
          trend={15.3}
          trendDirection="up"
          icon={<TrendingUp className="w-3 h-3 text-green-600" />}
          color="#059669"
          subtitle="this period"
        />
        <KPICard
          label="DAU/MAU"
          value={`${metrics.dau_mau_ratio}%`}
          trend={1.2}
          trendDirection="up"
          icon={<Activity className="w-3 h-3 text-purple-600" />}
          color="#7C3AED"
          subtitle="stickiness"
        />
      </div>

      {/* DAU Chart */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <SimpleLineChart
          data={metrics.daily_active_users}
          color="#2563EB"
          label="Daily Active Users"
          height={140}
        />
      </div>

      {/* Revenue KPIs */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5 mb-3">
          <DollarSign className="w-4 h-4 text-green-600" />
          <h4 className="text-xs font-bold text-gray-700">Revenue</h4>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-sm font-bold text-green-700">{(metrics.total_sponsor_revenue_birr / 1000).toFixed(0)}K</div>
            <div className="text-[9px] text-gray-400">Sponsor Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-blue-700">{(metrics.total_coin_purchases_birr / 1000).toFixed(0)}K</div>
            <div className="text-[9px] text-gray-400">Coin Purchases</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-purple-700">{metrics.arpu_birr.toFixed(1)}</div>
            <div className="text-[9px] text-gray-400">ARPU (ETB)</div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <SimpleBarChart
          data={metrics.daily_revenue}
          color="#059669"
          label="Daily Revenue (ETB)"
          height={120}
        />
      </div>

      {/* Engagement */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5 mb-3">
          <Activity className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-bold text-gray-700">Engagement</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <Smartphone className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] text-gray-500">Sessions/Day</span>
            </div>
            <div className="text-sm font-bold">{metrics.avg_sessions_per_day}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-gray-500">Avg Session</span>
            </div>
            <div className="text-sm font-bold">{Math.round(metrics.avg_session_duration_seconds / 60)}m {metrics.avg_session_duration_seconds % 60}s</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] text-gray-500">Contest Rate</span>
            </div>
            <div className="text-sm font-bold">{metrics.contest_participation_rate}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-red-500" />
              <span className="text-[10px] text-gray-500">Showroom Check-in</span>
            </div>
            <div className="text-sm font-bold">{metrics.showroom_checkin_rate}%</div>
          </div>
        </div>
      </div>

      {/* Sponsor Overview */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5 mb-3">
          <Building2 className="w-4 h-4 text-gray-600" />
          <h4 className="text-xs font-bold text-gray-700">Sponsors ({metrics.total_sponsors})</h4>
        </div>
        {/* Tier distribution */}
        <div className="flex gap-2 mb-3">
          {metrics.sponsor_tier_distribution.map(({ tier, count }) => {
            const colors: Record<string, string> = { platinum: '#6B7280', gold: '#D97706', silver: '#9CA3AF', bronze: '#C2754E' };
            return (
              <div key={tier} className="flex-1 text-center bg-gray-50 rounded-lg p-2">
                <div className="text-sm font-bold" style={{ color: colors[tier] }}>{count}</div>
                <div className="text-[9px] text-gray-400 capitalize">{tier}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
          <span>{metrics.active_sponsors} active / {metrics.total_sponsors} total</span>
          <span>{metrics.sponsor_retention_rate}% retention</span>
        </div>
      </div>

      {/* Top Sponsors Table */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 mb-2">Top Sponsors by Spend</h4>
        <DataTable
          columns={sponsorColumns}
          data={metrics.top_sponsors_by_spend}
          keyField="sponsor_id"
          compact
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
