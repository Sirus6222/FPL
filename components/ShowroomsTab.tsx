import React, { useState, useCallback } from 'react';
import {
  MapPin, Home, Plus, Trophy, Shield, Search, QrCode,
  ChevronRight, RefreshCw, Info
} from 'lucide-react';
import type {
  UserShowroomState, Showroom, ShowroomHubData, ShowroomMembershipType
} from '../types';
import { SHOWROOM_SLOT_PRICING } from '../types';
import { PrimaryShowroomCard, SecondaryShowroomCard, LockedSlotCard, EmptySlotCard } from './ShowroomSlotCard';
import ShowroomMatchdayHub from './ShowroomMatchdayHub';

interface ShowroomsTabProps {
  userShowroomState: UserShowroomState | null;
  userLevel: number;
  userCoins: number;
  hasCheckedInToday: boolean;
  isLoading: boolean;

  // Actions
  onJoinShowroom: (showroomId: string, via: 'qr_scan' | 'invite_link' | 'geo_suggest') => void;
  onLeaveShowroom: (showroomId: string) => void;
  onSetPrimary: (showroomId: string) => void;
  onUnlockSlot: (slotIndex: 1 | 2, method: 'LEVEL' | 'PURCHASE') => void;
  onCheckin: (showroomId: string) => void;
  onOpenShowroomBrowser: () => void;
  onOpenQRScanner: () => void;

  // Hub data
  hubData: ShowroomHubData | null;
  onLoadHubData: (showroomId: string, mode: 'primary' | 'secondary') => void;
}

const ShowroomsTab: React.FC<ShowroomsTabProps> = ({
  userShowroomState,
  userLevel,
  userCoins,
  hasCheckedInToday,
  isLoading,
  onJoinShowroom,
  onLeaveShowroom,
  onSetPrimary,
  onUnlockSlot,
  onCheckin,
  onOpenShowroomBrowser,
  onOpenQRScanner,
  hubData,
  onLoadHubData,
}) => {
  const [showMatchdayHub, setShowMatchdayHub] = useState(false);
  const [hubLoading, setHubLoading] = useState(false);

  const hasPrimary = !!userShowroomState?.primary;
  const secondaries = userShowroomState?.secondaries ?? [];
  const slot1 = userShowroomState?.slots.slot_1;
  const slot2 = userShowroomState?.slots.slot_2;

  // Check if primary cooldown is active
  const primaryCooldownActive = userShowroomState?.primary?.switch_locked_until
    ? new Date(userShowroomState.primary.switch_locked_until) > new Date()
    : false;

  const handleViewHub = useCallback((showroomId: string) => {
    const isPrimary = userShowroomState?.primary?.showroom?.showroom_id === showroomId;
    setHubLoading(true);
    onLoadHubData(showroomId, isPrimary ? 'primary' : 'secondary');
    setShowMatchdayHub(true);
    setTimeout(() => setHubLoading(false), 1000);
  }, [userShowroomState, onLoadHubData]);

  const handleSwitchHubShowroom = useCallback((showroomId: string, mode: 'primary' | 'secondary') => {
    onLoadHubData(showroomId, mode);
  }, [onLoadHubData]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw size={32} className="mx-auto mb-3 text-indigo-400 animate-spin" />
          <p className="text-sm text-gray-500">Loading your showrooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <MapPin size={20} />
              My Showrooms
            </h1>
            <p className="text-xs opacity-80">Manage your showroom memberships</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenQRScanner}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              title="Scan QR to join"
            >
              <QrCode size={18} />
            </button>
            <button
              onClick={onOpenShowroomBrowser}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              title="Browse showrooms"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Rivalry info banner */}
        <div className="bg-white/10 rounded-lg p-2.5 flex items-start gap-2 mt-2">
          <Shield size={14} className="text-green-300 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] opacity-90 leading-relaxed">
            Only your <strong>Home Showroom</strong> counts toward city rivalry scoring.
            Secondary showrooms give you access to additional hubs and leaderboards.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ==========================================
            PRIMARY SHOWROOM SECTION
            ========================================== */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Home size={14} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-800">Home Showroom</h2>
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
              PRIMARY
            </span>
          </div>

          {hasPrimary && userShowroomState?.primary ? (
            <PrimaryShowroomCard
              membership={userShowroomState.primary}
              onViewHub={handleViewHub}
              onCheckin={onCheckin}
              hasCheckedInToday={hasCheckedInToday}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-green-200 p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Home size={24} className="text-green-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">No Home Showroom Yet</h3>
              <p className="text-xs text-gray-500 mb-3">
                Join a showroom to make it your Home. Your first showroom automatically becomes your primary.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={onOpenQRScanner}
                  className="bg-green-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                >
                  <QrCode size={14} />
                  Scan QR Code
                </button>
                <button
                  onClick={onOpenShowroomBrowser}
                  className="bg-gray-100 text-gray-700 text-xs font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                >
                  <Search size={14} />
                  Browse
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ==========================================
            SECONDARY SHOWROOMS SECTION
            ========================================== */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-blue-600" />
            <h2 className="text-sm font-bold text-gray-800">Secondary Showrooms</h2>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
              OPTIONAL
            </span>
          </div>

          <div className="space-y-3">
            {/* Slot 1 */}
            {secondaries.find(s => s.slot_index === 1) ? (
              <SecondaryShowroomCard
                membership={secondaries.find(s => s.slot_index === 1)!}
                slotIndex={1}
                onViewHub={handleViewHub}
                onLeave={onLeaveShowroom}
                onPromoteToPrimary={onSetPrimary}
                canPromote={!primaryCooldownActive}
              />
            ) : slot1?.is_unlocked ? (
              <EmptySlotCard slotIndex={1} onBrowseShowrooms={onOpenShowroomBrowser} />
            ) : (
              <LockedSlotCard
                slotIndex={1}
                slot={slot1}
                userLevel={userLevel}
                userCoins={userCoins}
                onUnlockByLevel={(s) => onUnlockSlot(s, 'LEVEL')}
                onUnlockByPurchase={(s) => onUnlockSlot(s, 'PURCHASE')}
                onBrowseShowrooms={onOpenShowroomBrowser}
              />
            )}

            {/* Slot 2 */}
            {secondaries.find(s => s.slot_index === 2) ? (
              <SecondaryShowroomCard
                membership={secondaries.find(s => s.slot_index === 2)!}
                slotIndex={2}
                onViewHub={handleViewHub}
                onLeave={onLeaveShowroom}
                onPromoteToPrimary={onSetPrimary}
                canPromote={!primaryCooldownActive}
              />
            ) : slot2?.is_unlocked ? (
              <EmptySlotCard slotIndex={2} onBrowseShowrooms={onOpenShowroomBrowser} />
            ) : (
              <LockedSlotCard
                slotIndex={2}
                slot={slot2}
                userLevel={userLevel}
                userCoins={userCoins}
                onUnlockByLevel={(s) => onUnlockSlot(s, 'LEVEL')}
                onUnlockByPurchase={(s) => onUnlockSlot(s, 'PURCHASE')}
                onBrowseShowrooms={onOpenShowroomBrowser}
              />
            )}
          </div>
        </section>

        {/* ==========================================
            SLOT INFO SECTION
            ========================================== */}
        <section className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={12} className="text-gray-400" />
            <h3 className="text-xs font-bold text-gray-600">How Showroom Slots Work</h3>
          </div>
          <ul className="space-y-1.5 text-[10px] text-gray-500">
            <li className="flex items-start gap-1.5">
              <span className="text-green-500 font-bold">1.</span>
              Your <strong>Home</strong> showroom is your primary. It contributes to city rivalry.
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-500 font-bold">2.</span>
              <strong>Secondary</strong> slots give access to extra hubs & leaderboards.
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-purple-500 font-bold">3.</span>
              Unlock Secondary #1 at <strong>Level {SHOWROOM_SLOT_PRICING.slot_1.level_requirement}</strong> or <strong>{SHOWROOM_SLOT_PRICING.slot_1.coin_price} coins</strong>.
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-500 font-bold">4.</span>
              Unlock Secondary #2 at <strong>Level {SHOWROOM_SLOT_PRICING.slot_2.level_requirement}</strong> or <strong>{SHOWROOM_SLOT_PRICING.slot_2.coin_price} coins</strong>.
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-orange-500 font-bold">5.</span>
              Home switch cooldown: <strong>30 days</strong>. Secondary: <strong>7 days</strong>.
            </li>
          </ul>
        </section>
      </div>

      {/* Matchday Hub Modal */}
      {showMatchdayHub && userShowroomState && (
        <ShowroomMatchdayHub
          userShowroomState={userShowroomState}
          hubData={hubData}
          isLoading={hubLoading}
          onClose={() => setShowMatchdayHub(false)}
          onSwitchShowroom={handleSwitchHubShowroom}
        />
      )}
    </div>
  );
};

export default ShowroomsTab;
