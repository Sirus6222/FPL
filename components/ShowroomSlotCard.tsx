import React from 'react';
import {
  Home, MapPin, Users, Trophy, Lock, Unlock, ChevronRight, Coins, ArrowUpRight, Clock, Shield
} from 'lucide-react';
import type {
  Showroom, ShowroomMembership, ShowroomSlot, ShowroomMembershipType
} from '../types';
import { SHOWROOM_SLOT_PRICING } from '../types';

// ==========================================
// Slot Card Types
// ==========================================

interface PrimaryShowroomCardProps {
  membership: ShowroomMembership & { showroom: Showroom };
  onViewHub: (showroomId: string) => void;
  onCheckin: (showroomId: string) => void;
  hasCheckedInToday: boolean;
}

interface SecondaryShowroomCardProps {
  membership: ShowroomMembership & { showroom: Showroom };
  slotIndex: 1 | 2;
  onViewHub: (showroomId: string) => void;
  onLeave: (showroomId: string) => void;
  onPromoteToPrimary: (showroomId: string) => void;
  canPromote: boolean; // false if primary cooldown active
}

interface LockedSlotCardProps {
  slotIndex: 1 | 2;
  slot: ShowroomSlot | null;
  userLevel: number;
  userCoins: number;
  onUnlockByLevel: (slotIndex: 1 | 2) => void;
  onUnlockByPurchase: (slotIndex: 1 | 2) => void;
  onBrowseShowrooms: () => void;
}

interface EmptySlotCardProps {
  slotIndex: 1 | 2;
  onBrowseShowrooms: () => void;
}

// ==========================================
// Tier badge styling
// ==========================================

const tierConfig = {
  bronze: { gradient: 'from-amber-600 to-amber-800', badge: 'bg-amber-100 text-amber-800' },
  silver: { gradient: 'from-gray-400 to-gray-600', badge: 'bg-gray-100 text-gray-700' },
  gold: { gradient: 'from-yellow-400 to-yellow-600', badge: 'bg-yellow-100 text-yellow-800' },
  platinum: { gradient: 'from-purple-400 to-purple-700', badge: 'bg-purple-100 text-purple-800' },
};

// ==========================================
// Primary Showroom Card (HOME)
// ==========================================

export const PrimaryShowroomCard: React.FC<PrimaryShowroomCardProps> = ({
  membership, onViewHub, onCheckin, hasCheckedInToday
}) => {
  const { showroom } = membership;
  const tier = tierConfig[showroom.tier] || tierConfig.bronze;

  return (
    <div className="bg-white rounded-2xl shadow-md border-2 border-green-200 overflow-hidden">
      {/* HOME badge header */}
      <div className={`bg-gradient-to-r ${tier.gradient} p-4 text-white relative`}>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Home size={10} />
          HOME
        </div>
        <div className="flex items-center gap-3">
          {showroom.logo_url ? (
            <img src={showroom.logo_url} alt="" className="w-12 h-12 rounded-xl bg-white/20 object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              {showroom.venue_type === 'coffee_shop' ? '☕' :
               showroom.venue_type === 'sports_bar' ? '🍺' :
               showroom.venue_type === 'university' ? '🎓' :
               showroom.venue_type === 'corporate' ? '🏢' :
               showroom.venue_type === 'stadium' ? '🏟️' : '🏠'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{showroom.name}</h3>
            <div className="flex items-center gap-1 text-xs opacity-80 mt-0.5">
              <MapPin size={10} />
              <span>{showroom.sub_city ? `${showroom.sub_city}, ` : ''}{showroom.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats + rivalry badge */}
      <div className="p-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-3 flex items-center gap-2">
          <Shield size={14} className="text-green-600 flex-shrink-0" />
          <span className="text-xs text-green-700 font-medium">
            This is your Home Showroom. It counts toward city rivalry.
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Users size={12} className="mx-auto text-blue-500 mb-0.5" />
            <div className="text-xs font-bold text-gray-800">{showroom.member_count}</div>
            <div className="text-[9px] text-gray-500">Members</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Trophy size={12} className="mx-auto text-yellow-500 mb-0.5" />
            <div className="text-xs font-bold text-gray-800">
              {showroom.city_rank ? `#${showroom.city_rank}` : '-'}
            </div>
            <div className="text-[9px] text-gray-500">City Rank</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Trophy size={12} className="mx-auto text-purple-500 mb-0.5" />
            <div className="text-xs font-bold text-gray-800">{showroom.weekly_score?.toFixed(1) ?? '0'}</div>
            <div className="text-[9px] text-gray-500">Weekly</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewHub(showroom.showroom_id)}
            className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-1"
          >
            Matchday Hub
            <ChevronRight size={14} />
          </button>
          {hasCheckedInToday ? (
            <div className="bg-green-100 text-green-700 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center gap-1">
              Checked In
            </div>
          ) : (
            <button
              onClick={() => onCheckin(showroom.showroom_id)}
              className="bg-green-600 text-white text-xs font-bold py-2.5 px-3 rounded-lg hover:bg-green-700 transition"
            >
              Check In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Secondary Showroom Card
// ==========================================

export const SecondaryShowroomCard: React.FC<SecondaryShowroomCardProps> = ({
  membership, slotIndex, onViewHub, onLeave, onPromoteToPrimary, canPromote
}) => {
  const { showroom } = membership;
  const tier = tierConfig[showroom.tier] || tierConfig.bronze;
  const isOnCooldown = membership.switch_locked_until &&
    new Date(membership.switch_locked_until) > new Date();

  const cooldownDaysLeft = isOnCooldown
    ? Math.ceil((new Date(membership.switch_locked_until!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${tier.gradient} p-3 text-white relative`}>
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          SECONDARY #{slotIndex}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-lg">
            {showroom.venue_type === 'coffee_shop' ? '☕' :
             showroom.venue_type === 'sports_bar' ? '🍺' :
             showroom.venue_type === 'university' ? '🎓' :
             showroom.venue_type === 'corporate' ? '🏢' :
             showroom.venue_type === 'stadium' ? '🏟️' : '🏠'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate">{showroom.name}</h4>
            <div className="text-[10px] opacity-80 flex items-center gap-1">
              <MapPin size={8} />
              {showroom.sub_city ? `${showroom.sub_city}, ` : ''}{showroom.city}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-2 text-[10px] text-blue-600">
          Secondary showrooms do not count toward city rivalry scoring.
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-1.5 text-center">
            <div className="text-xs font-bold text-gray-800">{showroom.member_count}</div>
            <div className="text-[9px] text-gray-500">Members</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-1.5 text-center">
            <div className="text-xs font-bold text-gray-800">{showroom.weekly_score?.toFixed(1) ?? '0'}</div>
            <div className="text-[9px] text-gray-500">Weekly Score</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewHub(showroom.showroom_id)}
            className="flex-1 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Hub
          </button>
          {canPromote && (
            <button
              onClick={() => onPromoteToPrimary(showroom.showroom_id)}
              className="bg-green-100 text-green-700 text-[10px] font-bold py-2 px-2 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
              title="Make this your Home Showroom"
            >
              <ArrowUpRight size={12} />
            </button>
          )}
          <button
            onClick={() => onLeave(showroom.showroom_id)}
            className="bg-red-50 text-red-600 text-[10px] font-bold py-2 px-2 rounded-lg hover:bg-red-100 transition"
          >
            Leave
          </button>
        </div>

        {isOnCooldown && (
          <div className="mt-2 bg-orange-50 border border-orange-100 rounded-lg p-2 flex items-center gap-1.5">
            <Clock size={10} className="text-orange-500" />
            <span className="text-[10px] text-orange-600">
              Slot on cooldown: {cooldownDaysLeft} day{cooldownDaysLeft !== 1 ? 's' : ''} remaining
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// Locked Slot Card
// ==========================================

export const LockedSlotCard: React.FC<LockedSlotCardProps> = ({
  slotIndex, slot, userLevel, userCoins, onUnlockByLevel, onUnlockByPurchase, onBrowseShowrooms
}) => {
  const pricing = slotIndex === 1 ? SHOWROOM_SLOT_PRICING.slot_1 : SHOWROOM_SLOT_PRICING.slot_2;
  const isUnlocked = slot?.is_unlocked === true;
  const meetsLevelRequirement = userLevel >= pricing.level_requirement;
  const canAfford = userCoins >= pricing.coin_price;

  // If slot is unlocked but no showroom assigned, show "empty" state
  if (isUnlocked) {
    return <EmptySlotCard slotIndex={slotIndex} onBrowseShowrooms={onBrowseShowrooms} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-90">
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-3 text-white relative">
        <div className="absolute top-2 right-2 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Lock size={8} />
          LOCKED
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Lock size={18} className="text-white/70" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Secondary Slot #{slotIndex}</h4>
            <p className="text-[10px] opacity-80">Unlock to join another showroom</p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {/* Unlock via Level */}
        <button
          onClick={() => onUnlockByLevel(slotIndex)}
          disabled={!meetsLevelRequirement}
          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition ${
            meetsLevelRequirement
              ? 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer'
              : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Unlock size={14} className={meetsLevelRequirement ? 'text-green-600' : 'text-gray-400'} />
            <div className="text-left">
              <div className="text-xs font-bold text-gray-800">Unlock via Level</div>
              <div className="text-[10px] text-gray-500">
                {meetsLevelRequirement
                  ? 'You meet the requirement!'
                  : `Reach Level ${pricing.level_requirement} (currently ${userLevel})`
                }
              </div>
            </div>
          </div>
          {meetsLevelRequirement && (
            <span className="text-xs font-bold text-green-600">FREE</span>
          )}
        </button>

        {/* Unlock via Purchase */}
        <button
          onClick={() => onUnlockByPurchase(slotIndex)}
          disabled={!canAfford}
          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition ${
            canAfford
              ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 cursor-pointer'
              : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Coins size={14} className={canAfford ? 'text-yellow-600' : 'text-gray-400'} />
            <div className="text-left">
              <div className="text-xs font-bold text-gray-800">Buy with Coins</div>
              <div className="text-[10px] text-gray-500">
                {canAfford
                  ? `${pricing.coin_price} coins (~${pricing.birr_equivalent} Birr)`
                  : `Need ${pricing.coin_price} coins (you have ${userCoins})`
                }
              </div>
            </div>
          </div>
          <span className={`text-xs font-bold ${canAfford ? 'text-yellow-600' : 'text-gray-400'}`}>
            {pricing.coin_price}
          </span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// Empty Slot Card (unlocked but no showroom)
// ==========================================

export const EmptySlotCard: React.FC<EmptySlotCardProps> = ({ slotIndex, onBrowseShowrooms }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-purple-200 overflow-hidden">
      <div className="p-4 text-center">
        <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
          <MapPin size={18} className="text-purple-500" />
        </div>
        <h4 className="text-sm font-bold text-gray-800 mb-1">Secondary Slot #{slotIndex}</h4>
        <p className="text-xs text-gray-500 mb-3">Unlocked! Join a showroom to fill this slot.</p>
        <button
          onClick={onBrowseShowrooms}
          className="bg-purple-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-1 mx-auto"
        >
          Browse Showrooms
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default PrimaryShowroomCard;
