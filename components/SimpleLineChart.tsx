import React, { useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  label?: string;
  showArea?: boolean;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, height = 120, color = '#6C5CE7', label, showArea = true }) => {
  const svgWidth = 300;
  const svgHeight = height;
  const padding = { top: 8, right: 8, bottom: 20, left: 8 };

  const chartMetrics = useMemo(() => {
    if (!data.length) return null;
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const plotWidth = svgWidth - padding.left - padding.right;
    const plotHeight = svgHeight - padding.top - padding.bottom;

    const points = data.map((d, i) => ({
      x: padding.left + (i / Math.max(1, data.length - 1)) * plotWidth,
      y: padding.top + plotHeight - ((d.value - min) / range) * plotHeight,
      value: d.value,
      date: d.date
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = linePath + ` L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`;

    return { points, linePath, areaPath, max, min };
  }, [data, svgHeight]);

  if (!data.length || !chartMetrics) return <div className="text-xs text-gray-400 text-center py-4">No data available</div>;

  return (
    <div className="w-full">
      {label && <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id={`area-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {showArea && (
          <path d={chartMetrics.areaPath} fill={`url(#area-gradient-${color.replace('#', '')})`} />
        )}
        <path d={chartMetrics.linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {chartMetrics.points.length <= 30 && chartMetrics.points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} opacity="0.8">
            <title>{new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}: {p.value.toLocaleString()}</title>
          </circle>
        ))}
        {data.length > 0 && (
          <>
            <text x={padding.left} y={svgHeight - 4} fontSize="8" fill="#9CA3AF">
              {new Date(data[0].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </text>
            <text x={svgWidth - padding.right} y={svgHeight - 4} fontSize="8" fill="#9CA3AF" textAnchor="end">
              {new Date(data[data.length - 1].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default SimpleLineChart;
