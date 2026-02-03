import React, { useState, useEffect, useMemo } from 'react';
import { Users, Shirt, Wallet, Trophy, Bell, Menu, Plus, ArrowLeftRight, Settings, Send, Globe, BarChart2, TrendingUp, TrendingDown, Shield, RefreshCw, MessageCircle, Star, Zap, Lock, CheckCircle, AlertTriangle, AlertOctagon, PlayCircle, MapPin, Building2, GraduationCap, Database, Wifi, WifiOff, Home } from 'lucide-react';
import { MOCK_PLAYERS, MOCK_LEAGUES, MOCK_TRANSACTIONS, CURRENCY_SYMBOL, TRANSLATIONS, MOCK_DAILY_QUESTS, MOCK_TRIVIA, MOCK_GAMEWEEKS, LEVELS_CONFIG, getTeamFixtures } from './constants';
import { Player, Position, GameweekStatus, League, Notification, ChipType } from './types';
import Pitch from './components/Pitch';
import WalletModal from './components/WalletModal';
import TransferMarket from './components/TransferMarket';
import AICoach from './components/AICoach';
import FixtureTicker from './components/FixtureTicker';
import PlayerStatsTable from './components/PlayerStatsTable';
import TeamStatsTable from './components/TeamStatsTable';
import PlayerDetailModal from './components/PlayerDetailModal';
import DailyHub from './components/DailyHub';
import TriviaModal from './components/TriviaModal';
import LeagueChatModal from './components/LeagueChatModal';
import GameweekStatsList from './components/GameweekStatsList';
import ProfileModal from './components/ProfileModal';
import CreateLeagueModal from './components/CreateLeagueModal';
import NotificationModal from './components/NotificationModal';
import FlashScoutModal from './components/FlashScoutModal';
import LeagueDetailModal from './components/LeagueDetailModal';
import ChipBar from './components/ChipBar';
import OnboardingCoach, { TutorialStep } from './components/OnboardingCoach';
import { calculateScore, generateRandomStats, MatchStats } from './scoring';
import { supabase } from './services/supabase';

// --- Sub-Components ---

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${active ? 'text-pl-purple font-bold' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const LeagueCard: React.FC<{ league: League; onChatClick: () => void; userLevel: number; onJoin?: () => void; onClick: () => void }> = ({ league, onChatClick, userLevel, onJoin, onClick }) => {
  const isLocked = league.min_level && userLevel < league.min_level;

  const getIcon = () => {
      switch(league.type) {
          case 'city': return <MapPin size={14} className="text-blue-500" />;
          case 'company': return <Building2 size={14} className="text-orange-500" />;
          case 'university': return <GraduationCap size={14} className="text-purple-500" />;
          case 'prize': return <Trophy size={14} className="text-yellow-600" />;
          default: return <Users size={14} className="text-gray-500" />;
      }
  };

  return (
    <div 
        onClick={!isLocked && league.rank > 0 ? onClick : undefined}
        className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 relative overflow-hidden transition ${!isLocked && league.rank > 0 ? 'cursor-pointer hover:border-pl-purple' : ''} ${isLocked ? 'opacity-70' : ''}`}
    >
      {isLocked && (
          <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-2">
                  <Lock size={12} className="text-red-500"/>
                  <span className="text-xs font-bold text-gray-700">Requires Level {league.min_level}</span>
              </div>
          </div>
      )}
      
      <div className="flex items-center justify-between relative z-10">
          <div>
          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              {league.name}
              {league.telegram_group_id && !isLocked && league.rank > 0 && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); onChatClick(); }}
                      className="bg-blue-100 text-blue-600 p-1 rounded-full hover:bg-blue-200 transition"
                  >
                      <MessageCircle size={14} />
                  </button>
              )}
          </h4>
          <div className="flex gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 bg-gray-100 text-gray-600`}>
                {getIcon()}
                {league.type === 'h2h' ? 'Head-to-Head' : league.type.charAt(0).toUpperCase() + league.type.slice(1)}
              </span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Users size={10} /> {league.members_count.toLocaleString()}
              </span>
          </div>
          {(league.location || league.organization) && (
              <div className="text-[10px] text-gray-400 mt-1">{league.location || league.organization}</div>
          )}
          {league.code && (
              <div className="text-[10px] text-gray-400 mt-1">Code: <span className="font-mono text-gray-600 bg-gray-100 px-1 rounded">{league.code}</span></div>
          )}
          </div>
          
          <div className="text-right">
              {league.type === 'h2h' ? (
                  <>
                      <div className="text-xs text-gray-500">Record</div>
                      <div className="font-bold text-gray-800 text-lg">{league.user_h2h_record || "-"}</div>
                      <div className="text-[10px] text-pl-purple font-bold">{league.user_h2h_points || 0} pts</div>
                  </>
              ) : (
                  <>
                      <div className="text-xs text-gray-500">Rank</div>
                      <div className="font-bold text-pl-purple text-lg">#{league.rank > 0 ? league.rank.toLocaleString() : '-'}</div>
                      {league.rank_change !== 0 && (
                          <div className={`text-[10px] font-bold flex items-center justify-end ${league.rank_change > 0 ? 'text-pl-green' : 'text-red-500'}`}>
                              {league.rank_change > 0 ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                              {Math.abs(league.rank_change)}
                          </div>
                      )}
                  </>
              )}
          </div>
      </div>
      
      {/* Join Button for unjoined leagues */}
      {league.rank === 0 && !isLocked && onJoin && (
          <button 
            onClick={(e) => { e.stopPropagation(); onJoin(); }}
            className="w-full mt-3 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition"
          >
             Join Now {league.entry_fee ? `(${league.entry_fee} ETB)` : ''}
          </button>
      )}
      
      {/* Manager of the Month Badge - League Enhancement */}
      {league.manager_of_month && (
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between relative z-10">
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Manager of the Month</span>
              <span className="text-xs font-bold text-pl-purple bg-pl-purple/5 px-2 py-0.5 rounded flex items-center gap-1">
                  <Trophy size={10} /> {league.manager_of_month}
              </span>
          </div>
      )}
    </div>
  );
}

// Helper: Calculate Selling Price based on Rules
const calculateSellingPrice = (player: Player): number => {
    const purchasePrice = player.purchase_price || player.price;
    const currentPrice = player.price;

    if (currentPrice <= purchasePrice) {
        return currentPrice;
    } else {
        const profit = currentPrice - purchasePrice;
        const gain = Math.floor(Math.round(profit * 10) / 2) * 0.1; 
        return parseFloat((purchasePrice + gain).toFixed(1));
    }
};

// Helper: Check valid formation
const validateFormation = (players: Player[]): boolean => {
    const starters = players.filter(p => !p.is_bench);
    const defs = starters.filter(p => p.position === Position.DEF).length;
    const mids = starters.filter(p => p.position === Position.MID).length;
    const fwds = starters.filter(p => p.position === Position.FWD).length;
    const gks = starters.filter(p => p.position === Position.GK).length;

    // Rules: 1 GK, Min 3 DEF, Min 2 MID, Min 1 FWD
    return gks === 1 && defs >= 3 && mids >= 2 && fwds >= 1 && starters.length === 11;
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'team' | 'transfers' | 'leagues' | 'wallet' | 'stats'>('home');
  const [statsSubTab, setStatsSubTab] = useState<'Players' | 'Teams' | 'Gameweeks'>('Players');
  
  // Wallet & Modals
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletMode, setWalletMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [balance, setBalance] = useState(150); // ETB Mock Balance
  
  // Data State
  const [squad, setSquad] = useState<Player[]>(MOCK_PLAYERS);
  const [originalSquad, setOriginalSquad] = useState<Player[]>(MOCK_PLAYERS); // Snapshot for diffing
  const [leagues, setLeagues] = useState<League[]>(MOCK_LEAGUES);
  
  // Chip State
  const [chipInventory, setChipInventory] = useState<Record<ChipType, number>>({
      wildcard: 2,
      freehit: 1,
      benchboost: 1,
      triplecaptain: 1
  });
  const [activeChip, setActiveChip] = useState<ChipType | null>(null);

  // Transfer Logic State
  const [freeTransfers, setFreeTransfers] = useState(1); // Default 1
  const [transfersMadeCount, setTransfersMadeCount] = useState(0); // Track logic diff
  const [confirmedTransferCost, setConfirmedTransferCost] = useState(0); // For XP calculation

  // Player Interaction States
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [playerToSell, setPlayerToSell] = useState<Player | null>(null); // For Transfers

  // Gamification States
  const [showTrivia, setShowTrivia] = useState(false);
  const [activeLeagueChat, setActiveLeagueChat] = useState<League | null>(null);
  const [selectedLeagueDetail, setSelectedLeagueDetail] = useState<League | null>(null); // New State
  const [userLevel, setUserLevel] = useState(5);
  const [userXP, setUserXP] = useState(1250);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateLeagueOpen, setIsCreateLeagueOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isFlashScoutOpen, setIsFlashScoutOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [language, setLanguage] = useState<'en' | 'am'>('en');
  
  // Gameweek Lifecycle State & Countdown
  const [gameweekStatus, setGameweekStatus] = useState<GameweekStatus>(GameweekStatus.ACTIVE);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showLockAnimation, setShowLockAnimation] = useState(false);

  // In-Game Economy Budget (100.0)
  const [gameBudget, setGameBudget] = useState(1.5); // 1.5m in the bank

  // --- Tutorial / Onboarding State ---
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('WELCOME');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // --- Database Connection Status ---
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const t = TRANSLATIONS[language];

  // Check Database Connection on Mount
  useEffect(() => {
    const checkDb = async () => {
      try {
        // Simple query to check if we can reach the backend
        const { error } = await supabase.from('players').select('id').limit(1);
        
        if (error) {
            console.error("Supabase Error:", error);
            setDbStatus('error');
        } else {
            setDbStatus('connected');
        }
      } catch (e) {
        console.error("Connection Error:", e);
        setDbStatus('error');
      }
    };
    checkDb();
  }, []);

  // Initialize Squad with Fixture Data for the Current Gameweek (e.g. 38)
  useEffect(() => {
      const currentGW = MOCK_GAMEWEEKS.find(gw => gw.is_current);
      if (currentGW) {
          const updatedSquad = squad.map(p => {
              const allFixtures = getTeamFixtures(p.team);
              const gwFixtures = allFixtures.filter(f => f.gameweek === currentGW.gameweek_number);
              return { ...p, upcoming_fixtures: gwFixtures };
          });
          setSquad(updatedSquad);
      }
  }, []);

  // Initialize Tutorial
  useEffect(() => {
      const storedOnboarding = localStorage.getItem('fpl_eth_onboarding');
      if (storedOnboarding === 'done') {
          setHasCompletedOnboarding(true);
          setTutorialStep('HIDDEN');
      } else {
          setTutorialStep('WELCOME');
      }
  }, []);

  // Derived State: Squad Value & Validation
  const teamValue = squad.reduce((acc, p) => acc + p.price, 0).toFixed(1);
  
  const netTransfers = squad.filter(p => !originalSquad.some(op => op.id === p.id)).length;
  
  // Transfer Cost Calculation with Chips
  const transferCost = useMemo(() => {
      // Wildcard or Free Hit negate transfer costs
      if (activeChip === 'wildcard' || activeChip === 'freehit') return 0;
      return Math.max(0, (netTransfers - freeTransfers) * 4);
  }, [netTransfers, freeTransfers, activeChip]);

  const validationIssues = useMemo(() => {
    const issues: string[] = [];
    const teamCounts: {[key: string]: number} = {};
    squad.forEach(p => {
        teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
        if (teamCounts[p.team] > 3) {
            if (!issues.includes(`Max 3 players from ${p.team}`)) {
                issues.push(`Max 3 players from ${p.team}`);
            }
        }
    });

    if (gameBudget < 0) issues.push(`Over budget by £${Math.abs(gameBudget).toFixed(1)}m`);
    
    // Check formation validity
    if (!validateFormation(squad)) {
        issues.push("Invalid Formation (Need: 3+ DEF, 2+ MID, 1+ FWD)");
    }

    // Check Captaincy
    if (!squad.some(p => p.is_captain)) issues.push("Captain must be selected");
    if (!squad.some(p => p.is_vice_captain)) issues.push("Vice-Captain must be selected");

    return issues;
  }, [squad, gameBudget]);

  const levelInfo = LEVELS_CONFIG.find(l => l.level === userLevel) || LEVELS_CONFIG[0];
  const mockNotifications: Notification[] = [
      { notification_id: '1', title: 'Gameweek 38 Deadline', message: 'Deadline is tomorrow at 13:30 EAT', type: 'deadline', created_at: '2h ago', is_read: false, telegram_sent: true, user_id: '1' },
      { notification_id: '2', title: 'Price Rise', message: 'Haaland price rose to 14.1m', type: 'system', created_at: '5h ago', is_read: false, telegram_sent: false, user_id: '1' }
  ];

  // --- Countdown Logic ---
  const currentGW = MOCK_GAMEWEEKS.find(gw => gw.is_current);

  useEffect(() => {
    if (!currentGW) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(currentGW.deadline_time).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        if (gameweekStatus === GameweekStatus.ACTIVE) {
             setGameweekStatus(GameweekStatus.LOCKED);
             setShowLockAnimation(true);
             setTimeout(() => setShowLockAnimation(false), 3000); 
             showToast("Deadline Passed! Gameweek is now Locked.", "error");
        }
        setTimeLeft("00d 00h 00m 00s");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        
        if (gameweekStatus === GameweekStatus.LOCKED && distance > 0) {
            setGameweekStatus(GameweekStatus.ACTIVE);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentGW, gameweekStatus]);


  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleTransaction = (amount: number, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
        setBalance(prev => prev + amount);
        showToast(`Successfully deposited ${amount} ETB`);
    } else {
        if (amount > balance) {
            showToast("Insufficient funds", "error");
            return;
        }
        setBalance(prev => prev - amount);
        showToast(`Successfully withdrew ${amount} ETB`);
    }
  };

  const handleConfirmTransfers = () => {
      if (gameweekStatus !== GameweekStatus.ACTIVE) {
          showToast("Market Closed. Gameweek Locked.", "error");
          return;
      }

      if (validationIssues.length > 0) {
          showToast(validationIssues[0], "error");
          return;
      }
      
      // Cost is 0 if Chip is active
      if (transferCost > 0) {
          const confirm = window.confirm(`This will cost ${transferCost} points. Are you sure?`);
          if (!confirm) return;
      }

      setOriginalSquad([...squad]);
      setFreeTransfers(Math.max(0, freeTransfers - netTransfers));
      setConfirmedTransferCost(transferCost); // Track cost for XP Calculation later
      showToast("Transfers Confirmed!");
      setActiveTab('team');
  };

  const handleSaveTeam = () => {
    if (gameweekStatus !== GameweekStatus.ACTIVE) {
        showToast("Cannot save. Gameweek Locked.", "error");
        return;
    }
    if (validationIssues.length > 0) {
        showToast(validationIssues[0], "error");
        return;
    }
    showToast("Team saved successfully!");
    
    // Tutorial: If deadline step, complete it
    if (tutorialStep === 'DEADLINE') {
        setTutorialStep('HIDDEN');
        localStorage.setItem('fpl_eth_onboarding', 'done');
    }
  };

  const handleJoinLeague = (league: League) => {
      if (league.entry_fee && balance < league.entry_fee) {
          showToast(`Insufficient balance. Need ${league.entry_fee} ETB`, 'error');
          setIsWalletOpen(true);
          setWalletMode('deposit');
          return;
      }

      if (league.entry_fee) {
          setBalance(prev => prev - league.entry_fee!);
      }

      setLeagues(prev => prev.map(l => 
          l.league_id === league.league_id 
          ? { ...l, rank: 999, members_count: l.members_count + 1 } // Mock join
          : l
      ));
      showToast(`Joined ${league.name}!`);
  };

  const handleCreateLeague = (name: string, type: string) => {
      const newLeague: League = {
          league_id: Date.now(),
          name,
          type: type as any,
          rank: 1,
          rank_change: 0,
          members_count: 1,
          status: 'active',
          code: Math.random().toString(36).substring(7).toUpperCase(),
          created_at: new Date().toISOString().split('T')[0]
      };
      setLeagues([newLeague, ...leagues]);
      setIsCreateLeagueOpen(false);
      showToast(`League "${name}" created!`);
  };

  const handleBuyPlayer = (playerIn: Player) => {
      if (gameweekStatus !== GameweekStatus.ACTIVE) {
          showToast("Market Closed.", "error");
          return;
      }

      if (!playerToSell) {
          showToast("Select a player from your squad to remove first", "error");
          return;
      }
      
      if (playerIn.position !== playerToSell.position) {
          showToast(`Must replace ${playerToSell.position} with ${playerToSell.position}`, "error");
          return;
      }

      const sellPrice = calculateSellingPrice(playerToSell);
      const availableFunds = gameBudget + sellPrice;
      
      if (playerIn.price > availableFunds) {
          showToast(`Insufficient funds. Max: ${availableFunds.toFixed(1)}m`, "error");
          return;
      }

      const teamCount = squad.filter(p => p.team === playerIn.team && p.id !== playerToSell.id).length;
      if (teamCount >= 3) {
          showToast(`Max 3 players from ${playerIn.team}`, "error");
          
          // Tutorial Trigger: Show error limit explanation
          if (tutorialStep !== 'HIDDEN') setTutorialStep('ERROR_LIMIT');
          return;
      }

      const newSquad = squad.map(p => p.id === playerToSell.id ? playerIn : p);
      setSquad(newSquad);
      setGameBudget(prev => parseFloat((availableFunds - playerIn.price).toFixed(1)));
      setPlayerToSell(null);
      showToast(`Signed ${playerIn.name}!`);
      
      // Tutorial: If this was the market guide step, move to next
      if (tutorialStep === 'MARKET_GUIDE') setTutorialStep('DEADLINE');
  };

  const handlePlayerAction = (action: 'swap' | 'captain' | 'vice_captain' | 'info') => {
      if (!selectedPlayerId) return;
      const player = squad.find(p => p.id === selectedPlayerId);
      if (!player) return;

      if (action === 'info') {
          setViewingPlayer(player);
          return;
      }

      if (gameweekStatus !== GameweekStatus.ACTIVE) {
          showToast("Changes locked during LIVE gameweek", "error");
          return;
      }

      if (action === 'swap') {
          if (activeTab === 'transfers') {
              setPlayerToSell(player);
          } else {
              // Internal Swap (Bench) logic
              const starter = player;
              const isBench = starter.is_bench;
              
              // Find first available swap target (simple version: just toggle is_bench for demo)
              // In real FPL, you pick target. Here we just swap with first valid bench player for simplicity in demo
              // Or better: set a "swapMode" state.
              // For MVP: Toggle bench status if valid formation remains? 
              // Actually, better to just switch to transfers tab to Sell
              setActiveTab('transfers');
              setPlayerToSell(player);
          }
      } else if (action === 'captain') {
          setSquad(squad.map(p => ({ 
              ...p, 
              is_captain: p.id === player.id,
              is_vice_captain: p.id === player.id ? false : p.is_vice_captain // Clear VC if C
          })));
          showToast(`${player.name} is now Captain`);
          
          if (tutorialStep === 'CAPTAINCY') setTutorialStep('DEADLINE');
      } else if (action === 'vice_captain') {
           setSquad(squad.map(p => ({ 
              ...p, 
              is_vice_captain: p.id === player.id,
              is_captain: p.id === player.id ? false : p.is_captain // Clear C if VC
          })));
          showToast(`${player.name} is now Vice-Captain`);
      }
      setSelectedPlayerId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-24">
      
      {/* --- HEADER --- */}
      <header className="bg-pl-purple text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="relative">
                 <div className="w-8 h-8 rounded-full bg-white p-0.5 cursor-pointer" onClick={() => setIsProfileOpen(true)}>
                    <img src={MOCK_PLAYERS[0].image} className="w-full h-full rounded-full object-cover" alt="Profile" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-pl-green text-pl-purple text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                     {userLevel}
                 </div>
             </div>
             <div>
                 <h1 className="font-bold text-sm">Ethiopian FPL</h1>
                 <div className="flex items-center gap-2 text-[10px] text-white/80">
                    <span className="flex items-center gap-0.5"><Star size={10} className="text-eth-yellow fill-eth-yellow"/> {userXP} XP</span>
                 </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* DB Status Indicator */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                {dbStatus === 'checking' && <RefreshCw className="animate-spin text-white" size={14} />}
                {dbStatus === 'connected' && <Wifi className="text-pl-green" size={14} />}
                {dbStatus === 'error' && <WifiOff className="text-red-500" size={14} />}
            </div>
            
            <button onClick={() => setLanguage(l => l === 'en' ? 'am' : 'en')} className="font-bold text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition">
                {language.toUpperCase()}
            </button>
            <div 
                className="bg-pl-green text-pl-purple px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-white transition shadow-sm"
                onClick={() => { setIsWalletOpen(true); setWalletMode('deposit'); }}
            >
              <Wallet size={12} /> {balance}
            </div>
            <button className="relative" onClick={() => setIsNotificationOpen(true)}>
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-pl-purple"></span>
            </button>
          </div>
        </div>
        
        {/* Gameweek Status Bar */}
        <div className="bg-[#2A0F45] px-4 py-2 flex justify-between items-center text-xs border-t border-white/10">
            <div className="flex items-center gap-2">
                <span className="font-bold text-pl-green">GW{currentGW?.gameweek_number}</span>
                <span className="text-white/60">
                    {gameweekStatus === GameweekStatus.ACTIVE ? t.status_active : 
                     gameweekStatus === GameweekStatus.LOCKED ? t.status_locked : t.status_processing}
                </span>
            </div>
            <div className="font-mono font-bold text-white tabular-nums flex items-center gap-1">
                {timeLeft}
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {/* --- HOME TAB --- */}
        {activeTab === 'home' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Daily Hub */}
                <DailyHub streak={7} quests={MOCK_DAILY_QUESTS} onOpenTrivia={() => setShowTrivia(true)} />
                
                {/* Next Deadline Card */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('team')}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg">Gameweek {currentGW?.gameweek_number}</h3>
                                <p className="text-xs text-gray-300">Deadline: {new Date(currentGW?.deadline_time || '').toLocaleDateString()} 13:30</p>
                            </div>
                            <div className="bg-pl-green text-pl-purple font-bold text-xs px-2 py-1 rounded">
                                Next
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                                <Shirt size={14} className="text-gray-400" />
                                <span className="font-bold">{teamValue}m</span> Value
                            </div>
                            <div className="flex items-center gap-1">
                                <ArrowLeftRight size={14} className="text-gray-400" />
                                <span className="font-bold">{freeTransfers}</span> Free Transfer
                            </div>
                        </div>
                    </div>
                    <ArrowLeftRight className="absolute -bottom-4 -right-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
                </div>

                {/* Live Match Center Preview */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="font-bold text-gray-800 flex items-center gap-2">
                             <PlayCircle size={16} className="text-red-500" /> Live Matches
                         </h3>
                         <span className="text-xs font-bold text-pl-purple">Show All</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                            <div className="flex items-center gap-2 w-1/3">
                                <span className="font-bold">MCI</span>
                                <span className="text-gray-400">vs</span>
                                <span className="font-bold">LIV</span>
                            </div>
                            <div className="font-mono font-bold text-pl-purple bg-purple-50 px-2 py-0.5 rounded">2 - 2</div>
                            <div className="w-1/3 text-right text-green-600 font-bold">88'</div>
                        </div>
                        <div className="flex items-center justify-between text-xs py-2">
                            <div className="flex items-center gap-2 w-1/3">
                                <span className="font-bold">ARS</span>
                                <span className="text-gray-400">vs</span>
                                <span className="font-bold">CHE</span>
                            </div>
                            <div className="font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">17:30</div>
                            <div className="w-1/3 text-right text-gray-400">Upcoming</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- TEAM TAB --- */}
        {activeTab === 'team' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {/* Chip Bar */}
                <ChipBar 
                    inventory={chipInventory} 
                    activeChip={activeChip} 
                    onActivate={(chip) => {
                        if (gameweekStatus !== GameweekStatus.ACTIVE) return;
                        setActiveChip(chip);
                        setChipInventory(prev => ({ ...prev, [chip as ChipType]: prev[chip as ChipType] - 1 })); // Ideally logic handles revert if cancelled
                    }} 
                    isLocked={gameweekStatus !== GameweekStatus.ACTIVE}
                />

                <Pitch 
                    squad={squad} 
                    onPlayerClick={(p) => setSelectedPlayerId(p.id === selectedPlayerId ? null : p.id)} 
                    selectedPlayerId={selectedPlayerId}
                    isLocked={gameweekStatus !== GameweekStatus.ACTIVE}
                    onAction={handlePlayerAction}
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                        onClick={handleSaveTeam}
                        className={`bg-pl-green text-pl-purple font-bold py-3 rounded-xl shadow-sm hover:bg-opacity-90 transition ${gameweekStatus !== GameweekStatus.ACTIVE ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Save Team
                    </button>
                    <button 
                        onClick={() => setIsFlashScoutOpen(true)}
                        className="bg-gray-900 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <Zap size={16} className="text-yellow-400" /> Flash Scout
                    </button>
                </div>
            </div>
        )}

        {/* --- TRANSFERS TAB --- */}
        {activeTab === 'transfers' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {/* Budget Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center sticky top-[120px] z-20">
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Bank</div>
                        <div className="font-bold text-xl text-pl-purple">£{gameBudget.toFixed(1)}m</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Free Transfers</div>
                        <div className="font-bold text-xl text-gray-800">{freeTransfers}</div>
                    </div>
                    <div className="text-right border-l pl-4 ml-2 border-gray-100">
                         <div className="text-[10px] font-bold text-gray-500 uppercase">Cost</div>
                         <div className={`font-bold text-xl ${transferCost > 0 ? 'text-red-500' : 'text-gray-800'}`}>-{transferCost} pts</div>
                    </div>
                </div>

                {/* AI Advice Widget */}
                <AICoach squad={squad} bank={gameBudget} />
                
                {/* Fixture Ticker Helper */}
                <FixtureTicker userTeam="ARS" />

                {/* Transfer Market List */}
                <TransferMarket 
                    onBuy={handleBuyPlayer} 
                    currentBudget={gameBudget}
                    squad={squad}
                    playerToSell={playerToSell}
                    onCancelSell={() => setPlayerToSell(null)}
                    sellingPriceOfOutPlayer={playerToSell ? calculateSellingPrice(playerToSell) : 0}
                    isLocked={gameweekStatus !== GameweekStatus.ACTIVE}
                />

                {netTransfers > 0 && (
                    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40">
                         <button 
                            onClick={handleConfirmTransfers}
                            className="w-full bg-pl-purple text-white font-bold py-4 rounded-2xl shadow-2xl hover:bg-opacity-90 transition flex justify-between items-center px-6 border-2 border-white/20"
                         >
                             <span>Confirm {netTransfers} Transfer{netTransfers > 1 ? 's' : ''}</span>
                             <div className="flex items-center gap-2">
                                 {transferCost > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">-{transferCost} pts</span>}
                                 <ArrowLeftRight size={20} />
                             </div>
                         </button>
                    </div>
                )}
            </div>
        )}

        {/* --- LEAGUES TAB --- */}
        {activeTab === 'leagues' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                 {/* Create League CTA */}
                 <div className="flex gap-2">
                     <button 
                        onClick={() => setIsCreateLeagueOpen(true)}
                        className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pl-purple hover:bg-purple-50 transition group"
                     >
                         <Plus size={24} className="mx-auto text-gray-400 group-hover:text-pl-purple mb-1" />
                         <span className="text-sm font-bold text-gray-600 group-hover:text-pl-purple">Create League</span>
                     </button>
                     <button className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pl-purple hover:bg-purple-50 transition group">
                         <Globe size={24} className="mx-auto text-gray-400 group-hover:text-pl-purple mb-1" />
                         <span className="text-sm font-bold text-gray-600 group-hover:text-pl-purple">Join Public</span>
                     </button>
                 </div>

                 <h3 className="font-bold text-gray-800 text-sm mt-2">Your Leagues</h3>
                 {leagues.filter(l => l.rank > 0).map(league => (
                     <LeagueCard 
                        key={league.league_id} 
                        league={league} 
                        userLevel={userLevel}
                        onChatClick={() => setActiveLeagueChat(league)}
                        onClick={() => setSelectedLeagueDetail(league)}
                     />
                 ))}
                 
                 <h3 className="font-bold text-gray-800 text-sm mt-4">Recommended for You</h3>
                 {leagues.filter(l => l.rank === 0).map(league => (
                     <LeagueCard 
                        key={league.league_id} 
                        league={league} 
                        userLevel={userLevel}
                        onChatClick={() => {}}
                        onJoin={() => handleJoinLeague(league)}
                        onClick={() => {}}
                     />
                 ))}
            </div>
        )}

        {/* --- STATS TAB --- */}
        {activeTab === 'stats' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex p-1 bg-gray-100 rounded-lg">
                    {['Players', 'Teams', 'Gameweeks'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setStatsSubTab(tab as any)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${statsSubTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {statsSubTab === 'Players' && <PlayerStatsTable />}
                {statsSubTab === 'Teams' && <TeamStatsTable />}
                {statsSubTab === 'Gameweeks' && <GameweekStatsList gameweeks={MOCK_GAMEWEEKS} />}
            </div>
        )}

      </main>
      
      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-2 pb-safe pt-1 z-40 flex justify-between items-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] text-[10px]">
        <NavButton active={activeTab === 'home'} icon={<Home size={24} />} label={t.home} onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'team'} icon={<Shirt size={24} />} label={t.team} onClick={() => setActiveTab('team')} />
        <NavButton active={activeTab === 'transfers'} icon={<ArrowLeftRight size={24} />} label={t.transfers} onClick={() => setActiveTab('transfers')} />
        <NavButton active={activeTab === 'leagues'} icon={<Trophy size={24} />} label={t.leagues} onClick={() => setActiveTab('leagues')} />
        <NavButton active={activeTab === 'stats'} icon={<BarChart2 size={24} />} label={t.stats} onClick={() => setActiveTab('stats')} />
      </nav>

      {/* --- MODALS --- */}
      <WalletModal 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
        onTransaction={handleTransaction}
        initialMode={walletMode}
        balance={balance}
      />

      <PlayerDetailModal 
        player={viewingPlayer} 
        onClose={() => setViewingPlayer(null)}
        onAction={handlePlayerAction}
      />

      <TriviaModal 
        isOpen={showTrivia} 
        onClose={() => setShowTrivia(false)} 
        questions={MOCK_TRIVIA} 
      />

      <LeagueChatModal 
        isOpen={!!activeLeagueChat} 
        onClose={() => setActiveLeagueChat(null)} 
        league={activeLeagueChat} 
      />

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        level={userLevel}
        xp={userXP}
      />

      <CreateLeagueModal 
        isOpen={isCreateLeagueOpen} 
        onClose={() => setIsCreateLeagueOpen(false)} 
        onCreate={handleCreateLeague} 
      />
      
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
        notifications={mockNotifications} 
      />

      <FlashScoutModal 
        isOpen={isFlashScoutOpen} 
        onClose={() => setIsFlashScoutOpen(false)} 
        onAction={() => setActiveTab('transfers')}
      />

      <LeagueDetailModal 
        isOpen={!!selectedLeagueDetail}
        onClose={() => setSelectedLeagueDetail(null)}
        league={selectedLeagueDetail}
      />

      {/* --- ONBOARDING / TUTORIAL COACH --- */}
      {!hasCompletedOnboarding && (
          <OnboardingCoach 
             step={tutorialStep} 
             onNext={() => {
                 const steps: TutorialStep[] = ['WELCOME', 'POINTS', 'TRANSFERS_INTRO', 'MARKET_GUIDE', 'CAPTAINCY', 'DEADLINE'];
                 const currentIdx = steps.indexOf(tutorialStep);
                 if (currentIdx < steps.length - 1) setTutorialStep(steps[currentIdx + 1]);
                 else {
                     setTutorialStep('HIDDEN');
                     setHasCompletedOnboarding(true);
                     localStorage.setItem('fpl_eth_onboarding', 'done');
                 }
             }}
             onDismiss={() => {
                 setTutorialStep('HIDDEN');
                 setHasCompletedOnboarding(true);
                 localStorage.setItem('fpl_eth_onboarding', 'done');
             }}
             onAction={(action) => {
                 if (action === 'GOTO_TRANSFERS') {
                     setActiveTab('transfers');
                     setTutorialStep('MARKET_GUIDE');
                 }
             }}
          />
      )}

      {/* --- TOAST --- */}
      {toast && (
          <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5 font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}>
              {toast.type === 'error' ? <AlertOctagon size={16} /> : <CheckCircle size={16} className="text-pl-green" />}
              {toast.message}
          </div>
      )}

      {/* --- LOCKED OVERLAY ANIMATION --- */}
      {showLockAnimation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
               <div className="text-center">
                   <div className="bg-red-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-bounce">
                       <Lock size={48} className="text-white" />
                   </div>
                   <h2 className="text-3xl font-black text-white mb-2 tracking-tight">GAMEWEEK LOCKED</h2>
                   <p className="text-white/60">Good luck, manager.</p>
               </div>
          </div>
      )}

    </div>
  );
};

export default App;
