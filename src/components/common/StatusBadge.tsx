import React from 'react';

export type StatusVariant = 
  | 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE'
  | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  | 'ACTIVE' | 'INACTIVE' | 'PROBATION' | 'TERMINATED'
  | 'PAID' | 'PROCESSING'
  | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
  | 'ADMIN' | 'EMPLOYEE';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '', id }) => {
  const normalized = (status || '').toUpperCase().trim();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  // Attendance & Employee Statuses
  if (normalized === 'PRESENT' || normalized === 'APPROVED' || normalized === 'ACTIVE' || normalized === 'PAID') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'LATE' || normalized === 'HALF_DAY' || normalized === 'PROBATION' || normalized === 'PROCESSING') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'ABSENT' || normalized === 'REJECTED' || normalized === 'TERMINATED' || normalized === 'INACTIVE') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (normalized === 'PENDING') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (normalized === 'LEAVE' || normalized === 'CANCELLED') {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (normalized === 'ADMIN') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotColor = 'bg-indigo-500';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-0.5 gap-1.5' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5 gap-2 font-semibold' 
    : 'text-xs px-3 py-1 gap-1.5';

  const formatText = (text: string) => {
    return text.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <span
      id={id || `badge-${normalized.toLowerCase()}`}
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs whitespace-nowrap ${sizeClasses} ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {formatText(status)}
    </span>
  );
};
