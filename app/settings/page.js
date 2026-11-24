'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  User,
  RotateCcw,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Award,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useToast } from '../../components/common/Toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { resetToSampleData } = useFirestore();
  const { showToast } = useToast();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'F';

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Faculty Member';

  const handleResetData = async () => {
    setResetting(true);
    try {
      await resetToSampleData();
      showToast('Workspace reset to standard B.Tech CSE benchmark syllabus', 'success');
      setIsResetModalOpen(false);
    } catch (err) {
      showToast('Failed to reset workspace: ' + err.message, 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <AppLayout
      title="Department & System Settings"
      subtitle="Manage curriculum preferences, appearance, academic benchmarks, and faculty credentials"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Theme Settings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Appearance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize portal visual theme for presentation or low-light grading
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                theme === 'light'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Light Theme
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Clean academic paper styling with high contrast text
                </span>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Dark Theme
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Oxford navy night mode optimized for reduced eye strain
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* User Account Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Faculty Account & Department Authentication
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified institutional identity managed via Google Single Sign-On
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={userDisplayName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-900 text-blue-200 font-bold text-base flex items-center justify-center border border-blue-700">
                {userInitial}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white block truncate">
                  {userDisplayName}
                </span>
                <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Faculty Coordinator
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                {user?.email || 'faculty@university.edu'} • Department of Computer Science & Engineering
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Authentication: Google Verified • Access: Course Coordinator / BoS Committee
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Workspace Reset & Benchmarks */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Curriculum Baseline Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reset your faculty workspace back to the university-approved B.Tech Computer Science and Engineering model syllabus
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Re-Seed Approved University CSE Model Syllabus
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Restores the standard 8 B.Tech CSE subjects, 30+ lecture topics, and 5 benchmark industry job roles.
              </span>
            </div>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Model Syllabus</span>
            </button>
          </div>
        </div>

        {/* Academic Compliance & Accreditation Standards */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Accreditation & Curriculum Compliance Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Outcome-Based Education</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bloom's Taxonomy aligned Course Outcome (CO) and Program Outcome (PO) mapping matrix.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>NBA SAR Criterion 2</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                National Board of Accreditation format for curriculum review and industry relevance evidence.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>NAAC Sub-criterion 1.1</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                National Assessment and Accreditation Council standards for curricular planning and delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Restore Standard CSE Model Syllabus"
        description="Are you sure you want to reset your curriculum workspace back to the university benchmark syllabus?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            This action will restore the standard 8 B.Tech CSE subjects, 30+ lecture topics, 5 industry roles, and illustrative skill mappings in your department workspace.
          </p>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={resetting}
              onClick={handleResetData}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            >
              {resetting ? 'Restoring...' : 'Yes, Restore Model Syllabus'}
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
