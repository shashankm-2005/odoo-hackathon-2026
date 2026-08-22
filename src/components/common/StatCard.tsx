import React from 'react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
  trend,
  onClick,
}) => {
  return (
    <div
      id={id || `stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg font-bold ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              trend.isPositive
                ? 'text-green-600 bg-green-50'
                : 'text-slate-500 bg-slate-100'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>

      {subtitle && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-400">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};
