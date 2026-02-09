import React, { useState, useEffect } from 'react';
import {
  X, Trophy, Users, ChevronDown, Home, Star, Shield,
  ArrowUp, ArrowDown, Minus, Crown, MapPin
} from 'lucide-react';
import type {
  ShowroomHubData, ShowroomHubMember, Showroom,
  ShowroomMembership, UserShowroomState
} from '../types';

interface ShowroomMatchdayHubProps {
  userShowroomState: UserShowroomState;
  hubData: ShowroomHubData | null;
  isLoading: boolean;
  onClose: () => void;
  onSwitchShowroom: (showroomId: string, mode: 'primary' | 'secondary') => void;
}

const ShowroomMatchdayHub: React.FC<ShowroomMatchdayHubProps> = ({
  userShowroomState,
  hubData,
  isLoading,
  onClose,
  onSwitchShowroom,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedShowroomId, setSelectedShowroomId] = useState<string | null>(
    userShowroomState.primary?.showroom?.showroom_id ?? null
  );

  // Build showroom options for dropdown
  const showroomOptions: {
    id: string;
    name: string;
    type: 'primary' | 'secondary';
    showroom: Showroom;
  }[] = [];

  if (userShowroomState.primary) {
    showroomOptions.push({
      id: userShowroomState.primary.showroom.showroom_id,
      name: userShowroomState.primary.showroom.name,
      type: 'primary',
      showroom: userShowroomState.primary.showroom,
    });
  }

  for (const sec of userShowroomState.secondaries) {
    showroomOptions.push({
      id: sec.showroom.showroom_id,
      name: sec.showroom.name,
      type: 'secondary',
      showroom: sec.showroom,
    });
  }

  const selectedOption = showroomOptions.find(o => o.id === selectedShowroomId);

  const handleSelectShowroom = (option: typeof showroomOptions[0]) => {
    setSelectedShowroomId(option.id);
    setDropdownOpen(false);
    onSwitchShowroom(option.id, option.type);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading hub data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-lg sm:rounded-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy size={20} />
                Matchday Hub
              </h2>
              <p className="text-xs opacity-80">Showroom rankings & rivalry</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Showroom Selector Dropdown */}
          {showroomOptions.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm hover:bg-white/20 transition"
              >
                <div className="flex items-center gap-2">
                  {selectedOption?.type === 'primary' ? (
                    <Home size={14} className="text-green-300" />
                  ) : (
                    <MapPin size={14} className="text-blue-300" />
                  )}
                  <span className="truncate">{selectedOption?.name ?? 'Select showroom'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedOption?.type === 'primary'
                      ? 'bg-green-500/30 text-green-200'
                      : 'bg-blue-500/30 text-blue-200'
                  }`}>
                    {selectedOption?.type === 'primary' ? 'HOME' : 'SECONDARY'}
                  </span>
                </div>
                <ChevronDown size={14} className={`transition ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                  {showroomOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectShowroom(option)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition text-sm ${
                        option.id === selectedShowroomId ? 'bg-indigo-50' : ''
                      }`}
                    >
                      {option.type === 'primary' ? (
                        <Home size={12} className="text-green-600" />
                      ) : (
                        <MapPin size={12} className="text-blue-600" />
                      )}
                      <span className="text-gray-800 flex-1 truncate">{option.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        option.type === 'primary'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {option.type === 'primary' ? 'HOME' : 'SECONDARY'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rivalry Contribution Banner */}
        {hubData && (
          <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${
            hubData.contributes_to_rivalry
              ? 'bg-green-50 text-green-700 border-b border-green-100'
              : 'bg-blue-50 text-blue-600 border-b border-blue-100'
          }`}>
            <Shield size={12} />
            {hubData.contributes_to_rivalry
              ? 'This is your Home Showroom. Your points count toward city rivalry.'
              : 'Secondary showroom. Points here do NOT count toward city rivalry.'
            }
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {hubData ? (
            <>
              {/* Showroom Stats Summary */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-lg font-bold text-indigo-600">{hubData.weekly_score.toFixed(1)}</div>
                  <div className="text-[10px] text-gray-500">Weekly Score</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-lg font-bold text-yellow-600">
                    {hubData.city_rank ? `#${hubData.city_rank}` : '-'}
                  </div>
                  <div className="text-[10px] text-gray-500">City Rank</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-lg font-bold text-green-600">{hubData.members.length}</div>
                  <div className="text-[10px] text-gray-500">Active</div>
                </div>
              </div>

              {/* Member Rankings */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                  <Users size={14} />
                  Member Rankings
                </h3>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Header row */}
                  <div className="grid grid-cols-[40px_1fr_60px_60px] bg-gray-50 px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">
                    <span>Rank</span>
                    <span>Manager</span>
                    <span className="text-right">GW Pts</span>
                    <span className="text-right">Type</span>
                  </div>

                  {/* Member rows */}
                  {hubData.members.length > 0 ? (
                    hubData.members.map((member, index) => (
                      <MemberRow key={member.user_id} member={member} index={index} />
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-400">
                      No active members yet
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Trophy size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No hub data available</p>
              <p className="text-xs text-gray-400">Join a showroom to see matchday data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Member Row Sub-component
// ==========================================

const MemberRow: React.FC<{ member: ShowroomHubMember; index: number }> = ({ member, index }) => {
  const isTopThree = member.rank <= 3;
  const rankIcons = ['', '🥇', '🥈', '🥉'];

  return (
    <div className={`grid grid-cols-[40px_1fr_60px_60px] items-center px-3 py-2.5 border-b border-gray-50 last:border-0 ${
      isTopThree ? 'bg-yellow-50/50' : ''
    }`}>
      {/* Rank */}
      <div className="text-xs font-bold text-gray-800">
        {isTopThree ? (
          <span className="text-base">{rankIcons[member.rank]}</span>
        ) : (
          <span>{member.rank}</span>
        )}
      </div>

      {/* Name + avatar */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
          {member.display_name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs text-gray-800 truncate">{member.display_name}</span>
        {member.rank === 1 && <Crown size={10} className="text-yellow-500 flex-shrink-0" />}
      </div>

      {/* GW Points */}
      <div className="text-right">
        <span className="text-xs font-bold text-gray-800">{member.gameweek_points}</span>
        {member.rank_change !== 0 && (
          <span className={`text-[9px] ml-0.5 ${member.rank_change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {member.rank_change > 0 ? (
              <ArrowUp size={8} className="inline" />
            ) : (
              <ArrowDown size={8} className="inline" />
            )}
          </span>
        )}
      </div>

      {/* Membership Type */}
      <div className="text-right">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
          member.is_primary_member
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-600'
        }`}>
          {member.is_primary_member ? 'HOME' : 'SEC'}
        </span>
      </div>
    </div>
  );
};

export default ShowroomMatchdayHub;
