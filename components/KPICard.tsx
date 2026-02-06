import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'flat';
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, trendDirection, icon, color = '#6C5CE7', subtitle }) => {
  const getTrendColor = () => {
    if (!trendDirection) return 'text-gray-400';
    if (trendDirection === 'up') return 'text-green-500';
    if (trendDirection === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {icon && <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: color + '20' }}>{icon}</div>}
      </div>
      <div className="text-xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="flex items-center gap-1 mt-1">
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-medium ${getTrendColor()}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
        {subtitle && <span className="text-[10px] text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
};

export default KPICard;
