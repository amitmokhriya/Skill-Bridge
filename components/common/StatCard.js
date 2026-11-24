'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  color = 'indigo',
  badge,
}) {
  const colorThemes = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 ring-indigo-50/50 dark:ring-indigo-950/20',
      border: 'hover:border-indigo-200 dark:hover:border-indigo-800/80',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 ring-emerald-50/50 dark:ring-emerald-950/20',
      border: 'hover:border-emerald-200 dark:hover:border-emerald-800/80',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 ring-amber-50/50 dark:ring-amber-950/20',
      border: 'hover:border-amber-200 dark:hover:border-amber-800/80',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 ring-rose-50/50 dark:ring-rose-950/20',
      border: 'hover:border-rose-200 dark:hover:border-rose-800/80',
    },
    violet: {
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 ring-violet-50/50 dark:ring-violet-950/20',
      border: 'hover:border-violet-200 dark:hover:border-violet-800/80',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 ring-blue-50/50 dark:ring-blue-950/20',
      border: 'hover:border-blue-200 dark:hover:border-blue-800/80',
    },
  };

  const currentTheme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow-card ${currentTheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {badge && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ring-4 ${currentTheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(description || trend !== undefined) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center font-medium ${
                trend >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span>{trendLabel}</span>}
          {description && !trendLabel && <span>{description}</span>}
        </div>
      )}
    </div>
  );
}
