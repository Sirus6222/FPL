import React, { useState } from 'react';
import { X, Trophy, Filter, Coins, Gift, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { Contest, ContestType } from '../types';
import ContestCard from './ContestCard';

interface ContestHubProps {
  contests: Contest[];
  userLevel: number;
  userCoins: number;
  onClose: () => void;
  onEnterContest: (contest: Contest) => void;
}

const ContestHub: React.FC<ContestHubProps> = ({
  contests,
  userLevel,
  userCoins,
  onClose,
  onEnterContest
}) => {
  const [selectedType, setSelectedType] = useState<ContestType | 'all'>('all');
  const [confirmContest, setConfirmContest] = useState<Contest | null>(null);

  const contestTypes: { value: ContestType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '🏆' },
    { value: 'free', label: 'Free', icon: '🆓' },
    { value: 'micro', label: 'Micro', icon: '💵' },
    { value: 'standard', label: 'Standard', icon: '⭐' },
    { value: 'premium', label: 'Premium', icon: '💫' },
    { value: 'elite', label: 'Elite', icon: '🔥' },
    { value: 'grand', label: 'Grand', icon: '👑' }
  ];

  const filteredContests = contests.filter(
    contest => selectedType === 'all' || contest.type === selectedType
  );

  const activeContests = filteredContests.filter(c => c.status === 'active');
  const upcomingContests = filteredContests.filter(c => c.status === 'upcoming');

  const totalPrizePool = contests.reduce((sum, c) => {
    return sum + c.prize_structure.reduce((ps, p) => ps + p.prize_coins, 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-lg sm:rounded-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy size={20} />
                Contests
              </h2>
              <p className="text-xs opacity-80">Compete for guaranteed prizes</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold">{contests.length}</div>
              <div className="text-[10px] opacity-80">Active</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold flex items-center justify-center gap-1">
                <Coins size={14} />
                {(totalPrizePool / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] opacity-80">Total Prizes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold">{userCoins.toLocaleString()}</div>
              <div className="text-[10px] opacity-80">Your Coins</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-100 p-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {contestTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedType === type.value
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* How it Works Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <h3 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1">
              <Gift size={14} />
              How Contests Work
            </h3>
            <ul className="text-[10px] text-blue-700 space-y-0.5">
              <li>• Enter contests using coins (some are free!)</li>
              <li>• Compete based on your gameweek performance</li>
              <li>• Top performers win guaranteed prizes</li>
              <li>• Higher tiers = bigger prizes, higher stakes</li>
            </ul>
          </div>

          {/* Active Contests */}
          {activeContests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                <Trophy size={14} className="text-green-500" />
                Active Now ({activeContests.length})
              </h3>
              <div className="space-y-3">
                {activeContests.map(contest => (
                  <ContestCard
                    key={contest.contest_id}
                    contest={contest}
                    userLevel={userLevel}
                    userCoins={userCoins}
                    onEnter={(c) => setConfirmContest(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Contests */}
          {upcomingContests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                <AlertCircle size={14} className="text-blue-500" />
                Coming Soon ({upcomingContests.length})
              </h3>
              <div className="space-y-3">
                {upcomingContests.map(contest => (
                  <ContestCard
                    key={contest.contest_id}
                    contest={contest}
                    userLevel={userLevel}
                    userCoins={userCoins}
                    onEnter={(c) => setConfirmContest(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredContests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No contests found</p>
              <p className="text-xs">Check back soon for new contests!</p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmContest && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-4 animate-scale-in">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Entry</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter <span className="font-bold">{confirmContest.name}</span>?
              </p>

              {/* Cost & Prize Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entry Fee:</span>
                  <span className="font-bold flex items-center gap-1">
                    {confirmContest.entry_fee_coins === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <>
                        <Coins size={14} className="text-yellow-500" />
                        {confirmContest.entry_fee_coins}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Top Prize:</span>
                  <span className="font-bold flex items-center gap-1">
                    <Coins size={14} className="text-yellow-500" />
                    {confirmContest.prize_structure[0].prize_coins.toLocaleString()}
                    {confirmContest.prize_structure[0].prize_etb && (
                      <span className="text-green-600">+{confirmContest.prize_structure[0].prize_etb} ETB</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Your Balance After:</span>
                  <span className="font-bold flex items-center gap-1">
                    <Coins size={14} className="text-yellow-500" />
                    {(userCoins - confirmContest.entry_fee_coins).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Rules */}
              {confirmContest.contest_rules && confirmContest.contest_rules.length > 0 && (
                <div className="text-[10px] text-gray-500 mb-4">
                  {confirmContest.contest_rules.map((rule, i) => (
                    <div key={i}>• {rule}</div>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmContest(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onEnterContest(confirmContest);
                    setConfirmContest(null);
                  }}
                  className="flex-1 py-2.5 bg-pl-purple text-white font-bold rounded-lg hover:bg-pl-purple/90 transition flex items-center justify-center gap-1"
                >
                  Confirm Entry
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestHub;
