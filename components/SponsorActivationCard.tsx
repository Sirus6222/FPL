import React from 'react';
import { Coins, Zap, Target, Gift, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SponsorActivation } from '../types';

interface SponsorActivationCardProps {
  activation: SponsorActivation;
  onClaim: (activation: SponsorActivation) => void;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; gradient: string; label: string }> = {
  coin_drop: { icon: <Coins className="w-4 h-4" />, gradient: 'from-yellow-400 to-amber-500', label: 'Coin Drop' },
  bonus_xp: { icon: <Zap className="w-4 h-4" />, gradient: 'from-purple-400 to-indigo-500', label: 'Bonus XP' },
  mission: { icon: <Target className="w-4 h-4" />, gradient: 'from-blue-400 to-cyan-500', label: 'Mission' },
  flash_deal: { icon: <Gift className="w-4 h-4" />, gradient: 'from-pink-400 to-rose-500', label: 'Flash Deal' }
};

const SponsorActivationCard: React.FC<SponsorActivationCardProps> = ({ activation, onClaim }) => {
  const config = TYPE_CONFIG[activation.type] || TYPE_CONFIG.coin_drop;
  const claimed = activation.user_claimed;
  const progress = activation.max_claims ? (activation.claims_count / activation.max_claims) * 100 : 0;
  const completedSteps = activation.mission_steps?.filter(s => s.is_completed).length || 0;
  const totalSteps = activation.mission_steps?.length || 0;

  return (
    <div className="min-w-[200px] max-w-[220px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0">
      {/* Header with sponsor branding */}
      <div className={`bg-gradient-to-r ${config.gradient} p-2.5 flex items-center gap-2`}>
        <img src={activation.sponsor_logo_url} alt={activation.sponsor_name} className="w-7 h-7 rounded-full bg-white/90 p-0.5 object-cover" />
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-xs truncate">{activation.title}</div>
          <div className="flex items-center gap-1">
            <span className="text-white/80 text-[10px]">{config.label}</span>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-white/80 text-[10px]">{activation.sponsor_name}</span>
          </div>
        </div>
      </div>

      <div className="p-2.5">
        <p className="text-[11px] text-gray-600 mb-2 line-clamp-2">{activation.description}</p>

        {/* Rewards */}
        <div className="flex items-center gap-2 mb-2">
          {activation.reward_coins && (
            <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <Coins className="w-3 h-3" /> +{activation.reward_coins}
            </div>
          )}
          {activation.reward_xp && (
            <div className="flex items-center gap-0.5 bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <Zap className="w-3 h-3" /> +{activation.reward_xp} XP
            </div>
          )}
        </div>

        {/* Mission progress */}
        {activation.type === 'mission' && activation.mission_steps && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
              <span>Progress</span>
              <span>{completedSteps}/{totalSteps} steps</span>
            </div>
            <div className="flex gap-1">
              {activation.mission_steps.map((step, i) => (
                <div
                  key={step.step_id}
                  className={`flex-1 h-1.5 rounded-full ${step.is_completed ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Claims progress */}
        {activation.max_claims && (
          <div className="mb-2">
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div className="bg-gray-300 rounded-full h-1 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
            </div>
            <div className="text-[9px] text-gray-400 mt-0.5">{activation.claims_count.toLocaleString()}/{activation.max_claims.toLocaleString()} claimed</div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => !claimed && onClaim(activation)}
          disabled={claimed}
          className={`w-full py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            claimed
              ? 'bg-gray-100 text-gray-400'
              : 'text-white'
          }`}
          style={!claimed ? { backgroundColor: activation.sponsor_color } : undefined}
        >
          {claimed ? (
            <><CheckCircle2 className="w-3 h-3" /> Claimed</>
          ) : activation.type === 'mission' ? (
            <><Target className="w-3 h-3" /> View Mission <ChevronRight className="w-3 h-3" /></>
          ) : (
            <><Gift className="w-3 h-3" /> Claim Reward</>
          )}
        </button>

        <div className="text-[8px] text-gray-400 text-center mt-1">{activation.compliance_label}</div>
      </div>
    </div>
  );
};

export default SponsorActivationCard;
