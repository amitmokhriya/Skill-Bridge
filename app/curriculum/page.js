'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Eye,
  GitMerge,
  ExternalLink,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { useFirestore } from '../../hooks/useFirestore';
import { useToast } from '../../components/common/Toast';

export default function CurriculumPage() {
  const {
    programs,
    subjects,
    topics,
    mappings,
    addProgram,
    updateProgram,
    deleteProgram,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
  } = useFirestore();

  const { showToast } = useToast();

  const [selectedProgramId, setSelectedProgramId] = useState(
    programs[0]?.id || 'prog_btech_cse'
  );
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Modals state
  const [inspectingSubject, setInspectingSubject] = useState(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    semester: 1,
    credits: 3,
    description: '',
  });

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicTargetSubjectId, setTopicTargetSubjectId] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: '',
    hours: 6,
    description: '',
  });

  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programForm, setProgramForm] = useState({
    name: '',
    code: '',
    department: '',
    totalSemesters: 8,
    description: '',
  });

  const selectedProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];

  // Filter subjects
  const filteredSubjects = subjects.filter((sub) => {
    const matchesProgram = sub.programId === selectedProgramId;
    const matchesSemester =
      selectedSemester === 'all' || sub.semester === Number(selectedSemester);
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSemester && matchesSearch;
  });

  const toggleSubject = (subId) => {
    setExpandedSubjectId(expandedSubjectId === subId ? null : subId);
  };

  // Program Handlers
  const handleOpenProgramModal = (prog = null) => {
    if (prog) {
      setEditingProgram(prog);
      setProgramForm({
        name: prog.name,
        code: prog.code,
        department: prog.department,
        totalSemesters: prog.totalSemesters,
        description: prog.description,
      });
    } else {
      setEditingProgram(null);
      setProgramForm({
        name: '',
        code: '',
        department: '',
        totalSemesters: 8,
        description: '',
      });
    }
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    if (!programForm.name || !programForm.code) {
      showToast('Program name and code are required', 'error');
      return;
    }
    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, programForm);
        showToast('Program updated successfully', 'success');
      } else {
        const created = await addProgram(programForm);
        setSelectedProgramId(created.id);
        showToast('Program added successfully', 'success');
      }
      setIsProgramModalOpen(false);
    } catch (err) {
      showToast('Error saving program', 'error');
    }
  };

  // Subject Handlers
  const handleOpenSubjectModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        credits: subject.credits,
        description: subject.description,
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({
        name: '',
        code: '',
        semester: 1,
        credits: 3,
        description: '',
      });
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code) {
      showToast('Subject name and code are required', 'error');
      return;
    }
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          ...subjectForm,
          semester: Number(subjectForm.semester),
          credits: Number(subjectForm.credits),
        });
        showToast('Subject updated successfully', 'success');
      } else {
        await addSubject({
          ...subjectForm,
          programId: selectedProgramId,
          semester: Number(subjectForm.semester),
          credits: Number(subjectForm.credits),
        });
        showToast('Subject added successfully', 'success');
      }
      setIsSubjectModalOpen(false);
    } catch (err) {
      showToast('Error saving subject', 'error');
    }
  };

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (window.confirm(`Delete subject "${subjectName}" and all its topics?`)) {
      try {
        await deleteSubject(subjectId);
        showToast('Subject and topics deleted', 'success');
      } catch (err) {
        showToast('Failed to delete subject', 'error');
      }
    }
  };

  // Topic Handlers
  const handleOpenTopicModal = (subjectId, topic = null) => {
    setTopicTargetSubjectId(subjectId);
    if (topic) {
      setEditingTopic(topic);
      setTopicForm({
        name: topic.name,
        hours: topic.hours,
        description: topic.description,
      });
    } else {
      setEditingTopic(null);
      setTopicForm({
        name: '',
        hours: 6,
        description: '',
      });
    }
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.name) {
      showToast('Topic name is required', 'error');
      return;
    }
    try {
      if (editingTopic) {
        await updateTopic(editingTopic.id, {
          ...topicForm,
          hours: Number(topicForm.hours),
        });
        showToast('Topic updated successfully', 'success');
      } else {
        await addTopic({
          ...topicForm,
          subjectId: topicTargetSubjectId,
          hours: Number(topicForm.hours),
        });
        showToast('Topic added successfully', 'success');
      }
      setIsTopicModalOpen(false);
    } catch (err) {
      showToast('Error saving topic', 'error');
    }
  };

  const handleDeleteTopic = async (topicId, topicName) => {
    if (window.confirm(`Delete topic "${topicName}"?`)) {
      try {
        await deleteTopic(topicId);
        showToast('Topic deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete topic', 'error');
      }
    }
  };

  return (
    <AppLayout
      title="Curriculum & Syllabus Structure"
      subtitle="Department of Computer Science & Engineering • Approved R22 Course Catalog"
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Program Dropdown */}
            <div className="relative">
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="px-3.5 py-2 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Semesters ({subjects.length} subjects)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenSubjectModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
            <button
              onClick={() => handleOpenProgramModal()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-all"
            >
              <span>New Program</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subjects by name or course code (e.g. CS201, Web Development, Algorithms)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Subjects List */}
        <div className="space-y-4">
          {filteredSubjects.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No curriculum subjects found"
              description="No subjects matched your selected filter. Click 'Add Subject' to register a new course."
              actionLabel="Add First Subject"
              onAction={() => handleOpenSubjectModal()}
            />
          ) : (
            filteredSubjects.map((subject) => {
              const subjectTopics = topics.filter((t) => t.subjectId === subject.id);
              const isExpanded = expandedSubjectId === subject.id;

              return (
                <div
                  key={subject.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                >
                  {/* Subject Header Row */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {subject.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {subject.name}
                        </h3>
                        <Badge variant="default" size="sm">
                          Semester {subject.semester}
                        </Badge>
                        <Badge variant="purple" size="sm">
                          {subject.credits} Credits
                        </Badge>
                      </div>

                      {subject.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-3xl line-clamp-2">
                          {subject.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => setInspectingSubject(subject)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                        title="View Detailed Syllabus & Mappings"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleOpenTopicModal(subject.id)}
                        className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
                        title="Add Topic to this Subject"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenSubjectModal(subject)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Subject"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleSubject(subject.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Topic Sub-Table */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
                      <div className="flex items-center justify-between py-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Curriculum Lecture Topics ({subjectTopics.length})</span>
                        </h4>
                        <button
                          onClick={() => handleOpenTopicModal(subject.id)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Topic</span>
                        </button>
                      </div>

                      {subjectTopics.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No topics added for this subject yet. Click 'Add Topic' above.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {subjectTopics.map((topic) => {
                            const topicMappings = mappings.filter(
                              (m) => m.topicId === topic.id
                            );

                            return (
                              <div
                                key={topic.id}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                      {topic.name}
                                    </span>
                                    {topic.hours && (
                                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        {topic.hours} hrs
                                      </span>
                                    )}
                                  </div>
                                  {topic.description && (
                                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                      {topic.description}
                                    </p>
                                  )}

                                  {/* Mapped industry skills badges */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    {topicMappings.length > 0 ? (
                                      topicMappings.map((m) => (
                                        <span
                                          key={m.id}
                                          className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                        >
                                          Mapped to {m.industrySkillName} ({m.coveragePercentage}%)
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">
                                        Unmapped to industry roles
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                  <button
                                    onClick={() => handleOpenTopicModal(subject.id, topic)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    title="Edit Topic"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                    title="Delete Topic"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Subject Detailed Inspection Modal */}
      <Modal
        isOpen={Boolean(inspectingSubject)}
        onClose={() => setInspectingSubject(null)}
        title={inspectingSubject ? `${inspectingSubject.code}: ${inspectingSubject.name}` : 'Course Details'}
        description="Comprehensive academic syllabus overview and industry competency mapping"
        maxWidth="max-w-2xl"
      >
        {inspectingSubject && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Badge variant="primary" size="md">
                Semester {inspectingSubject.semester}
              </Badge>
              <Badge variant="purple" size="md">
                {inspectingSubject.credits} Academic Credits
              </Badge>
              <span className="text-slate-500 ml-auto font-mono text-[11px]">
                {topics.filter((t) => t.subjectId === inspectingSubject.id).reduce((acc, curr) => acc + (curr.hours || 0), 0)} Total Lecture Hours
              </span>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Course Scope & Learning Objectives
              </h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {inspectingSubject.description || 'No detailed course description provided.'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Granular Syllabus Topics ({topics.filter((t) => t.subjectId === inspectingSubject.id).length})
                </h5>
                <button
                  onClick={() => {
                    const subId = inspectingSubject.id;
                    setInspectingSubject(null);
                    handleOpenTopicModal(subId);
                  }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  + Add Topic
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {topics.filter((t) => t.subjectId === inspectingSubject.id).map((t, idx) => {
                  const tMaps = mappings.filter((m) => m.topicId === t.id);
                  return (
                    <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {idx + 1}. {t.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{t.hours} hrs</span>
                      </div>
                      {t.description && (
                        <p className="text-[11px] text-slate-500">{t.description}</p>
                      )}
                      <div className="pt-1 flex flex-wrap gap-1">
                        {tMaps.map((m) => (
                          <span key={m.id} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                            Mapped to: {m.industrySkillName} ({m.coveragePercentage}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingSubject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Program Modal */}
      <Modal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        title={editingProgram ? 'Edit Academic Program' : 'Create Academic Program'}
        description="Configure degree program details and duration"
      >
        <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Program Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. B.Tech Computer Science and Engineering"
              value={programForm.name}
              onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Program Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BTECH-CSE"
                value={programForm.code}
                onChange={(e) => setProgramForm({ ...programForm, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Total Semesters
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={programForm.totalSemesters}
                onChange={(e) => setProgramForm({ ...programForm, totalSemesters: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science & Engineering"
              value={programForm.department}
              onChange={(e) => setProgramForm({ ...programForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Program overview and degree objectives..."
              value={programForm.description}
              onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsProgramModalOpen(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editingProgram ? 'Save Changes' : 'Create Program'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={editingSubject ? 'Edit Curriculum Subject' : 'Add Curriculum Subject'}
        description="Add course information, credit weighting, and semester allocation"
      >
        <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS203"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={subjectForm.semester}
                onChange={(e) => setSubjectForm({ ...subjectForm, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Syllabus Summary
            </label>
            <textarea
              rows={3}
              placeholder="Outline of syllabus scope and pedagogical outcomes..."
              value={subjectForm.description}
              onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Topic Modal */}
      <Modal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title={editingTopic ? 'Edit Lecture Topic' : 'Add Academic Topic'}
        description="Specify micro-level topic name, lecture hours, and concepts covered"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Topic Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Graph Traversals (BFS, DFS, Dijkstra)"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Instruction Hours
            </label>
            <input
              type="number"
              min="1"
              max="40"
              value={topicForm.hours}
              onChange={(e) => setTopicForm({ ...topicForm, hours: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Topic Description / Sub-units
            </label>
            <textarea
              rows={3}
              placeholder="Specific algorithms, theorems, or laboratory exercises covered..."
              value={topicForm.description}
              onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsTopicModalOpen(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editingTopic ? 'Save Changes' : 'Add Topic'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
