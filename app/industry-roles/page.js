'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Layers,
  ArrowRight,
  Info,
  BarChart3,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { useFirestore } from '../../hooks/useFirestore';
import { useToast } from '../../components/common/Toast';

export default function IndustryRolesPage() {
  const { roles, skills, mappings, addRole, updateRole, deleteRole } = useFirestore();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    department: 'Engineering',
    description: '',
  });

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name,
        department: role.department || 'Engineering',
        description: role.description || '',
      });
    } else {
      setEditingRole(null);
      setRoleForm({
        name: '',
        department: 'Engineering',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleForm.name) {
      showToast('Role name is required', 'error');
      return;
    }
    try {
      if (editingRole) {
        await updateRole(editingRole.id, roleForm);
        showToast('Industry role updated', 'success');
      } else {
        await addRole(roleForm);
        showToast('Industry role created', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to save role', 'error');
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (window.confirm(`Delete role "${roleName}" and all associated skills & mappings?`)) {
      try {
        await deleteRole(roleId);
        showToast('Role and related skills deleted', 'success');
      } catch (err) {
        showToast('Failed to delete role', 'error');
      }
    }
  };

  return (
    <AppLayout
      title="Industry Job Roles"
      subtitle="Define target employment profiles and benchmark job requirements"
    >
      <div className="space-y-6">
        {/* Notice Banner */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">Industry Benchmark Reference:</span> These job roles and skill definitions reflect contemporary engineering standards (e.g. NASSCOM / ACM Computing Curricula benchmarks) formulated for curriculum alignment audits and Board of Studies review.
          </p>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Configured Industry Profiles ({roles.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Profiles used to compute curriculum alignment in gap analytics
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Industry Role</span>
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Briefcase}
                title="No industry roles created"
                description="Add an industry job role like Frontend Developer or Data Analyst to begin mapping skills."
                actionLabel="Create Role"
                onAction={() => handleOpenModal()}
              />
            </div>
          ) : (
            roles.map((role) => {
              const roleSkills = skills.filter((s) => s.roleId === role.id);
              const roleMappings = mappings.filter((m) => m.industryRoleId === role.id);

              return (
                <div
                  key={role.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:shadow-card transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenModal(role)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Role"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id, role.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete Role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {role.name}
                        </h4>
                      </div>
                      {role.department && (
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                          {role.department}
                        </span>
                      )}
                    </div>

                    {role.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {role.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Tracked Competencies:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {roleSkills.length} Skills
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/industry-skills/?role=${role.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Manage Skills</span>
                      </Link>
                      <Link
                        href={`/gap-analysis/?role=${role.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                        title="Run Gap Audit for this Role"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Edit Industry Job Role' : 'Add Industry Job Role'}
        description="Configure target employment profile attributes"
      >
        <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Job Role Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud DevOps Engineer"
              value={roleForm.name}
              onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Department / Domain
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineering / Systems"
              value={roleForm.department}
              onChange={(e) => setRoleForm({ ...roleForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Role Description & Industry Context
            </label>
            <textarea
              rows={4}
              placeholder="Primary responsibilities and tech stack requirements for this role..."
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
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
              {editingRole ? 'Save Changes' : 'Create Role'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
