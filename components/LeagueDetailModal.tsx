import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Users, Shield, TrendingUp, TrendingDown, Coins, ArrowRight, Wallet, Target, MessageCircle, Bell, BellOff, Send, Smile, ChevronDown, ChevronUp, Zap, BarChart2, HelpCircle, Star, Clock } from 'lucide-react';
import { League, LeagueMember, LeagueMatchup, PotInfo, ChatMessage } from '../types';
import { MOCK_LEAGUE_MEMBERS, MOCK_MATCHUPS, MOCK_POT_INFO, CURRENCY_SYMBOL, MOCK_CHAT_MESSAGES } from '../constants';

// Mock data for player-by-player matchup breakdown
interface MatchupPlayerScore {
    player_name: string;
    team: string;
    position: string;
    points: number;
    is_captain: boolean;
    events: Array<{ type: string; points: number; minute?: number }>;
    still_playing: boolean;
}

interface MatchupBreakdown {
    home_players: MatchupPlayerScore[];
    away_players: MatchupPlayerScore[];
    live_events: Array<{ time: string; text: string; team: 'home' | 'away'; points: number }>;
    h2h_record: { wins: number; draws: number; losses: number; total_played: number };
}

// Mock player-level breakdown for the user's matchup
const MOCK_BREAKDOWN: MatchupBreakdown = {
    home_players: [
        { player_name: 'Haaland', team: 'MCI', position: 'FWD', points: 13, is_captain: true, events: [{ type: '⚽ Goal', points: 4, minute: 23 }, { type: '⚽ Goal', points: 4, minute: 67 }, { type: '⏱️ 90 mins', points: 2 }, { type: '⭐ Bonus (3)', points: 3 }], still_playing: false },
        { player_name: 'Salah', team: 'LIV', position: 'MID', points: 8, is_captain: false, events: [{ type: '🎯 Assist', points: 3 }, { type: '⏱️ 90 mins', points: 2 }, { type: '⭐ Bonus (1)', points: 1 }, { type: '🧹 Clean Sheet', points: 1 }], still_playing: false },
        { player_name: 'Saka', team: 'ARS', position: 'MID', points: 7, is_captain: false, events: [{ type: '⚽ Goal', points: 5 }, { type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Trippier', team: 'NEW', position: 'DEF', points: 8, is_captain: false, events: [{ type: '🎯 Assist', points: 3 }, { type: '🛡️ Clean Sheet', points: 4 }, { type: '⏱️ 60 mins', points: 1 }], still_playing: true },
        { player_name: 'Gabriel', team: 'ARS', position: 'DEF', points: 6, is_captain: false, events: [{ type: '🛡️ Clean Sheet', points: 4 }, { type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Martinez', team: 'AVL', position: 'GK', points: 3, is_captain: false, events: [{ type: '⏱️ 90 mins', points: 2 }, { type: '🟨 Yellow Card', points: -1 }, { type: '💪 3 Saves', points: 2 }], still_playing: false },
        { player_name: 'Watkins', team: 'AVL', position: 'FWD', points: 2, is_captain: false, events: [{ type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Palmer', team: 'CHE', position: 'MID', points: 5, is_captain: false, events: [{ type: '🎯 Assist', points: 3 }, { type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Alexander-Arnold', team: 'LIV', position: 'DEF', points: 2, is_captain: false, events: [{ type: '⏱️ 55 mins', points: 1 }, { type: '🟨 Yellow', points: -1 }, { type: '⏱️ Played', points: 2 }], still_playing: false },
        { player_name: 'Isak', team: 'NEW', position: 'FWD', points: 6, is_captain: false, events: [{ type: '⚽ Goal', points: 4 }, { type: '⏱️ 72 mins', points: 2 }], still_playing: true },
        { player_name: 'B. Fernandes', team: 'MUN', position: 'MID', points: 5, is_captain: false, events: [{ type: '⚽ Goal', points: 5 }, { type: '🟨 Yellow', points: -1 }, { type: '⏱️ Played', points: 1 }], still_playing: false },
    ],
    away_players: [
        { player_name: 'Son', team: 'TOT', position: 'MID', points: 12, is_captain: true, events: [{ type: '⚽ Goal', points: 5, minute: 34 }, { type: '🎯 Assist', points: 3, minute: 78 }, { type: '⏱️ 90 mins', points: 2 }, { type: '⭐ Bonus (2)', points: 2 }], still_playing: false },
        { player_name: 'Alvarez', team: 'MCI', position: 'MID', points: 6, is_captain: false, events: [{ type: '⚽ Goal', points: 5 }, { type: '⏱️ Played', points: 1 }], still_playing: false },
        { player_name: 'Gusto', team: 'CHE', position: 'DEF', points: 6, is_captain: false, events: [{ type: '🛡️ Clean Sheet', points: 4 }, { type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Pickford', team: 'EVE', position: 'GK', points: 7, is_captain: false, events: [{ type: '🛡️ Clean Sheet', points: 4 }, { type: '💪 5 Saves', points: 2 }, { type: '⏱️ 90 mins', points: 1 }], still_playing: false },
        { player_name: 'Rashford', team: 'MUN', position: 'FWD', points: 2, is_captain: false, events: [{ type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Udogie', team: 'TOT', position: 'DEF', points: 2, is_captain: false, events: [{ type: '⏱️ 60 mins', points: 1 }, { type: '🟨 Yellow', points: -1 }, { type: '⏱️ Played', points: 2 }], still_playing: false },
        { player_name: 'Rice', team: 'ARS', position: 'MID', points: 6, is_captain: false, events: [{ type: '🛡️ CS pts', points: 1 }, { type: '⚽ Goal', points: 5 }], still_playing: false },
        { player_name: 'Cash', team: 'AVL', position: 'DEF', points: 2, is_captain: false, events: [{ type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Bowen', team: 'WHU', position: 'MID', points: 5, is_captain: false, events: [{ type: '🎯 Assist', points: 3 }, { type: '⏱️ 90 mins', points: 2 }], still_playing: false },
        { player_name: 'Solanke', team: 'TOT', position: 'FWD', points: 5, is_captain: false, events: [{ type: '⚽ Goal', points: 4 }, { type: '⏱️ Played', points: 1 }], still_playing: false },
        { player_name: 'Neto', team: 'CHE', position: 'MID', points: 2, is_captain: false, events: [{ type: '⏱️ Played', points: 2 }], still_playing: false },
    ],
    live_events: [
        { time: '78\'', text: 'Son (TOT) assists Solanke - Sara K gains', team: 'away', points: 3 },
        { time: '72\'', text: 'Isak (NEW) scores! Still playing', team: 'home', points: 4 },
        { time: '67\'', text: 'HAALAND (C) SCORES AGAIN! Double points!', team: 'home', points: 8 },
        { time: '55\'', text: 'Alexander-Arnold subbed off early', team: 'home', points: 0 },
        { time: '34\'', text: 'Son (TOT) scores for Sara K', team: 'away', points: 5 },
        { time: '23\'', text: 'HAALAND (C) opens scoring! Double points!', team: 'home', points: 8 },
        { time: 'KO', text: 'Gameweek 37 kicks off', team: 'home', points: 0 },
    ],
    h2h_record: { wins: 5, draws: 2, losses: 3, total_played: 10 }
};

// Mock season progression data
const MOCK_SEASON_PROGRESSION = [
    { gw: 30, rank: 5, points: 45 },
    { gw: 31, rank: 4, points: 62 },
    { gw: 32, rank: 4, points: 51 },
    { gw: 33, rank: 3, points: 71 },
    { gw: 34, rank: 2, points: 78 },
    { gw: 35, rank: 3, points: 55 },
    { gw: 36, rank: 3, points: 62 },
    { gw: 37, rank: 3, points: 65 },
];

interface LeagueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League | null;
  onStake?: (amount: number, multiplier: number) => void;
  userBalance?: number;
}

const LeagueDetailModal: React.FC<LeagueDetailModalProps> = ({ isOpen, onClose, league, onStake, userBalance = 150 }) => {
  const [activeTab, setActiveTab] = useState<'Standings' | 'Matchups' | 'Pot' | 'Chat'>('Standings');
  const [multiplier, setMultiplier] = useState(1.5);
  const [stakeAmount, setStakeAmount] = useState(50);
  const [hasStaked, setHasStaked] = useState(false);
  const [expandedMatchup, setExpandedMatchup] = useState<string | null>(null);
  const [matchupView, setMatchupView] = useState<'players' | 'events' | 'analysis'>('players');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isChatMuted, setIsChatMuted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'Chat' && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, chatMessages]);

  if (!isOpen || !league) return null;

  const members = MOCK_LEAGUE_MEMBERS;
  const matchups = MOCK_MATCHUPS;
  const pot = MOCK_POT_INFO;
  const breakdown = MOCK_BREAKDOWN;

  const handleStake = () => {
      if (onStake && stakeAmount <= pot.my_winnings_balance) {
          onStake(stakeAmount, multiplier);
          setHasStaked(true);
      }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user_name: 'You',
        message: chatInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_me: true
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
  };

  // Calculate point difference analysis
  const getMatchAnalysis = (match: LeagueMatchup) => {
    const diff = match.home_score - match.away_score;
    const isUserHome = match.home_team.is_me;
    const isUserAway = match.away_team.is_me;
    if (!isUserHome && !isUserAway) return null;

    const userScore = isUserHome ? match.home_score : match.away_score;
    const opponentScore = isUserHome ? match.away_score : match.home_score;
    const userWinning = userScore > opponentScore;
    const margin = Math.abs(userScore - opponentScore);

    // Find key differences
    const yourPlayers = isUserHome ? breakdown.home_players : breakdown.away_players;
    const theirPlayers = isUserHome ? breakdown.away_players : breakdown.home_players;
    const yourCaptain = yourPlayers.find(p => p.is_captain);
    const theirCaptain = theirPlayers.find(p => p.is_captain);
    const yourStillPlaying = yourPlayers.filter(p => p.still_playing).length;
    const theirStillPlaying = theirPlayers.filter(p => p.still_playing).length;

    return {
      userWinning,
      margin,
      yourCaptain,
      theirCaptain,
      yourStillPlaying,
      theirStillPlaying,
      captainDiff: (yourCaptain?.points || 0) * 2 - (theirCaptain?.points || 0) * 2,
      topScorer: [...yourPlayers].sort((a, b) => (b.is_captain ? b.points * 2 : b.points) - (a.is_captain ? a.points * 2 : a.points))[0]
    };
  };

  const renderPlayerRow = (player: MatchupPlayerScore, side: 'left' | 'right') => {
    const displayPoints = player.is_captain ? player.points * 2 : player.points;
    return (
      <div key={player.player_name} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${player.still_playing ? 'bg-green-50' : ''} ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1" style={{ justifyContent: side === 'right' ? 'flex-end' : 'flex-start' }}>
            <span className="text-xs font-bold text-gray-800 truncate">{player.player_name}</span>
            {player.is_captain && <span className="text-[9px] bg-yellow-400 text-yellow-900 px-1 rounded font-bold">C</span>}
            {player.still_playing && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>}
          </div>
          <div className="text-[9px] text-gray-400">{player.team} • {player.position}</div>
        </div>
        <div className={`text-sm font-bold px-2 py-0.5 rounded ${displayPoints >= 8 ? 'bg-green-100 text-green-700' : displayPoints >= 4 ? 'text-gray-800' : 'text-gray-400'}`}>
          {displayPoints}
        </div>
      </div>
    );
  };

  // Mini bar chart for season progression
  const maxGWPoints = Math.max(...MOCK_SEASON_PROGRESSION.map(g => g.points));

  return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200"
        onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="bg-pl-purple p-5 pb-12 text-white relative overflow-hidden shrink-0">
             <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-1 rounded-full z-50 transition cursor-pointer"
             >
                <X size={20} />
             </button>

             <div className="relative z-10">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                    {league.name}
                    {league.type === 'prize' && <Trophy size={16} className="text-eth-yellow" />}
                 </h2>
                 <p className="text-white/70 text-sm mt-1 flex items-center gap-2">
                    <Users size={12} /> {league.members_count} Members
                 </p>
             </div>

             <div className="absolute top-0 right-0 w-32 h-32 bg-pl-pink blur-3xl opacity-20 rounded-full z-0"></div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 -mt-6 relative z-20 shrink-0">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex p-1">
                 {['Standings', 'Matchups', 'Pot', 'Chat'].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${activeTab === tab ? 'bg-pl-purple text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                     >
                         {tab}
                     </button>
                 ))}
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">

            {/* --- STANDINGS TAB --- */}
            {activeTab === 'Standings' && (
                <div className="space-y-4">
                    {/* Season Progression Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                <BarChart2 size={12} className="text-pl-purple" />
                                Your Season Progress
                            </h4>
                            <span className="text-[10px] text-gray-400">Last 8 GWs</span>
                        </div>
                        {/* Mini bar chart */}
                        <div className="flex items-end gap-1 h-16">
                            {MOCK_SEASON_PROGRESSION.map((gw) => {
                                const height = (gw.points / maxGWPoints) * 100;
                                return (
                                    <div key={gw.gw} className="flex-1 flex flex-col items-center gap-0.5">
                                        <span className="text-[8px] text-gray-500 font-bold">{gw.points}</span>
                                        <div
                                            className={`w-full rounded-t transition-all ${gw.gw === 37 ? 'bg-pl-purple' : 'bg-pl-purple/30'}`}
                                            style={{ height: `${height}%`, minHeight: '4px' }}
                                        />
                                        <span className="text-[8px] text-gray-400">{gw.gw}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Rank trend */}
                        <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
                            <span className="text-[10px] text-gray-500">Current Rank</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-800">#{MOCK_SEASON_PROGRESSION[MOCK_SEASON_PROGRESSION.length - 1].rank}</span>
                                <TrendingUp size={10} className="text-green-500" />
                                <span className="text-[10px] text-green-600 font-medium">up 2 this month</span>
                            </div>
                        </div>
                    </div>

                    {/* Standings Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-3 text-[10px] font-bold text-gray-400 uppercase">Rank</th>
                                    <th className="p-3 text-[10px] font-bold text-gray-400 uppercase">Team & Manager</th>
                                    <th className="p-3 text-[10px] font-bold text-gray-400 uppercase text-right">GW</th>
                                    <th className="p-3 text-[10px] font-bold text-gray-400 uppercase text-right">Tot</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {members.map((member) => (
                                    <tr key={member.user_id} className={member.is_me ? 'bg-pl-purple/5 border-l-2 border-pl-purple' : ''}>
                                        <td className="p-3 text-xs font-bold text-gray-700 flex items-center gap-1">
                                            {member.rank <= 3 && <span>{member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : '🥉'}</span>}
                                            {member.rank > 3 && member.rank}
                                            {member.rank_change < 0 && <TrendingDown size={10} className="text-red-500" />}
                                            {member.rank_change > 0 && <TrendingUp size={10} className="text-green-500" />}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-xs text-gray-900">{member.team_name} {member.is_me && <span className="text-[9px] text-pl-purple">(You)</span>}</div>
                                            <div className="text-[10px] text-gray-500">{member.manager_name}</div>
                                        </td>
                                        <td className="p-3 text-right text-xs text-gray-600">{member.gameweek_points}</td>
                                        <td className="p-3 text-right text-xs font-bold text-pl-purple">{member.total_points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Points Behind Leader */}
                    {members.find(m => m.is_me) && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-xs">
                                <HelpCircle size={14} className="text-blue-500 shrink-0" />
                                <div>
                                    <span className="text-blue-800 font-bold">
                                        {members[0].is_me ? 'You\'re leading the league!' :
                                         `${members[0].total_points - (members.find(m => m.is_me)?.total_points || 0)} points behind ${members[0].team_name}`}
                                    </span>
                                    <span className="text-blue-600 block text-[10px] mt-0.5">
                                        {members[0].is_me ? 'Keep up the great work!' :
                                         `That's roughly ${Math.ceil((members[0].total_points - (members.find(m => m.is_me)?.total_points || 0)) / 5)} good gameweeks to catch up`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- MATCHUPS TAB (H2H) --- */}
            {activeTab === 'Matchups' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="font-bold">Gameweek 37</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                        </span>
                    </div>

                    {matchups.map((match) => {
                        const isExpanded = expandedMatchup === match.id;
                        const isUserMatch = match.home_team.is_me || match.away_team.is_me;
                        const analysis = isUserMatch ? getMatchAnalysis(match) : null;

                        return (
                            <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Status Stripe */}
                                <div className={`h-1 w-full ${match.status === 'live' ? 'bg-pl-green animate-pulse' : match.status === 'finished' ? 'bg-gray-300' : 'bg-blue-300'}`}></div>

                                {/* Score Header */}
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => setExpandedMatchup(isExpanded ? null : match.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        {/* Home Team */}
                                        <div className={`flex-1 text-center ${match.home_team.is_me ? 'font-bold' : ''}`}>
                                            <div className="text-[10px] text-gray-500 mb-1 truncate">{match.home_team.team_name}</div>
                                            <div className={`text-2xl font-bold ${match.home_score > match.away_score ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {match.home_score}
                                            </div>
                                            <div className="text-[9px] text-gray-400">{match.home_team.manager_name}</div>
                                        </div>

                                        {/* VS Divider */}
                                        <div className="px-3 text-center flex flex-col items-center gap-1">
                                            <div className="text-[10px] font-bold text-gray-300">VS</div>
                                            {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                                        </div>

                                        {/* Away Team */}
                                        <div className={`flex-1 text-center ${match.away_team.is_me ? 'font-bold' : ''}`}>
                                            <div className="text-[10px] text-gray-500 mb-1 truncate">{match.away_team.team_name}</div>
                                            <div className={`text-2xl font-bold ${match.away_score > match.home_score ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {match.away_score}
                                            </div>
                                            <div className="text-[9px] text-gray-400">{match.away_team.manager_name}</div>
                                        </div>
                                    </div>

                                    {/* Win/Loss Indicator */}
                                    {isUserMatch && analysis && (
                                        <div className={`mt-2 text-center py-1.5 text-[10px] font-bold rounded-lg flex items-center justify-center gap-2
                                            ${analysis.userWinning ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {analysis.userWinning ? (
                                                <>
                                                    <TrendingUp size={12} />
                                                    WINNING by {analysis.margin} pts
                                                    {analysis.yourStillPlaying > 0 && <span className="bg-green-200 px-1.5 py-0.5 rounded text-[9px]">{analysis.yourStillPlaying} still playing</span>}
                                                </>
                                            ) : (
                                                <>
                                                    <TrendingDown size={12} />
                                                    LOSING by {analysis.margin} pts
                                                    {analysis.yourStillPlaying > 0 && <span className="bg-red-200 px-1.5 py-0.5 rounded text-[9px]">{analysis.yourStillPlaying} still playing</span>}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {!isUserMatch && (
                                        <div className="mt-1 text-center text-[9px] text-gray-400">Tap to see details</div>
                                    )}
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && isUserMatch && (
                                    <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Sub-tabs */}
                                        <div className="flex border-b border-gray-100 bg-gray-50">
                                            {[
                                                { id: 'players', label: 'Players', icon: <Users size={12} /> },
                                                { id: 'events', label: 'Live Feed', icon: <Zap size={12} /> },
                                                { id: 'analysis', label: 'Analysis', icon: <BarChart2 size={12} /> }
                                            ].map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setMatchupView(tab.id as any)}
                                                    className={`flex-1 py-2 text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                                                        matchupView === tab.id ? 'text-pl-purple border-b-2 border-pl-purple bg-white' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {tab.icon} {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Player-by-Player View */}
                                        {matchupView === 'players' && (
                                            <div className="p-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {/* Your Players */}
                                                    <div>
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 text-center">
                                                            {match.home_team.is_me ? 'You' : match.home_team.manager_name}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {breakdown.home_players
                                                                .sort((a, b) => (b.is_captain ? b.points * 2 : b.points) - (a.is_captain ? a.points * 2 : a.points))
                                                                .map(p => renderPlayerRow(p, 'left'))}
                                                        </div>
                                                    </div>
                                                    {/* Opponent Players */}
                                                    <div>
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 text-center">
                                                            {match.away_team.is_me ? 'You' : match.away_team.manager_name}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {breakdown.away_players
                                                                .sort((a, b) => (b.is_captain ? b.points * 2 : b.points) - (a.is_captain ? a.points * 2 : a.points))
                                                                .map(p => renderPlayerRow(p, 'right'))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Live Events Feed */}
                                        {matchupView === 'events' && (
                                            <div className="p-3 max-h-64 overflow-y-auto">
                                                <div className="space-y-2">
                                                    {breakdown.live_events.map((event, i) => (
                                                        <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                                                            event.team === 'home' && match.home_team.is_me ? 'bg-green-50 border-l-2 border-green-400' :
                                                            event.team === 'away' && match.away_team.is_me ? 'bg-green-50 border-l-2 border-green-400' :
                                                            event.points > 0 ? 'bg-red-50 border-l-2 border-red-300' : 'bg-gray-50'
                                                        }`}>
                                                            <span className="text-[10px] font-mono font-bold text-gray-500 w-8 shrink-0">{event.time}</span>
                                                            <div className="flex-1">
                                                                <span className="text-gray-700">{event.text}</span>
                                                                {event.points > 0 && (
                                                                    <span className={`ml-1 text-[10px] font-bold ${
                                                                        (event.team === 'home' && match.home_team.is_me) || (event.team === 'away' && match.away_team.is_me)
                                                                            ? 'text-green-600' : 'text-red-500'
                                                                    }`}>
                                                                        {(event.team === 'home' && match.home_team.is_me) || (event.team === 'away' && match.away_team.is_me)
                                                                            ? `+${event.points} for you` : `+${event.points} for them`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Analysis View */}
                                        {matchupView === 'analysis' && analysis && (
                                            <div className="p-3 space-y-3">
                                                {/* Key Difference */}
                                                <div className={`rounded-lg p-3 ${analysis.userWinning ? 'bg-green-50' : 'bg-red-50'}`}>
                                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Why You're {analysis.userWinning ? 'Winning' : 'Losing'}</h4>
                                                    <div className="space-y-1.5">
                                                        {/* Captain comparison */}
                                                        <div className="text-xs text-gray-700 flex items-start gap-1.5">
                                                            <span className="text-yellow-500">👑</span>
                                                            <span>
                                                                <strong>Captain:</strong> Your {analysis.yourCaptain?.player_name} ({(analysis.yourCaptain?.points || 0) * 2}pts)
                                                                vs their {analysis.theirCaptain?.player_name} ({(analysis.theirCaptain?.points || 0) * 2}pts)
                                                                {analysis.captainDiff > 0
                                                                    ? <span className="text-green-600 font-bold"> (+{analysis.captainDiff} swing)</span>
                                                                    : <span className="text-red-500 font-bold"> ({analysis.captainDiff} swing)</span>}
                                                            </span>
                                                        </div>
                                                        {/* Top performer */}
                                                        <div className="text-xs text-gray-700 flex items-start gap-1.5">
                                                            <span>⭐</span>
                                                            <span>
                                                                <strong>Your top scorer:</strong> {analysis.topScorer?.player_name} with {analysis.topScorer?.is_captain ? (analysis.topScorer?.points || 0) * 2 : analysis.topScorer?.points} pts
                                                            </span>
                                                        </div>
                                                        {/* Players still playing */}
                                                        {(analysis.yourStillPlaying > 0 || analysis.theirStillPlaying > 0) && (
                                                            <div className="text-xs text-gray-700 flex items-start gap-1.5">
                                                                <span className="text-green-500">🟢</span>
                                                                <span>
                                                                    <strong>Still playing:</strong> You have {analysis.yourStillPlaying}, they have {analysis.theirStillPlaying}
                                                                    {analysis.yourStillPlaying > analysis.theirStillPlaying && !analysis.userWinning &&
                                                                        <span className="text-blue-600 font-medium"> - you could still catch up!</span>}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* H2H Record */}
                                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Season H2H Record</h4>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1">
                                                            <div className="flex h-3 rounded-full overflow-hidden">
                                                                <div className="bg-green-500" style={{ width: `${(breakdown.h2h_record.wins / breakdown.h2h_record.total_played) * 100}%` }}></div>
                                                                <div className="bg-gray-300" style={{ width: `${(breakdown.h2h_record.draws / breakdown.h2h_record.total_played) * 100}%` }}></div>
                                                                <div className="bg-red-400" style={{ width: `${(breakdown.h2h_record.losses / breakdown.h2h_record.total_played) * 100}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-1.5 text-[10px]">
                                                        <span className="text-green-600 font-bold">{breakdown.h2h_record.wins}W</span>
                                                        <span className="text-gray-500 font-bold">{breakdown.h2h_record.draws}D</span>
                                                        <span className="text-red-500 font-bold">{breakdown.h2h_record.losses}L</span>
                                                    </div>
                                                </div>

                                                {/* Quick Tips */}
                                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                                                    <div className="text-[10px] text-blue-700 flex items-start gap-1.5">
                                                        <HelpCircle size={12} className="text-blue-500 shrink-0 mt-0.5" />
                                                        <span>
                                                            {analysis.userWinning
                                                                ? "You're in a strong position! Check back after the remaining matches to see if you held on."
                                                                : analysis.yourStillPlaying > 0
                                                                    ? "Don't worry - you still have players in action who could close the gap."
                                                                    : "Tough week! Focus on next week's captain pick and consider your transfers carefully."
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Collapsed but expanded for non-user matches */}
                                {isExpanded && !isUserMatch && (
                                    <div className="border-t border-gray-100 p-3 text-center text-xs text-gray-500">
                                        <p>Detailed breakdowns available for your own matchups.</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Tap on your matchup above to see player-by-player scoring.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* How matchups work explainer */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                            <HelpCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[10px] font-bold text-blue-800 mb-0.5">How H2H Matchups Work</h4>
                                <p className="text-[10px] text-blue-600">Each week you face a different league member. Your gameweek points are compared - the higher scorer wins. Win = 3 pts, Draw = 1 pt, Loss = 0 pts toward your H2H ranking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- POT & STAKING TAB --- */}
            {activeTab === 'Pot' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-eth-yellow to-orange-400 p-4 rounded-xl text-white shadow-md">
                            <div className="flex items-center gap-1 mb-1 text-white/80">
                                <Trophy size={14} />
                                <span className="text-[10px] font-bold uppercase">Season Pot</span>
                            </div>
                            <div className="text-2xl font-bold">{pot.season_pot.toLocaleString()} <span className="text-xs">{CURRENCY_SYMBOL}</span></div>
                            <div className="text-[9px] mt-1 bg-black/10 inline-block px-1.5 py-0.5 rounded">Pays out GW38</div>
                        </div>

                        <div className="bg-gradient-to-br from-pl-green to-emerald-600 p-4 rounded-xl text-white shadow-md">
                            <div className="flex items-center gap-1 mb-1 text-white/80">
                                <Coins size={14} />
                                <span className="text-[10px] font-bold uppercase">Weekly Pot</span>
                            </div>
                            <div className="text-2xl font-bold">{pot.weekly_pot.toLocaleString()} <span className="text-xs">{CURRENCY_SYMBOL}</span></div>
                            <div className="text-[9px] mt-1 bg-black/10 inline-block px-1.5 py-0.5 rounded">Last Winner: {pot.last_week_winner}</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Target size={16} className="text-pl-pink"/> Weekly Accumulator</h3>
                                <p className="text-xs text-gray-500">Stake winnings to multiply next week's payout.</p>
                            </div>
                            <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-700">
                                Bal: {pot.my_winnings_balance} {CURRENCY_SYMBOL}
                            </div>
                        </div>

                        <div className="mb-6 relative z-10">
                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                <span>Risk: Low</span>
                                <span>Risk: High</span>
                            </div>
                            <input
                                type="range"
                                min="1.1"
                                max="3.0"
                                step="0.1"
                                value={multiplier}
                                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pl-purple"
                            />
                            <div className="flex justify-between mt-2">
                                <div className="text-center">
                                    <div className="text-[10px] text-gray-400">Multiplier</div>
                                    <div className="font-bold text-lg text-pl-purple">x{multiplier.toFixed(1)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-gray-400">Potential Return</div>
                                    <div className="font-bold text-lg text-pl-green">{(stakeAmount * multiplier).toFixed(0)} {CURRENCY_SYMBOL}</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStake}
                            disabled={pot.my_winnings_balance < stakeAmount || hasStaked}
                            className={`w-full font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed ${
                                hasStaked ? 'bg-pl-green text-black' : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            {hasStaked ? (
                                <>✓ Staked for GW38</>
                            ) : (
                                <><Wallet size={16} /> Stake {stakeAmount} {CURRENCY_SYMBOL}</>
                            )}
                        </button>

                        <Target className="absolute -bottom-6 -right-6 text-gray-50 w-32 h-32" />
                    </div>

                    <div>
                        <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">Recent Winners</h4>
                        <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-bold">GW36</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">Dawit T</span>
                                    <span className="text-xs font-bold text-pl-green bg-green-50 px-2 py-0.5 rounded">+800 {CURRENCY_SYMBOL}</span>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center opacity-70">
                                <span className="text-xs font-bold">GW35</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">You</span>
                                    <span className="text-xs font-bold text-pl-green bg-green-50 px-2 py-0.5 rounded">+450 {CURRENCY_SYMBOL}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CHAT TAB --- */}
            {activeTab === 'Chat' && (
                <div className="flex flex-col space-y-4 min-h-0">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                            {isChatMuted ? <BellOff size={16} className="text-gray-400"/> : <Bell size={16} className="text-pl-purple"/>}
                            <span>{isChatMuted ? 'Notifications Muted' : 'Notifications On'}</span>
                        </div>
                        <button
                            onClick={() => setIsChatMuted(!isChatMuted)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isChatMuted ? 'bg-gray-200' : 'bg-pl-green'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${isChatMuted ? 'translate-x-1' : 'translate-x-6'}`} />
                        </button>
                    </div>

                    <div className="space-y-3 pb-2 flex-1">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex gap-2 ${msg.is_me ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!msg.is_me && (
                                    <img src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.user_name}&background=random`} alt={msg.user_name} className="w-8 h-8 rounded-full border border-gray-200" />
                                )}
                                <div className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm text-sm ${msg.is_me ? 'bg-pl-purple text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                    {!msg.is_me && <div className="text-[10px] font-bold text-pl-pink mb-0.5">{msg.user_name}</div>}
                                    {msg.message}
                                    <div className={`text-[9px] mt-1 text-right ${msg.is_me ? 'text-white/60' : 'text-gray-400'}`}>{msg.timestamp}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                </div>
            )}
        </div>

        {/* Chat Input Footer */}
        {activeTab === 'Chat' && (
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                <button className="text-gray-400 hover:text-gray-600 p-2">
                    <Smile size={20} />
                </button>
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-purple/50"
                />
                <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim()}
                    className="bg-pl-purple text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Send size={18} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LeagueDetailModal;
