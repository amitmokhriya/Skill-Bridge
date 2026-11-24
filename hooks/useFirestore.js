'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getIndustryRoles,
  createIndustryRole,
  updateIndustryRole,
  deleteIndustryRole,
  getIndustrySkills,
  createIndustrySkill,
  updateIndustrySkill,
  deleteIndustrySkill,
  getSkillMappings,
  createSkillMapping,
  updateSkillMapping,
  deleteSkillMapping,
  initializeUserWorkspace,
  resetWorkspaceToSampleData,
} from '../lib/firestore';
import {
  calculateOverallSystemStats,
  calculateRoleGapAnalysis,
} from '../lib/calculations';

export function useFirestore() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [mappings, setMappings] = useState([]);

  const loadData = useCallback(async () => {
    if (!user || !user.uid) {
      setPrograms([]);
      setSubjects([]);
      setTopics([]);
      setRoles([]);
      setSkills([]);
      setMappings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let [
        progsData,
        subsData,
        topicsData,
        rolesData,
        skillsData,
        mapsData,
      ] = await Promise.all([
        getPrograms(user.uid),
        getSubjects(user.uid),
        getTopics(user.uid),
        getIndustryRoles(user.uid),
        getIndustrySkills(user.uid),
        getSkillMappings(user.uid),
      ]);

      // If user is freshly registered and workspace hasn't populated yet, auto-seed
      if (subsData.length === 0 && rolesData.length === 0) {
        await initializeUserWorkspace(user);
        [progsData, subsData, topicsData, rolesData, skillsData, mapsData] =
          await Promise.all([
            getPrograms(user.uid),
            getSubjects(user.uid),
            getTopics(user.uid),
            getIndustryRoles(user.uid),
            getIndustrySkills(user.uid),
            getSkillMappings(user.uid),
          ]);
      }

      setPrograms(progsData);
      setSubjects(subsData);
      setTopics(topicsData);
      setRoles(rolesData);
      setSkills(skillsData);
      setMappings(mapsData);
    } catch (err) {
      console.error('Error loading Firestore workspace for user:', user.uid, err);
      setError(err.message || 'Failed to load curriculum workspace from Firestore');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Program CRUD
  const handleAddProgram = async (data) => {
    if (!user?.uid) throw new Error('Authentication required');
    const newProg = await createProgram(user.uid, data);
    setPrograms((prev) => [newProg, ...prev]);
    return newProg;
  };

  const handleUpdateProgram = async (id, data) => {
    if (!user?.uid) throw new Error('Authentication required');
    await updateProgram(user.uid, id, data);
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const handleDeleteProgram = async (id) => {
    if (!user?.uid) throw new Error('Authentication required');
    await deleteProgram(user.uid, id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  // Subject CRUD
  const handleAddSubject = async (data) => {
    if (!user?.uid) throw new Error('Authentication required');
    const newSub = await createSubject(user.uid, data);
    setSubjects((prev) => [...prev, newSub]);
    return newSub;
  };

  const handleUpdateSubject = async (id, data) => {
    if (!user?.uid) throw new Error('Authentication required');
    await updateSubject(user.uid, id, data);
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const handleDeleteSubject = async (id) => {
    if (!user?.uid) throw new Error('Authentication required');
    await deleteSubject(user.uid, id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTopics((prev) => prev.filter((t) => t.subjectId !== id));
    setMappings((prev) => prev.filter((m) => m.subjectId !== id));
  };

  // Topic CRUD
  const handleAddTopic = async (data) => {
    if (!user?.uid) throw new Error('Authentication required');
    const newTopic = await createTopic(user.uid, data);
    setTopics((prev) => [...prev, newTopic]);
    return newTopic;
  };

  const handleUpdateTopic = async (id, data) => {
    if (!user?.uid) throw new Error('Authentication required');
    await updateTopic(user.uid, id, data);
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  const handleDeleteTopic = async (id) => {
    if (!user?.uid) throw new Error('Authentication required');
    await deleteTopic(user.uid, id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
    setMappings((prev) => prev.filter((m) => m.topicId !== id));
  };

  // Role CRUD
  const handleAddRole = async (data) => {
    if (!user?.uid) throw new Error('Authentication required');
    const newRole = await createIndustryRole(user.uid, data);
    setRoles((prev) => [...prev, newRole]);
    return newRole;
  };

  const handleUpdateRole = async (id, data) => {
    if (!user?.uid) throw new Error('Authentication required');
    await updateIndustryRole(user.uid, id, data);
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const handleDeleteRole = async (id) => {
    if (!user?.uid) throw new Error('Authentication required');
    await deleteIndustryRole(user.uid, id);
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setSkills((prev) => prev.filter((s) => s.roleId !== id));
    setMappings((prev) => prev.filter((m) => m.industryRoleId !== id));
  };

  // Skill CRUD
  const handleAddSkill = async (data) => {
    if (!user?.uid) throw new Error('Authentication required');
    const newSkill = await createIndustrySkill(user.uid, data);
    setSkills((prev) => [...prev, newSkill]);
    return newSkill;
  };

  const handleUpdateSkill = async (id, data) => {
    if (!user?.uid) throw new Error('Authentication required');
    await updateIndustrySkill(user.uid, id, data);
    const formatted = {
      ...data,
      importanceWeight:
        data.importanceWeight !== undefined
          ? Number(data.importanceWeight)
          : undefined,
    };
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...formatted } : s)));
  };

  const handleDeleteSkill = async (id) => {
    if (!user?.uid) throw new Error('Authentication required');
    await deleteIndustrySkill(user.uid, id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setMappings((prev) => prev.filter((m) => m.industrySkillId !== id));
  };

  // Mapping CRUD
  const handleAddMapping = async (data) => {
    if (!user?.uid) throw new Error('Authentication required');
    const newMapping = await createSkillMapping(user.uid, data);
    setMappings((prev) => [newMapping, ...prev]);
    return newMapping;
  };

  const handleUpdateMapping = async (id, data) => {
    if (!user?.uid) throw new Error('Authentication required');
    await updateSkillMapping(user.uid, id, data);
    const formatted = {
      ...data,
      coveragePercentage:
        data.coveragePercentage !== undefined
          ? Number(data.coveragePercentage)
          : undefined,
    };
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, ...formatted } : m)));
  };

  const handleDeleteMapping = async (id) => {
    if (!user?.uid) throw new Error('Authentication required');
    await deleteSkillMapping(user.uid, id);
    setMappings((prev) => prev.filter((m) => m.id !== id));
  };

  // Reset to initial sample benchmarks in Cloud Firestore
  const handleResetToSample = async () => {
    if (!user?.uid) throw new Error('Authentication required');
    setLoading(true);
    try {
      await resetWorkspaceToSampleData(user.uid);
      await loadData();
    } catch (err) {
      console.error('Reset error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // System Stats calculation
  const systemStats = useMemo(() => {
    return calculateOverallSystemStats(
      programs,
      subjects,
      topics,
      roles,
      skills,
      mappings
    );
  }, [programs, subjects, topics, roles, skills, mappings]);

  // Helper to compute gap analysis for a specific role
  const getRoleAnalysis = useCallback(
    (roleId) => {
      const selectedRole = roles.find((r) => r.id === roleId);
      return calculateRoleGapAnalysis(selectedRole, skills, mappings);
    },
    [roles, skills, mappings]
  );

  return {
    loading,
    error,
    programs,
    subjects,
    topics,
    roles,
    skills,
    mappings,
    systemStats,
    getRoleAnalysis,
    refreshData: loadData,
    resetToSampleData: handleResetToSample,
    addProgram: handleAddProgram,
    updateProgram: handleUpdateProgram,
    deleteProgram: handleDeleteProgram,
    addSubject: handleAddSubject,
    updateSubject: handleUpdateSubject,
    deleteSubject: handleDeleteSubject,
    addTopic: handleAddTopic,
    updateTopic: handleUpdateTopic,
    deleteTopic: handleDeleteTopic,
    addRole: handleAddRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
    addSkill: handleAddSkill,
    updateSkill: handleUpdateSkill,
    deleteSkill: handleDeleteSkill,
    addMapping: handleAddMapping,
    updateMapping: handleUpdateMapping,
    deleteMapping: handleDeleteMapping,
  };
}
