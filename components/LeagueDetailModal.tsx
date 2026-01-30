import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Users, Shield, TrendingUp, TrendingDown, Coins, ArrowRight, Wallet, Target, MessageCircle, Bell, BellOff, Send, Smile } from 'lucide-react';
import { League, LeagueMember, LeagueMatchup, PotInfo, ChatMessage } from '../types';
import { MOCK_LEAGUE_MEMBERS, MOCK_MATCHUPS, MOCK_POT_INFO, CURRENCY_SYMBOL, MOCK_CHAT_MESSAGES } from '../constants';

interface LeagueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League | null;
}

const LeagueDetailModal: React.FC<LeagueDetailModalProps> = ({ isOpen, onClose, league }) => {
  const [activeTab, setActiveTab] = useState<'Standings' | 'Matchups' | 'Pot' | 'Chat'>('Standings');
  const [multiplier, setMultiplier] = useState(1.5);
  const [stakeAmount, setStakeAmount] = useState(50);
  
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

  // Use mock data for internal league structure
  // In a real app, you would fetch this based on league.league_id
  const members = MOCK_LEAGUE_MEMBERS;
  const matchups = MOCK_MATCHUPS;
  const pot = MOCK_POT_INFO;

  const handleStake = () => {
      alert(`Staked ${stakeAmount} ${CURRENCY_SYMBOL} for a chance to win ${Math.floor(stakeAmount * multiplier)} ${CURRENCY_SYMBOL} next week!`);
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

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200"
        onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
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
             
             {/* Background decorative elements */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-pl-pink blur-3xl opacity-20 rounded-full z-0"></div>
        </div>

        {/* Tab Navigation (Floating overlapping header) */}
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
                <div className="space-y-3">
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
                                    <tr key={member.user_id} className={member.is_me ? 'bg-pl-purple/5' : ''}>
                                        <td className="p-3 text-xs font-bold text-gray-700 flex items-center gap-1">
                                            {member.rank}
                                            {member.rank_change < 0 && <TrendingDown size={10} className="text-red-500" />}
                                            {member.rank_change > 0 && <TrendingUp size={10} className="text-pl-green" />}
                                            {member.rank_change === 0 && <span className="w-2.5"></span>}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-xs text-gray-900">{member.team_name}</div>
                                            <div className="text-[10px] text-gray-500">{member.manager_name}</div>
                                        </td>
                                        <td className="p-3 text-right text-xs text-gray-600">{member.gameweek_points}</td>
                                        <td className="p-3 text-right text-xs font-bold text-pl-purple">{member.total_points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- MATCHUPS TAB (H2H) --- */}
            {activeTab === 'Matchups' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="font-bold">Gameweek 37 Results</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Live</span>
                    </div>

                    {matchups.map((match) => (
                        <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                            {/* Status Stripe */}
                            <div className={`h-1 w-full ${match.status === 'live' ? 'bg-pl-green animate-pulse' : 'bg-gray-200'}`}></div>
                            
                            <div className="p-4 flex justify-between items-center">
                                {/* Home Team */}
                                <div className={`flex-1 text-center ${match.home_team.is_me ? 'font-bold' : ''}`}>
                                    <div className="text-[10px] text-gray-500 mb-1 truncate">{match.home_team.team_name}</div>
                                    <div className={`text-2xl font-bold ${match.home_score > match.away_score ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {match.home_score}
                                    </div>
                                    <div className="text-[9px] text-gray-400">{match.home_team.manager_name}</div>
                                </div>

                                {/* VS Divider */}
                                <div className="px-2 text-center">
                                    <div className="text-[10px] font-bold text-gray-300">VS</div>
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
                            
                            {/* Win/Loss Indicator for User */}
                            {(match.home_team.is_me || match.away_team.is_me) && (
                                <div className={`text-center py-1 text-[10px] font-bold text-white 
                                    ${(match.home_team.is_me && match.home_score > match.away_score) || (match.away_team.is_me && match.away_score > match.home_score) 
                                        ? 'bg-pl-green text-black' 
                                        : 'bg-red-500'}`}>
                                    {(match.home_team.is_me && match.home_score > match.away_score) || (match.away_team.is_me && match.away_score > match.home_score) 
                                        ? 'WINNING' 
                                        : 'LOSING'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- POT & STAKING TAB --- */}
            {activeTab === 'Pot' && (
                <div className="space-y-6">
                    {/* Pot Overview Cards */}
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

                    {/* Staking Accumulator Section */}
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
                            disabled={pot.my_winnings_balance < stakeAmount}
                            className="w-full bg-black text-white font-bold py-3 rounded-xl shadow-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Wallet size={16} /> Stake {stakeAmount} {CURRENCY_SYMBOL}
                        </button>

                        <Target className="absolute -bottom-6 -right-6 text-gray-50 w-32 h-32" />
                    </div>

                    {/* Winners History */}
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
                    {/* Mute Toggle Header */}
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

                    {/* Messages */}
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