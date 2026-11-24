'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { useFirestore } from '../../hooks/useFirestore';
import { useToast } from '../../components/common/Toast';
import { getCoverageMeta } from '../../lib/utils';

function IndustrySkillsContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  const { roles, skills, mappings, addSkill, updateSkill, deleteSkill } = useFirestore();
  const { showToast } = useToast();

  const [selectedRoleId, setSelectedRoleId] = useState(initialRole || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with searchParams if navigated with ?role=...
  useEffect(() => {
    if (initialRole) {
      setSelectedRoleId(initialRole);
    }
  }, [initialRole]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    roleId: roles[0]?.id || '',
    importanceWeight: 4,
    description: '',
  });

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesRole = selectedRoleId === 'all' || skill.roleId === selectedRoleId;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        name: skill.name,
        roleId: skill.roleId,
        importanceWeight: skill.importanceWeight || 3,
        description: skill.description || '',
      });
    } else {
      setEditingSkill(null);
      setSkillForm({
        name: '',
        roleId: selectedRoleId !== 'all' ? selectedRoleId : roles[0]?.id || '',
        importanceWeight: 4,
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.roleId) {
      showToast('Skill name and assigned role are required', 'error');
      return;
    }
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, skillForm);
        showToast('Industry skill updated', 'success');
      } else {
        await addSkill(skillForm);
        showToast('Industry skill added', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to save skill', 'error');
    }
  };

  const handleDeleteSkill = async (skillId, skillName) => {
    if (window.confirm(`Delete skill "${skillName}" and all associated mappings?`)) {
      try {
        await deleteSkill(skillId);
        showToast('Skill deleted', 'success');
      } catch (err) {
        showToast('Failed to delete skill', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="all">All Industry Roles ({skills.length} skills)</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Industry Skill</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search skills (e.g. React.js, Docker, SQL, TypeScript)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Skills Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-3.5">Skill Name & Description</th>
                <th className="px-6 py-3.5">Target Role</th>
                <th className="px-6 py-3.5">Importance Weight</th>
                <th className="px-6 py-3.5">Best Syllabus Coverage</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={Layers}
                      title="No skills found"
                      description="Add a new skill competency or adjust your role filter."
                      actionLabel="Add Skill"
                      onAction={() => handleOpenModal()}
                    />
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => {
                  const role = roles.find((r) => r.id === skill.roleId);
                  const skillMappings = mappings.filter((m) => m.industrySkillId === skill.id);
                  const bestCoverage = skillMappings.reduce(
                    (max, curr) => Math.max(max, curr.coveragePercentage || 0),
                    0
                  );
                  const meta = getCoverageMeta(bestCoverage);

                  return (
                    <tr
                      key={skill.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                    >
                      <td className="px-6 py-4 max-w-sm">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {skill.name}
                        </div>
                        {skill.description && (
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-2">
                            {skill.description}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {role?.name || 'Unassigned'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= (skill.importanceWeight || 3)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200 dark:text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">
                            {skill.importanceWeight}/5
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.badgeColor}`}
                          >
                            {bestCoverage}% • {meta.status}
                          </span>
                          {skillMappings.length > 0 && (
                            <div className="text-[10px] text-slate-400">
                              Mapped via {skillMappings.length} topic(s)
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(skill)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id, skill.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Industry Skill' : 'Add Industry Skill'}
        description="Define technical competency, target role, and relative importance weight"
      >
        <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js & Server-Side Rendering"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Associated Job Role *
              </label>
              <select
                required
                value={skillForm.roleId}
                onChange={(e) => setSkillForm({ ...skillForm, roleId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Importance Weight (1 to 5) *
              </label>
              <select
                value={skillForm.importanceWeight}
                onChange={(e) => setSkillForm({ ...skillForm, importanceWeight: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                <option value={5}>5 - Critical / Core Must-Have</option>
                <option value={4}>4 - High Importance</option>
                <option value={3}>3 - Medium / Standard</option>
                <option value={2}>2 - Low / Nice-to-Have</option>
                <option value={1}>1 - Supplementary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Skill Description & Learning Criteria
            </label>
            <textarea
              rows={3}
              placeholder="Key industry expectations, technologies, or tools associated with this skill..."
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function IndustrySkillsPage() {
  return (
    <AppLayout
      title="Industry Skill Competencies"
      subtitle="Track required engineering competencies, importance weights (1–5), and current syllabus coverage"
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <IndustrySkillsContent />
      </Suspense>
    </AppLayout>
  );
}
