import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, Coins, Star, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Player } from '../types';

interface PricePredictorProps {
  players: Player[];
  maxReward: number;
  xpReward: number;
  onComplete: (correct: number, reward: number, xp: number) => void;
  onClose: () => void;
}

type Prediction = 'rise' | 'fall' | 'same';

interface PlayerPrediction {
  player: Player;
  prediction: Prediction | null;
  actual?: Prediction;
  revealed?: boolean;
}

const PricePredictor: React.FC<PricePredictorProps> = ({
  players,
  maxReward,
  xpReward,
  onComplete,
  onClose
}) => {
  // Select 5 random players for the game
  const [gameState, setGameState] = useState<'predicting' | 'revealing' | 'complete'>('predicting');
  const [selectedPlayers] = useState<PlayerPrediction[]>(() => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map(p => ({ player: p, prediction: null }));
  });
  const [predictions, setPredictions] = useState<PlayerPrediction[]>(selectedPlayers);
  const [currentReveal, setCurrentReveal] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const setPrediction = (index: number, prediction: Prediction) => {
    setPredictions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], prediction };
      return updated;
    });
  };

  const allPredicted = predictions.every(p => p.prediction !== null);

  const generateActualResults = (): Prediction[] => {
    // Simulate price changes based on player stats
    return predictions.map(({ player }) => {
      const random = Math.random();
      // Players with good form more likely to rise
      if (player.form >= 6) {
        if (random < 0.5) return 'rise';
        if (random < 0.8) return 'same';
        return 'fall';
      } else if (player.form <= 4) {
        if (random < 0.5) return 'fall';
        if (random < 0.8) return 'same';
        return 'rise';
      } else {
        if (random < 0.33) return 'rise';
        if (random < 0.66) return 'same';
        return 'fall';
      }
    });
  };

  const submitPredictions = () => {
    const actuals = generateActualResults();
    const updated = predictions.map((p, i) => ({
      ...p,
      actual: actuals[i]
    }));
    setPredictions(updated);
    setGameState('revealing');
    revealNext(updated, 0);
  };

  const revealNext = (preds: PlayerPrediction[], index: number) => {
    if (index >= preds.length) {
      setTimeout(() => {
        const correct = preds.filter(p => p.prediction === p.actual).length;
        setCorrectCount(correct);
        setGameState('complete');
      }, 500);
      return;
    }

    setCurrentReveal(index);
    const updated = [...preds];
    updated[index] = { ...updated[index], revealed: true };

    if (updated[index].prediction === updated[index].actual) {
      setCorrectCount(c => c + 1);
    }

    setPredictions(updated);
    setTimeout(() => revealNext(updated, index + 1), 1000);
  };

  const calculateReward = (correct: number) => {
    if (correct === 5) return maxReward; // Jackpot!
    if (correct === 4) return Math.floor(maxReward * 0.6);
    if (correct === 3) return Math.floor(maxReward * 0.3);
    if (correct === 2) return Math.floor(maxReward * 0.1);
    return 0;
  };

  const getPredictionIcon = (pred: Prediction) => {
    switch (pred) {
      case 'rise': return <TrendingUp size={16} className="text-green-500" />;
      case 'fall': return <TrendingDown size={16} className="text-red-500" />;
      case 'same': return <Minus size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                📈 Price Predictor
              </h2>
              <p className="text-xs opacity-80">Will prices rise or fall?</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span>{predictions.filter(p => p.prediction).length} / 5 predicted</span>
            {gameState !== 'predicting' && (
              <span className="font-bold">{correctCount} correct</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {gameState === 'complete' ? (
            // Final Results
            <div className="text-center py-4">
              <div className="text-6xl mb-4">
                {correctCount === 5 ? '🎯' : correctCount >= 3 ? '⭐' : correctCount >= 1 ? '👍' : '😔'}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {correctCount === 5 ? 'Perfect! Jackpot!' : correctCount >= 3 ? 'Nice Predictions!' : 'Keep Practicing!'}
              </h3>
              <p className="text-gray-500 text-sm mb-4">You got {correctCount} out of 5 correct</p>

              {/* Rewards */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Coins size={24} className="mx-auto text-yellow-500 mb-1" />
                    <div className="text-lg font-bold text-gray-800">+{calculateReward(correctCount)}</div>
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
                onClick={() => onComplete(correctCount, calculateReward(correctCount), xpReward)}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Claim Rewards
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            // Playing
            <>
              <div className="space-y-3">
                {predictions.map((item, index) => (
                  <div
                    key={item.player.id}
                    className={`bg-gray-50 rounded-xl p-3 transition-all ${
                      item.revealed ? (item.prediction === item.actual ? 'ring-2 ring-green-400 bg-green-50' : 'ring-2 ring-red-400 bg-red-50') : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Player Avatar */}
                      <img
                        src={item.player.image}
                        alt={item.player.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-800">{item.player.name}</span>
                          <span className="text-[10px] text-gray-400">{item.player.team}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>£{item.player.price}m</span>
                          <span>•</span>
                          <span>Form: {item.player.form}</span>
                        </div>
                      </div>

                      {/* Prediction Buttons or Result */}
                      {gameState === 'predicting' ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setPrediction(index, 'rise')}
                            className={`p-2 rounded-lg transition ${
                              item.prediction === 'rise'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-500 hover:bg-green-100'
                            }`}
                          >
                            <TrendingUp size={18} />
                          </button>
                          <button
                            onClick={() => setPrediction(index, 'same')}
                            className={`p-2 rounded-lg transition ${
                              item.prediction === 'same'
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                          >
                            <Minus size={18} />
                          </button>
                          <button
                            onClick={() => setPrediction(index, 'fall')}
                            className={`p-2 rounded-lg transition ${
                              item.prediction === 'fall'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-500 hover:bg-red-100'
                            }`}
                          >
                            <TrendingDown size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {item.revealed ? (
                            <>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-gray-400">You</span>
                                {item.prediction && getPredictionIcon(item.prediction)}
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-gray-400">Actual</span>
                                {item.actual && getPredictionIcon(item.actual)}
                              </div>
                              {item.prediction === item.actual ? (
                                <Check size={20} className="text-green-500" />
                              ) : (
                                <X size={20} className="text-red-500" />
                              )}
                            </>
                          ) : (
                            <div className="animate-pulse text-gray-400">...</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              {gameState === 'predicting' && (
                <button
                  onClick={submitPredictions}
                  disabled={!allPredicted}
                  className={`mt-4 w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    allPredicted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {allPredicted ? (
                    <>Submit Predictions <ChevronRight size={18} /></>
                  ) : (
                    <>Predict all 5 players</>
                  )}
                </button>
              )}

              {gameState === 'revealing' && (
                <div className="mt-4 text-center text-gray-500 text-sm animate-pulse">
                  Revealing results...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePredictor;
