import React from 'react';
import { MapPin, Users, Trophy, QrCode, Wifi, Star, Clock } from 'lucide-react';
import { Showroom } from '../types';

interface ShowroomCardProps {
  showroom: Showroom;
  onSelect: (showroom: Showroom) => void;
  isCheckedIn?: boolean;
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-700'
};

const tierBadges = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎'
};

const ShowroomCard: React.FC<ShowroomCardProps> = ({ showroom, onSelect, isCheckedIn = false }) => {
  const venueTypeLabel = {
    coffee_shop: '☕ Coffee Shop',
    sports_bar: '🍺 Sports Bar',
    betting_shop: '🎲 Betting Shop',
    university: '🎓 University',
    corporate: '🏢 Corporate',
    stadium: '🏟️ Stadium'
  };

  return (
    <div
      onClick={() => onSelect(showroom)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header with tier gradient */}
      <div className={`bg-gradient-to-r ${tierColors[showroom.tier]} p-3 text-white relative`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs opacity-80 flex items-center gap-1">
              {venueTypeLabel[showroom.venue_type]}
            </div>
            <h3 className="font-bold text-sm mt-0.5 line-clamp-1">{showroom.name}</h3>
          </div>
          <div className="text-2xl">{tierBadges[showroom.tier]}</div>
        </div>
        {showroom.branding?.sponsor_name && (
          <div className="mt-2 text-[10px] bg-white/20 inline-block px-2 py-0.5 rounded-full">
            Sponsored by {showroom.branding.sponsor_name}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-xs">{showroom.location.sub_city}, {showroom.location.city}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Users size={14} className="mx-auto text-blue-500 mb-0.5" />
            <div className="text-xs font-bold text-gray-800">{showroom.stats.total_members}</div>
            <div className="text-[9px] text-gray-500">Members</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Trophy size={14} className="mx-auto text-yellow-500 mb-0.5" />
            <div className="text-xs font-bold text-gray-800">#{showroom.stats.rank_in_city}</div>
            <div className="text-[9px] text-gray-500">City Rank</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Star size={14} className="mx-auto text-purple-500 mb-0.5" />
            <div className="text-xs font-bold text-gray-800">{showroom.stats.active_this_week}</div>
            <div className="text-[9px] text-gray-500">Active</div>
          </div>
        </div>

        {/* Verification Method */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            {showroom.verification.method === 'qr_scan' ? (
              <>
                <QrCode size={12} />
                <span>QR Check-in</span>
              </>
            ) : (
              <>
                <Wifi size={12} />
                <span>WiFi Check-in</span>
              </>
            )}
          </div>
          {showroom.operating_hours && (
            <div className="flex items-center gap-1 text-gray-400">
              <Clock size={10} />
              <span className="text-[10px]">{showroom.operating_hours.open} - {showroom.operating_hours.close}</span>
            </div>
          )}
        </div>

        {/* Check-in Status */}
        {isCheckedIn ? (
          <div className="bg-green-50 text-green-700 text-xs font-bold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1">
            ✓ Checked In Today
          </div>
        ) : (
          <button className="w-full bg-pl-purple text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-pl-purple/90 transition group-hover:scale-[1.02]">
            Check In Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ShowroomCard;
