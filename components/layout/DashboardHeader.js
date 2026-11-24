'use client';

import React from 'react';
import { Menu, Calendar, ShieldCheck, User } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function DashboardHeader({ onMenuClick, title, subtitle }) {
  const { user } = useAuth();

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'F';

  const userLabel = user?.displayName || user?.email?.split('@')[0] || 'Faculty Member';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          {title && (
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Session Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>AY 2026–27 (Odd Sem)</span>
        </div>

        {/* Accreditation Reference Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>NBA / NAAC Ready</span>
        </div>

        <ThemeToggle />

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Faculty User Info */}
        <div className="flex items-center gap-2.5">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={userLabel}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {userInitial}
            </div>
          )}
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block max-w-[140px] truncate" title={userLabel}>
              {userLabel}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              BoS Committee
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
