import React from 'react';

interface AdPlaceholderProps {
  label?: string;
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ label = "Advertisement", className = "" }) => {
  return (
    <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 border-dashed p-4 my-6 min-h-[100px] ${className}`}>
      <span className="text-xs uppercase tracking-widest font-semibold">{label}</span>
      <span className="text-xs mt-1">Ad Space (Responsive)</span>
    </div>
  );
};