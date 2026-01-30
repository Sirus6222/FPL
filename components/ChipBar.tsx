
import React from 'react';
import { ChipType } from '../types';
import { Zap, Users, RotateCcw, Star } from 'lucide-react';

interface ChipBarProps {
  inventory: Record<ChipType, number>;
  activeChip: ChipType | null;
  onActivate: (chip: ChipType | null) => void;
  isLocked?: boolean;
}

const ChipBar: React.FC<ChipBarProps> = ({ inventory, activeChip, onActivate, isLocked }) => {
  const chips: { type: ChipType; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { 
        type: 'benchboost', 
        label: 'Bench Boost', 
        icon: <Users size={14} />, 
        color: 'bg-orange-500',
        desc: 'Bench players score points'
    },
    { 
        type: 'triplecaptain', 
        label: 'Triple Capt', 
        icon: <Star size={14} />, 
        color: 'bg-white text-black border-2 border-black',
        desc: 'Captain gets 3x points'
    },
    { 
        type: 'freehit', 
        label: 'Free Hit', 
        icon: <RotateCcw size={14} />, 
        color: 'bg-pl-purple',
        desc: 'Unlimited transfers 1 GW'
    },
    { 
        type: 'wildcard', 
        label: 'Wildcard', 
        icon: <Zap size={14} />, 
        color: 'bg-black',
        desc: 'Unlimited transfers permanent'
    },
  ];

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex justify-between items-center">
            <span>Chips</span>
            {activeChip && <span className="text-[10px] text-pl-pink font-bold animate-pulse">Chip Active</span>}
        </h3>
        
        <div className="grid grid-cols-4 gap-2">
            {chips.map((chip) => {
                const count = inventory[chip.type];
                const isActive = activeChip === chip.type;
                const isDisabled = (count === 0 && !isActive) || (activeChip !== null && !isActive) || isLocked;

                return (
                    <button
                        key={chip.type}
                        onClick={() => !isDisabled && onActivate(isActive ? null : chip.type)}
                        disabled={isDisabled}
                        className={`
                            relative flex flex-col items-center justify-center p-2 rounded-lg transition-all
                            ${isActive ? 'ring-2 ring-offset-1 ring-pl-green scale-105 shadow-md' : ''}
                            ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}
                            ${chip.type === 'triplecaptain' ? 'bg-white border border-gray-200' : chip.color}
                            ${chip.type === 'triplecaptain' ? 'text-black' : 'text-white'}
                        `}
                    >
                        <div className="mb-1">{chip.icon}</div>
                        <div className="text-[9px] font-bold text-center leading-tight">{chip.label}</div>
                        
                        {/* Count Badge */}
                        {!isDisabled && count > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pl-green text-pl-purple text-[8px] flex items-center justify-center font-bold border border-white">
                                {count}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>

        {/* Dynamic Hints */}
        <div className="mt-3 bg-gray-50 p-2 rounded-lg text-[10px] text-gray-500 text-center flex items-center justify-center gap-2">
            <span className="font-bold text-pl-purple">Tip:</span>
            {activeChip === 'benchboost' && <span>Best used in a Double Gameweek when bench players have 2 games.</span>}
            {activeChip === 'triplecaptain' && <span>Save for a premium player in a Double Gameweek (e.g. Haaland vs SHU/LUT).</span>}
            {activeChip === 'freehit' && <span>Use in blank gameweeks when your main team has no fixtures.</span>}
            {activeChip === 'wildcard' && <span>Activate to overhaul your squad without point deductions.</span>}
            {!activeChip && <span>Only one chip can be active per Gameweek.</span>}
        </div>
    </div>
  );
};

export default ChipBar;
