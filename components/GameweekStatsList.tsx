import React from 'react';
import { Gameweek } from '../types';
import { MOCK_PLAYERS } from '../constants';
import { Trophy, Users, BarChart } from 'lucide-react';

interface GameweekStatsListProps {
  gameweeks: Gameweek[];
}

const GameweekStatsList: React.FC<GameweekStatsListProps> = ({ gameweeks }) => {
  const getPlayerName = (id?: number) => {
    if (!id) return '-';
    const p = MOCK_PLAYERS.find(player => player.id === id);
    return p ? p.name : 'Unknown';
  };

  return (
    <div className="space-y-4">
      {gameweeks.map(gw => (
        <div key={gw.gameweek_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
            <h3 className="font-bold text-gray-800">Gameweek {gw.gameweek_number}</h3>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${gw.is_finished ? 'bg-gray-100 text-gray-500' : 'bg-pl-green text-pl-purple'}`}>
              {gw.is_finished ? 'Finished' : 'Live'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-1">
                    <Trophy size={12} className="text-eth-yellow" /> Highest Score
                </div>
                <div className="text-xl font-bold text-gray-800">{gw.highest_score || '-'} <span className="text-xs font-normal text-gray-400">pts</span></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-1">
                    <BarChart size={12} className="text-blue-500" /> Average
                </div>
                <div className="text-xl font-bold text-gray-800">{gw.average_score || '-'} <span className="text-xs font-normal text-gray-400">pts</span></div>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center text-xs">
             <div className="flex-1">
                <div className="text-gray-400 mb-1">Most Selected</div>
                <div className="font-bold flex items-center gap-2">
                    <Users size={14} className="text-gray-400"/>
                    {getPlayerName(gw.most_selected_player_id)}
                </div>
             </div>
             <div className="flex-1 text-right">
                <div className="text-gray-400 mb-1">Most Captained</div>
                 <div className="font-bold flex items-center gap-2 justify-end">
                    {getPlayerName(gw.most_captained_player_id)}
                    <div className="bg-black text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">C</div>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameweekStatsList;