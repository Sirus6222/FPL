
import React, { useState } from 'react';
import { Search, Filter, ArrowRight, X, AlertTriangle, Coins, Users, TrendingUp, TrendingDown, Minus, Lock } from 'lucide-react';
import { Player, Position } from '../types';
import { MOCK_PLAYERS } from '../constants'; // In real app, this would be a full player database

interface TransferMarketProps {
  onBuy: (player: Player) => void;
  currentBudget: number;
  squad: Player[];
  playerToSell: Player | null;
  onCancelSell: () => void;
  sellingPriceOfOutPlayer: number;
  isLocked?: boolean;
}

const TransferMarket: React.FC<TransferMarketProps> = ({ onBuy, currentBudget, squad, playerToSell, onCancelSell, sellingPriceOfOutPlayer, isLocked }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState<Position | 'ALL'>('ALL');

  if (isLocked) {
      return (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                  <Lock size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Transfer Market Closed</h3>
              <p className="text-sm text-gray-500 text-center max-w-xs mt-2">
                  Gameweek is currently active. Transfers will reopen after points processing.
              </p>
          </div>
      );
  }

  // If we are replacing a player, force the filter to that position
  const activeFilterPos = playerToSell ? playerToSell.position : filterPos;

  // Max price is current remaining budget + what we get for selling the player
  const maxAffordablePrice = playerToSell ? currentBudget + sellingPriceOfOutPlayer : currentBudget;

  const filteredPlayers = MOCK_PLAYERS.filter(p => {
    // Basic Filters
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = activeFilterPos === 'ALL' || p.position === activeFilterPos;
    
    // Don't show players already in squad
    const inSquad = squad.some(sp => sp.id === p.id);

    return matchesSearch && matchesPos && !inSquad;
  });

  // Helper to check team count for a specific team
  const getTeamCount = (teamCode: string) => {
    // If we are selling a player from this team, the count will effectively decrease by 1
    // But logically we check the NEW state.
    // Count existing players from this team
    let count = squad.filter(p => p.team === teamCode).length;
    
    // If the player we are selling is FROM this team, we subtract 1 from the count
    // to see if a slot opens up.
    if (playerToSell && playerToSell.team === teamCode) {
        count -= 1;
    }
    return count;
  };

  const getPriceTrendIcon = (player: Player) => {
      if (player.price_trend === 'up') return <TrendingUp size={12} className="text-pl-green" />;
      if (player.price_trend === 'down') return <TrendingDown size={12} className="text-red-500" />;
      return <Minus size={12} className="text-gray-300" />;
  };

  return (
    <div className="space-y-4">
      
      {/* Transfer Context Banner */}
      {playerToSell ? (
          <div className="bg-white border-2 border-pl-purple rounded-xl p-3 shadow-md animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-start">
                  <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Transfer Out</div>
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                         {playerToSell.name} <span className="text-xs bg-gray-100 px-1.5 rounded">{playerToSell.position}</span>
                      </div>
                      <div className="text-xs text-pl-green font-bold mt-1 flex items-center gap-1">
                          Selling for £{sellingPriceOfOutPlayer.toFixed(1)}m
                          {sellingPriceOfOutPlayer > (playerToSell.purchase_price || 0) && (
                              <span className="bg-green-100 text-green-700 px-1 rounded text-[9px]">+Profit</span>
                          )}
                      </div>
                  </div>
                  <button 
                    onClick={onCancelSell}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                      <X size={16} />
                  </button>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Max Budget:</span>
                  <span className="font-bold text-pl-purple">£{maxAffordablePrice.toFixed(1)}m</span>
              </div>
          </div>
      ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
              <div className="text-xs text-yellow-800">
                  Select a player from your <span className="font-bold">Team</span> view to swap.
              </div>
          </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-20">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search players..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pl-purple"
          />
        </div>
        
        {/* Only show position filter if NOT swapping (browsing mode) */}
        {!playerToSell && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                <button
                key={pos}
                onClick={() => setFilterPos(pos as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filterPos === pos ? 'bg-pl-purple text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                {pos}
                </button>
            ))}
            </div>
        )}
      </div>

      {/* Player List */}
      <div className="space-y-2">
        {filteredPlayers.map(player => {
            const teamCount = getTeamCount(player.team);
            const isTeamFull = teamCount >= 3;
            const isTooExpensive = playerToSell ? player.price > maxAffordablePrice : false;
            const isDisabled = isTeamFull || isTooExpensive || !playerToSell;

            return (
                <div key={player.id} className={`bg-white p-3 rounded-xl border ${isDisabled ? 'border-gray-100 opacity-60' : 'border-gray-100'} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={player.image} alt={player.name} className={`w-10 h-10 rounded-full bg-gray-100 object-cover ${isDisabled ? 'grayscale' : ''}`} />
                        <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-[8px] px-1 rounded">{player.position}</div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-800">{player.name}</h4>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2">
                            <span>{player.team}</span>
                            {/* Visual Team Limit Warning */}
                            {isTeamFull && <span className="text-red-500 font-bold flex items-center gap-0.5"><Users size={8}/> 3/3</span>}
                        </div>
                    </div>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold text-sm flex items-center justify-end gap-1 ${isTooExpensive ? 'text-red-500' : 'text-pl-purple'}`}>
                            £{player.price}m
                            {getPriceTrendIcon(player)}
                        </div>
                        {player.chance_of_price_change && player.chance_of_price_change > 75 && (
                             <div className="text-[9px] text-orange-500 font-bold">Price Locked</div>
                        )}

                        <button 
                            onClick={() => !isDisabled && onBuy(player)}
                            disabled={isDisabled}
                            className={`mt-1 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 transition ml-auto ${
                                isDisabled 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-pl-green text-pl-purple hover:bg-opacity-80'
                            }`}
                        >
                            {isTooExpensive ? 'Funds' : isTeamFull ? 'Max 3' : 'Sign'} <ArrowRight size={10} />
                        </button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default TransferMarket;
