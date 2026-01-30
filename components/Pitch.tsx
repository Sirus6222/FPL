
import React from 'react';
import { Player, Position } from '../types';
import { Lock, Info, ArrowRightLeft } from 'lucide-react';

interface PitchProps {
  squad: Player[];
  onPlayerClick: (player: Player) => void;
  selectedPlayerId?: number | null;
  isLocked?: boolean;
  onAction?: (action: 'swap' | 'captain' | 'vice_captain' | 'info') => void;
}

const PlayerShirt: React.FC<{ 
    player: Player; 
    onClick: () => void; 
    isSelected: boolean; 
    isLocked?: boolean;
    onAction?: (action: 'swap' | 'captain' | 'vice_captain' | 'info') => void;
    benchOrder?: number;
}> = ({ player, onClick, isSelected, isLocked, onAction, benchOrder }) => {
    
    // Captaincy Heat Color Logic (Based on ownership)
    const getHeatColor = () => {
        if (player.selected_by_percent > 40) return 'border-red-500 shadow-red-500/50';
        if (player.selected_by_percent > 20) return 'border-orange-400 shadow-orange-400/50';
        return 'border-white';
    };

    // Fixture Status Logic
    const fixtureCount = player.upcoming_fixtures ? player.upcoming_fixtures.length : 1;
    const isDGW = fixtureCount > 1;
    const isBGW = fixtureCount === 0;

    return (
      <div className="relative flex flex-col items-center">
        {/* Action Menu Popover when Selected */}
        {isSelected && !isLocked && onAction && (
            <div className="absolute bottom-full mb-2 bg-white rounded-xl shadow-xl p-1.5 flex gap-1 z-50 animate-in fade-in zoom-in duration-200 border border-gray-100">
                <button 
                    onClick={(e) => { e.stopPropagation(); onAction('captain'); }} 
                    className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center hover:bg-gray-800"
                >
                    C
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onAction('vice_captain'); }} 
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center hover:bg-gray-300"
                >
                    V
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onAction('swap'); }} 
                    className="w-8 h-8 rounded-full bg-pl-green text-pl-purple flex items-center justify-center hover:bg-opacity-80"
                >
                    <ArrowRightLeft size={14} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onAction('info'); }} 
                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                >
                    <Info size={14} />
                </button>
            </div>
        )}

        <div 
            onClick={!isLocked ? onClick : undefined} 
            className={`flex flex-col items-center justify-center transform transition w-20 relative
            ${isSelected ? 'scale-110 z-40' : !isLocked ? 'hover:scale-105 cursor-pointer' : 'cursor-default opacity-90'}`}
        >
            <div className="relative">
            {/* Shirt Graphic SVG */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10 L30 10 L35 15 L35 30 L5 30 L5 15 Z" fill={player.position === Position.GK ? "#FFD700" : "#EF0107"} stroke="white" strokeWidth="2"/>
            </svg>
            
            {/* Captaincy Badge & Heat Ring */}
            {player.is_captain && (
                <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center border-2 ${getHeatColor()} shadow-lg`}>
                    C
                </div>
            )}
            {player.is_vice_captain && (
                <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gray-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-gray-400 shadow-md">
                    V
                </div>
            )}

            {/* Status Badges */}
            {isDGW && !player.news && (
                <div className="absolute -top-1 -right-1 bg-pl-green text-pl-purple text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-white animate-pulse shadow-md">
                    x2
                </div>
            )}
            {isBGW && !player.news && (
                <div className="absolute -top-1 -right-1 bg-gray-400 text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-white">
                    -
                </div>
            )}

            {player.news && (
                <div className="absolute -top-1 -right-1 bg-eth-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">!</div>
            )}
            
            {/* Bench Order Badge */}
            {benchOrder !== undefined && (
                <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                    {benchOrder}
                </div>
            )}
            </div>
            <div className={`text-white text-[10px] px-2 py-0.5 rounded mt-1 font-bold truncate w-full text-center border ${isSelected ? 'bg-eth-yellow text-black border-white' : 'bg-pl-purple border-pl-green'}`}>
            {player.name}
            </div>
            {/* Score Badge - Interactive Look */}
            <div className="mt-0.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 transition-colors">
                <div className="text-white text-[10px] font-bold drop-shadow-md">
                    {player.points_last_gw} pts
                </div>
            </div>
        </div>
      </div>
    );
};

const Pitch: React.FC<PitchProps> = ({ squad, onPlayerClick, selectedPlayerId, isLocked, onAction }) => {
  // Only render players who are NOT on the bench
  const activeSquad = squad.filter(p => !p.is_bench);
  const benchSquad = squad.filter(p => p.is_bench);
  
  const gk = activeSquad.filter(p => p.position === Position.GK);
  const def = activeSquad.filter(p => p.position === Position.DEF);
  const mid = activeSquad.filter(p => p.position === Position.MID);
  const fwd = activeSquad.filter(p => p.position === Position.FWD);

  // Bench separation
  const benchGK = benchSquad.find(p => p.position === Position.GK);
  const benchOutfield = benchSquad.filter(p => p.position !== Position.GK);

  return (
    <div className="space-y-4">
        <div className="relative w-full aspect-[2/3] max-w-md mx-auto bg-eth-green rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
        {/* Pitch Markings */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full border-2 border-white m-2 box-border relative">
            <div className="absolute top-0 left-1/4 right-1/4 h-16 border-b-2 border-x-2 border-white"></div>
            <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border-t-2 border-x-2 border-white"></div>
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>
            {/* Grass Stripes */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_10%]"></div>
        </div>

        {/* Locked Overlay State */}
        {isLocked && (
            <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none flex items-center justify-center">
                <div className="bg-black/40 p-2 rounded-full backdrop-blur-sm">
                    <Lock className="text-white/50" size={32} />
                </div>
            </div>
        )}

        {/* Players Layer */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-2 z-10">
            <div className="flex justify-center items-center h-1/5">
            {gk.map(p => <PlayerShirt key={p.id} player={p} onClick={() => onPlayerClick(p)} isSelected={selectedPlayerId === p.id} isLocked={isLocked} onAction={onAction} />)}
            </div>
            <div className="flex justify-around items-center h-1/5">
            {def.map(p => <PlayerShirt key={p.id} player={p} onClick={() => onPlayerClick(p)} isSelected={selectedPlayerId === p.id} isLocked={isLocked} onAction={onAction} />)}
            </div>
            <div className="flex justify-around items-center h-1/5">
            {mid.map(p => <PlayerShirt key={p.id} player={p} onClick={() => onPlayerClick(p)} isSelected={selectedPlayerId === p.id} isLocked={isLocked} onAction={onAction} />)}
            </div>
            <div className="flex justify-around items-center h-1/5">
            {fwd.map(p => <PlayerShirt key={p.id} player={p} onClick={() => onPlayerClick(p)} isSelected={selectedPlayerId === p.id} isLocked={isLocked} onAction={onAction} />)}
            </div>
        </div>
        </div>

        {/* Bench Area */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold mb-3 text-gray-500 uppercase flex justify-between">
                <span>Bench</span>
                <span className="text-[10px] text-pl-green bg-pl-green/10 px-2 py-0.5 rounded">Auto-Sub Enabled</span>
            </h3>
            <div className="flex justify-around items-end bg-gray-50 rounded-xl p-2 border border-gray-100 relative">
                {benchGK && (
                    <div className="relative">
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 font-bold">GK</span>
                        <PlayerShirt player={benchGK} onClick={() => onPlayerClick(benchGK)} isSelected={selectedPlayerId === benchGK.id} isLocked={isLocked} onAction={onAction} />
                    </div>
                )}
                <div className="w-px h-12 bg-gray-200 mx-1"></div>
                {benchOutfield.map((p, idx) => (
                    <div key={p.id} className="relative">
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 font-bold">#{idx + 1}</span>
                        <PlayerShirt player={p} onClick={() => onPlayerClick(p)} isSelected={selectedPlayerId === p.id} isLocked={isLocked} onAction={onAction} benchOrder={idx + 1} />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Pitch;
