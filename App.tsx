
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Shirt, Wallet, Trophy, Bell, Menu, Plus, ArrowLeftRight, Settings, Send, Globe, BarChart2, TrendingUp, TrendingDown, Shield, RefreshCw, MessageCircle, Star, Zap, Lock, CheckCircle, AlertTriangle, AlertOctagon, PlayCircle, MapPin, Building2, GraduationCap, Coins, Gamepad2, Store, Coffee } from 'lucide-react';
import { MOCK_PLAYERS, MOCK_LEAGUES, MOCK_TRANSACTIONS, CURRENCY_SYMBOL, TRANSLATIONS, MOCK_DAILY_QUESTS, MOCK_TRIVIA, MOCK_GAMEWEEKS, LEVELS_CONFIG, getTeamFixtures, TEAMS, MOCK_SHOWROOMS, MOCK_CONTESTS, COIN_BUNDLES, MINI_GAMES, COFFEE_HOUR_CONFIG, XP_ACTIONS } from './constants';
import { Player, Position, GameweekStatus, League, Notification, ChipType, DailyQuest, Contest, MiniGameConfig, CoinBundle } from './types';
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
import ShowroomHub from './components/ShowroomHub';
import ContestHub from './components/ContestHub';
import CoinShop from './components/CoinShop';
import MiniGamesHub from './components/MiniGamesHub';
import CoffeeHourBanner from './components/CoffeeHourBanner';
import PenaltyShootout from './components/PenaltyShootout';
import PricePredictor from './components/PricePredictor';
import { calculateScore, generateRandomStats, MatchStats } from './scoring';

// --- Sub-Components ---

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${active ? 'text-pl-pink' : 'text-gray-400 hover:text-gray-200'}`}
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

// Helper: Build initial valid squad from players array
const buildInitialSquad = (allPlayers: Player[]): Player[] => {
    const gks = allPlayers.filter(p => p.position === Position.GK);
    const defs = allPlayers.filter(p => p.position === Position.DEF);
    const mids = allPlayers.filter(p => p.position === Position.MID);
    const fwds = allPlayers.filter(p => p.position === Position.FWD);

    // Sort by total_points descending to get best players
    const sortByPoints = (a: Player, b: Player) => b.total_points - a.total_points;
    gks.sort(sortByPoints);
    defs.sort(sortByPoints);
    mids.sort(sortByPoints);
    fwds.sort(sortByPoints);

    // Build squad: 2 GK, 5 DEF, 5 MID, 3 FWD = 15 players
    // Starting 11: 1 GK, 4 DEF, 4 MID, 2 FWD
    // Bench 4: 1 GK, 1 DEF, 1 MID, 1 FWD
    const squad: Player[] = [];

    // Starting GK
    if (gks[0]) squad.push({ ...gks[0], is_bench: false, is_captain: false, is_vice_captain: false });
    // Starting DEFs (4)
    for (let i = 0; i < 4 && i < defs.length; i++) {
        squad.push({ ...defs[i], is_bench: false, is_captain: false, is_vice_captain: false });
    }
    // Starting MIDs (4)
    for (let i = 0; i < 4 && i < mids.length; i++) {
        const isCaptain = i === 0; // Best midfielder as vice captain
        squad.push({ ...mids[i], is_bench: false, is_captain: false, is_vice_captain: isCaptain });
    }
    // Starting FWDs (2)
    for (let i = 0; i < 2 && i < fwds.length; i++) {
        const isCaptain = i === 0; // Best forward as captain
        squad.push({ ...fwds[i], is_bench: false, is_captain: isCaptain, is_vice_captain: false });
    }

    // Bench GK
    if (gks[1]) squad.push({ ...gks[1], is_bench: true, is_captain: false, is_vice_captain: false });
    // Bench DEF
    if (defs[4]) squad.push({ ...defs[4], is_bench: true, is_captain: false, is_vice_captain: false });
    // Bench MID
    if (mids[4]) squad.push({ ...mids[4], is_bench: true, is_captain: false, is_vice_captain: false });
    // Bench FWD
    if (fwds[2]) squad.push({ ...fwds[2], is_bench: true, is_captain: false, is_vice_captain: false });

    return squad;
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'team' | 'transfers' | 'leagues' | 'wallet' | 'stats'>('home');
  const [statsSubTab, setStatsSubTab] = useState<'Players' | 'Teams' | 'Gameweeks'>('Players');
  
  // Wallet & Modals
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletMode, setWalletMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [balance, setBalance] = useState(150); // ETB Mock Balance
  const [coins, setCoins] = useState(0); // Virtual currency (non-monetary)
  
  // Data State - Build valid 15-player squad from mock data
  const [squad, setSquad] = useState<Player[]>(() => buildInitialSquad(MOCK_PLAYERS));
  const [originalSquad, setOriginalSquad] = useState<Player[]>(() => buildInitialSquad(MOCK_PLAYERS)); // Snapshot for diffing
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
  const [selectedAvatarId, setSelectedAvatarId] = useState('av1'); // Currently selected avatar
  const [ownedAvatars, setOwnedAvatars] = useState<string[]>(() => {
    // Load owned avatars from localStorage or default to free avatar
    const saved = localStorage.getItem('fpl_eth_owned_avatars');
    return saved ? JSON.parse(saved) : ['av1'];
  });
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(MOCK_DAILY_QUESTS);
  const [loginStreak, setLoginStreak] = useState(1);
  const [isCreateLeagueOpen, setIsCreateLeagueOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isFlashScoutOpen, setIsFlashScoutOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // New Feature States
  const [isShowroomHubOpen, setIsShowroomHubOpen] = useState(false);
  const [isContestHubOpen, setIsContestHubOpen] = useState(false);
  const [isCoinShopOpen, setIsCoinShopOpen] = useState(false);
  const [isMiniGamesOpen, setIsMiniGamesOpen] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameConfig | null>(null);
  const [checkedInShowrooms, setCheckedInShowrooms] = useState<string[]>([]);
  const [miniGamePlays, setMiniGamePlays] = useState<{[gameId: string]: number}>({});
  const [coffeeHourClaimed, setCoffeeHourClaimed] = useState(false);

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

  const t = TRANSLATIONS[language];

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

  // Initialize Login Streak from localStorage
  useEffect(() => {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem('fpl_eth_last_login');
      const storedStreak = parseInt(localStorage.getItem('fpl_eth_login_streak') || '0', 10);
      const storedCoins = parseInt(localStorage.getItem('fpl_eth_coins') || '0', 10);
      const storedAvatarId = localStorage.getItem('fpl_eth_avatar') || 'av1';

      setCoins(storedCoins);
      setSelectedAvatarId(storedAvatarId);

      if (lastLogin === today) {
          // Already logged in today
          setLoginStreak(storedStreak);
      } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastLogin === yesterday.toDateString()) {
              // Consecutive day - increment streak
              const newStreak = storedStreak + 1;
              setLoginStreak(newStreak);
              localStorage.setItem('fpl_eth_login_streak', newStreak.toString());

              // Award streak bonuses
              let bonusCoins = 5; // Daily login bonus
              if (newStreak === 7) bonusCoins = 50;
              else if (newStreak === 14) bonusCoins = 100;
              else if (newStreak === 30) bonusCoins = 200;

              if (bonusCoins > 5) {
                  setTimeout(() => showToast(`${newStreak}-day streak! +${bonusCoins} coins!`, 'success'), 1000);
              }
              setCoins(prev => {
                  const newCoins = prev + bonusCoins;
                  localStorage.setItem('fpl_eth_coins', newCoins.toString());
                  return newCoins;
              });
          } else {
              // Streak broken - reset to 1
              setLoginStreak(1);
              localStorage.setItem('fpl_eth_login_streak', '1');
          }
          localStorage.setItem('fpl_eth_last_login', today);
      }
  }, []);

  // Auto Level-Up based on XP thresholds
  useEffect(() => {
      const newLevel = LEVELS_CONFIG.reduce((acc, lvl) => {
          if (userXP >= lvl.min_xp) return lvl.level;
          return acc;
      }, 1);

      if (newLevel > userLevel) {
          setUserLevel(newLevel);
          const levelInfo = LEVELS_CONFIG.find(l => l.level === newLevel);
          showToast(`Level Up! You are now a ${levelInfo?.title || 'Manager'}!`, 'success');
      }
  }, [userXP, userLevel]);

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
          // Tutorial: Intercept Limit Error
          setTutorialStep('ERROR_LIMIT');
          return;
      }

      const playerInWithPurchasePrice = { ...playerIn, purchase_price: playerIn.price };
      // Ensure the new player has fixture data attached for the current view
      const currentGW = MOCK_GAMEWEEKS.find(gw => gw.is_current);
      if (currentGW) {
          const allFixtures = getTeamFixtures(playerIn.team);
          playerInWithPurchasePrice.upcoming_fixtures = allFixtures.filter(f => f.gameweek === currentGW.gameweek_number);
      }

      const newSquad = squad.map(p => p.id === playerToSell.id ? playerInWithPurchasePrice : p);
      
      setSquad(newSquad);
      setGameBudget(parseFloat((availableFunds - playerIn.price).toFixed(1)));
      setPlayerToSell(null); 
      showToast(`Transferred in ${playerIn.name}`);

      // Tutorial: Advance if in MARKET_GUIDE
      if (tutorialStep === 'MARKET_GUIDE') {
          setTutorialStep('HIDDEN');
      }
      // Tutorial: If squad is full (just simulating flow), offer captaincy tip if 15/15
      // Ideally check if 15 players selected. Mock is always 15, so just check if captain is set.
      if (tutorialStep === 'HIDDEN' && !hasCompletedOnboarding) {
          setTutorialStep('CAPTAINCY');
      }
  };

  const handlePlayerClick = (player: Player) => {
    if (gameweekStatus !== GameweekStatus.ACTIVE) {
        setViewingPlayer(player);
        return;
    }

    if (selectedPlayerId !== null) {
        if (selectedPlayerId === player.id) {
            setSelectedPlayerId(null);
        } else {
            // Logic to swap players within the squad
            setSquad(prevSquad => {
                const newSquad = [...prevSquad];
                const p1Index = newSquad.findIndex(p => p.id === selectedPlayerId);
                const p2Index = newSquad.findIndex(p => p.id === player.id);
                
                if (p1Index === -1 || p2Index === -1) return prevSquad;

                const p1 = newSquad[p1Index];
                const p2 = newSquad[p2Index];

                // GK Check: Can only swap GK with GK
                if ((p1.position === 'GK' && p2.position !== 'GK') || (p2.position === 'GK' && p1.position !== 'GK')) {
                    showToast("Goalkeepers can only play in goal!", "error");
                    return prevSquad;
                }

                // Temporary Swap to check formation
                const tempBench = p1.is_bench;
                p1.is_bench = p2.is_bench;
                p2.is_bench = tempBench;

                // If one was a starter and other bench, we need to validate formation
                if (p1.is_bench !== p2.is_bench) {
                    if (!validateFormation(newSquad)) {
                        showToast("Invalid Formation! Needs 3 DEF, 2 MID, 1 FWD.", "error");
                        return prevSquad; // Implicitly reverts the logic because we return prevSquad
                    }
                }

                return newSquad;
              });
              setSelectedPlayerId(null);
              // Do not show toast here, specific logic above handles errors
        }
    } else {
        // If viewing detailed stats, just open modal. 
        // If clicking on pitch, we set selected to allow swapping or action menu.
        // Let's toggle between selection.
        setSelectedPlayerId(player.id);
    }
  };

  const handlePlayerAction = (action: 'swap' | 'captain' | 'vice_captain' | 'info') => {
      if (action === 'info') {
          setViewingPlayer(squad.find(p => p.id === selectedPlayerId) || null);
          return;
      }

      if (gameweekStatus !== GameweekStatus.ACTIVE) {
          showToast("Changes disabled. Gameweek Locked.", "error");
          return;
      }

      if (selectedPlayerId === null) return;

      if (action === 'swap') {
          // Handled by next click logic usually, but here we initiate transfer out
          const player = squad.find(p => p.id === selectedPlayerId);
          if (player) {
            setPlayerToSell(player);
            setActiveTab('transfers');
            // Tutorial: If coming from squad building
            if (tutorialStep === 'TRANSFERS_INTRO' || tutorialStep === 'WELCOME') {
                setTutorialStep('MARKET_GUIDE');
            }
          }
      } else if (action === 'captain') {
          setSquad(prev => prev.map(p => ({
              ...p,
              is_captain: p.id === selectedPlayerId,
              is_vice_captain: p.id === selectedPlayerId ? false : p.is_vice_captain
          })));
          showToast("Captain changed");
          setSelectedPlayerId(null);
          // Tutorial: Advance
          if (tutorialStep === 'CAPTAINCY') {
              setTutorialStep('DEADLINE');
          }
      } else if (action === 'vice_captain') {
          setSquad(prev => prev.map(p => ({
              ...p,
              is_vice_captain: p.id === selectedPlayerId,
              is_captain: p.id === selectedPlayerId ? false : p.is_captain
          })));
          showToast("Vice-Captain changed");
          setSelectedPlayerId(null);
      }
  };

  // --- Auto Sub Simulation & Scoring Engine ---
  const handleSimulateGameweek = () => {
      // 1. Simulate Matches for ALL players (Starters + Bench)
      // DGW/BGW Logic: Iterate based on number of upcoming fixtures
      let simulatedSquad = squad.map(p => {
          const fixturesCount = p.upcoming_fixtures ? p.upcoming_fixtures.length : 1;
          
          let totalPoints = 0;
          let aggregatedStats: MatchStats = {
              minutesPlayed: 0, goalsScored: 0, assists: 0, cleanSheet: false, 
              goalsConceded: 0, ownGoals: 0, penaltiesSaved: 0, penaltiesMissed: 0, 
              yellowCards: 0, redCards: 0, saves: 0, bonus: 0, bps: 0
          };

          // Blank Gameweek: Player gets 0 points and stats remain 0
          if (fixturesCount === 0) {
              return {
                  ...p,
                  minutes_played: 0,
                  points_last_gw: 0,
                  last_match_stats: aggregatedStats,
                  bps: 0
              };
          }

          // Loop for Double Gameweeks (or Standard)
          for (let i = 0; i < fixturesCount; i++) {
              const matchStats = generateRandomStats(p.position);
              const points = calculateScore(matchStats, p.position);
              
              totalPoints += points;
              
              // Aggregate stats
              aggregatedStats.minutesPlayed += matchStats.minutesPlayed;
              aggregatedStats.goalsScored += matchStats.goalsScored;
              aggregatedStats.assists += matchStats.assists;
              aggregatedStats.cleanSheet = aggregatedStats.cleanSheet || matchStats.cleanSheet; // If kept in any game? No, typically per match. This is simplified for UI summary.
              aggregatedStats.goalsConceded += matchStats.goalsConceded;
              aggregatedStats.saves += matchStats.saves;
              aggregatedStats.yellowCards += matchStats.yellowCards;
              aggregatedStats.redCards += matchStats.redCards;
              aggregatedStats.bonus += matchStats.bonus;
              aggregatedStats.bps += matchStats.bps;
          }

          return {
              ...p,
              minutes_played: aggregatedStats.minutesPlayed,
              points_last_gw: totalPoints,
              // Update season totals roughly for simulation effect
              goals_scored: p.goals_scored + aggregatedStats.goalsScored,
              assists: p.assists + aggregatedStats.assists,
              clean_sheets: aggregatedStats.cleanSheet ? p.clean_sheets + 1 : p.clean_sheets, // Simplified aggregation
              // Store match stats for the BPS breakdown
              last_match_stats: aggregatedStats,
              bps: aggregatedStats.bps
          };
      });

      // 2. Separate into Starters and Bench for Sub Logic
      let starters = simulatedSquad.filter(p => !p.is_bench);
      let bench = simulatedSquad.filter(p => p.is_bench);
      
      // Sort Bench: GK first
      bench.sort((a, b) => {
          if (a.position === 'GK') return -1;
          if (b.position === 'GK') return 1;
          return 0; 
      });

      let subsMadeCount = 0;
      let captainChanged = false;

      // 3. Substitution Logic (Standard)
      // Only run subs if Bench Boost is NOT active. 
      // If Bench Boost is active, we don't swap, we just count everyone later.
      if (activeChip !== 'benchboost') {
          // A. Goalkeeper Sub
          const startingGK = starters.find(p => p.position === 'GK');
          if (startingGK && startingGK.minutes_played === 0) {
              const benchGK = bench.find(p => p.position === 'GK');
              if (benchGK && benchGK.minutes_played > 0) {
                  startingGK.is_bench = true;
                  benchGK.is_bench = false;
                  subsMadeCount++;
                  
                  starters = [...starters.filter(p => p.id !== startingGK.id), benchGK];
                  bench = [...bench.filter(p => p.id !== benchGK.id), startingGK];
              }
          }

          // B. Outfield Subs
          const nonPlayingStarters = starters.filter(p => p.position !== 'GK' && p.minutes_played === 0);
          const availableBench = bench.filter(p => p.position !== 'GK' && p.minutes_played > 0);

          nonPlayingStarters.forEach(starter => {
              for (let i = 0; i < availableBench.length; i++) {
                  const sub = availableBench[i];
                  
                  // Check Formation Validity
                  const proposedStarters = starters.filter(p => p.id !== starter.id).concat(sub);
                  
                  const defs = proposedStarters.filter(p => p.position === 'DEF').length;
                  const mids = proposedStarters.filter(p => p.position === 'MID').length;
                  const fwds = proposedStarters.filter(p => p.position === 'FWD').length;

                  if (defs >= 3 && mids >= 2 && fwds >= 1) {
                      starter.is_bench = true;
                      sub.is_bench = false;
                      subsMadeCount++;

                      starters = proposedStarters;
                      bench = bench.filter(p => p.id !== sub.id).concat(starter);
                      availableBench.splice(i, 1);
                      break; 
                  }
              }
          });
      }

      // 4. Captaincy Logic
      // If Triple Captain active, check captain minutes.
      let finalSquad = [...starters, ...bench];
      let captain = finalSquad.find(p => p.is_captain);
      let vice = finalSquad.find(p => p.is_vice_captain);

      if (captain && captain.minutes_played === 0) {
          captain.is_captain = false;
          if (vice && vice.minutes_played > 0) {
              vice.is_captain = true;
              captainChanged = true;
              vice.is_vice_captain = false;
              captain.is_vice_captain = true;
          }
      }

      // 5. Apply Captain Multiplier
      finalSquad = finalSquad.map(p => {
          if (p.is_captain) {
              const multiplier = activeChip === 'triplecaptain' ? 3 : 2;
              return { ...p, points_last_gw: p.points_last_gw * multiplier };
          }
          return p;
      });

      // 6. Handle Chip Consumption
      if (activeChip) {
          setChipInventory(prev => ({
              ...prev,
              [activeChip]: Math.max(0, prev[activeChip] - 1)
          }));
      }

      // 7. Gamified XP Logic
      let xpGain = 0;
      const xpReasons: string[] = [];

      // Captaincy Bonus: Captain Score >= 20
      const activeCap = finalSquad.find(p => p.is_captain);
      if (activeCap && activeCap.points_last_gw >= 20) {
          xpGain += 50;
          xpReasons.push("Captain Masterclass (+50 XP)");
      }

      // No Hits Bonus
      if (confirmedTransferCost === 0) {
          xpGain += 30;
          xpReasons.push("Disciplined Manager (+30 XP)");
      }

      // Commit Updates
      setSquad(finalSquad);
      if (xpGain > 0) {
          setUserXP(prev => prev + xpGain);
      }
      setConfirmedTransferCost(0); // Reset for next week
      
      let msg = `Simulated: ${subsMadeCount} subs.`;
      if (captainChanged) msg += ` Captain switched.`;
      if (activeChip) msg += ` ${activeChip.toUpperCase()} used!`;
      if (xpGain > 0) msg += ` XP Gained: ${xpGain}`;
      
      showToast(msg);
  };

  // Tutorial Actions
  const handleTutorialNext = () => {
      switch (tutorialStep) {
          case 'WELCOME': setTutorialStep('POINTS'); break;
          case 'POINTS': setTutorialStep('TRANSFERS_INTRO'); break;
          case 'TRANSFERS_INTRO': setActiveTab('transfers'); setTutorialStep('MARKET_GUIDE'); break;
          case 'CAPTAINCY': setTutorialStep('DEADLINE'); break;
          case 'DEADLINE': handleSaveTeam(); break;
          default: setTutorialStep('HIDDEN');
      }
  };

  const handleTutorialDismiss = () => {
      setTutorialStep('HIDDEN');
      localStorage.setItem('fpl_eth_onboarding', 'done');
  };

  const handleTutorialAction = (action: string) => {
      if (action === 'GOTO_TRANSFERS') {
          setActiveTab('transfers');
          setTutorialStep('MARKET_GUIDE');
      }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  };

  // Handle Trivia Reward Claim
  const handleTriviaComplete = useCallback((score: number) => {
      const reward = (score * 10) + 10;
      setCoins(prev => {
          const newCoins = prev + reward;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      showToast(`+${reward} coins earned from trivia!`, 'success');
      setShowTrivia(false);
  }, []);

  // Handle Quest Completion
  const handleQuestComplete = useCallback((questId: string) => {
      setDailyQuests(prev => prev.map(q => {
          if (q.id === questId && !q.is_completed) {
              // Apply reward
              if (q.reward_type === 'xp') {
                  setUserXP(prevXP => prevXP + q.reward_amount);
                  showToast(`+${q.reward_amount} XP earned!`, 'success');
              } else if (q.reward_type === 'coins') {
                  setCoins(prevCoins => {
                      const newCoins = prevCoins + q.reward_amount;
                      localStorage.setItem('fpl_eth_coins', newCoins.toString());
                      return newCoins;
                  });
                  showToast(`+${q.reward_amount} coins earned!`, 'success');
              }
              return { ...q, is_completed: true };
          }
          return q;
      }));
  }, []);

  // Handle Avatar Selection
  const handleAvatarSelect = useCallback((avatarId: string) => {
      setSelectedAvatarId(avatarId);
      localStorage.setItem('fpl_eth_avatar', avatarId);
      showToast('Avatar updated!', 'success');
  }, []);

  // Handle Avatar Purchase
  const handlePurchaseAvatar = useCallback((avatarId: string, price: number): boolean => {
      if (coins < price) {
          return false;
      }
      // Deduct coins
      setCoins(prev => {
          const newCoins = prev - price;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      // Add to owned avatars
      setOwnedAvatars(prev => {
          const updated = [...prev, avatarId];
          localStorage.setItem('fpl_eth_owned_avatars', JSON.stringify(updated));
          return updated;
      });
      return true;
  }, [coins]);

  // Handle Coin Purchase (ETB to Coins)
  const handlePurchaseCoins = useCallback((coinsAmount: number, etbPrice: number) => {
      setCoins(prev => {
          const newCoins = prev + coinsAmount;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      showToast(`+${coinsAmount} coins added!`, 'success');
  }, []);

  // Handle Flash Scout action
  const handleFlashScoutAction = useCallback((playerId: number) => {
      // Add player to a watchlist or initiate transfer flow
      const player = MOCK_PLAYERS.find(p => p.id === playerId);
      if (player) {
          setPlayerToSell(null); // Clear any existing selection
          setActiveTab('transfers');
          showToast(`Scouting ${player.name}. Find them in transfers!`, 'success');
      }
      setIsFlashScoutOpen(false);
  }, []);

  // Handle League Stake
  const handleLeagueStake = useCallback((amount: number, multiplier: number) => {
      const potentialWin = Math.floor(amount * multiplier);
      showToast(`Staked ${amount} ETB! Win ${potentialWin} ETB if you top GW38!`, 'success');
  }, []);

  // Handle Showroom Check-in
  const handleShowroomCheckIn = useCallback((showroomId: string) => {
      if (checkedInShowrooms.includes(showroomId)) {
          showToast('Already checked in today!', 'error');
          return;
      }
      setCheckedInShowrooms(prev => [...prev, showroomId]);
      // Award XP for check-in
      const xpAction = XP_ACTIONS.find(a => a.action === 'showroom_checkin');
      if (xpAction) {
          setUserXP(prev => prev + xpAction.xp);
      }
      setCoins(prev => {
          const newCoins = prev + 25;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      showToast('Checked in! +25 XP, +25 coins', 'success');
  }, [checkedInShowrooms]);

  // Handle Contest Entry
  const handleContestEntry = useCallback((contest: Contest) => {
      if (coins < contest.entry_fee_coins) {
          showToast('Not enough coins!', 'error');
          return;
      }
      if (contest.min_level && userLevel < contest.min_level) {
          showToast(`Requires level ${contest.min_level}`, 'error');
          return;
      }
      setCoins(prev => {
          const newCoins = prev - contest.entry_fee_coins;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      // Award XP for entering
      const xpAction = XP_ACTIONS.find(a => a.action === 'contest_entry');
      if (xpAction) {
          setUserXP(prev => prev + xpAction.xp);
      }
      showToast(`Entered ${contest.name}! Good luck!`, 'success');
  }, [coins, userLevel]);

  // Handle Coin Bundle Purchase
  const handleBundlePurchase = useCallback((bundle: CoinBundle) => {
      // In a real app, this would integrate with Telebirr/CBE
      const totalCoins = bundle.coins + bundle.bonus_coins;
      setCoins(prev => {
          const newCoins = prev + totalCoins;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      // First purchase XP bonus
      const xpAction = XP_ACTIONS.find(a => a.action === 'first_purchase');
      if (xpAction) {
          setUserXP(prev => prev + xpAction.xp);
      }
      showToast(`+${totalCoins} coins added!`, 'success');
      setIsCoinShopOpen(false);
  }, []);

  // Handle Mini-game Play
  const handlePlayMiniGame = useCallback((game: MiniGameConfig) => {
      const played = miniGamePlays[game.id] || 0;
      if (played >= game.daily_limit) {
          showToast('Daily limit reached! Try again tomorrow.', 'error');
          return;
      }
      if (coins < game.cost_coins) {
          showToast('Not enough coins!', 'error');
          return;
      }
      // Deduct cost
      if (game.cost_coins > 0) {
          setCoins(prev => {
              const newCoins = prev - game.cost_coins;
              localStorage.setItem('fpl_eth_coins', newCoins.toString());
              return newCoins;
          });
      }
      // Track play
      setMiniGamePlays(prev => ({
          ...prev,
          [game.id]: (prev[game.id] || 0) + 1
      }));
      // Open the game
      setActiveMiniGame(game);
      setIsMiniGamesOpen(false);
  }, [coins, miniGamePlays]);

  // Handle Mini-game Completion
  const handleMiniGameComplete = useCallback((goals: number, rewardCoins: number, xp: number) => {
      setCoins(prev => {
          const newCoins = prev + rewardCoins;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      setUserXP(prev => prev + xp);
      setActiveMiniGame(null);
      if (rewardCoins > 0) {
          showToast(`Earned ${rewardCoins} coins & ${xp} XP!`, 'success');
      } else {
          showToast(`+${xp} XP earned!`, 'success');
      }
  }, []);

  // Handle Coffee Hour Claim
  const handleCoffeeHourClaim = useCallback(() => {
      if (coffeeHourClaimed) return;
      setCoffeeHourClaimed(true);
      // Random reward from coffee hour
      const coinReward = Math.floor(Math.random() * 20) + 10;
      const xpReward = Math.floor(Math.random() * 25) + 15;
      setCoins(prev => {
          const newCoins = prev + coinReward;
          localStorage.setItem('fpl_eth_coins', newCoins.toString());
          return newCoins;
      });
      setUserXP(prev => prev + xpReward);
      showToast(`Coffee Hour: +${coinReward} coins, +${xpReward} XP!`, 'success');
  }, [coffeeHourClaimed]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto relative border-x border-gray-200 shadow-2xl overflow-hidden">
      
      {/* Onboarding Coach Overlay */}
      <OnboardingCoach 
        step={tutorialStep} 
        onNext={handleTutorialNext} 
        onDismiss={handleTutorialDismiss}
        onAction={handleTutorialAction}
      />

      {/* --- Lock Animation Overlay --- */}
      {showLockAnimation && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="bg-red-600 p-6 rounded-full shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-bounce">
                  <Lock size={64} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mt-6 tracking-widest uppercase">Gameweek Locked</h2>
              <p className="text-gray-300 mt-2">Good luck!</p>
          </div>
      )}

      {/* Toast Notification */}
      {toast && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle size={14}/> : <Shield size={14}/>}
              {toast.message}
          </div>
      )}

      {/* Gameweek Status Bar */}
      <div className={`text-center py-1 text-[10px] font-bold text-white uppercase tracking-wider transition-colors duration-500
        ${gameweekStatus === GameweekStatus.ACTIVE ? 'bg-pl-green text-pl-purple' : 
          gameweekStatus === GameweekStatus.LOCKED ? 'bg-red-600' : 'bg-yellow-500 text-black'}`}>
          {gameweekStatus === GameweekStatus.ACTIVE && t.status_active}
          {gameweekStatus === GameweekStatus.LOCKED && t.status_locked}
          {gameweekStatus === GameweekStatus.PROCESSING && <span className="flex items-center justify-center gap-1"><RefreshCw size={10} className="animate-spin"/> {t.status_processing}</span>}
      </div>

      {/* Top Bar */}
      <header className="bg-pl-purple text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Fantasy PL <span className="text-pl-green text-xs align-top">ET</span></h1>
            {/* Level Indicator (Clickable) */}
            <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-1 text-[10px] font-medium text-white/80 mt-[-2px] hover:text-white hover:bg-white/10 px-1 py-0.5 rounded transition"
            >
                <Star size={10} className="text-eth-yellow fill-eth-yellow" />
                <span>Lvl {userLevel} {levelInfo.title}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
             {/* Coach Trigger */}
             <button 
                onClick={() => setTutorialStep('WELCOME')} 
                className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 text-pl-green transition mr-1"
                title="Open Coach Academy"
             >
                <GraduationCap size={16} />
             </button>

             <button onClick={toggleLanguage} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs font-bold hover:bg-white/20">
                <Globe size={14} />
                {language.toUpperCase()}
             </button>
             {/* Coins Display */}
             <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
               <Coins size={12} className="text-yellow-400" />
               <span className="text-xs font-bold text-yellow-400">{coins}</span>
             </div>
            <button
              onClick={() => { setActiveTab('wallet'); setIsWalletOpen(true); setWalletMode('deposit'); }}
              className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition"
            >
              <span className="text-xs font-bold text-eth-yellow">{balance} {CURRENCY_SYMBOL}</span>
              <Wallet size={14} className="text-white" />
            </button>
            <button onClick={() => setIsNotificationOpen(true)} className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-pl-purple"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Validation Warning Banner */}
      {validationIssues.length > 0 && activeTab === 'team' && (
          <div className="bg-red-500 text-white p-3 text-xs font-bold flex items-start gap-2 sticky top-[72px] z-20">
              <AlertOctagon size={16} className="shrink-0 mt-0.5" />
              <div>
                  <div className="uppercase tracking-wide mb-1">Squad Invalid</div>
                  <ul className="list-disc list-inside space-y-0.5">
                      {validationIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
                  </ul>
              </div>
          </div>
      )}

      {/* Main Content Area */}
      <main className="p-4 space-y-6">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-300 space-y-6">

            {/* Coffee Hour Banner */}
            <CoffeeHourBanner
              config={COFFEE_HOUR_CONFIG}
              onClaim={handleCoffeeHourClaim}
              hasClaimed={coffeeHourClaimed}
            />

            {/* Daily Hub (New Feature) */}
            <DailyHub
              streak={loginStreak}
              quests={dailyQuests}
              onOpenTrivia={() => setShowTrivia(true)}
              onQuestAction={handleQuestComplete}
            />

            {/* Quick Access Grid - New Features */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setIsShowroomHubOpen(true)}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-1 hover:border-purple-300 transition"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin size={18} className="text-purple-600" />
                </div>
                <span className="text-[10px] font-medium text-gray-700">Showrooms</span>
              </button>
              <button
                onClick={() => setIsContestHubOpen(true)}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-1 hover:border-yellow-300 transition"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy size={18} className="text-yellow-600" />
                </div>
                <span className="text-[10px] font-medium text-gray-700">Contests</span>
              </button>
              <button
                onClick={() => setIsMiniGamesOpen(true)}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-1 hover:border-pink-300 transition"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Gamepad2 size={18} className="text-pink-600" />
                </div>
                <span className="text-[10px] font-medium text-gray-700">Mini-Games</span>
              </button>
              <button
                onClick={() => setIsCoinShopOpen(true)}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-1 hover:border-amber-300 transition"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Coins size={18} className="text-amber-600" />
                </div>
                <span className="text-[10px] font-medium text-gray-700">Shop</span>
              </button>
            </div>

            {/* Gameweek Deadline Card */}
            <div className={`rounded-2xl p-5 text-white shadow-lg relative overflow-hidden transition-all duration-500 ${gameweekStatus === GameweekStatus.ACTIVE ? 'bg-gradient-to-r from-pl-purple to-indigo-900' : 'bg-red-800'}`}>
              <div className="relative z-10">
                <h2 className="text-sm opacity-80 uppercase tracking-wider mb-1">
                    Gameweek {currentGW?.gameweek_number} {gameweekStatus === GameweekStatus.ACTIVE ? 'Deadline' : 'Locked'}
                </h2>
                <div className="text-3xl font-bold font-mono">
                    {timeLeft}
                </div>
                <p className="text-xs mt-2 text-pl-green flex items-center gap-1">
                    {gameweekStatus === GameweekStatus.ACTIVE ? (
                        <>Sat, 11 May - 13:30 EAT</>
                    ) : (
                        <><Lock size={12}/> Markets Closed</>
                    )}
                </p>
              </div>
              <Shirt className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 rotate-12" />
            </div>

            {/* Flash Scout */}
            <div onClick={() => setIsFlashScoutOpen(true)} className="bg-black rounded-xl p-3 flex items-center justify-between text-white border-l-4 border-pl-green shadow-lg cursor-pointer transition hover:bg-gray-900">
                <div className="flex items-center gap-3">
                    <div className="bg-pl-green text-black p-2 rounded-lg">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-[10px] text-pl-green font-bold uppercase tracking-wider">Flash Scout Alert</div>
                        <div className="font-bold text-sm">Watkins Price Drop (-5%)</div>
                        <div className="text-[10px] text-gray-400">Ends in 00:45:12</div>
                    </div>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold hover:bg-white/20">
                    View
                </div>
            </div>

            {/* Live In-Play Leaderboard Dashboard */}
             <div className="bg-gray-900 rounded-2xl p-4 text-white">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h3 className="font-bold text-sm flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live In-Play Leaderboard</h3>
                    <span className="text-xs text-gray-400">GW37 • Live</span>
                </div>
                <div className="flex justify-between text-center divide-x divide-gray-700">
                    <div className="px-2 w-1/3">
                        <div className="text-xs text-gray-400">Current Rank</div>
                        <div className="font-bold text-lg text-white">14.5k</div>
                        <div className="text-[10px] text-red-400">↓ 205</div>
                    </div>
                     <div className="px-2 w-1/3">
                        <div className="text-xs text-gray-400">Projected Rank</div>
                        <div className="font-bold text-lg text-pl-green">14.2k</div>
                        <div className="text-[10px] text-pl-green">↑ 300</div>
                    </div>
                     <div className="px-2 w-1/3">
                        <div className="text-xs text-gray-400">Safety Score</div>
                        <div className="font-bold text-lg text-white">+12</div>
                        <div className="text-[10px] text-gray-500">vs Avg</div>
                    </div>
                </div>
             </div>
             
             {/* Fixture Ticker */}
             <FixtureTicker userTeam="ARS" />

             {/* AI Suggestion Teaser */}
             <AICoach squad={squad} bank={gameBudget} />
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="animate-in slide-in-from-right duration-300 space-y-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
              <div>
                <div className="text-xs text-gray-500">{t.gameweek} 37</div>
                <div className="font-bold text-pl-purple">
                    {activeChip === 'freehit' ? 'Free Hit Active' : activeChip === 'wildcard' ? 'Wildcard Active' : 'Normal'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Value</div>
                <div className="font-bold text-gray-800">£{teamValue}m</div>
              </div>
            </div>

            <ChipBar 
                inventory={chipInventory} 
                activeChip={activeChip} 
                onActivate={(chip) => setActiveChip(chip)}
                isLocked={gameweekStatus !== GameweekStatus.ACTIVE}
            />

            {/* Pitch Overlay Warning */}
            {gameweekStatus === GameweekStatus.LOCKED && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-red-200">
                    <Lock size={12}/> Team Locked. Points are live.
                </div>
            )}

            <Pitch 
                squad={squad} 
                onPlayerClick={handlePlayerClick} 
                selectedPlayerId={selectedPlayerId} 
                isLocked={gameweekStatus !== GameweekStatus.ACTIVE} 
                onAction={handlePlayerAction}
            />

            {/* Auto Sub Simulation Preview */}
            <div className="bg-black text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                    <h3 className="text-sm font-bold text-pl-green">Gameweek Simulator</h3>
                    <p className="text-[10px] text-gray-400">Test squad with random match events</p>
                </div>
                <button 
                    onClick={handleSimulateGameweek}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
                >
                    <PlayCircle size={24} />
                </button>
            </div>
            
            <button 
                onClick={handleSaveTeam}
                disabled={gameweekStatus !== GameweekStatus.ACTIVE}
                className={`w-full font-bold py-3 rounded-xl shadow-md transition ${gameweekStatus !== GameweekStatus.ACTIVE ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pl-purple text-white hover:bg-pl-purple/90'}`}
            >
               {t.save_team}
            </button>
          </div>
        )}

        {/* TRANSFERS TAB */}
        {activeTab === 'transfers' && (
           <div className="animate-in slide-in-from-right duration-300">
              <h2 className="font-bold text-xl mb-4">{t.transfers}</h2>
              <div className="bg-pl-purple text-white p-4 rounded-xl mb-4 flex justify-between items-center relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="text-xs opacity-70">Free Transfers</div>
                    <div className="text-2xl font-bold">
                        {(activeChip === 'wildcard' || activeChip === 'freehit') ? '∞' : freeTransfers}
                    </div>
                 </div>
                 <div className="text-right relative z-10">
                    <div className="text-xs opacity-70">Bank</div>
                    <div className={`text-2xl font-bold ${gameBudget < 0 ? 'text-red-300' : 'text-pl-green'}`}>£{gameBudget.toFixed(1)}m</div>
                 </div>
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              </div>

              {/* Transfer Summary / Confirmation */}
              {netTransfers > 0 && gameweekStatus === GameweekStatus.ACTIVE && (
                  <div className="bg-white rounded-xl shadow-lg border border-pl-purple/20 p-4 mb-4">
                      <h3 className="font-bold text-sm mb-2 text-gray-800">Transfer Summary</h3>
                      <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Transfers Made</span>
                          <span className="font-bold">{netTransfers}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                          <span className="text-gray-500">Points Cost</span>
                          <span className={`font-bold ${transferCost > 0 ? 'text-red-500' : 'text-gray-800'}`}>
                             {transferCost > 0 ? `-${transferCost}` : '0'} pts
                          </span>
                      </div>
                      <button 
                         onClick={handleConfirmTransfers}
                         className="w-full bg-black text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition"
                      >
                          Confirm Transfers ({transferCost > 0 ? `-${transferCost} pts` : 'Free'})
                      </button>
                  </div>
              )}

              {/* Transfer Market Component */}
              <TransferMarket 
                onBuy={handleBuyPlayer} 
                currentBudget={gameBudget}
                squad={squad}
                playerToSell={playerToSell}
                onCancelSell={() => setPlayerToSell(null)}
                sellingPriceOfOutPlayer={playerToSell ? calculateSellingPrice(playerToSell) : 0}
                isLocked={gameweekStatus !== GameweekStatus.ACTIVE}
              />
           </div>
        )}
        
        {/* STATS TAB */}
        {activeTab === 'stats' && (
             <div className="animate-in slide-in-from-right duration-300">
                <h2 className="font-bold text-xl mb-4">Statistics Center</h2>
                
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
                    {['Players', 'Teams', 'Gameweeks'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setStatsSubTab(tab as any)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${statsSubTab === tab ? 'bg-white text-pl-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                {statsSubTab === 'Players' && (
                    <>
                        <div className="mb-2 mt-2 text-sm font-bold text-gray-800">Player Stats</div>
                        <PlayerStatsTable />
                    </>
                )}
                {statsSubTab === 'Teams' && <TeamStatsTable />}
                {statsSubTab === 'Gameweeks' && <GameweekStatsList gameweeks={MOCK_GAMEWEEKS} />}
             </div>
        )}

        {/* LEAGUES TAB */}
        {activeTab === 'leagues' && (
            <div className="animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-xl">{t.leagues}</h2>
                    <button 
                        onClick={() => setIsCreateLeagueOpen(true)}
                        className="bg-pl-green text-pl-purple p-2 rounded-full shadow-lg hover:scale-105 transition"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                
                {/* My Leagues Section */}
                <h3 className="font-bold text-gray-800 mb-2 mt-2">My Leagues</h3>
                {leagues.filter(l => ['private', 'h2h', 'prize'].includes(l.type)).map(league => (
                    <LeagueCard 
                        key={league.league_id} 
                        league={league} 
                        onChatClick={() => setActiveLeagueChat(league)}
                        userLevel={userLevel}
                        onJoin={() => handleJoinLeague(league)}
                        onClick={() => setSelectedLeagueDetail(league)}
                    />
                ))}

                {/* Local Leagues Section - NEW */}
                <h3 className="font-bold text-gray-800 mb-2 mt-6">Local Communities</h3>
                {leagues.filter(l => ['city', 'company', 'university'].includes(l.type)).map(league => (
                    <LeagueCard 
                        key={league.league_id} 
                        league={league} 
                        onChatClick={() => setActiveLeagueChat(league)}
                        userLevel={userLevel}
                        onJoin={() => handleJoinLeague(league)}
                        onClick={() => setSelectedLeagueDetail(league)}
                    />
                ))}

                {/* Global Leagues Section */}
                <h3 className="font-bold text-gray-800 mb-2 mt-6">Global</h3>
                {leagues.filter(l => l.type === 'public').map(league => (
                    <LeagueCard 
                        key={league.league_id} 
                        league={league} 
                        onChatClick={() => setActiveLeagueChat(league)}
                        userLevel={userLevel}
                        onJoin={() => handleJoinLeague(league)}
                        onClick={() => setSelectedLeagueDetail(league)}
                    />
                ))}

                <div className="mt-8">
                    <h3 className="font-bold text-gray-800 mb-3">{t.join} Paid Leagues</h3>
                    <div className="bg-gradient-to-r from-eth-yellow to-orange-400 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg text-black/80">Weekly Jackpot</h4>
                                <p className="text-black/60 text-sm">Win up to 50,000 ETB</p>
                            </div>
                            <Trophy className="text-black/20 w-12 h-12" />
                        </div>
                        <button 
                            onClick={() => handleJoinLeague({ 
                                league_id: 999, name: 'Weekly Jackpot', type: 'prize', rank: 0, rank_change: 0, members_count: 50, entry_fee: 100, status: 'active' 
                            })}
                            className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-gray-800 transition"
                        >
                            Join for 100 ETB
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
            <div className="animate-in slide-in-from-right duration-300">
                <div className="bg-black text-white rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm">Total {t.balance}</p>
                        <h2 className="text-4xl font-bold mt-1">{balance.toFixed(2)} <span className="text-sm text-pl-green">{CURRENCY_SYMBOL}</span></h2>
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => { setIsWalletOpen(true); setWalletMode('deposit'); }}
                                className="flex-1 bg-pl-green text-pl-purple font-bold py-2 rounded-lg text-sm hover:bg-white transition"
                            >
                                {t.deposit}
                            </button>
                            <button 
                                onClick={() => { setIsWalletOpen(true); setWalletMode('withdraw'); }}
                                className="flex-1 bg-white/20 text-white font-bold py-2 rounded-lg text-sm hover:bg-white/30 transition"
                            >
                                {t.withdraw}
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pl-pink blur-3xl opacity-20 rounded-full"></div>
                </div>

                <h3 className="font-bold text-gray-800 mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                    {MOCK_TRANSACTIONS.map(tx => (
                        <div key={tx.transaction_id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {tx.type === 'deposit' ? <Plus size={18} /> : <Wallet size={18} />}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-800 capitalize">{tx.type.replace('_', ' ')}</div>
                                    <div className="text-[10px] text-gray-500">{tx.created_at}</div>
                                </div>
                            </div>
                            <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ETB
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-pl-purple border-t border-white/10 px-6 pb-safe pt-2 z-40 flex justify-between items-end shadow-2xl">
        <NavButton active={activeTab === 'home'} icon={<Menu />} label={t.home} onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'leagues'} icon={<Trophy />} label={t.leagues} onClick={() => setActiveTab('leagues')} />
        <div className="relative -top-5">
            <button 
                onClick={() => setActiveTab('team')}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-50 shadow-xl transition-all ${activeTab === 'team' ? 'bg-pl-green text-pl-purple' : 'bg-white text-gray-400'}`}
            >
                <Shirt size={28} fill={activeTab === 'team' ? "currentColor" : "none"} />
            </button>
        </div>
        <NavButton active={activeTab === 'stats'} icon={<BarChart2 />} label={t.stats} onClick={() => setActiveTab('stats')} />
        <NavButton active={activeTab === 'wallet'} icon={<Wallet />} label={t.wallet} onClick={() => setActiveTab('wallet')} />
      </nav>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onTransaction={handleTransaction}
        initialMode={walletMode}
        balance={balance}
        coins={coins}
        onPurchaseCoins={handlePurchaseCoins}
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
        onClaimReward={handleTriviaComplete}
      />

      <LeagueChatModal
        isOpen={!!activeLeagueChat}
        onClose={() => setActiveLeagueChat(null)}
        league={activeLeagueChat}
      />

      <LeagueDetailModal
        isOpen={!!selectedLeagueDetail}
        onClose={() => setSelectedLeagueDetail(null)}
        league={selectedLeagueDetail}
        onStake={handleLeagueStake}
        userBalance={balance}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        level={userLevel}
        xp={userXP}
        coins={coins}
        selectedAvatarId={selectedAvatarId}
        onAvatarSelect={handleAvatarSelect}
        ownedAvatars={ownedAvatars}
        onPurchaseAvatar={handlePurchaseAvatar}
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
        onAction={handleFlashScoutAction}
      />

      {/* New Feature Modals */}
      {isShowroomHubOpen && (
        <ShowroomHub
          showrooms={MOCK_SHOWROOMS}
          userCheckedInShowrooms={checkedInShowrooms}
          onClose={() => setIsShowroomHubOpen(false)}
          onCheckIn={handleShowroomCheckIn}
        />
      )}

      {isContestHubOpen && (
        <ContestHub
          contests={MOCK_CONTESTS}
          userLevel={userLevel}
          userCoins={coins}
          onClose={() => setIsContestHubOpen(false)}
          onEnterContest={handleContestEntry}
        />
      )}

      {isCoinShopOpen && (
        <CoinShop
          bundles={COIN_BUNDLES}
          userCoins={coins}
          onClose={() => setIsCoinShopOpen(false)}
          onPurchase={handleBundlePurchase}
        />
      )}

      {isMiniGamesOpen && (
        <MiniGamesHub
          games={MINI_GAMES}
          userLevel={userLevel}
          userCoins={coins}
          dailyPlays={miniGamePlays}
          onClose={() => setIsMiniGamesOpen(false)}
          onPlayGame={handlePlayMiniGame}
        />
      )}

      {/* Mini-Game Active Views */}
      {activeMiniGame?.id === 'penalty_shootout' && (
        <PenaltyShootout
          maxReward={activeMiniGame.max_reward_coins}
          xpReward={activeMiniGame.xp_reward}
          onComplete={handleMiniGameComplete}
          onClose={() => setActiveMiniGame(null)}
        />
      )}

      {activeMiniGame?.id === 'price_predictor' && (
        <PricePredictor
          players={MOCK_PLAYERS}
          maxReward={activeMiniGame.max_reward_coins}
          xpReward={activeMiniGame.xp_reward}
          onComplete={handleMiniGameComplete}
          onClose={() => setActiveMiniGame(null)}
        />
      )}

    </div>
  );
};

export default App;
