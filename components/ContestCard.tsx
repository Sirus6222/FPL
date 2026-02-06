import React from 'react';
import { Trophy, Users, Clock, Coins, Lock, Gift, ChevronRight } from 'lucide-react';
import { Contest } from '../types';
import SponsorBrandBanner from './SponsorBrandBanner';

interface ContestCardProps {
  contest: Contest;
  userLevel: number;
  userCoins: number;
  onEnter: (contest: Contest) => void;
}

const contestTypeColors = {
  free: 'from-green-400 to-green-600',
  micro: 'from-blue-400 to-blue-600',
  standard: 'from-purple-400 to-purple-600',
  premium: 'from-orange-400 to-orange-600',
  elite: 'from-red-400 to-red-600',
  grand: 'from-yellow-400 to-yellow-600'
};

const contestTypeBadges = {
  free: '🆓',
  micro: '💵',
  standard: '⭐',
  premium: '💫',
  elite: '🔥',
  grand: '👑'
};

const ContestCard: React.FC<ContestCardProps> = ({ contest, userLevel, userCoins, onEnter }) => {
  const canEnter = (!contest.min_level || userLevel >= contest.min_level) &&
    userCoins >= contest.entry_fee_coins;
  const levelLocked = contest.min_level && userLevel < contest.min_level;

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(contest.end_time);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${mins}m`;
  };

  const fillPercentage = contest.max_entries > 0
    ? (contest.current_entries / contest.max_entries) * 100
    : 50;

  const topPrize = contest.prize_structure[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      {/* Header */}
      <div className={`bg-gradient-to-r ${contestTypeColors[contest.type]} p-3 text-white relative`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-lg">{contestTypeBadges[contest.type]}</span>
              <span className="text-[10px] uppercase font-bold opacity-80">{contest.type} Contest</span>
            </div>
            <h3 className="font-bold text-sm line-clamp-1">{contest.name}</h3>
          </div>
          {contest.sponsor && (
            <SponsorBrandBanner
              sponsorName={contest.sponsor.name}
              sponsorLogoUrl={contest.sponsor.logo_url}
              variant="badge"
            />
          )}
        </div>
        {contest.is_guaranteed && (
          <div className="mt-1.5 text-[10px] bg-white/20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full">
            <Gift size={10} />
            Guaranteed Prizes
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Prize & Entry */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">Top Prize</div>
            <div className="flex items-center gap-1">
              <Coins size={14} className="text-yellow-500" />
              <span className="text-sm font-bold text-gray-800">{topPrize.prize_coins.toLocaleString()}</span>
              {topPrize.prize_etb && (
                <span className="text-xs text-green-600 ml-1">+{topPrize.prize_etb} ETB</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase font-bold">Entry Fee</div>
            {contest.entry_fee_coins === 0 ? (
              <div className="text-sm font-bold text-green-600">FREE</div>
            ) : (
              <div className="flex items-center gap-1">
                <Coins size={12} className="text-yellow-500" />
                <span className="text-sm font-bold text-gray-800">{contest.entry_fee_coins}</span>
              </div>
            )}
          </div>
        </div>

        {/* Entries Progress */}
        <div>
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-gray-500 flex items-center gap-1">
              <Users size={10} />
              {contest.current_entries.toLocaleString()} entries
            </span>
            {contest.max_entries > 0 && (
              <span className="text-gray-400">Max {contest.max_entries.toLocaleString()}</span>
            )}
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pl-purple to-indigo-500 rounded-full transition-all"
              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock size={12} />
            <span>{getTimeRemaining()}</span>
          </div>
          {contest.min_level && (
            <div className={`flex items-center gap-1 ${levelLocked ? 'text-red-500' : 'text-gray-400'}`}>
              <Lock size={12} />
              <span>Level {contest.min_level}+</span>
            </div>
          )}
        </div>

        {/* Enter Button */}
        {levelLocked ? (
          <div className="bg-gray-100 text-gray-500 text-xs font-medium py-2.5 px-3 rounded-lg text-center flex items-center justify-center gap-1">
            <Lock size={14} />
            Unlock at Level {contest.min_level}
          </div>
        ) : !canEnter && contest.entry_fee_coins > 0 ? (
          <div className="bg-yellow-50 text-yellow-700 text-xs font-medium py-2.5 px-3 rounded-lg text-center">
            Need {contest.entry_fee_coins - userCoins} more coins
          </div>
        ) : (
          <button
            onClick={() => onEnter(contest)}
            className={`w-full text-white text-xs font-bold py-2.5 px-3 rounded-lg transition flex items-center justify-center gap-1 ${
              contest.entry_fee_coins === 0
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-pl-purple hover:bg-pl-purple/90'
            }`}
          >
            {contest.entry_fee_coins === 0 ? 'Enter Free' : `Enter for ${contest.entry_fee_coins} Coins`}
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
