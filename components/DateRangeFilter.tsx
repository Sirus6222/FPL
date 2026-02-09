import React from 'react';

type Period = 'today' | '7d' | '30d' | 'all_time';

interface DateRangeFilterProps {
  value: Period;
  onChange: (period: Period) => void;
  options?: Period[];
}

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  '7d': '7 Days',
  '30d': '30 Days',
  all_time: 'All Time'
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange, options = ['today', '7d', '30d', 'all_time'] }) => {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      {options.map(period => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
            value === period
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
};

export default DateRangeFilter;
