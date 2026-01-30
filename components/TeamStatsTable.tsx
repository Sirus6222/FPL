import React, { useState } from 'react';
import { TeamStats } from '../types';
import { MOCK_TEAM_STATS } from '../constants';
import { HelpCircle } from 'lucide-react';

const TeamStatsTable: React.FC = () => {
  const [sortKey, setSortKey] = useState<keyof TeamStats>('goals_conceded');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const sortedStats = [...MOCK_TEAM_STATS].sort((a, b) => {
    // @ts-ignore
    if (a[sortKey] < b[sortKey]) return direction === 'asc' ? -1 : 1;
    // @ts-ignore
    if (a[sortKey] > b[sortKey]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: keyof TeamStats) => {
    if (sortKey === key) {
        setDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setDirection('desc');
    }
  };

  const headers: { key: keyof TeamStats; label: string; tooltip: string }[] = [
    { key: 'short_name', label: 'Team', tooltip: 'Premier League Team' },
    { key: 'goals_conceded', label: 'GC', tooltip: 'Goals Conceded' },
    { key: 'xg_against', label: 'xGC', tooltip: 'Expected Goals Conceded (Measure of defensive quality)' },
    { key: 'goals_scored', label: 'GS', tooltip: 'Goals Scored' },
    { key: 'xg_for', label: 'xG', tooltip: 'Expected Goals (Measure of chances created)' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
      <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
            <h3 className="text-sm font-bold text-gray-800">Team Form (Season)</h3>
            <p className="text-[10px] text-gray-500">Target teams conceding high goals (GC)</p>
        </div>
        <div className="text-gray-400">
            <HelpCircle size={14} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(h => (
                <th 
                    key={h.key}
                    onClick={() => toggleSort(h.key)}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    title={h.tooltip}
                >
                    <div className="flex items-center gap-1">
                        <span className={h.key !== 'short_name' ? 'border-b border-dotted border-gray-400 cursor-help' : ''}>
                            {h.label}
                        </span>
                        {sortKey === h.key && <span className="text-[8px] text-pl-purple">{direction === 'asc' ? '▲' : '▼'}</span>}
                    </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStats.map((team, idx) => (
              <tr key={team.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">{team.short_name}</td>
                <td className={`px-3 py-2 whitespace-nowrap text-xs font-bold ${team.goals_conceded > 50 ? 'text-red-500' : 'text-gray-900'}`}>{team.goals_conceded}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{team.xg_against}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-green-600">{team.goals_scored}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{team.xg_for}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamStatsTable;