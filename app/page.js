'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Layers,
  FileSpreadsheet,
  Award,
  ChevronRight,
  Building2,
  Lock,
  GitMerge,
  FileCheck,
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user, signInWithGoogle, isConfigured } = useAuth();

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard/');
      return;
    }
    if (isConfigured) {
      try {
        await signInWithGoogle();
        router.push('/dashboard/');
      } catch (err) {
        router.push('/login/');
      }
    } else {
      router.push('/login/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Academic Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        <span>Department of Computer Science & Engineering • Academic Regulation R22 • Session 2026–2027</span>
        <span className="hidden sm:inline-block text-slate-500">|</span>
        <span className="hidden sm:inline-block text-slate-400">Board of Studies (BoS) Syllabus Audit</span>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  SkillBridge
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  BoS
                </span>
              </div>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Curriculum Quality & Industry Alignment
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <a href="#framework" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Curriculum Framework
            </a>
            <a href="#methodology" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Audit Methodology
            </a>
            <a href="#accreditation" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Accreditation Compliance
            </a>
            <a href="#sample-matrix" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Syllabus Matrix
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard/"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
              >
                Go to Faculty Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login/"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Faculty Sign In
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-colors"
                >
                  Launch Audit Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-18 lg:pb-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Department of Computer Science & Engineering</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              Academic Curriculum to Industry Skill Gap Analytics
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
              A departmental analytics system for Faculty, Curriculum Review Committees, and Board of Studies (BoS) members. Map syllabus topics against current engineering job profiles, calculate weighted coverage, and generate accreditation-ready dossiers for NBA and NAAC audits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
              >
                Access Faculty Portal
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/login/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-colors"
              >
                Sign In with Google
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Outcome-Based Education (OBE) Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>NBA Criterion 2 & NAAC Sub-criterion 1.1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>AICTE / UGC Model Benchmark R22</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Matrix Preview Card */}
          <div id="sample-matrix" className="mt-12 max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 shadow-md">
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Curriculum Coverage Matrix • Full Stack Developer Profile</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    B.Tech Computer Science & Engineering (Autonomous Regulation R22)
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 self-start sm:self-center">
                  BoS Review Snapshot
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium">Weighted Syllabus Coverage</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">68.4%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Calculated across 8 weighted skills</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium">Industry Deficit Gap</div>
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">31.6%</div>
                  <div className="text-[11px] text-rose-500 mt-1 font-medium">2 Skills requiring syllabus addition</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium">Committee Recommendation</div>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">Docker & Cloud APIs</div>
                  <div className="text-[11px] text-slate-400 mt-1">Recommend inclusion in CS303 Lab</div>
                </div>
              </div>

              {/* Sample Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 font-bold text-slate-700 dark:text-slate-200 grid grid-cols-12 gap-2">
                  <div className="col-span-4">Required Industry Competency</div>
                  <div className="col-span-2">Importance</div>
                  <div className="col-span-4">Mapped Syllabus Course Module</div>
                  <div className="col-span-2 text-right">Coverage Level</div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <div className="px-4 py-2.5 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-semibold text-slate-900 dark:text-white">React & Component Frameworks</div>
                    <div className="col-span-2"><span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">5 / 5</span></div>
                    <div className="col-span-4 text-slate-600 dark:text-slate-400">CS303 Web Development (Unit IV)</div>
                    <div className="col-span-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">100% (Advanced)</div>
                  </div>
                  <div className="px-4 py-2.5 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-semibold text-slate-900 dark:text-white">Relational DB & SQL Optimization</div>
                    <div className="col-span-2"><span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">4 / 5</span></div>
                    <div className="col-span-4 text-slate-600 dark:text-slate-400">CS202 Database Systems (Unit II & III)</div>
                    <div className="col-span-2 text-right text-blue-600 dark:text-blue-400 font-bold">60% (Intermediate)</div>
                  </div>
                  <div className="px-4 py-2.5 grid grid-cols-12 gap-2 items-center bg-rose-50/50 dark:bg-rose-950/20">
                    <div className="col-span-4 font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <span>Docker & Containerization</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded">Syllabus Gap</span>
                    </div>
                    <div className="col-span-2"><span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">4 / 5</span></div>
                    <div className="col-span-4 text-rose-600 dark:text-rose-400 italic">No formal mapping in current R22 syllabus</div>
                    <div className="col-span-2 text-right text-rose-600 dark:text-rose-400 font-bold">0% (Not Covered)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Metrics Banner */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">8</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Core CSE Courses</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">30+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Granular Syllabus Units</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">5</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Benchmark Industry Roles</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">NBA & NAAC</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Criterion 2 Audit Format</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Academic Modules */}
      <section id="framework" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              System Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for Departmental Curriculum Governance
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              A comprehensive toolset for course coordinators, department heads, and academic quality assurance cells.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Course & Syllabus Hierarchy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Structured syllabus management covering Course Codes (e.g., CS201, CS301), Semester tiers, L-T-P credits, and granular lecture topics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Industry Job Profile Benchmarking
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pre-configured benchmarks for Frontend, Backend, Full Stack, Data Analyst, and Software Engineer with 1–5 importance weights.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <GitMerge className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Multi-Tier Competency Mapping
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assign rigorous coverage tiers (Introductory 25%, Substantial 60%, Advanced 100%) to link academic units with required skill competencies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Weighted Skill Gap Engine
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Objective mathematical formula computing weighted role coverage and isolation of critical curriculum deficits for the syllabus committee.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Accreditation Self-Audit Dossiers
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Export formal BoS curriculum review reports and CSV dossiers formatted for NBA Criterion 2 and NAAC Criterion 1 documentation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Institutional Data Isolation
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every course coordinator operates in a secure, authenticated workspace scoped strictly to their institutional credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Curriculum Review Protocol
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Evidence-Based Syllabus Revision Cycle
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-4">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Catalog Syllabus Course Units
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Faculty enter approved course codes, lecture modules, contact hours, and target competencies from the academic regulation handbook.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-4">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Map Academic Units to Industry Roles
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect topics with industry skills and specify coverage intensity (e.g. 100% for full lab courses, 60% for theory lectures).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-4">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Generate BoS Revision Agenda
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The Board of Studies receives automated gap calculations, identifies high-priority missing topics, and drafts formal revision notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Accreditation Ready • B.Tech CSE Framework</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Prepare Your Department for Academic Curriculum Audits
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Sign in with your Google account to access your faculty workspace pre-populated with standard B.Tech Computer Science and Engineering syllabus benchmarks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              Sign In to Faculty Portal
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/login/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-colors"
            >
              Faculty Sign In Options
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-400 py-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block text-sm">SkillBridge Academic Suite</span>
              <span className="text-[11px] text-slate-400">Department Curriculum Quality Assurance & BoS Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-300">
            <Link href="/login/" className="hover:text-white transition-colors">
              Faculty Login
            </Link>
            <Link href="/dashboard/" className="hover:text-white transition-colors">
              Curriculum Dashboard
            </Link>
            <Link href="/reports/" className="hover:text-white transition-colors">
              Accreditation Reports
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            <span>Department of Computer Science & Engineering • Regulation R22</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
