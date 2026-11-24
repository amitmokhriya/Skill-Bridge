'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Briefcase,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/common/Badge';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { useFirestore } from '../../hooks/useFirestore';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../lib/utils';

function ReportsContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  const { programs, roles, skills, mappings, getRoleAnalysis, subjects } = useFirestore();
  const { showToast } = useToast();

  const [selectedProgramId, setSelectedProgramId] = useState(
    programs[0]?.id || 'prog_btech_cse'
  );
  const [selectedRoleId, setSelectedRoleId] = useState(
    initialRole || roles[0]?.id || 'role_frontend'
  );
  const [copied, setCopied] = useState(false);

  const selectedProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];
  const analysis = getRoleAnalysis(selectedRoleId);

  // Export to CSV
  const handleExportCSV = () => {
    if (!analysis || analysis.skillsAnalysis.length === 0) {
      showToast('No data to export', 'error');
      return;
    }

    const headers = [
      'Industry Role',
      'Industry Skill',
      'Importance Weight (1-5)',
      'Curriculum Coverage %',
      'Coverage Status',
      'Best Mapped Topic',
      'Source Subject',
    ];

    const rows = analysis.skillsAnalysis.map((item) => [
      `"${analysis.role.name}"`,
      `"${item.skill.name}"`,
      item.weight,
      `${item.coveragePercentage}%`,
      `"${item.status}"`,
      `"${item.bestMapping?.topicName || 'None'}"`,
      `"${item.bestMapping?.subjectName || 'None'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `SkillBridge_Audit_${analysis.role.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded successfully', 'success');
  };

  // Copy Executive Summary to Clipboard
  const handleCopySummary = () => {
    const text = `SKILLBRIDGE CURRICULUM AUDIT REPORT
Academic Program: ${selectedProgram?.name || 'N/A'} (${selectedProgram?.code || 'N/A'})
Target Job Role: ${analysis.role.name}
Weighted Coverage: ${analysis.weightedCoverage}%
Curriculum Gap: ${analysis.skillGapPercentage}%
Strongly Covered Skills: ${analysis.coveredSkills.length}
Partially Covered Skills: ${analysis.partiallyCoveredSkills.length}
Missing Skills: ${analysis.missingSkills.length}
High-Priority Blindspots: ${analysis.highPriorityGaps.map((g) => g.skill.name).join(', ') || 'None'}
Audit Date: ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Summary copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls Toolbar (hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Program Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Document Card */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
          <div>
            <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400 text-xs uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>NBA SAR Criterion 2 & NAAC Sub-criterion 1.1 Self-Study Audit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curriculum-to-Industry Alignment Dossier
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Department of Computer Science & Engineering • Regulation R22 • Document Ref: SAR-CSE-2026
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <span className="block font-bold text-slate-900 dark:text-white">
              Academic Session: 2026–2027
            </span>
            <span>Audit Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Academic Scope Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Academic Institution Scope
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {selectedProgram?.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Department of {selectedProgram?.department || 'Computer Science & Engineering'} • {selectedProgram?.totalSemesters || 8} Semesters
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {selectedProgram?.description}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Industry Target Benchmark
            </span>
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
              {analysis.role.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Evaluated against {analysis.totalSkills} technical competency requirements (Importance weighted 1 to 5)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {analysis.role.description}
            </p>
          </div>
        </div>

        {/* Executive Quantitative Findings */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            1. Executive Quantitative Findings
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Weighted Syllabus Coverage</span>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {analysis.weightedCoverage}%
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Net Curriculum Gap</span>
              <div className="text-2xl font-extrabold text-rose-500 mt-1">
                {analysis.skillGapPercentage}%
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Strongly Covered Skills</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {analysis.coveredSkills.length} / {analysis.totalSkills}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Unmapped Blindspots</span>
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {analysis.missingSkills.length} Skills
              </div>
            </div>
          </div>
        </div>

        {/* Full Breakdown Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            2. Comprehensive Competency Mapping Matrix
          </h4>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  <th className="px-4 py-3">Industry Competency</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Mapped Academic Topic</th>
                  <th className="px-4 py-3">Source Course</th>
                  <th className="px-4 py-3 text-right">Coverage Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analysis.skillsAnalysis.map((item) => (
                  <tr key={item.skill.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {item.skill.name}
                    </td>
                    <td className="px-4 py-3 font-bold">{item.weight} / 5</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {item.bestMapping?.topicName || (
                        <span className="text-rose-500 italic">No curriculum mapping</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {item.bestMapping?.subjectName || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      <span
                        className={
                          item.coveragePercentage >= 80
                            ? 'text-emerald-600'
                            : item.coveragePercentage > 0
                            ? 'text-blue-600'
                            : 'text-rose-600'
                        }
                      >
                        {item.coveragePercentage}% ({item.status})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* High Priority Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            3. Curriculum Committee Recommendations
          </h4>

          <div className="space-y-2 text-xs">
            {analysis.highPriorityGaps.length === 0 ? (
              <p className="text-slate-500 italic">
                All high-importance industry competencies are adequately represented in the current curriculum.
              </p>
            ) : (
              analysis.highPriorityGaps.map((gap, i) => (
                <div
                  key={gap.skill.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Incorporate {gap.skill.name} (Importance Weight: {gap.weight}/5)
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Current syllabus coverage is only {gap.coveragePercentage}%. It is advised that the Department of {selectedProgram?.department} introduce modern laboratory coursework and project-based assessments targeting this requirement prior to semester 7.
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Signatures Footer for Academic Dossier */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-2" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Head of Department</span>
            <p className="text-[10px]">Curriculum Committee Chair</p>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-2" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Dean of Academics</span>
            <p className="text-[10px]">Academic Council Representative</p>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-2" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Industry Advisory Board</span>
            <p className="text-[10px]">External Corporate Liaison</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <AppLayout
      title="Accreditation & Curriculum Audit Reports"
      subtitle="Export formal curriculum dossiers formatted for Board of Studies, NAAC, and NBA review committees"
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <ReportsContent />
      </Suspense>
    </AppLayout>
  );
}
