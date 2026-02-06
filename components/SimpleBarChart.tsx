import React, { useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  label?: string;
  showLabels?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, height = 120, color = '#6C5CE7', label, showLabels = true }) => {
  const chartData = useMemo(() => {
    if (!data.length) return { bars: [], max: 0, min: 0 };
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const bars = data.map(d => ({
      ...d,
      heightPercent: ((d.value - min) / range) * 100,
      label: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    }));
    return { bars, max, min };
  }, [data]);

  if (!data.length) return <div className="text-xs text-gray-400 text-center py-4">No data available</div>;

  const barWidth = Math.max(4, Math.min(16, Math.floor(280 / data.length) - 2));

  return (
    <div className="w-full">
      {label && <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>}
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end justify-between gap-[2px] px-1">
          {chartData.bars.map((bar, i) => (
            <div key={i} className="flex flex-col items-center flex-1" style={{ maxWidth: barWidth + 4 }}>
              <div
                className="rounded-t-sm transition-all duration-300 w-full"
                style={{
                  height: `${Math.max(2, bar.heightPercent)}%`,
                  backgroundColor: color,
                  opacity: 0.7 + (bar.heightPercent / 300),
                  minWidth: barWidth
                }}
                title={`${bar.label}: ${bar.value.toLocaleString()}`}
              />
            </div>
          ))}
        </div>
      </div>
      {showLabels && data.length <= 15 && (
        <div className="flex justify-between mt-1 px-1">
          <span className="text-[8px] text-gray-400">
            {new Date(data[0].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-[8px] text-gray-400">
            {new Date(data[data.length - 1].date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  );
};

export default SimpleBarChart;
