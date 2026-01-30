
import React from 'react';
import { getTeamFixtures } from '../constants';
import { Fixture } from '../types';

interface FixtureTickerProps {
  userTeam: string; // The user's favorite team or used for context
  title?: string;
}

const getDifficultyColor = (difficulty: number) => {
  switch (difficulty) {
    case 1: return 'bg-[#007f31] text-white'; // Dark Green
    case 2: return 'bg-[#00ff85] text-gray-900'; // PL Green
    case 3: return 'bg-[#e7e7e7] text-gray-800'; // Grey
    case 4: return 'bg-[#ff2882] text-white'; // PL Pink
    case 5: return 'bg-[#80072d] text-white'; // Dark Red
    default: return 'bg-gray-200';
  }
};

const FixtureItem: React.FC<{ fixture: Fixture }> = ({ fixture }) => (
  <div className={`flex flex-col items-center justify-center p-1 w-full rounded ${getDifficultyColor(fixture.difficulty)} mb-0.5 last:mb-0`}>
    <span className="text-[9px] font-bold uppercase leading-none">{fixture.opponent}</span>
    <span className="text-[7px] opacity-90 leading-none">{fixture.is_home ? '(H)' : '(A)'}</span>
  </div>
);

const FixtureTicker: React.FC<FixtureTickerProps> = ({ userTeam, title = "Upcoming Fixture Difficulty" }) => {
  // For demo purposes, let's show fixtures for a few top teams or just one
  // In a real app, this might accept a specific team ID
  const teamsToShow = ["ARS", "MCI", "LIV", "LUT"];

  // Helper to group fixtures by gameweek for a team
  const getGroupedFixtures = (teamId: string) => {
      const allFixtures = getTeamFixtures(teamId);
      // Get unique gameweeks from the fixtures list to define columns
      // For this ticker, let's look at the next 5 gameweeks based on the mock data logic (38-42)
      const nextGWs = [38, 39, 40, 41, 42];
      
      return nextGWs.map(gw => ({
          gameweek: gw,
          matches: allFixtures.filter(f => f.gameweek === gw)
      }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-1">
        {teamsToShow.map(teamId => {
          const grouped = getGroupedFixtures(teamId);
          return (
            <div key={teamId} className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-0">
               <div className="w-8 font-bold text-xs text-gray-600 shrink-0">{teamId}</div>
               <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide flex-1">
                 {grouped.map((group, idx) => (
                   <div key={idx} className="min-w-[60px] flex flex-col justify-center bg-gray-50 rounded-lg p-1 min-h-[40px]">
                       <div className="text-[8px] text-center text-gray-400 mb-1">GW{group.gameweek}</div>
                       {group.matches.length > 0 ? (
                           group.matches.map((match, mIdx) => (
                               <FixtureItem key={mIdx} fixture={match} />
                           ))
                       ) : (
                           <div className="text-[10px] text-center text-gray-300 font-bold">-</div>
                       )}
                   </div>
                 ))}
               </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between items-center mt-3 text-[10px] text-gray-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#007f31]"></div> Easy</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#e7e7e7]"></div> Mod</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#80072d]"></div> Hard</div>
      </div>
    </div>
  );
};

export default FixtureTicker;
