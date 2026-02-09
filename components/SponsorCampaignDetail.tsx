import React from 'react';
import { ArrowLeft, Calendar, Target, Eye, MousePointerClick, Users, Award, Gift, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { SponsorCampaign, SponsorPrize } from '../types';
import SimpleBarChart from './SimpleBarChart';

interface SponsorCampaignDetailProps {
  campaign: SponsorCampaign;
  sponsorColor?: string;
  onBack: () => void;
}

const SponsorCampaignDetail: React.FC<SponsorCampaignDetailProps> = ({ campaign, sponsorColor = '#6C5CE7', onBack }) => {
  const kpiPairs = Object.entries(campaign.kpi_targets)
    .filter(([, v]) => v && v > 0)
    .map(([key, target]) => ({
      key,
      label: key.replace(/_/g, ' '),
      target: target!,
      actual: (campaign.kpi_actuals as any)[key] || 0,
      progress: target ? ((campaign.kpi_actuals as any)[key] || 0) / target * 100 : 0
    }));

  const daysRemaining = Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const totalDays = Math.max(1, Math.ceil((new Date(campaign.end_date).getTime() - new Date(campaign.start_date).getTime()) / (1000 * 60 * 60 * 24)));
  const timeProgress = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
      </button>

      {/* Campaign Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{campaign.name}</h3>
            <span className="text-[10px] text-gray-400">{campaign.type.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            campaign.status === 'active' ? 'bg-green-100 text-green-700' :
            campaign.status === 'draft' ? 'bg-gray-100 text-gray-600' :
            'bg-yellow-100 text-yellow-700'
          }`}>{campaign.status}</span>
        </div>
        {campaign.description && (
          <p className="text-[11px] text-gray-600 mb-3">{campaign.description}</p>
        )}

        {/* Timeline */}
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Campaign Timeline</span>
            <span>{daysRemaining} days remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, timeProgress)}%`, backgroundColor: sponsorColor }} />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
            <span>{new Date(campaign.start_date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>{new Date(campaign.end_date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <h4 className="text-xs font-bold text-gray-700">KPI Progress</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <Eye className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <div className="text-sm font-bold">{campaign.kpi_actuals.impressions.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">Impressions</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <MousePointerClick className="w-4 h-4 mx-auto text-green-500 mb-1" />
            <div className="text-sm font-bold">{campaign.kpi_actuals.engagements.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">Engagements</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <Users className="w-4 h-4 mx-auto text-purple-500 mb-1" />
            <div className="text-sm font-bold">{campaign.kpi_actuals.league_joins.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">League Joins</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <Target className="w-4 h-4 mx-auto text-orange-500 mb-1" />
            <div className="text-sm font-bold">{campaign.kpi_actuals.contest_entries.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">Contest Entries</div>
          </div>
        </div>

        {/* KPI Target bars */}
        {kpiPairs.length > 0 && (
          <div className="mt-3 space-y-2">
            <h5 className="text-[10px] font-medium text-gray-500 uppercase">Target Progress</h5>
            {kpiPairs.map(kpi => (
              <div key={kpi.key}>
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-gray-600 capitalize">{kpi.label}</span>
                  <span className="text-gray-500">{Math.round(kpi.progress)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, kpi.progress)}%`,
                      backgroundColor: kpi.progress >= 100 ? '#10B981' : sponsorColor
                    }}
                  />
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  {kpi.actual.toLocaleString()} / {kpi.target.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h4 className="text-xs font-bold text-gray-700 mb-2">Budget</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-gray-500">Coin Budget</div>
            <div className="text-sm font-bold text-yellow-600">{campaign.budget_coins.toLocaleString()} coins</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500">ETB Budget</div>
            <div className="text-sm font-bold text-green-600">{campaign.budget_birr.toLocaleString()} ETB</div>
          </div>
        </div>
      </div>

      {/* Prizes */}
      {campaign.prizes_allocated.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1.5 mb-3">
            <Gift className="w-4 h-4 text-purple-500" />
            <h4 className="text-xs font-bold text-gray-700">Prizes</h4>
          </div>
          <div className="space-y-2">
            {campaign.prizes_allocated.map((prize: SponsorPrize) => (
              <div key={prize.prize_id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-gray-800">{prize.name}</div>
                  <div className="text-[9px] text-gray-400">{prize.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold" style={{ color: sponsorColor }}>
                    {prize.type === 'coins' ? `${prize.value_coins} coins` : `${prize.value_birr} ETB`}
                  </div>
                  <div className="text-[9px] text-gray-400">
                    {prize.quantity_claimed}/{prize.quantity} claimed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Entities */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h4 className="text-xs font-bold text-gray-700 mb-2">Linked Entities</h4>
        <div className="space-y-1.5 text-[11px] text-gray-600">
          {campaign.linked_league_ids?.length ? (
            <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-blue-500" /> {campaign.linked_league_ids.length} linked league(s)</div>
          ) : null}
          {campaign.linked_contest_ids?.length ? (
            <div className="flex items-center gap-1.5"><Target className="w-3 h-3 text-green-500" /> {campaign.linked_contest_ids.length} linked contest(s)</div>
          ) : null}
          {campaign.linked_showroom_ids?.length ? (
            <div className="flex items-center gap-1.5"><Eye className="w-3 h-3 text-purple-500" /> {campaign.linked_showroom_ids.length} linked showroom(s)</div>
          ) : null}
          {campaign.linked_survey_id ? (
            <div className="flex items-center gap-1.5"><BarChart3 className="w-3 h-3 text-orange-500" /> 1 linked survey</div>
          ) : null}
          {!campaign.linked_league_ids?.length && !campaign.linked_contest_ids?.length && !campaign.linked_showroom_ids?.length && !campaign.linked_survey_id && (
            <span className="text-gray-400">No linked entities</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorCampaignDetail;
