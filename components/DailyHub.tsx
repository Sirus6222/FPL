import React from 'react';
import { Flame, CheckCircle, Lock, Gift, Brain, ChevronRight } from 'lucide-react';
import { DailyQuest } from '../types';

interface DailyHubProps {
  streak: number;
  quests: DailyQuest[];
  onOpenTrivia: () => void;
}

const DailyHub: React.FC<DailyHubProps> = ({ streak, quests, onOpenTrivia }) => {
  const completedCount = quests.filter(q => q.is_completed).length;
  const totalCount = quests.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-4">
        {/* Streak & Daily Bonus Row */}
        <div className="flex gap-3">
             <div className="flex-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 text-white shadow-md relative overflow-hidden">
                 <div className="relative z-10">
                     <div className="flex items-center gap-1 mb-1">
                         <Flame size={16} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                         <span className="text-xs font-bold uppercase opacity-90">Login Streak</span>
                     </div>
                     <div className="text-2xl font-bold">{streak} Days</div>
                     <div className="text-[10px] opacity-80 mt-1">Next Bonus: 2 Days</div>
                 </div>
                 <Flame size={64} className="absolute -bottom-4 -right-4 text-white/10" />
             </div>

             <button 
                onClick={onOpenTrivia}
                className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 text-white shadow-md relative overflow-hidden text-left group transition-all hover:scale-[1.02]"
             >
                 <div className="relative z-10">
                     <div className="flex items-center gap-1 mb-1">
                         <Brain size={16} className="text-blue-200" />
                         <span className="text-xs font-bold uppercase opacity-90">Daily Trivia</span>
                     </div>
                     <div className="text-sm font-bold leading-tight">Win 50 Coins</div>
                     <div className="mt-2 bg-white/20 text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full">
                         Play Now <ChevronRight size={10} />
                     </div>
                 </div>
                 <Brain size={64} className="absolute -bottom-4 -right-4 text-white/10 group-hover:rotate-12 transition-transform" />
             </button>
        </div>

        {/* Daily Quests Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm">Daily Quests</h3>
                <span className="text-xs font-bold text-pl-purple">{completedCount}/{totalCount} Done</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">
                <div 
                    className="bg-pl-green h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="space-y-3">
                {quests.map(quest => (
                    <div key={quest.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quest.is_completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                {quest.is_completed ? <CheckCircle size={16} /> : <Lock size={16} />}
                            </div>
                            <div>
                                <div className={`text-xs font-bold ${quest.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{quest.label}</div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Gift size={10} /> +{quest.reward_amount} {quest.reward_type}
                                </div>
                            </div>
                        </div>
                        {!quest.is_completed && (
                            <button className="text-[10px] font-bold text-pl-purple bg-pl-purple/5 px-2 py-1 rounded hover:bg-pl-purple/10">
                                Go
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default DailyHub;