'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Layers,
  GitMerge,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  FileText,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    loading,
    programs,
    subjects,
    topics,
    roles,
    skills,
    mappings,
    systemStats,
  } = useFirestore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <AppLayout title="Curriculum Analytics Dashboard" subtitle="Loading academic metrics...">
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  // Chart 1: Role-wise Coverage Chart Data
  const roleChartData = systemStats.roleCoverageStats.map((item) => ({
    name: item.roleName,
    coverage: item.coverage,
    gap: item.gap,
  }));

  // Chart 2: Covered vs Missing Skills Distribution
  const stronglyCoveredCount = skills.filter((s) => {
    const sMaps = mappings.filter((m) => m.industrySkillId === s.id);
    const maxCov = sMaps.reduce((max, curr) => Math.max(max, curr.coveragePercentage || 0), 0);
    return maxCov >= 80;
  }).length;

  const partiallyCoveredCount = skills.filter((s) => {
    const sMaps = mappings.filter((m) => m.industrySkillId === s.id);
    const maxCov = sMaps.reduce((max, curr) => Math.max(max, curr.coveragePercentage || 0), 0);
    return maxCov > 0 && maxCov < 80;
  }).length;

  const missingSkillsCount = skills.filter((s) => {
    const sMaps = mappings.filter((m) => m.industrySkillId === s.id);
    return sMaps.length === 0;
  }).length;

  const coverageBreakdownData = [
    { name: 'Adequately Addressed (≥80%)', value: stronglyCoveredCount, color: '#059669' },
    { name: 'Partially Covered (25-60%)', value: partiallyCoveredCount, color: '#2563eb' },
    { name: 'Syllabus Deficit (0%)', value: missingSkillsCount, color: '#dc2626' },
  ];

  // Chart 3: Subject-wise Topic & Mapping Contribution
  const subjectChartData = systemStats.subjectContributionStats.slice(0, 8).map((sub) => ({
    name: sub.subjectCode || sub.subjectName.split(' ')[0],
    fullName: sub.subjectName,
    topics: sub.totalTopics,
    mapped: sub.mappedTopicsCount,
  }));

  // Chart 4: Industry Skill Gap Distribution (Deficit % for skills)
  const skillGapDistributionData = skills
    .map((s) => {
      const sMaps = mappings.filter((m) => m.industrySkillId === s.id);
      const maxCov = sMaps.reduce((max, curr) => Math.max(max, curr.coveragePercentage || 0), 0);
      const role = roles.find((r) => r.id === s.roleId);
      return {
        name: s.name.length > 18 ? `${s.name.slice(0, 16)}...` : s.name,
        fullName: s.name,
        roleName: role?.name || 'Role',
        gap: 100 - maxCov,
        coverage: maxCov,
        weight: s.importanceWeight || 3,
      };
    })
    .sort((a, b) => b.gap - a.gap || b.weight - a.weight)
    .slice(0, 8);

  // Top Critical Skill Gaps for Board of Studies Review
  const criticalGaps = skills
    .map((s) => {
      const sMaps = mappings.filter((m) => m.industrySkillId === s.id);
      const maxCov = sMaps.reduce((max, curr) => Math.max(max, curr.coveragePercentage || 0), 0);
      const role = roles.find((r) => r.id === s.roleId);
      return {
        ...s,
        roleName: role?.name || 'Industry Role',
        coverage: maxCov,
        gap: 100 - maxCov,
      };
    })
    .filter((s) => (s.importanceWeight || 3) >= 4 && s.coverage < 60)
    .sort((a, b) => b.importanceWeight - a.importanceWeight || a.coverage - b.coverage)
    .slice(0, 6);

  const overallGapPercentage = Math.round((100 - systemStats.averageSkillCoverage) * 10) / 10;
  const facultyName = user?.displayName ? `Prof. ${user.displayName}` : 'Course Coordinator';

  return (
    <AppLayout
      title="Curriculum & BoS Analytics Dashboard"
      subtitle="Department of Computer Science & Engineering • Regulation R22"
    >
      <div className="space-y-6">
        {/* Welcome Academic Banner */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Department Curriculum Advisory Committee (CAC)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {facultyName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Auditing syllabus for <span className="font-semibold text-white">{programs[0]?.name || 'B.Tech CSE'}</span>. Aligning course outcomes with industry benchmarks for upcoming Board of Studies review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/skill-mapping/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Map Course Unit</span>
            </Link>
            <Link
              href="/gap-analysis/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>View Gap Audit</span>
            </Link>
            <Link
              href="/reports/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accreditation Dossier</span>
            </Link>
          </div>
        </div>

        {/* BoS Committee Notice Card */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-relaxed">
              <span className="font-bold">BoS Agenda Item:</span> The annual Curriculum Review Committee convenes in December 2026. Please verify that all professional elective topics are mapped to ensure SAR Criterion 2 completeness.
            </p>
          </div>
          <Link
            href="/reports/"
            className="font-semibold text-blue-700 dark:text-blue-300 hover:underline shrink-0 text-xs flex items-center gap-1"
          >
            <span>Review SAR Draft</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 7 Core Academic Metric Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Department Curriculum Metrics
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Academic Regulation R22 • Autonomous
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Curriculum Courses"
              value={systemStats.totalSubjects}
              description="Core Theory & Lab Modules"
              icon={BookOpen}
              color="indigo"
            />
            <StatCard
              title="Syllabus Units"
              value={systemStats.totalTopics}
              description="Granular Lecture Units"
              icon={Layers}
              color="blue"
            />
            <StatCard
              title="Industry Profiles"
              value={systemStats.totalRoles}
              description="Benchmark Job Profiles"
              icon={Briefcase}
              color="emerald"
            />
            <StatCard
              title="Tracked Skills"
              value={systemStats.totalSkills}
              description="Industry Competencies"
              icon={Layers}
              color="blue"
            />
            <StatCard
              title="Course-Skill Links"
              value={systemStats.totalMappings}
              description="Active Syllabus Mappings"
              icon={GitMerge}
              color="indigo"
            />
            <StatCard
              title="Curriculum Coverage"
              value={`${systemStats.averageSkillCoverage}%`}
              description="Weighted across all roles"
              icon={TrendingUp}
              color={systemStats.averageSkillCoverage >= 60 ? 'emerald' : 'amber'}
              badge={systemStats.averageSkillCoverage >= 60 ? 'Adequate' : 'Review Required'}
            />
            <StatCard
              title="Curriculum Skill Gap"
              value={`${overallGapPercentage}%`}
              description="Deficit vs 100% Industry Standard"
              icon={AlertTriangle}
              color="rose"
              badge="BoS Action Item"
            />
            <StatCard
              title="High-Priority Gaps"
              value={criticalGaps.length}
              description="High-weight topics missing"
              icon={AlertTriangle}
              color="amber"
              badge="Syllabus Addition"
            />
          </div>
        </div>

        {/* Chart Row 1: Role-Wise Coverage & Competency Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Role-wise Coverage */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Role-Wise Syllabus Alignment</span>
                  <Badge variant="default" size="sm">NBA Criterion 2.1</Badge>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculated syllabus coverage score versus the 80% industrial benchmark
                </p>
              </div>
              <Link
                href="/gap-analysis/"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Audit by Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {mounted && (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      formatter={(val, name) => [`${val}%`, name === 'coverage' ? 'Syllabus Coverage' : 'Competency Gap']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <ReferenceLine y={80} stroke="#059669" strokeDasharray="3 3" label={{ value: '80% Benchmark', fill: '#059669', fontSize: 10, position: 'top' }} />
                    <Bar dataKey="coverage" name="Syllabus Coverage" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Covered and Missing Skills Donut */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Competency Status
                </h4>
                <Badge variant="default" size="sm">Distribution</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proportion of syllabus-covered vs deficit skills
              </p>
            </div>

            {mounted && (
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={coverageBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {coverageBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} competencies`, name]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {coverageBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Row 2: Subject-Wise Syllabus Coverage & Skill Gap Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Subject-wise Topic Mapping Contribution */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Course Unit Mapping Intensity</span>
                  <Badge variant="default" size="sm">Course Outcomes</Badge>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total lecture units vs units mapped to industry skills
                </p>
              </div>
              <Link
                href="/curriculum/"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {mounted && (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val, name) => [val, name === 'topics' ? 'Total Course Topics' : 'Topics Mapped to Skills']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="topics" name="Total Syllabus Units" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mapped" name="Mapped to Skills" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 4: Industry Skill Gap Distribution */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Priority Skill Deficits</span>
                  <Badge variant="danger" size="sm">Deficit %</Badge>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest syllabus deficit percentages across essential competencies
                </p>
              </div>
              <Link
                href="/gap-analysis/"
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Full Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {mounted && (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillGapDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      formatter={(val, name, props) => [
                        `${val}% Deficit (${props.payload.coverage}% covered, Importance: ${props.payload.weight}/5)`,
                        props.payload.fullName,
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="gap" name="Syllabus Deficit %" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Priority Syllabus Revision Recommendations */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Priority Syllabus Revision Agenda for Board of Studies</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-importance competencies (Weight ≥ 4) requiring syllabus expansion or elective introduction
              </p>
            </div>
            <Link
              href="/gap-analysis/"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Open Gap Analysis &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalGaps.length === 0 ? (
              <div className="col-span-full p-8 text-center text-xs text-slate-400">
                No high-priority syllabus gaps currently detected.
              </div>
            ) : (
              criticalGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {gap.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-750 dark:text-slate-200">
                        Weight: {gap.importanceWeight}/5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Target Role: {gap.roleName}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      {gap.coverage === 0 ? 'Not in Syllabus' : `${gap.coverage}% (Partial)`}
                    </span>
                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs">
                      {gap.gap}% Deficit
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
