
import React, { useState } from 'react';
import { MOCK_PLAYERS } from '../constants';
import { Player, Position } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortKey = keyof Player | 'price' | 'selected_by_percent';

const PlayerStatsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Summary' | 'Attacking' | 'Defensive' | 'ICT'>('Summary');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'total_points', direction: 'desc' });

  const sortedPlayers = [...MOCK_PLAYERS].sort((a, b) => {
    // @ts-ignore - dynamic sorting
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    // @ts-ignore
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortConfig.key !== colKey) return <ArrowUpDown size={10} className="text-gray-300" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={10} className="text-pl-green" /> : <ArrowDown size={10} className="text-pl-green" />;
  };

  const Th: React.FC<{ label: string; sortKey: SortKey; width?: string; tooltip?: string }> = ({ label, sortKey, width, tooltip }) => (
    <th 
      className={`px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 ${width}`}
      onClick={() => requestSort(sortKey)}
      title={tooltip}
    >
      <div className="flex items-center gap-1">
        <span className={tooltip ? 'border-b border-dotted border-gray-400 cursor-help' : ''}>
            {label}
        </span>
        <SortIcon colKey={sortKey} />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {['Summary', 'Attacking', 'Defensive', 'ICT'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-pl-purple border-b-2 border-pl-purple bg-purple-50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th label="Player" sortKey="name" width="min-w-[120px]" />
              <Th label="Price" sortKey="price" />
              {activeTab === 'Summary' && (
                <>
                  <Th label="Pts" sortKey="total_points" tooltip="Total Points" />
                  <Th label="PPM" sortKey="total_points" tooltip="Points Per Match" /> 
                  <Th label="Form" sortKey="form" tooltip="Average points over last 30 days" />
                  <Th label="Own %" sortKey="selected_by_percent" tooltip="Ownership Percentage" />
                </>
              )}
              {activeTab === 'Attacking' && (
                <>
                  <Th label="G" sortKey="goals_scored" tooltip="Goals Scored" />
                  <Th label="A" sortKey="assists" tooltip="Assists" />
                  <Th label="xG" sortKey="stats_xg" tooltip="Expected Goals" />
                  <Th label="xA" sortKey="stats_xa" tooltip="Expected Assists" />
                </>
              )}
              {activeTab === 'Defensive' && (
                <>
                  <Th label="CS" sortKey="clean_sheets" tooltip="Clean Sheets" />
                  <Th label="GC" sortKey="stats_goals_conceded" tooltip="Goals Conceded" />
                  <Th label="Saves" sortKey="stats_saves" tooltip="Saves Made" />
                </>
              )}
              {activeTab === 'ICT' && (
                 <>
                  <Th label="Index" sortKey="stats_ict" tooltip="Influence, Creativity, Threat Index" />
                  <Th label="xG" sortKey="stats_xg" tooltip="Expected Goals" />
                  <Th label="xA" sortKey="stats_xa" tooltip="Expected Assists" />
                 </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPlayers.map((player, idx) => (
              <tr key={player.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-2 py-3 whitespace-nowrap">
                   <div className="flex items-center">
                      <div className={`w-1 h-8 mr-2 rounded-full ${
                          player.position === 'GK' ? 'bg-yellow-400' :
                          player.position === 'DEF' ? 'bg-blue-400' :
                          player.position === 'MID' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <div>
                          <div className="text-xs font-bold text-gray-900">{player.name}</div>
                          <div className="text-[10px] text-gray-500">{player.team} • {player.position}</div>
                      </div>
                   </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">£{player.price}</td>
                
                {activeTab === 'Summary' && (
                    <>
                        <td className="px-2 py-3 whitespace-nowrap text-xs font-bold text-pl-purple">{player.total_points}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 font-medium">
                            {player.matches_played > 0 ? (player.total_points / player.matches_played).toFixed(1) : '0.0'}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-600">{player.form}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-600">{player.selected_by_percent}%</td>
                    </>
                )}
                 {activeTab === 'Attacking' && (
                    <>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">{player.goals_scored}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">{player.assists}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{player.stats_xg}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{player.stats_xa}</td>
                    </>
                )}
                 {activeTab === 'Defensive' && (
                    <>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">{player.clean_sheets}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{player.stats_goals_conceded}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{player.stats_saves || '-'}</td>
                    </>
                )}
                 {activeTab === 'ICT' && (
                    <>
                        <td className="px-2 py-3 whitespace-nowrap text-xs font-bold text-blue-600">{player.stats_ict}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{player.stats_xg}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{player.stats_xa}</td>
                    </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStatsTable;
