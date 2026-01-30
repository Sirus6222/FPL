
import React, { useState, useEffect } from 'react';
import { Player, Position, MatchStatsSummary } from '../types';
import { MOCK_PLAYERS } from '../constants';
import { X, TrendingUp, TrendingDown, Activity, BarChart3, ShieldCheck, ArrowRightLeft, Search, ChevronLeft, Award, List, Sparkles, Bot, Minus, Circle, Goal, Flag, RectangleVertical, Timer } from 'lucide-react';
import RadarChart from './RadarChart';
import { generatePlayerInsight } from '../services/geminiService';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
  onAction: (action: 'swap' | 'captain') => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose, onAction }) => {
  const [comparePlayer, setComparePlayer] = useState<Player | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'Stats' | 'Live Match' | 'AI'>('Stats');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Reset internal state when the main player changes or modal closes
  useEffect(() => {
    setComparePlayer(null);
    setIsSelecting(false);
    setSearchTerm('');
    setView('Stats');
    setAiInsight(null);
    setLoadingAI(false);
  }, [player]);

  if (!player) return null;

  const pointsPerMatch = player.matches_played > 0 ? (player.total_points / player.matches_played).toFixed(1) : '0.0';
  const seasonPPM = parseFloat(pointsPerMatch);
  
  // Trend Logic: If recent form > season average PPM, they are trending up.
  const isTrendingUp = player.form > seasonPPM;
  const isTrendingDown = player.form < seasonPPM;

  const handleFetchAI = async () => {
      setLoadingAI(true);
      const insight = await generatePlayerInsight(player);
      setAiInsight(insight);
      setLoadingAI(false);
  };

  // Mock heatmap logic: Green for >=6 pts, Yellow for >=3, Red for <3
  const getHeatmapColor = (pts: number) => {
    if (pts >= 6) return 'bg-pl-green text-pl-purple';
    if (pts >= 3) return 'bg-yellow-400 text-black';
    return 'bg-gray-200 text-gray-500';
  };

  const handleSelectCompare = (p: Player) => {
    setComparePlayer(p);
    setIsSelecting(false);
  };

  // --- View 2: Player Selection for Comparison ---
  if (isSelecting) {
    const filtered = MOCK_PLAYERS.filter(p => 
      p.id !== player.id && 
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.team.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                 <div className="p-4 border-b flex items-center gap-2">
                     <button onClick={() => setIsSelecting(false)} className="p-1 hover:bg-gray-100 rounded-full">
                         <ChevronLeft size={20} />
                     </button>
                     <h3 className="font-bold text-gray-800">Compare with...</h3>
                 </div>
                 <div className="p-3 border-b bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search player..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pl-purple"
                            autoFocus
                        />
                    </div>
                 </div>
                 <div className="overflow-y-auto flex-1 p-2 space-y-1">
                     {filtered.map(p => (
                         <button 
                            key={p.id}
                            onClick={() => handleSelectCompare(p)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition text-left group"
                         >
                             <div className="flex items-center gap-3">
                                 <img src={p.image} className="w-10 h-10 rounded-full object-cover bg-gray-200" alt={p.name}/>
                                 <div>
                                     <div className="font-bold text-sm text-gray-800 group-hover:text-pl-purple">{p.name}</div>
                                     <div className="text-xs text-gray-500">{p.team} • {p.position}</div>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <div className="font-bold text-pl-purple text-sm">{p.price}m</div>
                                 <div className="text-xs text-gray-500">{p.total_points} pts</div>
                             </div>
                         </button>
                     ))}
                 </div>
             </div>
        </div>
    );
  }

  // --- View 3: Comparison View (Head-to-Head) ---
  if (comparePlayer) {
     const ppm1 = player.matches_played > 0 ? (player.total_points / player.matches_played).toFixed(1) : '0.0';
     const ppm2 = comparePlayer.matches_played > 0 ? (comparePlayer.total_points / comparePlayer.matches_played).toFixed(1) : '0.0';

     const StatRow = ({ label, val1, val2, highIsGood = true }: { label: string, val1: number | string, val2: number | string, highIsGood?: boolean }) => {
         const v1 = Number(val1);
         const v2 = Number(val2);
         const isBetter1 = highIsGood ? v1 > v2 : v1 < v2;
         const isBetter2 = highIsGood ? v2 > v1 : v2 < v1;
         const isEqual = v1 === v2;

         return (
             <div className="flex items-center text-sm py-2 border-b border-gray-50 last:border-0">
                 <div className={`flex-1 text-right font-bold ${isBetter1 ? 'text-pl-green' : isEqual ? 'text-gray-600' : 'text-red-500 opacity-70'}`}>
                     {val1}
                 </div>
                 <div className="w-24 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2">{label}</div>
                 <div className={`flex-1 text-left font-bold ${isBetter2 ? 'text-pl-green' : isEqual ? 'text-gray-600' : 'text-red-500 opacity-70'}`}>
                     {val2}
                 </div>
             </div>
         )
     };

     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
                <div className="bg-pl-purple p-4 text-white flex justify-between items-center shadow-md z-10">
                    <button onClick={() => setComparePlayer(null)} className="flex items-center gap-1 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
                        <ChevronLeft size={14} /> Back
                    </button>
                    <h3 className="font-bold text-sm">Head-to-Head</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                    <div className="text-center w-1/3">
                        <div className="w-16 h-16 rounded-full mx-auto mb-2 p-1 bg-white shadow-sm border border-gray-100">
                             <img src={player.image} className="w-full h-full rounded-full object-cover" alt={player.name} />
                        </div>
                        <div className="font-bold text-sm leading-tight text-gray-900">{player.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{player.team}</div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                        <div className="bg-pl-purple text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">VS</div>
                    </div>
                    <div className="text-center w-1/3 group cursor-pointer" onClick={() => setIsSelecting(true)}>
                        <div className="w-16 h-16 rounded-full mx-auto mb-2 p-1 bg-white shadow-sm border border-gray-100 group-hover:ring-2 ring-pl-green transition">
                             <img src={comparePlayer.image} className="w-full h-full rounded-full object-cover" alt={comparePlayer.name} />
                        </div>
                        <div className="font-bold text-sm leading-tight text-gray-900">{comparePlayer.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{comparePlayer.team}</div>
                        <div className="text-[9px] text-pl-purple font-bold mt-1 opacity-0 group-hover:opacity-100 transition">Change</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <StatRow label="Price" val1={player.price} val2={comparePlayer.price} highIsGood={false} />
                    <StatRow label="Total Pts" val1={player.total_points} val2={comparePlayer.total_points} />
                    <StatRow label="Pts/Match" val1={ppm1} val2={ppm2} />
                    <StatRow label="Form" val1={player.form} val2={comparePlayer.form} />
                    <StatRow label="Selected %" val1={player.selected_by_percent} val2={comparePlayer.selected_by_percent} />
                    <StatRow label="Goals" val1={player.goals_scored} val2={comparePlayer.goals_scored} />
                    <StatRow label="Assists" val1={player.assists} val2={comparePlayer.assists} />
                    <StatRow label="Clean Sheets" val1={player.clean_sheets} val2={comparePlayer.clean_sheets} />
                    <StatRow label="Bonus Pts" val1={player.bonus_points} val2={comparePlayer.bonus_points} />
                    <StatRow label="xG" val1={player.stats_xg} val2={comparePlayer.stats_xg} />
                    <StatRow label="xA" val1={player.stats_xa} val2={comparePlayer.stats_xa} />
                    <StatRow label="ICT Index" val1={player.stats_ict} val2={comparePlayer.stats_ict} />
                </div>
            </div>
        </div>
     );
  }

  // --- View 1: Standard Detail View ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-pl-purple p-4 relative shrink-0">
             <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
                <X size={20} />
             </button>
             <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-white p-1">
                     <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover" />
                 </div>
                 <div>
                     <h2 className="text-xl font-bold text-white">{player.name}</h2>
                     <p className="text-pl-green text-sm font-medium">{player.team} • {player.position}</p>
                 </div>
             </div>
             
             {/* Sub-Nav */}
             <div className="flex mt-4 bg-white/10 rounded-lg p-1">
                <button 
                    onClick={() => setView('Stats')} 
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${view === 'Stats' ? 'bg-white text-pl-purple' : 'text-white/60 hover:text-white'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setView('Live Match')} 
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${view === 'Live Match' ? 'bg-white text-pl-purple' : 'text-white/60 hover:text-white'}`}
                >
                    Live Match
                </button>
                <button 
                    onClick={() => setView('AI')} 
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${view === 'AI' ? 'bg-white text-pl-purple' : 'text-white/60 hover:text-white'}`}
                >
                    AI Scout
                </button>
             </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            
            {view === 'Stats' && (
                <>
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Form</div>
                                <div className="text-xl font-bold text-gray-800 flex items-center gap-1">
                                    {player.form}
                                    {isTrendingUp ? <TrendingUp size={14} className="text-pl-green" /> : 
                                     isTrendingDown ? <TrendingDown size={14} className="text-red-500" /> : 
                                     <Minus size={14} className="text-gray-400" />}
                                </div>
                            </div>
                            <Activity size={20} className="text-pl-purple opacity-20" />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Pts / Match</div>
                                <div className="text-xl font-bold text-gray-800">{pointsPerMatch}</div>
                            </div>
                            <Award size={20} className="text-eth-yellow opacity-20" />
                        </div>
                    </div>

                    {/* Radar Chart */}
                    {player.stats_radar && (
                        <div className="flex flex-col items-center">
                            <h3 className="text-sm font-bold text-gray-800 mb-[-10px] z-10 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-gray-400" /> Attribute Radar
                            </h3>
                            <div className="w-48 h-48">
                                <RadarChart data={player.stats_radar} />
                            </div>
                        </div>
                    )}

                    {/* Form Heatmap */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Activity size={16} className="text-gray-400" /> Form Heatmap (Last 5)
                        </h3>
                        <div className="flex justify-between gap-2">
                            {player.recent_points?.map((pts, i) => (
                                <div key={i} className={`flex-1 aspect-square rounded-lg flex items-center justify-center font-bold text-sm ${getHeatmapColor(pts)}`}>
                                    {pts}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Stats */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <BarChart3 size={16} className="text-gray-400" /> ICT Index Breakdown
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <div className="text-[10px] text-gray-500">Influence</div>
                                <div className="font-bold text-gray-800">{(player.stats_ict * 0.4).toFixed(1)}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <div className="text-[10px] text-gray-500">Creativity</div>
                                <div className="font-bold text-gray-800">{(player.stats_ict * 0.3).toFixed(1)}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <div className="text-[10px] text-gray-500">Threat</div>
                                <div className="font-bold text-gray-800">{(player.stats_ict * 0.3).toFixed(1)}</div>
                            </div>
                        </div>
                        <div className="mt-2 text-center text-[10px] text-gray-400">Total ICT: {player.stats_ict}</div>
                    </div>
                </>
            )}

            {view === 'AI' && (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                    {!aiInsight && !loadingAI && (
                        <div className="space-y-4 p-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-pl-purple to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                <Bot size={32} className="text-white" />
                            </div>
                            <h3 className="font-bold text-gray-800">AI Scout Report</h3>
                            <p className="text-sm text-gray-500">Generate a personalized summary of why you should (or shouldn't) pick {player.name}.</p>
                            <button 
                                onClick={handleFetchAI}
                                className="bg-black text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-800 transition flex items-center gap-2 mx-auto"
                            >
                                <Sparkles size={16} /> Generate Insight
                            </button>
                        </div>
                    )}

                    {loadingAI && (
                        <div className="space-y-3">
                            <div className="w-8 h-8 border-4 border-pl-purple/30 border-t-pl-purple rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm font-bold text-pl-purple animate-pulse">Scouting {player.name}...</p>
                        </div>
                    )}

                    {aiInsight && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left w-full animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={16} className="text-pl-purple" />
                                <h3 className="font-bold text-sm text-pl-purple uppercase tracking-wide">Scout Verdict</h3>
                            </div>
                            <div className="prose prose-sm text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                {aiInsight}
                            </div>
                            <button 
                                onClick={handleFetchAI} 
                                className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
                            >
                                Refresh Analysis
                            </button>
                        </div>
                    )}
                </div>
            )}

            {view === 'Live Match' && (
                <div className="space-y-6">
                    {!player.last_match_stats ? (
                         <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                             <List size={24} className="mx-auto text-gray-300 mb-2" />
                             <p className="text-gray-500 text-sm">No live match data available.</p>
                             <p className="text-xs text-gray-400">Wait for the gameweek to start.</p>
                         </div>
                    ) : (
                        <MatchScoreBreakdown player={player} />
                    )}
                </div>
            )}
            
            {/* Actions Footer */}
            <div className="flex gap-2 pt-2 shrink-0">
                <button 
                    onClick={() => { onAction('swap'); onClose(); }}
                    className="flex-1 bg-pl-purple text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition text-xs"
                >
                    Swap
                </button>
                <button 
                    onClick={() => setIsSelecting(true)}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-xs flex items-center justify-center gap-1"
                >
                    <ArrowRightLeft size={14} /> Compare
                </button>
                <button 
                    onClick={() => { onAction('captain'); onClose(); }}
                    className="flex-1 border-2 border-pl-purple text-pl-purple py-3 rounded-xl font-bold hover:bg-pl-purple/5 transition text-xs"
                >
                    Captain
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for the Live Match view
const MatchScoreBreakdown: React.FC<{ player: Player }> = ({ player }) => {
    if (!player.last_match_stats) return null;
    
    const stats = player.last_match_stats;
    
    // Procedural Timeline Generation based on stats
    const timelineEvents = React.useMemo(() => {
        const events = [];
        if (stats.minutesPlayed > 0) events.push({ min: 0, type: 'start', text: 'Kickoff', points: 0 });
        if (stats.minutesPlayed > 0 && stats.minutesPlayed < 90) events.push({ min: stats.minutesPlayed, type: 'sub_out', text: 'Substituted Out', points: 1 });
        if (stats.minutesPlayed === 90) events.push({ min: 90, type: 'end', text: 'Full Time', points: 0 });

        for(let i=0; i<stats.goalsScored; i++) events.push({ min: Math.floor(Math.random() * 80) + 5, type: 'goal', text: 'Goal Scored', points: player.position === Position.FWD ? 4 : player.position === Position.MID ? 5 : 6 });
        for(let i=0; i<stats.assists; i++) events.push({ min: Math.floor(Math.random() * 80) + 5, type: 'assist', text: 'Assist', points: 3 });
        for(let i=0; i<stats.yellowCards; i++) events.push({ min: Math.floor(Math.random() * 80) + 5, type: 'card_yellow', text: 'Yellow Card', points: -1 });
        for(let i=0; i<stats.redCards; i++) events.push({ min: Math.floor(Math.random() * 80) + 5, type: 'card_red', text: 'Red Card', points: -3 });
        if (stats.saves >= 3) events.push({ min: 85, type: 'save', text: `${stats.saves} Saves made`, points: Math.floor(stats.saves/3) });
        if (stats.bonus > 0) events.push({ min: 90, type: 'bonus', text: 'Bonus Points Awarded', points: stats.bonus });

        return events.sort((a, b) => a.min - b.min);
    }, [stats, player.position]);

    const getImpactNarrative = () => {
        if (stats.bonus === 3) return "⭐️ A masterclass performance securing maximum bonus points.";
        if (stats.goalsScored > 1) return "🔥 A brace today makes him the MVP of the match.";
        if (stats.redCards > 0) return "⚠️ A disastrous outing with a red card dismissal.";
        if (stats.cleanSheet && (player.position === Position.GK || player.position === Position.DEF)) return "🛡️ Solid defensive display locking in the clean sheet.";
        if (stats.goalsScored > 0) return "⚽ Crucial goal contributed nicely to the total score.";
        return "Typical performance, steady points accumulation.";
    };

    return (
        <>
            {/* Header Points */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden text-center shadow-lg">
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gameweek Points</h3>
                    <div className="text-5xl font-black tracking-tight">{player.points_last_gw}</div>
                    <div className="mt-2 text-sm text-pl-green flex justify-center items-center gap-1">
                        <TrendingUp size={14} /> BPS Rank: {stats.bonus === 3 ? '1st' : stats.bonus === 2 ? '2nd' : stats.bonus === 1 ? '3rd' : '>3rd'}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-pl-pink opacity-20 blur-3xl rounded-full"></div>
            </div>

            {/* Narrative */}
            <div className="bg-pl-purple/5 border border-pl-purple/10 p-3 rounded-xl text-sm text-pl-purple font-medium flex gap-2 items-start">
                <Sparkles size={16} className="shrink-0 mt-0.5" />
                {getImpactNarrative()}
            </div>

            {/* Points Breakdown Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                    Points Breakdown
                </div>
                <div className="divide-y divide-gray-50">
                    {stats.minutesPlayed > 0 && <BreakdownRow label="Minutes Played" count={stats.minutesPlayed + "'"} points={stats.minutesPlayed >= 60 ? 2 : 1} />}
                    {stats.goalsScored > 0 && <BreakdownRow label="Goals" count={stats.goalsScored} points={stats.goalsScored * (player.position === Position.FWD ? 4 : player.position === Position.MID ? 5 : 6)} />}
                    {stats.assists > 0 && <BreakdownRow label="Assists" count={stats.assists} points={stats.assists * 3} />}
                    {stats.cleanSheet && (player.position === Position.GK || player.position === Position.DEF) && <BreakdownRow label="Clean Sheet" count={1} points={4} />}
                    {stats.saves >= 3 && <BreakdownRow label="Saves" count={stats.saves} points={Math.floor(stats.saves / 3)} />}
                    {stats.yellowCards > 0 && <BreakdownRow label="Yellow Cards" count={stats.yellowCards} points={stats.yellowCards * -1} isNegative />}
                    {stats.redCards > 0 && <BreakdownRow label="Red Cards" count={stats.redCards} points={stats.redCards * -3} isNegative />}
                    {stats.bonus > 0 && <BreakdownRow label="Bonus" count={stats.bonus} points={stats.bonus} />}
                </div>
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                    <span>Total</span>
                    <span>{player.points_last_gw} pts</span>
                </div>
            </div>

            {/* Event Timeline */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                    <Timer size={12} /> Match Timeline
                </h4>
                <div className="relative pl-4 ml-2 border-l-2 border-gray-100 space-y-6">
                    {timelineEvents.map((event, idx) => (
                        <div key={idx} className="relative">
                            <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white ${
                                event.type === 'goal' ? 'bg-pl-green' : 
                                event.type === 'card_red' ? 'bg-red-500' : 
                                event.type === 'bonus' ? 'bg-eth-yellow' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs font-bold text-gray-800">{event.min}' {event.text}</div>
                                    <div className="text-[10px] text-gray-400 capitalize">{event.type.replace('_', ' ')}</div>
                                </div>
                                {event.points !== 0 && (
                                    <div className={`text-xs font-bold ${event.points > 0 ? 'text-pl-green' : 'text-red-500'}`}>
                                        {event.points > 0 ? '+' : ''}{event.points}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const BreakdownRow = ({ label, count, points, isNegative = false }: { label: string, count: number | string, points: number, isNegative?: boolean }) => (
    <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition">
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{label}</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded-full font-bold">x{count}</span>
        </div>
        <span className={`text-sm font-bold ${isNegative ? 'text-red-500' : 'text-pl-green'}`}>
            {points > 0 ? '+' : ''}{points}
        </span>
    </div>
);

const BPSRow = ({ label, value, isNegative = false }: { label: string, value: number, isNegative?: boolean }) => (
    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm border border-gray-100">
        <span className="text-gray-600">{label}</span>
        <span className={`font-bold ${isNegative || value < 0 ? 'text-red-500' : 'text-pl-green'}`}>
            {value > 0 ? '+' : ''}{value}
        </span>
    </div>
);

export default PlayerDetailModal;
