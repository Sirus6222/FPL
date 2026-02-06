import React, { useState } from 'react';
import { X, Gift, Coins, Zap, Target, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SponsorActivation, ActivationType } from '../types';

interface SponsorActivationHubProps {
  activations: SponsorActivation[];
  onClose: () => void;
  onClaim: (activation: SponsorActivation) => void;
}

const TYPE_FILTERS: { key: ActivationType | 'all'; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Sparkles className="w-3 h-3" /> },
  { key: 'coin_drop', label: 'Coin Drops', icon: <Coins className="w-3 h-3" /> },
  { key: 'bonus_xp', label: 'Bonus XP', icon: <Zap className="w-3 h-3" /> },
  { key: 'mission', label: 'Missions', icon: <Target className="w-3 h-3" /> },
  { key: 'flash_deal', label: 'Flash Deals', icon: <Gift className="w-3 h-3" /> }
];

const TYPE_GRADIENTS: Record<string, string> = {
  coin_drop: 'from-yellow-400 to-amber-500',
  bonus_xp: 'from-purple-400 to-indigo-500',
  mission: 'from-blue-400 to-cyan-500',
  flash_deal: 'from-pink-400 to-rose-500'
};

const SponsorActivationHub: React.FC<SponsorActivationHubProps> = ({ activations, onClose, onClaim }) => {
  const [selectedType, setSelectedType] = useState<ActivationType | 'all'>('all');
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  const filteredActivations = activations.filter(a => {
    if (selectedType !== 'all' && a.type !== selectedType) return false;
    return true;
  });

  const activeActivations = filteredActivations.filter(a => a.is_active && !a.user_claimed);
  const claimedActivations = filteredActivations.filter(a => a.user_claimed);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-gray-50 w-full max-w-md rounded-t-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-t-2xl p-4 text-white relative">
          <button onClick={onClose} className="absolute right-3 top-3 p-1.5 bg-white/20 rounded-full">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5" />
            <h2 className="text-lg font-bold">Sponsored Rewards</h2>
          </div>
          <p className="text-white/70 text-xs">Earn rewards from our partners. No purchase required.</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-white/20 rounded-lg px-3 py-1.5 text-center">
              <div className="text-sm font-bold">{activeActivations.length}</div>
              <div className="text-[9px] text-white/70">Available</div>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1.5 text-center">
              <div className="text-sm font-bold">{claimedActivations.length}</div>
              <div className="text-[9px] text-white/70">Claimed</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-b border-gray-200 bg-white">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedType(f.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                selectedType === f.key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeActivations.length === 0 && claimedActivations.length === 0 && (
            <div className="text-center py-8">
              <Gift className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No rewards available right now</p>
              <p className="text-xs text-gray-300 mt-1">Check back soon!</p>
            </div>
          )}

          {/* Active */}
          {activeActivations.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" /> Available Now
              </h3>
              <div className="space-y-2">
                {activeActivations.map(act => {
                  const gradient = TYPE_GRADIENTS[act.type] || 'from-gray-400 to-gray-500';
                  const progress = act.max_claims ? (act.claims_count / act.max_claims) * 100 : 0;
                  const isMissionExpanded = expandedMission === act.activation_id;

                  return (
                    <div key={act.activation_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white flex-shrink-0`}>
                            <img src={act.sponsor_logo_url} alt={act.sponsor_name} className="w-7 h-7 rounded-md object-cover bg-white/20 p-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-gray-800 truncate">{act.title}</h4>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white font-medium`}>
                                {act.type.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">{act.description}</p>

                            {/* Rewards row */}
                            <div className="flex items-center gap-2 mt-2">
                              {act.reward_coins && (
                                <span className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  <Coins className="w-3 h-3" /> +{act.reward_coins}
                                </span>
                              )}
                              {act.reward_xp && (
                                <span className="flex items-center gap-0.5 bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  <Zap className="w-3 h-3" /> +{act.reward_xp} XP
                                </span>
                              )}
                              <span className="text-[9px] text-gray-400 ml-auto">{act.sponsor_name}</span>
                            </div>

                            {/* Mission steps */}
                            {act.type === 'mission' && act.mission_steps && (
                              <div className="mt-2">
                                <button
                                  onClick={() => setExpandedMission(isMissionExpanded ? null : act.activation_id)}
                                  className="text-[10px] text-indigo-600 font-medium flex items-center gap-0.5"
                                >
                                  {isMissionExpanded ? 'Hide' : 'View'} Steps ({act.mission_steps.filter(s => s.is_completed).length}/{act.mission_steps.length})
                                  <ChevronRight className={`w-3 h-3 transition-transform ${isMissionExpanded ? 'rotate-90' : ''}`} />
                                </button>
                                {isMissionExpanded && (
                                  <div className="mt-1.5 space-y-1">
                                    {act.mission_steps.map((step, i) => (
                                      <div key={step.step_id} className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded ${step.is_completed ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                                        {step.is_completed ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />}
                                        <span>{step.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Claims bar */}
                            {act.max_claims && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-100 rounded-full h-1">
                                  <div className="bg-gray-300 rounded-full h-1" style={{ width: `${Math.min(100, progress)}%` }} />
                                </div>
                                <div className="text-[9px] text-gray-400 mt-0.5">{act.claims_count.toLocaleString()}/{act.max_claims.toLocaleString()} claimed</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => onClaim(act)}
                          className="w-full mt-2.5 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1"
                          style={{ backgroundColor: act.sponsor_color }}
                        >
                          {act.type === 'mission' ? (
                            <><Target className="w-3.5 h-3.5" /> Start Mission</>
                          ) : act.type === 'flash_deal' ? (
                            <><Gift className="w-3.5 h-3.5" /> Activate Deal</>
                          ) : (
                            <><Gift className="w-3.5 h-3.5" /> Claim Reward</>
                          )}
                        </button>
                        <div className="text-[8px] text-gray-400 text-center mt-1">{act.compliance_label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Claimed */}
          {claimedActivations.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 mb-2">Already Claimed</h3>
              <div className="space-y-2">
                {claimedActivations.map(act => (
                  <div key={act.activation_id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 opacity-60">
                    <div className="flex items-center gap-3">
                      <img src={act.sponsor_logo_url} alt={act.sponsor_name} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-500 truncate">{act.title}</div>
                        <div className="text-[10px] text-gray-400">{act.sponsor_name}</div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorActivationHub;
