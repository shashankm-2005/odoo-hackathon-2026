import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading Dayflow HRMS data...',
  size = 'md',
  fullHeight = false,
}) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${fullHeight ? 'min-h-[300px]' : ''}`}>
      <Loader2 className={`${iconSize} animate-spin text-slate-800`} />
      {label && <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>}
    </div>
  );
};
