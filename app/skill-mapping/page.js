'use client';

import React, { useState } from 'react';
import {
  GitMerge,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ArrowRight,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { useFirestore } from '../../hooks/useFirestore';
import { useToast } from '../../components/common/Toast';
import { COVERAGE_LEVELS } from '../../lib/utils';

export default function SkillMappingPage() {
  const {
    programs,
    subjects,
    topics,
    roles,
    skills,
    mappings,
    addMapping,
    updateMapping,
    deleteMapping,
  } = useFirestore();

  const { showToast } = useToast();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);

  // Form state cascading: Program -> Subject -> Topic -> Role -> Skill
  const [formProgramId, setFormProgramId] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [formRoleId, setFormRoleId] = useState('');
  const [formSkillId, setFormSkillId] = useState('');
  const [formCoverageLevel, setFormCoverageLevel] = useState('Intermediate');
  const [formNotes, setFormNotes] = useState('');

  // Cascading derivations
  const formSubjects = subjects.filter((s) => s.programId === formProgramId);
  const formTopics = topics.filter((t) => t.subjectId === formSubjectId);
  const formSkills = skills.filter((s) => s.roleId === formRoleId);

  // Filter mappings
  const filteredMappings = mappings.filter((m) => {
    const matchesSubject =
      selectedSubjectFilter === 'all' || m.subjectId === selectedSubjectFilter;
    const matchesRole =
      selectedRoleFilter === 'all' || m.industryRoleId === selectedRoleFilter;
    const matchesSearch =
      m.industrySkillName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.industryRoleName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesRole && matchesSearch;
  });

  const handleOpenModal = (mapping = null) => {
    if (mapping) {
      setEditingMapping(mapping);
      const sub = subjects.find((s) => s.id === mapping.subjectId);
      setFormProgramId(sub?.programId || programs[0]?.id || '');
      setFormSubjectId(mapping.subjectId);
      setFormTopicId(mapping.topicId);
      setFormRoleId(mapping.industryRoleId);
      setFormSkillId(mapping.industrySkillId);
      setFormCoverageLevel(mapping.coverageLevel || 'Intermediate');
      setFormNotes(mapping.notes || '');
    } else {
      setEditingMapping(null);
      const firstProg = programs[0]?.id || '';
      setFormProgramId(firstProg);
      const progSubs = subjects.filter((s) => s.programId === firstProg);
      const firstSub = progSubs[0]?.id || subjects[0]?.id || '';
      setFormSubjectId(firstSub);
      const subTopics = topics.filter((t) => t.subjectId === firstSub);
      setFormTopicId(subTopics[0]?.id || '');
      const firstRole = roles[0]?.id || '';
      setFormRoleId(firstRole);
      const roleSkills = skills.filter((s) => s.roleId === firstRole);
      setFormSkillId(roleSkills[0]?.id || '');
      setFormCoverageLevel('Intermediate');
      setFormNotes('');
    }
    setIsModalOpen(true);
  };

  const handleProgramChangeInForm = (progId) => {
    setFormProgramId(progId);
    const progSubs = subjects.filter((s) => s.programId === progId);
    const firstSub = progSubs[0]?.id || '';
    setFormSubjectId(firstSub);
    const subTopics = topics.filter((t) => t.subjectId === firstSub);
    setFormTopicId(subTopics[0]?.id || '');
  };

  const handleSubjectChangeInForm = (subId) => {
    setFormSubjectId(subId);
    const subTopics = topics.filter((t) => t.subjectId === subId);
    setFormTopicId(subTopics[0]?.id || '');
  };

  const handleRoleChangeInForm = (roleId) => {
    setFormRoleId(roleId);
    const roleSkills = skills.filter((s) => s.roleId === roleId);
    setFormSkillId(roleSkills[0]?.id || '');
  };

  const handleSaveMapping = async (e) => {
    e.preventDefault();
    if (!formTopicId || !formSkillId) {
      showToast('Please select both an academic topic and an industry skill', 'error');
      return;
    }

    const sub = subjects.find((s) => s.id === formSubjectId);
    const top = topics.find((t) => t.id === formTopicId);
    const rol = roles.find((r) => r.id === formRoleId);
    const ski = skills.find((s) => s.id === formSkillId);

    const levelObj =
      Object.values(COVERAGE_LEVELS).find((l) => l.label === formCoverageLevel) ||
      COVERAGE_LEVELS.INTERMEDIATE;

    const payload = {
      subjectId: formSubjectId,
      subjectName: sub?.name || 'Subject',
      topicId: formTopicId,
      topicName: top?.name || 'Topic',
      industryRoleId: formRoleId,
      industryRoleName: rol?.name || 'Role',
      industrySkillId: formSkillId,
      industrySkillName: ski?.name || 'Skill',
      coverageLevel: levelObj.label,
      coveragePercentage: levelObj.percentage,
      notes: formNotes,
    };

    try {
      if (editingMapping) {
        await updateMapping(editingMapping.id, payload);
        showToast('Mapping updated successfully', 'success');
      } else {
        await addMapping(payload);
        showToast('Skill mapping added successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to save mapping', 'error');
    }
  };

  const handleDeleteMapping = async (id, skillName) => {
    if (window.confirm(`Delete this mapping to "${skillName}"?`)) {
      try {
        await deleteMapping(id);
        showToast('Mapping deleted', 'success');
      } catch (err) {
        showToast('Failed to delete mapping', 'error');
      }
    }
  };

  return (
    <AppLayout
      title="Syllabus-to-Industry Skill Mapping"
      subtitle="Map course syllabus units to industry competencies with Outcome-Based Education (OBE) coverage tiers"
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Subject */}
            <div className="flex items-center gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="all">All Academic Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Role */}
            <div className="flex items-center gap-1.5 text-xs">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="all">All Industry Roles</option>
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
            <span>Create New Mapping</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mappings by topic, subject, industry role, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Mappings Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Academic Syllabus Source</th>
                  <th className="px-6 py-3.5 text-center w-8"></th>
                  <th className="px-6 py-3.5">Target Industry Competency</th>
                  <th className="px-6 py-3.5">Assigned Coverage</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMappings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <EmptyState
                        icon={GitMerge}
                        title="No skill mappings found"
                        description="Start bridging your curriculum by connecting an academic topic to an industry skill."
                        actionLabel="Add Mapping"
                        onAction={() => handleOpenModal()}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredMappings.map((map) => {
                    const levelMeta =
                      Object.values(COVERAGE_LEVELS).find(
                        (l) => l.label === map.coverageLevel
                      ) || COVERAGE_LEVELS.INTERMEDIATE;

                    return (
                      <tr
                        key={map.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                      >
                        {/* Academic Source */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {map.subjectName}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {map.topicName}
                          </div>
                          {map.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-1">
                              "{map.notes}"
                            </p>
                          )}
                        </td>

                        {/* Connector Icon */}
                        <td className="px-2 py-4 text-center">
                          <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                        </td>

                        {/* Industry Target */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {map.industryRoleName}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {map.industrySkillName}
                          </div>
                        </td>

                        {/* Coverage Level Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${levelMeta.color}`}
                          >
                            <span>{map.coverageLevel}</span>
                            <span>({map.coveragePercentage}%)</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenModal(map)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit Mapping"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMapping(map.id, map.industrySkillName)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete Mapping"
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
      </div>

      {/* Mapping Modal with Academic Program -> Subject -> Topic -> Industry Role -> Industry Skill */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMapping ? 'Edit Skill Mapping' : 'Link Academic Topic to Industry Skill'}
        description="Cascade: Academic Program → Subject → Topic → Industry Role → Industry Skill"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveMapping} className="space-y-4 text-xs">
          {/* Section 1: Academic Cascade */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Academic Curriculum Cascade</span>
            </h4>

            {/* 1. Academic Program */}
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                1. Academic Degree Program *
              </label>
              <select
                required
                value={formProgramId}
                onChange={(e) => handleProgramChangeInForm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Course Subject */}
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                2. Select Course Subject *
              </label>
              <select
                required
                value={formSubjectId}
                onChange={(e) => handleSubjectChangeInForm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {formSubjects.length === 0 ? (
                  <option value="">No subjects in this program</option>
                ) : (
                  formSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name} (Semester {s.semester})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 3. Lecture Topic */}
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                3. Select Specific Lecture Topic *
              </label>
              <select
                required
                value={formTopicId}
                onChange={(e) => setFormTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {formTopics.length === 0 ? (
                  <option value="">No topics found in this subject</option>
                ) : (
                  formTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.hours} hrs)
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Section 2: Industry Target */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-violet-500" />
              <span>Target Industry Competency</span>
            </h4>

            {/* 4. Industry Role */}
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                4. Target Industry Role *
              </label>
              <select
                required
                value={formRoleId}
                onChange={(e) => handleRoleChangeInForm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Industry Skill */}
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                5. Select Required Technical Skill *
              </label>
              <select
                required
                value={formSkillId}
                onChange={(e) => setFormSkillId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {formSkills.length === 0 ? (
                  <option value="">No skills defined under this role</option>
                ) : (
                  formSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Importance: {s.importanceWeight}/5)
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Section 3: Coverage Level */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              6. Curriculum Coverage Level *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(COVERAGE_LEVELS).map((lvl) => (
                <label
                  key={lvl.label}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    formCoverageLevel === lvl.label
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 dark:border-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="coverageLevel"
                      checked={formCoverageLevel === lvl.label}
                      onChange={() => setFormCoverageLevel(lvl.label)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {lvl.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {lvl.percentage}%
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Faculty Mapping Notes / Audit Justification
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Lab exercises cover component state and lifecycle; server actions need supplementary modules..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
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
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editingMapping ? 'Save Changes' : 'Create Mapping'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
