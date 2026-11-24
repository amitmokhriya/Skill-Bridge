'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Layers,
  GitMerge,
  BarChart3,
  FileText,
  Settings,
  User,
  LogOut,
  GraduationCap,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard/', icon: LayoutDashboard },
  { name: 'Curriculum & Courses', href: '/curriculum/', icon: BookOpen },
  { name: 'Industry Job Roles', href: '/industry-roles/', icon: Briefcase },
  { name: 'Industry Skills', href: '/industry-skills/', icon: Layers },
  { name: 'Syllabus Mapping', href: '/skill-mapping/', icon: GitMerge },
  { name: 'Curriculum Gap Audit', href: '/gap-analysis/', icon: BarChart3 },
  { name: 'Accreditation Reports', href: '/reports/', icon: FileText },
  { name: 'Department Settings', href: '/settings/', icon: Settings },
  { name: 'Faculty Profile', href: '/profile/', icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'F';

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Faculty Member';
  const userEmail = user?.email || 'faculty@university.edu';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Institutional Header & Logo */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <Link href="/dashboard/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">
                  SkillBridge
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  BoS
                </span>
              </div>
              <span className="block text-[11px] font-medium text-slate-400">
                Curriculum Quality Portal
              </span>
            </div>
          </Link>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Academic Context Badge */}
        <div className="px-4 py-3 bg-slate-950/20 border-b border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="font-medium text-slate-200 block truncate">Dept. of Computer Science</span>
              <span className="text-[10px] text-slate-400">B.Tech CSE • Regulation R22</span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Academic Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname === item.href.slice(0, -1) ||
              (item.href !== '/dashboard/' && pathname.startsWith(item.href.slice(0, -1)));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Faculty profile footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <Link
              href="/profile/"
              className="flex items-center gap-2.5 min-w-0 flex-1 group"
              onClick={onClose}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={userDisplayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-200 flex items-center justify-center font-bold text-xs border border-blue-700">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors" title={userDisplayName}>
                  {userDisplayName}
                </p>
                <p className="text-[10px] text-slate-400 truncate" title={userEmail}>
                  Faculty Coordinator
                </p>
              </div>
            </Link>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
