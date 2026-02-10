
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, UserCheck, ShieldAlert, HelpCircle, Trophy, Shirt, ArrowLeftRight, Star, Coins, Users, Clock, Zap, Target, BarChart2 } from 'lucide-react';

export type TutorialStep = 'WELCOME' | 'POINTS' | 'TRANSFERS_INTRO' | 'MARKET_GUIDE' | 'ERROR_LIMIT' | 'CAPTAINCY' | 'DEADLINE' | 'COMPLETE' | 'HIDDEN'
  | 'WHAT_IS_FPL' | 'SQUAD_RULES' | 'GAMEWEEK_EXPLAINED' | 'LEAGUES_INTRO' | 'CHIPS_EXPLAINED' | 'COINS_AND_XP';

interface OnboardingCoachProps {
  step: TutorialStep;
  onNext: () => void;
  onDismiss: () => void;
  onAction?: (action: string) => void;
  customMessage?: string;
}

interface StepContent {
  title: string;
  text: string;
  details?: string[];
  actionLabel?: string;
  secondaryLabel?: string;
  icon?: React.ReactNode;
  stepNumber?: number;
  totalSteps?: number;
  illustration?: string;
}

// Full walkthrough sequence for first-time users
const WALKTHROUGH_SEQUENCE: TutorialStep[] = [
  'WELCOME', 'WHAT_IS_FPL', 'SQUAD_RULES', 'POINTS', 'GAMEWEEK_EXPLAINED',
  'CAPTAINCY', 'TRANSFERS_INTRO', 'CHIPS_EXPLAINED', 'LEAGUES_INTRO',
  'COINS_AND_XP', 'DEADLINE'
];

const OnboardingCoach: React.FC<OnboardingCoachProps> = ({ step, onNext, onDismiss, onAction, customMessage }) => {
  const [expandedDetails, setExpandedDetails] = useState(false);

  if (step === 'HIDDEN' || step === 'COMPLETE') return null;

  const currentIndex = WALKTHROUGH_SEQUENCE.indexOf(step);
  const isInWalkthrough = currentIndex !== -1;
  const totalSteps = WALKTHROUGH_SEQUENCE.length;

  const content: Record<string, StepContent> = {
    WELCOME: {
      title: "Welcome, Manager!",
      text: "Fantasy Premier League is a free game where YOU become a football manager. Pick real Premier League players, earn points when they perform well in real matches, and compete with friends.",
      details: [
        "No football expertise needed - we'll guide you through everything",
        "It's completely free to play",
        "Millions of people play FPL worldwide - you're joining a huge community",
        "You can win coins, badges, and prizes as you learn"
      ],
      actionLabel: "Tell me more",
      icon: <UserCheck size={24} className="text-white" />,
      stepNumber: 1,
      totalSteps,
      illustration: "🏟️"
    },
    WHAT_IS_FPL: {
      title: "How Does It Work?",
      text: "Every weekend, Premier League teams play real football matches in England. Your fantasy players earn points based on what they do in those real matches.",
      details: [
        "If your player scores a goal in real life = you get points",
        "If your player assists a goal = you get points",
        "If your defender keeps a clean sheet (no goals conceded) = bonus points",
        "Your total points are compared against other managers in your leagues",
        "The manager with the most points wins!"
      ],
      actionLabel: "What's my squad?",
      icon: <Target size={24} className="text-white" />,
      stepNumber: 2,
      totalSteps,
      illustration: "⚽"
    },
    SQUAD_RULES: {
      title: "Building Your Squad",
      text: "You pick 15 real Premier League players with a budget of \u00a3100 million. 11 play each week, 4 sit on the bench as backup.",
      details: [
        "2 Goalkeepers (1 plays, 1 backup)",
        "5 Defenders (at least 3 must play each week)",
        "5 Midfielders (at least 2 must play each week)",
        "3 Forwards (at least 1 must play each week)",
        "Maximum 3 players from any single club",
        "Expensive players usually score more, but you can't afford them all!"
      ],
      actionLabel: "How do points work?",
      icon: <Shirt size={24} className="text-white" />,
      stepNumber: 3,
      totalSteps,
      illustration: "👥"
    },
    POINTS: {
      title: "Scoring System",
      text: "Here's how your players earn points each match week. The better they perform in real life, the more points you get!",
      details: [
        "⚽ Goal by Forward = 4 pts | Midfielder = 5 pts | Defender/GK = 6 pts",
        "🎯 Assist (setting up a goal) = 3 pts",
        "🛡️ Clean Sheet (DEF/GK, no goals conceded) = 4 pts",
        "⏱️ Playing 60+ minutes = 2 pts | Under 60 min = 1 pt",
        "⭐ Bonus Points = 1-3 pts for best performers in each match",
        "🟨 Yellow Card = -1 pt | 🟥 Red Card = -3 pts",
        "❌ Own Goal = -2 pts | Missed Penalty = -2 pts"
      ],
      actionLabel: "What's a Gameweek?",
      stepNumber: 4,
      totalSteps,
      illustration: "📊"
    },
    GAMEWEEK_EXPLAINED: {
      title: "Gameweeks & Deadlines",
      text: "The Premier League season is split into 38 Gameweeks. Each week, you have a deadline to set your team before matches start (usually Saturday).",
      details: [
        "Before the deadline: Make transfers, set your captain, arrange your team",
        "After deadline: Your team is LOCKED - no more changes until next week",
        "During matches: Watch your points update live as games happen!",
        "After matches: Final points are calculated, rankings update",
        "You get 1 free transfer each week to swap a player",
        "Extra transfers cost 4 points each (sometimes worth it!)"
      ],
      actionLabel: "Captain power!",
      icon: <Clock size={24} className="text-white" />,
      stepNumber: 5,
      totalSteps,
      illustration: "📅"
    },
    CAPTAINCY: {
      title: "Your Captain = 2x Points",
      text: "Every week, you choose ONE player as Captain. Whatever points they score are DOUBLED. Choose wisely - this is the single biggest decision each week!",
      details: [
        "Pick a player who has a good matchup this week",
        "Check if they're playing against a weak team",
        "Forwards and midfielders usually make the best captains",
        "You also pick a Vice-Captain as backup (in case your captain doesn't play)",
        "If your captain gets 10 points, you actually get 20!"
      ],
      actionLabel: "How do transfers work?",
      icon: <Star size={24} className="text-yellow-300 fill-yellow-300" />,
      stepNumber: 6,
      totalSteps,
      illustration: "👑"
    },
    TRANSFERS_INTRO: {
      title: "The Transfer Market",
      text: "You start with \u00a3100m to buy 15 players. Each week you get 1 free transfer to swap out a player who isn't performing for someone better.",
      details: [
        "Player prices change based on how many managers buy/sell them",
        "Buy low, sell high - you can profit from price changes",
        "You only get half the profit when selling (so be strategic!)",
        "Extra transfers beyond your free one cost 4 points each",
        "Wildcards let you make unlimited free transfers (you get 2 per season)"
      ],
      actionLabel: "What are Chips?",
      icon: <ArrowLeftRight size={24} className="text-white" />,
      stepNumber: 7,
      totalSteps,
      illustration: "💰"
    },
    CHIPS_EXPLAINED: {
      title: "Special Power-Ups (Chips)",
      text: "You have 4 special 'Chips' you can activate once per season for a big advantage. Save them for the right moment!",
      details: [
        "🃏 Wildcard: Unlimited free transfers for one week (you get 2 per season)",
        "🎯 Free Hit: Temporary team for one week, reverts back next week",
        "📈 Bench Boost: All 15 players score (not just your starting 11)",
        "👑 Triple Captain: Captain scores 3x points instead of 2x",
        "Using chips at the right time can gain you 20-50+ extra points!"
      ],
      actionLabel: "Tell me about Leagues",
      icon: <Zap size={24} className="text-yellow-300" />,
      stepNumber: 8,
      totalSteps,
      illustration: "🃏"
    },
    LEAGUES_INTRO: {
      title: "Leagues & Competition",
      text: "The fun is in competing! Join leagues to play against friends, colleagues, or other Ethiopian FPL managers. See who's the best manager!",
      details: [
        "Classic League: Total points over the season - highest score wins",
        "Head-to-Head (H2H): Face a different opponent each week",
        "Public Leagues: Compete against all Ethiopian players",
        "Private Leagues: Create one and invite friends with a code",
        "Prize Leagues: Put ETB on the line for bigger rewards",
        "Showroom Leagues: Compete locally at coffee shops and venues"
      ],
      actionLabel: "Coins & Rewards?",
      icon: <Users size={24} className="text-white" />,
      stepNumber: 9,
      totalSteps,
      illustration: "🏆"
    },
    COINS_AND_XP: {
      title: "Earn As You Learn",
      text: "You earn Coins and XP for playing the game. XP levels you up and unlocks features. Coins let you enter contests and buy items.",
      details: [
        "🪙 Coins: Earned from trivia, quests, check-ins, and mini-games",
        "⭐ XP: Earned from daily logins, transfers, winning matchups",
        "📈 Levels: Unlock contests, mini-games, and features as you level up",
        "☕ Coffee Hour: Bonus XP & coins every morning 6-9 AM Ethiopia time!",
        "🏪 Showrooms: Check in at partner venues for bonus rewards",
        "🎮 Mini-Games: Play Penalty Shootout and Price Predictor for coins"
      ],
      actionLabel: "I'm ready to play!",
      icon: <Coins size={24} className="text-yellow-300" />,
      stepNumber: 10,
      totalSteps,
      illustration: "🌟"
    },
    DEADLINE: {
      title: "You're All Set!",
      text: "You now know the basics. Don't worry about being perfect - even experienced managers learn new strategies every week. The Coach icon in the top bar is always here to help!",
      details: [
        "Tap the 🎓 icon anytime to reopen this guide",
        "Look for ℹ️ icons throughout the app for quick explanations",
        "Check the Daily Hub for quests that teach you new skills",
        "Join a league to see how you compare with others",
        "Most importantly: have fun and don't stress!"
      ],
      actionLabel: "Start Playing!",
      stepNumber: 11,
      totalSteps,
      illustration: "🚀"
    },
    MARKET_GUIDE: {
      title: "Scouting Players",
      text: "Look for players with high 'Form' (recent performance) and good upcoming fixtures. Tap any player to see their full stats before buying.",
      details: [
        "Form: A rating of recent performance (higher = better recent scores)",
        "Price: How much they cost from your budget",
        "Total Points: How many points they've scored all season",
        "Selected By %: How popular they are among all managers",
        "Fixtures: Who they play next - easier opponents = more likely to score"
      ]
    },
    ERROR_LIMIT: {
      title: "Squad Rule Alert",
      text: customMessage || "You can only have 3 players from any single Premier League club. This rule makes sure you build a diverse squad across many teams.",
      actionLabel: "Understood",
      icon: <ShieldAlert size={24} className="text-yellow-300" />,
      illustration: "⚠️"
    }
  };

  const current = content[step];
  if (!current) return null;

  const handleNext = () => {
    setExpandedDetails(false);
    // Navigate the user to the relevant tab at specific walkthrough steps
    if (onAction) {
      if (step === 'SQUAD_RULES') {
        onAction('GOTO_TEAM');
        onNext();
        return;
      }
      if (step === 'CAPTAINCY') {
        onAction('GOTO_TEAM');
        onNext();
        return;
      }
      if (step === 'TRANSFERS_INTRO') {
        onAction('GOTO_TRANSFERS');
        onNext();
        return;
      }
      if (step === 'CHIPS_EXPLAINED') {
        onAction('GOTO_TEAM');
        onNext();
        return;
      }
      if (step === 'LEAGUES_INTRO') {
        onAction('GOTO_LEAGUES');
        onNext();
        return;
      }
      if (step === 'COINS_AND_XP') {
        onAction('GOTO_HOME');
        onNext();
        return;
      }
      if (step === 'POINTS') {
        onAction('GOTO_STATS');
        onNext();
        return;
      }
    }
    onNext();
  };

  const handleBack = () => {
    if (isInWalkthrough && currentIndex > 0) {
      setExpandedDetails(false);
      // We need the parent to handle going back, so we use onAction
      if (onAction) onAction('GOTO_STEP_' + WALKTHROUGH_SEQUENCE[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center pb-20 px-3 sm:items-center sm:pb-0">
      <div className="bg-gradient-to-br from-pl-purple to-indigo-900 text-white w-full max-w-sm rounded-2xl shadow-2xl border-2 border-white/20 pointer-events-auto relative overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pl-pink opacity-20 blur-3xl rounded-full pointer-events-none"></div>

        {/* Progress Bar (if in walkthrough) */}
        {isInWalkthrough && current.stepNumber && (
          <div className="px-5 pt-4 pb-0">
            <div className="flex items-center justify-between text-[10px] text-white/60 mb-1.5">
              <span>Step {current.stepNumber} of {current.totalSteps}</span>
              <span>{Math.round(((current.stepNumber) / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-pl-green h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((current.stepNumber) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-5 pt-3 flex gap-4">
          {/* Avatar / Illustration Area */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border-2 border-pl-green mb-1 shadow-lg">
              {current.illustration ? (
                <span className="text-2xl">{current.illustration}</span>
              ) : current.icon ? (
                current.icon
              ) : (
                <span className="text-2xl">🧢</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-pl-green bg-black/20 px-2 py-0.5 rounded-full">COACH</span>
          </div>

          {/* Text Area */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1.5">
              {current.title}
            </h3>
            <p className="text-sm text-white/90 leading-relaxed mb-2">
              {current.text}
            </p>

            {/* Expandable Details */}
            {current.details && current.details.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setExpandedDetails(!expandedDetails)}
                  className="text-[11px] text-pl-green font-medium flex items-center gap-1 hover:text-white transition mb-1"
                >
                  <HelpCircle size={12} />
                  {expandedDetails ? 'Hide details' : 'Learn more...'}
                </button>
                {expandedDetails && (
                  <div className="bg-black/20 rounded-lg p-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 max-h-40 overflow-y-auto">
                    {current.details.map((detail, i) => (
                      <div key={i} className="text-[11px] text-white/80 flex items-start gap-2">
                        <span className="text-pl-green mt-0.5 shrink-0">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Back Button (if in walkthrough and not first step) */}
              {isInWalkthrough && currentIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="text-white/40 hover:text-white text-xs font-bold px-2 py-2 flex items-center gap-0.5 transition"
                >
                  <ChevronLeft size={14} />
                  Back
                </button>
              )}

              {current.actionLabel && (
                <button
                  onClick={handleNext}
                  className="bg-pl-green text-pl-purple text-xs font-bold px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-1 shadow-md"
                >
                  {current.actionLabel} <ChevronRight size={14} />
                </button>
              )}

              {step !== 'ERROR_LIMIT' && (
                <button
                  onClick={onDismiss}
                  className="text-white/40 text-xs font-bold px-2 py-2 hover:text-white transition ml-auto"
                >
                  {isInWalkthrough ? 'Skip All' : 'Close'}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 p-1.5 text-white/30 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCoach;
