import React, { useState } from 'react';
import { Search, Building2, Shield, Eye, Megaphone, TrendingUp } from 'lucide-react';
import { Sponsor, SponsorTier } from '../types';

interface AdminSponsorListProps {
  sponsors: Sponsor[];
  onSelectSponsor: (sponsor: Sponsor) => void;
}

const TIER_STYLES: Record<SponsorTier, { bg: string; text: string; badge: string }> = {
  platinum: { bg: 'bg-gray-100', text: 'text-gray-700', badge: '💎' },
  gold: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: '🥇' },
  silver: { bg: 'bg-gray-50', text: 'text-gray-500', badge: '🥈' },
  bronze: { bg: 'bg-orange-50', text: 'text-orange-700', badge: '🥉' }
};

const AdminSponsorList: React.FC<AdminSponsorListProps> = ({ sponsors, onSelectSponsor }) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<SponsorTier | 'all'>('all');

  const filtered = sponsors.filter(s => {
    if (tierFilter !== 'all' && s.tier !== tierFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.company_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tiers: (SponsorTier | 'all')[] = ['all', 'platinum', 'gold', 'silver', 'bronze'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">All Sponsors ({sponsors.length})</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search sponsors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      {/* Tier filters */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tiers.map(t => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
              tierFilter === t ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t === 'all' ? 'All Tiers' : `${TIER_STYLES[t].badge} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Sponsor Cards */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No sponsors found
          </div>
        )}
        {filtered.map(sponsor => {
          const tierStyle = TIER_STYLES[sponsor.tier];
          return (
            <div
              key={sponsor.sponsor_id}
              onClick={() => onSelectSponsor(sponsor)}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <img src={sponsor.logo_url} alt={sponsor.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-800">{sponsor.name}</h4>
                    <div className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                        sponsor.status === 'active' ? 'bg-green-100 text-green-700' :
                        sponsor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        sponsor.status === 'suspended' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>{sponsor.status}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                        {tierStyle.badge} {sponsor.tier}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{sponsor.company_name}</div>
                  <div className="text-[9px] text-gray-400">{sponsor.industry}</div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mt-2 text-[9px]">
                    <span className="flex items-center gap-0.5 text-blue-600">
                      <Eye className="w-2.5 h-2.5" /> {(sponsor.total_impressions / 1000).toFixed(0)}K imp
                    </span>
                    <span className="flex items-center gap-0.5 text-green-600">
                      <TrendingUp className="w-2.5 h-2.5" /> {(sponsor.total_engagements / 1000).toFixed(0)}K eng
                    </span>
                    <span className="flex items-center gap-0.5 text-purple-600">
                      <Megaphone className="w-2.5 h-2.5" /> {sponsor.active_campaigns_count} campaigns
                    </span>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-2 mt-1.5 text-[9px] text-gray-400">
                    <span>{sponsor.monthly_budget_birr.toLocaleString()} ETB/mo</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Contract: {new Date(sponsor.contract_start).toLocaleDateString('en', { month: 'short' })} — {new Date(sponsor.contract_end).toLocaleDateString('en', { month: 'short', year: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSponsorList;
