/**
 * SkillBridge Analytical Calculations Engine
 * 
 * Rules:
 * 1. For each industry skill, determine its coverage percentage from its best available curriculum mapping.
 * 2. Weighted Coverage = Sum of (Importance Weight * Skill Coverage Percentage) / Sum of Importance Weights.
 * 3. Skill Gap = 100 - Weighted Coverage.
 * 4. A skill without a curriculum mapping receives 0% coverage.
 * 5. Calculate results separately for each selected industry role.
 */

export function calculateSkillCoverage(industrySkill, mappings = []) {
  // Find all mappings for this specific skill
  const skillMappings = mappings.filter(m => m.industrySkillId === industrySkill.id);
  
  if (skillMappings.length === 0) {
    return {
      skill: industrySkill,
      coveragePercentage: 0,
      bestMapping: null,
      mappingsCount: 0,
      status: 'Missing',
      gapPercentage: 100,
      mappedTopics: [],
    };
  }

  // Find best available curriculum mapping (highest percentage)
  let best = skillMappings[0];
  for (const m of skillMappings) {
    if ((m.coveragePercentage ?? 0) > (best.coveragePercentage ?? 0)) {
      best = m;
    }
  }

  const bestCoverage = best.coveragePercentage || 0;
  let status = 'Missing';
  if (bestCoverage >= 80) status = 'Strongly Covered';
  else if (bestCoverage >= 40) status = 'Partially Covered';
  else if (bestCoverage > 0) status = 'Minimal';

  return {
    skill: industrySkill,
    coveragePercentage: bestCoverage,
    bestMapping: best,
    mappingsCount: skillMappings.length,
    status,
    gapPercentage: Math.max(0, 100 - bestCoverage),
    mappedTopics: skillMappings,
  };
}

export function calculateRoleGapAnalysis(role, roleSkills = [], mappings = []) {
  if (!role || !roleSkills || roleSkills.length === 0) {
    return {
      role: role || { name: 'Unknown' },
      totalSkills: 0,
      weightedCoverage: 0,
      skillGapPercentage: 100,
      skillsAnalysis: [],
      coveredSkills: [],
      partiallyCoveredSkills: [],
      missingSkills: [],
      highPriorityGaps: [],
      totalImportanceWeight: 0,
    };
  }

  // Filter skills for this role
  const skills = roleSkills.filter(s => s.roleId === role.id);
  if (skills.length === 0) {
    return {
      role,
      totalSkills: 0,
      weightedCoverage: 0,
      skillGapPercentage: 100,
      skillsAnalysis: [],
      coveredSkills: [],
      partiallyCoveredSkills: [],
      missingSkills: [],
      highPriorityGaps: [],
      totalImportanceWeight: 0,
    };
  }

  let totalWeightedCoverageScore = 0;
  let totalImportanceWeight = 0;

  const skillsAnalysis = skills.map(skill => {
    const analysis = calculateSkillCoverage(skill, mappings);
    const weight = Number(skill.importanceWeight) || 3;
    totalImportanceWeight += weight;
    totalWeightedCoverageScore += weight * analysis.coveragePercentage;
    return {
      ...analysis,
      weight,
      weightedContribution: weight * analysis.coveragePercentage,
    };
  });

  const weightedCoverage = totalImportanceWeight > 0
    ? Math.round((totalWeightedCoverageScore / totalImportanceWeight) * 10) / 10
    : 0;

  const skillGapPercentage = Math.round((100 - weightedCoverage) * 10) / 10;

  // Categorize
  const coveredSkills = skillsAnalysis.filter(s => s.coveragePercentage >= 80);
  const partiallyCoveredSkills = skillsAnalysis.filter(s => s.coveragePercentage > 0 && s.coveragePercentage < 80);
  const missingSkills = skillsAnalysis.filter(s => s.coveragePercentage === 0);

  // High priority gaps: skills with importance weight >= 4 and coverage < 60%
  const highPriorityGaps = skillsAnalysis
    .filter(s => s.weight >= 4 && s.coveragePercentage < 60)
    .sort((a, b) => {
      // First by importance desc, then by coverage asc
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.coveragePercentage - b.coveragePercentage;
    });

  return {
    role,
    totalSkills: skills.length,
    weightedCoverage,
    skillGapPercentage,
    skillsAnalysis,
    coveredSkills,
    partiallyCoveredSkills,
    missingSkills,
    highPriorityGaps,
    totalImportanceWeight,
  };
}

export function calculateOverallSystemStats(programs = [], subjects = [], topics = [], roles = [], skills = [], mappings = []) {
  const totalPrograms = programs.length;
  const totalSubjects = subjects.length;
  const totalTopics = topics.length;
  const totalRoles = roles.length;
  const totalSkills = skills.length;
  const totalMappings = mappings.length;

  if (totalSkills === 0) {
    return {
      totalPrograms,
      totalSubjects,
      totalTopics,
      totalRoles,
      totalSkills,
      totalMappings,
      averageSkillCoverage: 0,
      totalSkillGaps: 0,
      roleCoverageStats: [],
      subjectContributionStats: [],
    };
  }

  // Calculate stats across all roles
  let roleCoverageStats = roles.map(role => {
    const analysis = calculateRoleGapAnalysis(role, skills, mappings);
    return {
      roleId: role.id,
      roleName: role.name,
      coverage: analysis.weightedCoverage,
      gap: analysis.skillGapPercentage,
      totalSkills: analysis.totalSkills,
      missingCount: analysis.missingSkills.length,
      highPriorityCount: analysis.highPriorityGaps.length,
    };
  });

  const avgCoverage = roleCoverageStats.length > 0
    ? Math.round((roleCoverageStats.reduce((acc, curr) => acc + curr.coverage, 0) / roleCoverageStats.length) * 10) / 10
    : 0;

  const totalSkillGaps = skills.filter(skill => {
    const analysis = calculateSkillCoverage(skill, mappings);
    return analysis.coveragePercentage < 80;
  }).length;

  // Subject-wise contribution stats
  const subjectContributionStats = subjects.map(sub => {
    const subTopics = topics.filter(t => t.subjectId === sub.id);
    const subTopicIds = subTopics.map(t => t.id);
    const subMappings = mappings.filter(m => subTopicIds.includes(m.topicId));
    
    return {
      subjectId: sub.id,
      subjectName: sub.name,
      subjectCode: sub.code,
      totalTopics: subTopics.length,
      mappedTopicsCount: new Set(subMappings.map(m => m.topicId)).size,
      mappingsCount: subMappings.length,
    };
  });

  return {
    totalPrograms,
    totalSubjects,
    totalTopics,
    totalRoles,
    totalSkills,
    totalMappings,
    averageSkillCoverage: avgCoverage,
    totalSkillGaps,
    roleCoverageStats,
    subjectContributionStats,
  };
}
