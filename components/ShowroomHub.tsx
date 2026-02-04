import React, { useState } from 'react';
import { X, MapPin, Filter, Search, Trophy, Star, QrCode, ChevronRight } from 'lucide-react';
import { Showroom, ShowroomVenueType, ShowroomTier } from '../types';
import ShowroomCard from './ShowroomCard';

interface ShowroomHubProps {
  showrooms: Showroom[];
  userCheckedInShowrooms: string[];
  onClose: () => void;
  onCheckIn: (showroomId: string) => void;
}

const ShowroomHub: React.FC<ShowroomHubProps> = ({
  showrooms,
  userCheckedInShowrooms,
  onClose,
  onCheckIn
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState<ShowroomVenueType | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<ShowroomTier | 'all'>('all');
  const [selectedShowroom, setSelectedShowroom] = useState<Showroom | null>(null);

  const venueTypes: { value: ShowroomVenueType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Venues', icon: '🏠' },
    { value: 'coffee_shop', label: 'Coffee Shops', icon: '☕' },
    { value: 'sports_bar', label: 'Sports Bars', icon: '🍺' },
    { value: 'university', label: 'Universities', icon: '🎓' },
    { value: 'corporate', label: 'Corporate', icon: '🏢' },
    { value: 'stadium', label: 'Stadiums', icon: '🏟️' }
  ];

  const tiers: { value: ShowroomTier | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Tiers', icon: '⭐' },
    { value: 'platinum', label: 'Platinum', icon: '💎' },
    { value: 'gold', label: 'Gold', icon: '🥇' },
    { value: 'silver', label: 'Silver', icon: '🥈' },
    { value: 'bronze', label: 'Bronze', icon: '🥉' }
  ];

  const filteredShowrooms = showrooms.filter(showroom => {
    const matchesSearch = showroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showroom.location.sub_city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVenue = selectedVenueType === 'all' || showroom.venue_type === selectedVenueType;
    const matchesTier = selectedTier === 'all' || showroom.tier === selectedTier;
    return matchesSearch && matchesVenue && matchesTier;
  });

  const topShowrooms = [...showrooms].sort((a, b) => b.stats.total_members - a.stats.total_members).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-lg sm:rounded-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-pl-purple to-indigo-600 p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MapPin size={20} />
                Showroom Venues
              </h2>
              <p className="text-xs opacity-80">Check in at venues to earn XP & compete locally</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-100 p-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {venueTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedVenueType(type.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedVenueType === type.value
                    ? 'bg-pl-purple text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto mt-2 scrollbar-hide">
            {tiers.map(tier => (
              <button
                key={tier.value}
                onClick={() => setSelectedTier(tier.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedTier === tier.value
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tier.icon}</span>
                <span>{tier.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Featured Top Showrooms */}
          {searchTerm === '' && selectedVenueType === 'all' && selectedTier === 'all' && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                <Trophy size={14} className="text-yellow-500" />
                Top Showrooms in Addis
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {topShowrooms.map((showroom, index) => (
                  <div
                    key={showroom.showroom_id}
                    onClick={() => setSelectedShowroom(showroom)}
                    className="min-w-[140px] bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg p-3 border border-yellow-200 cursor-pointer hover:scale-105 transition"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                      <span className="text-xs font-bold text-gray-800 line-clamp-1">{showroom.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">{showroom.stats.total_members} members</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Showroom List */}
          <div className="grid gap-3">
            {filteredShowrooms.length > 0 ? (
              filteredShowrooms.map(showroom => (
                <ShowroomCard
                  key={showroom.showroom_id}
                  showroom={showroom}
                  onSelect={(s) => setSelectedShowroom(s)}
                  isCheckedIn={userCheckedInShowrooms.includes(showroom.showroom_id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No showrooms found</p>
                <p className="text-xs">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Showroom Detail Modal */}
        {selectedShowroom && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden animate-scale-in">
              <div
                className="h-24 relative"
                style={{
                  background: selectedShowroom.branding?.primary_color
                    ? `linear-gradient(135deg, ${selectedShowroom.branding.primary_color}, ${selectedShowroom.branding.secondary_color || '#000'})`
                    : 'linear-gradient(135deg, #667eea, #764ba2)'
                }}
              >
                <button
                  onClick={() => setSelectedShowroom(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/20 rounded-full text-white hover:bg-black/30"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h3 className="font-bold text-lg">{selectedShowroom.name}</h3>
                  <p className="text-xs opacity-80">{selectedShowroom.location.address}</p>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">{selectedShowroom.stats.total_members}</div>
                    <div className="text-xs text-blue-600/70">Total Members</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">#{selectedShowroom.stats.rank_in_city}</div>
                    <div className="text-xs text-green-600/70">City Ranking</div>
                  </div>
                </div>

                {/* Perks */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Member Perks</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" />
                      <span>+25 XP per check-in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-purple-500" />
                      <span>Exclusive showroom contests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <QrCode size={14} className="text-blue-500" />
                      <span>Easy QR code check-in</span>
                    </div>
                  </div>
                </div>

                {/* Check-in Button */}
                {userCheckedInShowrooms.includes(selectedShowroom.showroom_id) ? (
                  <div className="bg-green-100 text-green-700 text-sm font-bold py-3 rounded-lg text-center">
                    ✓ Already Checked In Today
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onCheckIn(selectedShowroom.showroom_id);
                      setSelectedShowroom(null);
                    }}
                    className="w-full bg-pl-purple text-white font-bold py-3 rounded-lg hover:bg-pl-purple/90 transition flex items-center justify-center gap-2"
                  >
                    <QrCode size={18} />
                    Check In Now
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowroomHub;
