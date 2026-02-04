import React, { useState, useCallback } from 'react';
import { X, Target, Trophy, Coins, Star, RefreshCw, ChevronRight } from 'lucide-react';

interface PenaltyShootoutProps {
  maxReward: number;
  xpReward: number;
  onComplete: (goals: number, reward: number, xp: number) => void;
  onClose: () => void;
}

type ShotPosition = 'top_left' | 'top_center' | 'top_right' | 'bottom_left' | 'bottom_center' | 'bottom_right';
type GamePhase = 'aiming' | 'shooting' | 'result' | 'complete';

const positions: ShotPosition[] = ['top_left', 'top_center', 'top_right', 'bottom_left', 'bottom_center', 'bottom_right'];

const positionLabels: Record<ShotPosition, string> = {
  top_left: '↖️ Top Left',
  top_center: '⬆️ Top Center',
  top_right: '↗️ Top Right',
  bottom_left: '↙️ Bottom Left',
  bottom_center: '⬇️ Bottom Center',
  bottom_right: '↘️ Bottom Right'
};

const PenaltyShootout: React.FC<PenaltyShootoutProps> = ({
  maxReward,
  xpReward,
  onComplete,
  onClose
}) => {
  const [currentShot, setCurrentShot] = useState(1);
  const [goals, setGoals] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<ShotPosition | null>(null);
  const [goalkeeperPosition, setGoalkeeperPosition] = useState<ShotPosition | null>(null);
  const [phase, setPhase] = useState<GamePhase>('aiming');
  const [shotHistory, setShotHistory] = useState<Array<{ shot: ShotPosition; keeper: ShotPosition; goal: boolean }>>([]);

  const totalShots = 5;

  const getGoalkeeperSave = (): ShotPosition => {
    // Goalkeeper AI - tends to dive to corners more often
    const weights = {
      top_left: 0.2,
      top_center: 0.1,
      top_right: 0.2,
      bottom_left: 0.2,
      bottom_center: 0.1,
      bottom_right: 0.2
    };

    const random = Math.random();
    let cumulative = 0;
    for (const [pos, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return pos as ShotPosition;
      }
    }
    return 'bottom_center';
  };

  const shoot = useCallback(() => {
    if (!selectedPosition) return;

    setPhase('shooting');
    const keeperPos = getGoalkeeperSave();
    setGoalkeeperPosition(keeperPos);

    // Determine if goal (keeper can only save if in same general area)
    const isGoal = selectedPosition !== keeperPos;

    setTimeout(() => {
      setPhase('result');
      if (isGoal) {
        setGoals(g => g + 1);
      }
      setShotHistory(h => [...h, { shot: selectedPosition, keeper: keeperPos, goal: isGoal }]);
    }, 800);
  }, [selectedPosition]);

  const nextShot = () => {
    if (currentShot >= totalShots) {
      setPhase('complete');
    } else {
      setCurrentShot(s => s + 1);
      setSelectedPosition(null);
      setGoalkeeperPosition(null);
      setPhase('aiming');
    }
  };

  const calculateReward = () => {
    if (goals >= 5) return maxReward;
    if (goals >= 4) return Math.floor(maxReward * 0.8);
    if (goals >= 3) return Math.floor(maxReward * 0.5);
    if (goals >= 2) return Math.floor(maxReward * 0.2);
    return 0;
  };

  const getPositionStyle = (pos: ShotPosition) => {
    const base = 'absolute w-1/3 h-1/2 flex items-center justify-center transition-all';
    const posStyles: Record<ShotPosition, string> = {
      top_left: 'top-0 left-0',
      top_center: 'top-0 left-1/3',
      top_right: 'top-0 right-0',
      bottom_left: 'bottom-0 left-0',
      bottom_center: 'bottom-0 left-1/3',
      bottom_right: 'bottom-0 right-0'
    };
    return `${base} ${posStyles[pos]}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                ⚽ Penalty Shootout
              </h2>
              <p className="text-xs opacity-80">Score as many as you can!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Score & Progress */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              {shotHistory.map((shot, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    shot.goal ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                  }`}
                >
                  {shot.goal ? '✓' : '✗'}
                </div>
              ))}
              {Array(totalShots - shotHistory.length).fill(0).map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {shotHistory.length + i + 1}
                </div>
              ))}
            </div>
            <div className="text-xl font-bold">{goals} / {totalShots}</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-4">
          {phase === 'complete' ? (
            // Final Results
            <div className="text-center py-6">
              <div className="text-6xl mb-4">
                {goals >= 4 ? '🏆' : goals >= 3 ? '⭐' : goals >= 1 ? '👍' : '😔'}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {goals >= 4 ? 'Amazing!' : goals >= 3 ? 'Great Job!' : goals >= 1 ? 'Nice Try!' : 'Better Luck Next Time'}
              </h3>
              <p className="text-gray-500 text-sm mb-4">You scored {goals} out of {totalShots} penalties</p>

              {/* Rewards */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Coins size={24} className="mx-auto text-yellow-500 mb-1" />
                    <div className="text-lg font-bold text-gray-800">+{calculateReward()}</div>
                    <div className="text-xs text-gray-500">Coins</div>
                  </div>
                  <div className="text-center">
                    <Star size={24} className="mx-auto text-purple-500 mb-1" />
                    <div className="text-lg font-bold text-gray-800">+{xpReward}</div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onComplete(goals, calculateReward(), xpReward)}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                Claim Rewards
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            // Playing
            <>
              <p className="text-center text-sm text-gray-600 mb-3">
                {phase === 'aiming' && 'Tap where you want to shoot!'}
                {phase === 'shooting' && 'Shooting...'}
                {phase === 'result' && (shotHistory[shotHistory.length - 1]?.goal ? 'GOAL! ⚽' : 'Saved! 🧤')}
              </p>

              {/* Goal */}
              <div className="relative bg-gradient-to-b from-green-200 to-green-400 rounded-xl aspect-video border-4 border-white shadow-lg overflow-hidden">
                {/* Goal Frame */}
                <div className="absolute inset-2 border-4 border-white rounded">
                  {/* Grid for aiming */}
                  {phase === 'aiming' && positions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`${getPositionStyle(pos)} hover:bg-white/30 ${
                        selectedPosition === pos ? 'bg-yellow-400/50 ring-2 ring-yellow-500' : ''
                      }`}
                    >
                      <Target size={24} className={`text-white/60 ${selectedPosition === pos ? 'text-yellow-500' : ''}`} />
                    </button>
                  ))}

                  {/* Ball animation */}
                  {(phase === 'shooting' || phase === 'result') && selectedPosition && (
                    <div
                      className={`absolute text-4xl transition-all duration-500 ${
                        phase === 'shooting' ? 'bottom-0 left-1/2 -translate-x-1/2' : ''
                      }`}
                      style={phase === 'result' ? {
                        top: selectedPosition.includes('top') ? '10%' : '60%',
                        left: selectedPosition.includes('left') ? '15%' : selectedPosition.includes('right') ? '70%' : '42%'
                      } : undefined}
                    >
                      ⚽
                    </div>
                  )}

                  {/* Goalkeeper */}
                  {(phase === 'shooting' || phase === 'result') && goalkeeperPosition && (
                    <div
                      className="absolute text-3xl transition-all duration-300"
                      style={{
                        top: goalkeeperPosition.includes('top') ? '5%' : '55%',
                        left: goalkeeperPosition.includes('left') ? '10%' : goalkeeperPosition.includes('right') ? '65%' : '40%'
                      }}
                    >
                      🧤
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4">
                {phase === 'aiming' && (
                  <button
                    onClick={shoot}
                    disabled={!selectedPosition}
                    className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                      selectedPosition
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedPosition ? `Shoot ${positionLabels[selectedPosition]}` : 'Select a target'}
                  </button>
                )}
                {phase === 'result' && (
                  <button
                    onClick={nextShot}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    {currentShot >= totalShots ? 'See Results' : 'Next Shot'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PenaltyShootout;
