import React from 'react';
import { X, Zap, TrendingDown, ArrowRight } from 'lucide-react';

interface FlashScoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (playerId: number) => void;
}

const FlashScoutModal: React.FC<FlashScoutModalProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-pl-green/30 text-white relative">
        <div className="absolute top-0 right-0 p-4">
             <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
        </div>

        <div className="p-6 text-center">
            <div className="w-16 h-16 bg-pl-green rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Zap size={32} className="text-black" fill="currentColor" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1 text-pl-green">FLASH SCOUT</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">Limited Time Opportunity</p>

            <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">Ollie Watkins</span>
                    <span className="bg-pl-purple px-2 py-1 rounded text-xs font-bold">AVL</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Current Price</span>
                    <span className="font-bold line-through text-red-400">£8.9m</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-pl-green font-bold">Flash Price</span>
                    <span className="font-bold text-2xl text-pl-green">£8.5m</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400 justify-center">
                    <TrendingDown size={12} className="text-pl-green" /> 
                    Projected to rise in 24h
                </div>
            </div>

            <button
                onClick={() => onAction(4)} // Watkins player ID
                className="w-full bg-pl-green text-black font-bold py-3 rounded-xl hover:bg-white transition flex items-center justify-center gap-2"
            >
                Scout Player <ArrowRight size={16} />
            </button>
            <p className="text-[10px] text-gray-500 mt-3">Offer expires in 00:42:15</p>
        </div>
      </div>
    </div>
  );
};

export default FlashScoutModal;