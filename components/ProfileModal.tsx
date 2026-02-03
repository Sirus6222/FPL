import React, { useState } from 'react';
import { X, Trophy, Shield, Medal, Lock, Star, ChevronRight, User, Coins, Check } from 'lucide-react';
import { LEVELS_CONFIG, MOCK_BADGES, MOCK_AVATARS } from '../constants';
import { Badge, AvatarItem } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  xp: number;
  coins?: number;
  selectedAvatarId?: string;
  onAvatarSelect?: (avatarId: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, level, xp, coins = 0, selectedAvatarId = 'av1', onAvatarSelect }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Badges' | 'Avatars'>('Overview');

  if (!isOpen) return null;

  const currentLevelInfo = LEVELS_CONFIG.find(l => l.level === level) || LEVELS_CONFIG[0];
  const nextLevelInfo = LEVELS_CONFIG.find(l => l.level > level);
  const selectedAvatar = MOCK_AVATARS.find(a => a.id === selectedAvatarId) || MOCK_AVATARS[0];

  // XP Progress Calculation
  const minXp = currentLevelInfo.min_xp;
  const maxXp = currentLevelInfo.max_xp;
  const progress = Math.min(100, Math.max(0, ((xp - minXp) / (maxXp - minXp)) * 100));

  const getIcon = (iconName: string) => {
      switch(iconName) {
          case 'Trophy': return <Trophy size={24} />;
          case 'Shield': return <Shield size={24} />;
          case 'Medal': return <Medal size={24} />;
          case 'Star': return <Star size={24} />;
          default: return <Star size={24} />;
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-pl-purple p-6 text-center relative text-white">
             <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
                <X size={20} />
             </button>
             <div className="w-20 h-20 mx-auto bg-white rounded-full p-1 mb-3 relative">
                 <img src={selectedAvatar.url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                 <div className="absolute -bottom-2 -right-2 bg-pl-green text-pl-purple font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-xs">
                     {level}
                 </div>
             </div>
             <h2 className="text-xl font-bold">{currentLevelInfo.title}</h2>
             <div className="flex items-center justify-center gap-4 mt-2">
                 <div className="text-sm opacity-80">{xp.toLocaleString()} XP</div>
                 <div className="flex items-center gap-1 bg-yellow-500/30 px-2 py-0.5 rounded-full">
                     <Coins size={12} className="text-yellow-300" />
                     <span className="text-xs font-bold text-yellow-300">{coins.toLocaleString()}</span>
                 </div>
             </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100">
             {['Overview', 'Badges', 'Avatars'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-3 text-sm font-bold transition ${activeTab === tab ? 'text-pl-purple border-b-2 border-pl-purple' : 'text-gray-400'}`}
                 >
                     {tab}
                 </button>
             ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
            
            {/* Overview Tab */}
            {activeTab === 'Overview' && (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500">Progress to Level {nextLevelInfo?.level || level + 1}</span>
                            <span className="text-xs font-bold text-pl-purple">{Math.floor(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-pl-green h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-400 text-right">
                            {Math.max(0, maxXp - xp)} XP needed
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3">Next Level Rewards</h3>
                        {nextLevelInfo ? (
                             <div className="space-y-2">
                                {nextLevelInfo.rewards.map((reward, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                            <GiftIcon reward={reward} />
                                        </div>
                                        <div className="text-sm font-medium text-gray-700">{reward}</div>
                                    </div>
                                ))}
                             </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-4">Max Level Reached!</div>
                        )}
                    </div>
                </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'Badges' && (
                <div className="grid grid-cols-2 gap-3">
                    {MOCK_BADGES.map((badge, idx) => (
                        <div key={badge.id} className={`bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center ${idx > 1 ? 'opacity-50 grayscale' : ''}`}>
                            <div className={`mb-2 ${idx > 1 ? 'text-gray-400' : badge.color}`}>
                                {getIcon(badge.icon)}
                            </div>
                            <div className="font-bold text-sm text-gray-800">{badge.name}</div>
                            <div className="text-[10px] text-gray-500 mt-1">{badge.description}</div>
                            {idx > 1 && <div className="mt-2"><Lock size={12} className="text-gray-400"/></div>}
                        </div>
                    ))}
                </div>
            )}

            {/* Avatars Tab */}
            {activeTab === 'Avatars' && (
                <div className="grid grid-cols-3 gap-3">
                    {MOCK_AVATARS.map((avatar) => {
                        const isLocked = level < avatar.min_level;
                        const isSelected = avatar.id === selectedAvatarId;
                        return (
                            <button
                                key={avatar.id}
                                onClick={() => !isLocked && onAvatarSelect && onAvatarSelect(avatar.id)}
                                disabled={isLocked}
                                className="relative flex flex-col items-center focus:outline-none"
                            >
                                <div className={`w-16 h-16 rounded-full p-1 border-2 relative ${
                                    isLocked
                                        ? 'border-gray-200 bg-gray-100 opacity-70'
                                        : isSelected
                                            ? 'border-pl-green ring-2 ring-pl-green ring-offset-2'
                                            : 'border-pl-purple cursor-pointer hover:scale-105 transition'
                                }`}>
                                    <img src={avatar.url} alt={avatar.name} className={`w-full h-full rounded-full object-cover ${isLocked ? 'grayscale' : ''}`} />
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                            <Lock size={16} className="text-white" />
                                        </div>
                                    )}
                                    {isSelected && !isLocked && (
                                        <div className="absolute -bottom-1 -right-1 bg-pl-green text-white rounded-full p-0.5">
                                            <Check size={12} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold mt-1 text-center text-gray-700">{avatar.name}</span>
                                {isLocked && <span className="text-[9px] text-red-500">Lvl {avatar.min_level}</span>}
                            </button>
                        )
                    })}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

const GiftIcon = ({ reward }: { reward: string }) => {
    if (reward.includes("Badge")) return <Medal size={16} />;
    if (reward.includes("Avatar")) return <User size={16} />;
    return <Star size={16} />;
}

export default ProfileModal;