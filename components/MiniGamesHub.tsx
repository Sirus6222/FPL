import React, { useState } from 'react';
import { X, Gamepad2, Lock, Coins, Star, Zap, ChevronRight, AlertCircle, Trophy } from 'lucide-react';
import { MiniGameConfig } from '../types';

interface MiniGamesHubProps {
  games: MiniGameConfig[];
  userLevel: number;
  userCoins: number;
  dailyPlays: { [gameId: string]: number };
  onClose: () => void;
  onPlayGame: (game: MiniGameConfig) => void;
}

const MiniGamesHub: React.FC<MiniGamesHubProps> = ({
  games,
  userLevel,
  userCoins,
  dailyPlays,
  onClose,
  onPlayGame
}) => {
  const [selectedGame, setSelectedGame] = useState<MiniGameConfig | null>(null);

  const isUnlocked = (game: MiniGameConfig) => userLevel >= game.unlock_level;
  const canAfford = (game: MiniGameConfig) => userCoins >= game.cost_coins;
  const getRemainingPlays = (game: MiniGameConfig) => {
    const played = dailyPlays[game.id] || 0;
    return Math.max(0, game.daily_limit - played);
  };

  const totalAvailableGames = games.filter(g => isUnlocked(g) && getRemainingPlays(g) > 0).length;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-lg sm:rounded-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Gamepad2 size={20} />
                Mini-Games
              </h2>
              <p className="text-xs opacity-80">Play games to earn coins & XP</p>
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
              <div className="text-lg font-bold">{totalAvailableGames}</div>
              <div className="text-[10px] opacity-80">Available</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold flex items-center justify-center gap-1">
                <Coins size={14} />
                {userCoins.toLocaleString()}
              </div>
              <div className="text-[10px] opacity-80">Your Coins</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold">Lv. {userLevel}</div>
              <div className="text-[10px] opacity-80">Your Level</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {games.map(game => {
            const unlocked = isUnlocked(game);
            const affordable = canAfford(game);
            const remainingPlays = getRemainingPlays(game);
            const canPlay = unlocked && affordable && remainingPlays > 0;

            return (
              <div
                key={game.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  unlocked ? 'border-gray-100 hover:shadow-md cursor-pointer' : 'border-gray-200 opacity-60'
                }`}
                onClick={() => unlocked && setSelectedGame(game)}
              >
                <div className="flex">
                  {/* Icon Section */}
                  <div className={`w-20 flex items-center justify-center text-3xl ${
                    unlocked ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-gray-100'
                  }`}>
                    {unlocked ? game.icon : '🔒'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-sm text-gray-800">{game.name}</h3>
                      {!unlocked && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Lock size={10} />
                          Lv. {game.unlock_level}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{game.description}</p>

                    <div className="flex items-center justify-between">
                      {/* Rewards */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-0.5 text-yellow-600">
                          <Coins size={12} />
                          {game.max_reward_coins} max
                        </span>
                        <span className="flex items-center gap-0.5 text-purple-600">
                          <Star size={12} />
                          {game.xp_reward} XP
                        </span>
                      </div>

                      {/* Play Status */}
                      {unlocked && (
                        <div className="text-[10px]">
                          {remainingPlays > 0 ? (
                            <span className="text-green-600 font-medium">{remainingPlays} plays left</span>
                          ) : (
                            <span className="text-gray-400">Resets at midnight</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cost */}
                    {unlocked && game.cost_coins > 0 && (
                      <div className="mt-2 text-[10px] flex items-center gap-1">
                        <Coins size={10} className="text-yellow-500" />
                        <span className={affordable ? 'text-gray-600' : 'text-red-500'}>
                          {game.cost_coins} coins per play
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Play Arrow */}
                  {canPlay && (
                    <div className="flex items-center px-2 text-gray-300">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Game Detail Modal */}
        {selectedGame && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden animate-scale-in">
              {/* Game Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white text-center">
                <div className="text-5xl mb-2">{selectedGame.icon}</div>
                <h3 className="text-xl font-bold">{selectedGame.name}</h3>
                <p className="text-xs opacity-80">{selectedGame.description}</p>
              </div>

              <div className="p-4 space-y-4">
                {/* Rewards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <Coins size={24} className="mx-auto text-yellow-500 mb-1" />
                    <div className="text-sm font-bold text-gray-800">Up to {selectedGame.max_reward_coins}</div>
                    <div className="text-[10px] text-gray-500">Coin Reward</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Star size={24} className="mx-auto text-purple-500 mb-1" />
                    <div className="text-sm font-bold text-gray-800">+{selectedGame.xp_reward}</div>
                    <div className="text-[10px] text-gray-500">XP per Game</div>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">How to Play</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {selectedGame.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cost & Plays */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cost per play:</span>
                    <span className="font-bold flex items-center gap-1">
                      {selectedGame.cost_coins === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <>
                          <Coins size={14} className="text-yellow-500" />
                          {selectedGame.cost_coins}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plays remaining:</span>
                    <span className="font-bold">{getRemainingPlays(selectedGame)} / {selectedGame.daily_limit}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition"
                  >
                    Back
                  </button>
                  {getRemainingPlays(selectedGame) > 0 && canAfford(selectedGame) ? (
                    <button
                      onClick={() => {
                        onPlayGame(selectedGame);
                        setSelectedGame(null);
                      }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center gap-1"
                    >
                      <Zap size={16} />
                      Play Now
                    </button>
                  ) : getRemainingPlays(selectedGame) === 0 ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 bg-gray-200 text-gray-400 font-bold rounded-lg cursor-not-allowed"
                    >
                      No Plays Left
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-2.5 bg-yellow-100 text-yellow-700 font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <AlertCircle size={16} />
                      Need {selectedGame.cost_coins - userCoins} Coins
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGamesHub;
