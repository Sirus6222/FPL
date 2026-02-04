import React, { useState, useEffect } from 'react';
import { Coffee, Zap, Clock, Gift, Sparkles } from 'lucide-react';
import { CoffeeHourConfig } from '../types';

interface CoffeeHourBannerProps {
  config: CoffeeHourConfig;
  onClaim?: () => void;
  hasClaimed?: boolean;
}

const CoffeeHourBanner: React.FC<CoffeeHourBannerProps> = ({
  config,
  onClaim,
  hasClaimed = false
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [timeUntilStart, setTimeUntilStart] = useState('');

  useEffect(() => {
    const checkCoffeeHour = () => {
      // Get current time in Ethiopia timezone (UTC+3)
      const now = new Date();
      const ethiopiaOffset = 3 * 60; // UTC+3 in minutes
      const localOffset = now.getTimezoneOffset();
      const ethiopiaTime = new Date(now.getTime() + (ethiopiaOffset + localOffset) * 60 * 1000);

      const currentHour = ethiopiaTime.getHours();
      const currentMinute = ethiopiaTime.getMinutes();

      // Check if within coffee hour (6 AM - 9 AM Ethiopia time)
      const withinCoffeeHour = currentHour >= config.start_hour && currentHour < config.end_hour;
      setIsActive(withinCoffeeHour);

      if (withinCoffeeHour) {
        // Calculate time remaining until coffee hour ends
        const endMinutes = config.end_hour * 60;
        const currentMinutes = currentHour * 60 + currentMinute;
        const remainingMinutes = endMinutes - currentMinutes;
        const hours = Math.floor(remainingMinutes / 60);
        const mins = remainingMinutes % 60;
        setTimeRemaining(`${hours}h ${mins}m`);
        setTimeUntilStart('');
      } else {
        // Calculate time until coffee hour starts
        let startMinutes = config.start_hour * 60;
        const currentMinutes = currentHour * 60 + currentMinute;

        if (currentMinutes >= config.end_hour * 60) {
          // After coffee hour, calculate until tomorrow
          startMinutes += 24 * 60;
        }

        const minutesUntil = startMinutes - currentMinutes;
        const hours = Math.floor(minutesUntil / 60);
        const mins = minutesUntil % 60;
        setTimeUntilStart(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
        setTimeRemaining('');
      }
    };

    checkCoffeeHour();
    const interval = setInterval(checkCoffeeHour, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [config.start_hour, config.end_hour]);

  if (!config.enabled) return null;

  if (isActive) {
    return (
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl p-3 text-white shadow-lg relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <Coffee size={80} className="absolute -right-4 -bottom-4 text-white/10 transform rotate-12" />
          <Sparkles size={24} className="absolute top-2 right-8 text-yellow-300/50 animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Coffee size={20} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">☕ Coffee Hour Active!</span>
                  <Zap size={14} className="text-yellow-300 fill-yellow-300" />
                </div>
                <div className="text-[10px] opacity-90">
                  {config.bonus_multiplier}x bonus on {config.bonus_types.join(', ')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 flex items-center gap-1">
                <Clock size={12} />
                Ends in {timeRemaining}
              </div>
            </div>
          </div>

          {/* Special Rewards */}
          <div className="mt-2 flex items-center gap-2">
            {config.special_rewards.map((reward, i) => (
              <div key={i} className="bg-white/10 rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1">
                <Gift size={10} />
                {reward.type === 'coins' && `+${reward.amount} coins`}
                {reward.type === 'xp' && `+${reward.amount} XP`}
                {reward.type === 'badge' && 'Early Bird badge'}
                <span className="opacity-60">({Math.round(reward.chance * 100)}%)</span>
              </div>
            ))}
          </div>

          {/* Claim Button */}
          {onClaim && !hasClaimed && (
            <button
              onClick={onClaim}
              className="mt-2 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <Gift size={14} />
              Claim Coffee Hour Bonus
            </button>
          )}
          {hasClaimed && (
            <div className="mt-2 text-center text-xs opacity-80">
              ✓ Bonus claimed today! Come back tomorrow.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Not active - show countdown
  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-3 text-white/80 relative overflow-hidden">
      <Coffee size={60} className="absolute -right-2 -bottom-2 text-white/5" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee size={18} className="text-amber-400" />
          <div>
            <div className="text-xs font-medium">Coffee Hour</div>
            <div className="text-[10px] opacity-70">6-9 AM Ethiopia Time</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-amber-400">{timeUntilStart}</div>
          <div className="text-[10px] opacity-70">until bonus</div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeHourBanner;
