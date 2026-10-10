import React from 'react';
import { clsx } from '../utils/helpers';

export default function ChartCard({ title, subtitle, children, className }) {
  return (
    <div className={clsx("glass flex flex-col", className)}>
      <div className="p-5 border-b border-slate-200 dark:border-white/10">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-5 flex-1 w-full h-full min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
