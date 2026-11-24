'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase,
  ArrowRight,
  BookOpen,
  Layers,
  Lightbulb,
  FileText,
  Star,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { useFirestore } from '../../hooks/useFirestore';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';

function GapAnalysisContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  const { roles, skills, mappings, getRoleAnalysis } = useFirestore();

  const [selectedRoleId, setSelectedRoleId] = useState(
    initialRole || roles[0]?.id || 'role_frontend'
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialRole) {
      setSelectedRoleId(initialRole);
    }
  }, [initialRole]);

  // Compute Gap Analysis for the selected role
  const analysis = getRoleAnalysis(selectedRoleId);

  // Prepare chart data for skill-by-skill coverage
  const chartData = analysis.skillsAnalysis.map((item) => ({
    name: item.skill.name,
    coverage: item.coveragePercentage,
    gap: item.gapPercentage,
    weight: item.weight,
    isHighPriority: item.weight >= 4 && item.coveragePercentage < 60,
  }));

  // Recommended syllabus additions based on high priority gaps
  const recommendations = analysis.highPriorityGaps.map((gap) => {
    return {
      skillName: gap.skill.name,
      importance: gap.weight,
      currentCoverage: gap.coveragePercentage,
      suggestedAction:
        gap.coveragePercentage === 0
          ? `Introduce a dedicated module on "${gap.skill.name}" into the advanced semester syllabus.`
          : `Expand current lab coursework on "${gap.skill.name}" from ${gap.coveragePercentage}% to advanced production level (80%+).`,
      targetSemester: 'Semester 6 or 7 Elective / Lab',
    };
  });

  return (
    <div className="space-y-8">
      {/* Role Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Auditing Target Job Role
            </span>
            <div className="relative mt-0.5">
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="text-base font-bold text-slate-900 dark:text-white bg-transparent pr-8 focus:outline-none cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/reports/?role=${selectedRoleId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Audit Report</span>
          </Link>
          <Link
            href="/skill-mapping/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Add / Edit Mappings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Weighted Coverage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Weighted Syllabus Coverage
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {analysis.weightedCoverage}%
            </span>
            <span className="text-xs text-slate-400">of 100% target</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${analysis.weightedCoverage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Sum of (Weight × Coverage%) / Sum of Weights
          </p>
        </div>

        {/* Overall Skill Gap */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Curriculum Skill Gap
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {analysis.skillGapPercentage}%
            </span>
            <span className="text-xs text-rose-500 font-semibold">Deficit</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${analysis.skillGapPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            100% minus Weighted Coverage
          </p>
        </div>

        {/* High Priority Blindspots */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            High-Priority Gaps
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-500">
              {analysis.highPriorityGaps.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Critical</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-3">
            Skills with importance weight ≥ 4 and coverage below 60%.
          </p>
        </div>

        {/* Syllabus Competency Counts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Competencies Status
          </span>
          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Strongly Covered (≥80%)</span>
              <span className="font-bold">{analysis.coveredSkills.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Partially Covered (&lt;80%)</span>
              <span className="font-bold">{analysis.partiallyCoveredSkills.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Missing from Syllabus</span>
              <span className="font-bold">{analysis.missingSkills.length}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Total {analysis.totalSkills} technical skills analyzed
          </span>
        </div>
      </div>

      {/* Skill-by-Skill Visual Coverage Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Individual Skill Coverage Breakdown for {analysis.role.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualizing coverage percentage derived from best available curriculum topic mapping
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Strong (≥80%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Partial</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Missing (0%)</span>
            </span>
          </div>
        </div>

        {mounted && (
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(val, name, props) => [
                    `${val}% (Weight: ${props.payload.weight}/5)`,
                    'Best Syllabus Coverage',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target: 80%', fill: '#10b981', fontSize: 10, position: 'top' }} />
                <Bar dataKey="coverage" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => {
                    let color = '#f43f5e';
                    if (entry.coverage >= 80) color = '#10b981';
                    else if (entry.coverage > 0) color = '#4f46e5';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Mathematical Explanation Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 pb-0">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Analytical Calculation Audit Trail
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every score is mathematically explainable from its best available curriculum topic mapping
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-3.5">Industry Required Competency</th>
                <th className="px-6 py-3.5">Weight (w)</th>
                <th className="px-6 py-3.5">Best Curriculum Topic Mapping</th>
                <th className="px-6 py-3.5">Best Coverage (c)</th>
                <th className="px-6 py-3.5">Deficit Gap</th>
                <th className="px-6 py-3.5 text-right">Weighted Product (w × c)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {analysis.skillsAnalysis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No skills configured under this role yet.
                  </td>
                </tr>
              ) : (
                analysis.skillsAnalysis.map((item) => {
                  const isMissing = item.coveragePercentage === 0;

                  return (
                    <tr
                      key={item.skill.id}
                      className={`transition-colors ${
                        isMissing
                          ? 'bg-rose-50/30 dark:bg-rose-950/20'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.skill.name}
                        </div>
                        {item.weight >= 4 && isMissing && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                            Critical Syllabus Blind Spot
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {item.weight} / 5
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {item.bestMapping ? (
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.bestMapping.topicName}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              from {item.bestMapping.subjectName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            Unmapped (0% syllabus allocation)
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        <span
                          className={
                            item.coveragePercentage >= 80
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : item.coveragePercentage > 0
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {item.coveragePercentage}%
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold text-rose-500">
                        {item.gapPercentage}%
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-bold text-slate-900 dark:text-white">
                        {item.weightedContribution}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
              <tr>
                <td className="px-6 py-3.5">Sum Total Weights &amp; Score</td>
                <td className="px-6 py-3.5">{analysis.totalImportanceWeight}</td>
                <td colSpan={3} className="px-6 py-3.5 text-right font-sans">
                  Weighted Formula: Sum(w × c) / Sum(w) =
                </td>
                <td className="px-6 py-3.5 text-right font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                  {analysis.weightedCoverage}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actionable Curriculum Recommendations */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Board of Studies Curriculum Recommendations
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actionable syllabus interventions to eliminate high-priority market deficiencies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400">
              Excellent! All high-importance competencies are adequately covered in the syllabus.
            </div>
          ) : (
            recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{rec.skillName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                      Weight: {rec.importance}/5
                    </span>
                  </span>
                  <span className="text-xs font-bold text-rose-500">
                    {rec.currentCoverage}% current
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rec.suggestedAction}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Suggested Timing: {rec.targetSemester}</span>
                  <Link
                    href="/curriculum/"
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Update Syllabus
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function GapAnalysisPage() {
  return (
    <AppLayout
      title="Curriculum Gap Audit & BoS Action Plan"
      subtitle="Board of Studies (BoS) syllabus gap analysis against benchmark industry competencies"
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <GapAnalysisContent />
      </Suspense>
    </AppLayout>
  );
}
