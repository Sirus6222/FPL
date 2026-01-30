import React from 'react';

interface RadarChartProps {
  data: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const width = 200;
  const height = 200;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 80;
  
  const categories = Object.keys(data);
  const totalAxes = categories.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Helper to calculate coordinates
  const getCoordinates = (value: number, index: number, max: number = 100) => {
    const angle = index * angleSlice - Math.PI / 2; // Start from top
    const r = (value / max) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  // Generate grid points (3 levels: 33%, 66%, 100%)
  const levels = [33, 66, 100];
  const gridPolygons = levels.map(level => {
    return categories.map((_, i) => {
      const { x, y } = getCoordinates(level, i);
      return `${x},${y}`;
    }).join(' ');
  });

  // Generate data polygon
  const dataPoints = categories.map((key, i) => {
    // @ts-ignore
    const { x, y } = getCoordinates(data[key], i);
    return `${x},${y}`;
  }).join(' ');

  // Labels
  const labels = [
    { text: 'PAC', ...getCoordinates(115, 0) },
    { text: 'SHO', ...getCoordinates(115, 1) },
    { text: 'PAS', ...getCoordinates(115, 2) },
    { text: 'DRI', ...getCoordinates(115, 3) },
    { text: 'DEF', ...getCoordinates(115, 4) },
    { text: 'PHY', ...getCoordinates(115, 5) },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid Web */}
        {gridPolygons.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />
        ))}
        
        {/* Axis Lines */}
        {categories.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
        })}

        {/* Data Shape */}
        <polygon points={dataPoints} fill="rgba(61, 25, 91, 0.4)" stroke="#3D195B" strokeWidth="2" />

        {/* Labels */}
        {labels.map((label, i) => (
          <text 
            key={i} 
            x={label.x} 
            y={label.y} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontSize="10" 
            fontWeight="bold" 
            fill="#6b7280"
          >
            {label.text}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;