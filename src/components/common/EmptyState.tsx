import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id,
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      id={id || 'empty-state'}
      className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-200"
    >
      <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {action && (
        <button
          id="empty-state-action-btn"
          onClick={action.onClick}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
