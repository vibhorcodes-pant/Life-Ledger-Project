import React from 'react';
import { clsx } from '../utils/helpers';

export default function LoadingSkeleton({ type = 'card', count = 1, className }) {
  const skeletons = Array(count).fill(0);

  const getSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={clsx("glass p-5 flex flex-col gap-4 animate-pulse", className)}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700/50" />
              <div className="w-16 h-6 rounded-full bg-slate-200 dark:bg-slate-700/50" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="w-1/3 h-4 rounded bg-slate-200 dark:bg-slate-700/50" />
              <div className="w-1/2 h-8 rounded bg-slate-200 dark:bg-slate-700/50" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className={clsx("glass p-4 flex items-center gap-4 animate-pulse", className)}>
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700/50" />
            <div className="flex-1 space-y-2">
              <div className="w-1/3 h-5 rounded bg-slate-200 dark:bg-slate-700/50" />
              <div className="w-1/4 h-3 rounded bg-slate-200 dark:bg-slate-700/50" />
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className={clsx("glass p-5 animate-pulse", className)}>
            <div className="w-1/4 h-6 rounded bg-slate-200 dark:bg-slate-700/50 mb-8" />
            <div className="w-full h-64 rounded-xl bg-slate-200 dark:bg-slate-700/50" />
          </div>
        );
      case 'header':
        return (
          <div className={clsx("mb-8 animate-pulse", className)}>
            <div className="w-1/3 h-10 rounded-lg bg-slate-200 dark:bg-slate-700/50 mb-2" />
            <div className="w-1/4 h-5 rounded bg-slate-200 dark:bg-slate-700/50" />
          </div>
        );
      default:
        return <div className={clsx("w-full h-24 rounded-2xl bg-slate-200 dark:bg-slate-700/50 animate-pulse", className)} />;
    }
  };

  return (
    <>
      {skeletons.map((_, i) => (
        <React.Fragment key={i}>{getSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
