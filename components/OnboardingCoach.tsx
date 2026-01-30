
import React from 'react';
import { X, ChevronRight, UserCheck, ShieldAlert } from 'lucide-react';

export type TutorialStep = 'WELCOME' | 'POINTS' | 'TRANSFERS_INTRO' | 'MARKET_GUIDE' | 'ERROR_LIMIT' | 'CAPTAINCY' | 'DEADLINE' | 'COMPLETE' | 'HIDDEN';

interface OnboardingCoachProps {
  step: TutorialStep;
  onNext: () => void;
  onDismiss: () => void;
  onAction?: (action: string) => void;
  customMessage?: string;
}

const OnboardingCoach: React.FC<OnboardingCoachProps> = ({ step, onNext, onDismiss, onAction, customMessage }) => {
  if (step === 'HIDDEN') return null;

  const content: Record<string, { title: string; text: string; actionLabel?: string; icon?: React.ReactNode }> = {
    WELCOME: {
      title: "Coach Carter",
      text: "Welcome to FPL! 🎓 Think of this as a Manager Simulator. No football degree needed. We're building your team together.",
      actionLabel: "How do I win?",
      icon: <UserCheck size={24} className="text-white" />
    },
    POINTS: {
      title: "Scoring 101",
      text: "Points mean prizes! \n⚽ Goals = Big Points\n🎯 Assists = Points\n🛡️ Clean Sheets = Points for Defenders.\n\nSimple, right?",
      actionLabel: "Let's Build Squad",
    },
    TRANSFERS_INTRO: {
      title: "The War Chest",
      text: "You have £100m to buy 15 players. Don't spend it all in one place! Tap 'Transfers' to start scouting.",
      actionLabel: "Go to Transfers",
    },
    MARKET_GUIDE: {
      title: "First Pick Strategy",
      text: "See that price tag? It matters. Pick a 'Reliable Star' first - someone who plays every match week. Tap a player to sign them.",
    },
    ERROR_LIMIT: {
      title: "Easy there, scout! 🐅",
      text: customMessage || "You've got 3 players from this club already. Rules say we have to diversify. Who else is on your radar?",
      actionLabel: "Understood",
      icon: <ShieldAlert size={24} className="text-yellow-300" />
    },
    CAPTAINCY: {
      title: "The Golden Rule",
      text: "Your Captain scores DOUBLE points. 👑 Pick your absolute best player for this spot.",
      actionLabel: "Got it",
    },
    DEADLINE: {
      title: "Locked & Loaded",
      text: "Once the Match Week starts, your team is LOCKED in battle. 🔒 Make sure you're happy before the deadline!",
      actionLabel: "Finish",
    }
  };

  const current = content[step];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center pb-24 px-4 sm:items-center sm:pb-0">
      <div className="bg-gradient-to-br from-pl-purple to-indigo-900 text-white w-full max-w-sm rounded-2xl shadow-2xl border-2 border-white/20 pointer-events-auto relative overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pl-pink opacity-20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="p-5 flex gap-4">
          {/* Avatar Area */}
          <div className="shrink-0 flex flex-col items-center">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-pl-green mb-1 shadow-lg">
                {current.icon || <span className="text-2xl">🧢</span>}
             </div>
             <span className="text-[10px] font-bold text-pl-green bg-black/20 px-2 py-0.5 rounded-full">COACH</span>
          </div>

          {/* Text Area */}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 flex justify-between items-center">
                {current.title}
            </h3>
            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line mb-4">
                {current.text}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
                {current.actionLabel && (
                    <button 
                        onClick={() => {
                            if (onAction && step === 'TRANSFERS_INTRO') onAction('GOTO_TRANSFERS');
                            else onNext();
                        }}
                        className="bg-pl-green text-pl-purple text-xs font-bold px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-1 shadow-md"
                    >
                        {current.actionLabel} <ChevronRight size={14} />
                    </button>
                )}
                {step !== 'ERROR_LIMIT' && step !== 'WELCOME' && (
                    <button 
                        onClick={onDismiss}
                        className="text-white/60 text-xs font-bold px-3 py-2 hover:text-white"
                    >
                        Skip
                    </button>
                )}
            </div>
          </div>
          
          <button 
            onClick={onDismiss} 
            className="absolute top-2 right-2 p-1 text-white/30 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCoach;
