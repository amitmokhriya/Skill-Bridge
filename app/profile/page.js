'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Layers,
  GitMerge,
  BookOpen,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';

export default function ProfilePage() {
  const { user } = useAuth();
  const { programs, subjects, topics, roles, skills, mappings } = useFirestore();

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'F';

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Faculty Member';

  return (
    <AppLayout
      title="Faculty Profile & Academic Record"
      subtitle="Department of Computer Science & Engineering • Academic Coordinator Credentials"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Profile Card */}
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={userDisplayName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-xs"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-blue-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-xs">
              {userInitial}
            </div>
          )}

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {userDisplayName}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Course Coordinator
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Department of Computer Science & Engineering</span>
              <span className="text-slate-400">•</span>
              <span>Board of Studies (BoS) Member</span>
            </p>

            <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'faculty@university.edu'}</span>
              </div>
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified Institutional Account
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Verification Pending
                </span>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google Single Sign-On (SSO) Authorized</span>
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Faculty ID: {user?.uid ? `${user.uid.slice(0, 12)}...` : 'CSE-FACULTY'}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Activity Counters */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Department Syllabus & Mapping Scope (B.Tech CSE)
            </h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Regulation R22</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Academic Programs</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {programs.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curriculum Courses</span>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {subjects.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lecture Topics</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {topics.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Industry Roles</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {roles.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tracked Skills</span>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {skills.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Course-Skill Links</span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {mappings.length}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Operations Links */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Curriculum Review Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/curriculum/"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span>Manage Course Syllabus Units</span>
              <BookOpen className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/gap-analysis/"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span>Review BoS Skill Gap Analytics</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
