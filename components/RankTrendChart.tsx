import React from 'react';
import { RankHistory } from '../types';

interface RankTrendChartProps {
  history: RankHistory[];
}

const RankTrendChart: React.FC<RankTrendChartProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  // Calculate SVG scales
  const width = 320;
  const height = 120;
  const padding = 20;

  const minRank = Math.min(...history.map(h => h.rank)) * 0.9;
  const maxRank = Math.max(...history.map(h => h.rank)) * 1.1;
  const rankRange = maxRank - minRank;

  const getX = (index: number) => {
    return padding + (index / (history.length - 1)) * (width - 2 * padding);
  };

  const getY = (rank: number) => {
    // Invert Y because lower rank (1) is better (higher on chart)
    return padding + ((rank - minRank) / rankRange) * (height - 2 * padding);
  };

  // Generate path data
  let pathD = `M ${getX(0)} ${getY(history[0].rank)}`;
  history.forEach((h, i) => {
    if (i === 0) return;
    pathD += ` L ${getX(i)} ${getY(h.rank)}`;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-2">Trend Tracker</h3>
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#f0f0f0" strokeWidth="1" />
            <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#f0f0f0" strokeWidth="1" />

            {/* Line */}
            <path d={pathD} fill="none" stroke="#3D195B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Dots */}
            {history.map((h, i) => (
                <circle 
                    key={i} 
                    cx={getX(i)} 
                    cy={getY(h.rank)} 
                    r="3" 
                    fill={i === history.length - 1 ? "#00FF85" : "#3D195B"} 
                    stroke="white" 
                    strokeWidth="1"
                />
            ))}
        </svg>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
             <span>GW{history[0].gameweek}</span>
             <span>GW{history[history.length-1].gameweek}</span>
        </div>
      </div>
      <div className="text-[10px] text-gray-500 mt-2 text-center">
        Current Rank: <span className="font-bold text-pl-purple">#{history[history.length-1].rank.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default RankTrendChart;
