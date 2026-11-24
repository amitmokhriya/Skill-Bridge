import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  SAMPLE_PROGRAM,
  SAMPLE_SUBJECTS,
  SAMPLE_TOPICS,
  SAMPLE_ROLES,
  SAMPLE_SKILLS,
  SAMPLE_MAPPINGS,
} from './seedData';
import { generateId } from './utils';

/**
 * -------------------------------------------------------------
 * 1. USER PROFILE MANAGEMENT
 * Stored at: users/{uid}/profile/main
 * -------------------------------------------------------------
 */

export async function syncUserProfile(user) {
  if (!user || !user.uid || !db) return null;
  const uid = user.uid;

  try {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    const snap = await getDoc(profileRef);

    const provider = user.providerData?.[0]?.providerId || 'google.com';

    if (!snap.exists()) {
      // First-time registration profile creation
      const profileData = {
        uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Academic Faculty',
        email: user.email || '',
        emailVerified: Boolean(user.emailVerified),
        photoURL: user.photoURL || null,
        provider,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(profileRef, profileData);

      // Top-level document for security rules validation & user directory
      await setDoc(doc(db, 'users', uid), {
        uid,
        displayName: profileData.displayName,
        email: profileData.email,
        emailVerified: profileData.emailVerified,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      return profileData;
    } else {
      // Returning user login timestamp update
      const updateData = {
        displayName: user.displayName || snap.data().displayName,
        email: user.email || snap.data().email,
        emailVerified: Boolean(user.emailVerified),
        photoURL: user.photoURL || snap.data().photoURL,
        provider,
        lastLoginAt: serverTimestamp(),
      };
      await updateDoc(profileRef, updateData);
      return { ...snap.data(), ...updateData };
    }
  } catch (error) {
    console.error('Error syncing user profile in users/{uid}/profile/main:', error);
    throw error;
  }
}

export async function getUserProfile(uid) {
  if (!uid || !db) return null;
  try {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    const snap = await getDoc(profileRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * -------------------------------------------------------------
 * 2. IDEMPOTENT WORKSPACE INITIALIZATION
 * Scoped at: users/{uid}/appMeta/workspace
 * Uses deterministic IDs and batch writes.
 * -------------------------------------------------------------
 */

export async function initializeUserWorkspace(user) {
  if (!user || !user.uid || !db) return false;
  const uid = user.uid;

  try {
    // Check if workspace initialization metadata document exists
    const metaRef = doc(db, 'users', uid, 'appMeta', 'workspace');
    const metaSnap = await getDoc(metaRef);

    if (metaSnap.exists() && (metaSnap.data().isInitialized || metaSnap.data().isSeeded)) {
      // Workspace already initialized! Idempotent return without duplicating data
      return true;
    }

    // Atomic batch write for all sample benchmark data
    const batch = writeBatch(db);

    // 1. Academic Program (deterministic ID)
    const progRef = doc(db, 'users', uid, 'programs', SAMPLE_PROGRAM.id);
    batch.set(progRef, {
      ...SAMPLE_PROGRAM,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: uid,
      updatedBy: uid,
    });

    // 2. Academic Subjects (deterministic IDs)
    SAMPLE_SUBJECTS.forEach((sub) => {
      const subRef = doc(db, 'users', uid, 'subjects', sub.id);
      batch.set(subRef, {
        ...sub,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid,
        updatedBy: uid,
      });
    });

    // 3. Curriculum Topics (deterministic IDs)
    SAMPLE_TOPICS.forEach((topic) => {
      const topicRef = doc(db, 'users', uid, 'topics', topic.id);
      batch.set(topicRef, {
        ...topic,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid,
        updatedBy: uid,
      });
    });

    // 4. Industry Job Roles (deterministic IDs)
    SAMPLE_ROLES.forEach((role) => {
      const roleRef = doc(db, 'users', uid, 'industryRoles', role.id);
      batch.set(roleRef, {
        ...role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid,
        updatedBy: uid,
      });
    });

    // 5. Industry Skills (deterministic IDs)
    SAMPLE_SKILLS.forEach((skill) => {
      const skillRef = doc(db, 'users', uid, 'industrySkills', skill.id);
      batch.set(skillRef, {
        ...skill,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid,
        updatedBy: uid,
      });
    });

    // 6. Skill Mappings (deterministic IDs)
    SAMPLE_MAPPINGS.forEach((mapping) => {
      const mapRef = doc(db, 'users', uid, 'skillMappings', mapping.id);
      batch.set(mapRef, {
        ...mapping,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid,
        updatedBy: uid,
      });
    });

    // 7. Mark workspace as initialized atomically with the data
    batch.set(metaRef, {
      isInitialized: true,
      isSeeded: true,
      initializedAt: serverTimestamp(),
      version: '1.0',
      ownerUid: uid,
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error during workspace initialization:', error);
    throw error;
  }
}

/**
 * -------------------------------------------------------------
 * 3. REUSABLE SCOPED CRUD OPERATIONS
 * All operations are strictly scoped to users/{uid}/...
 * -------------------------------------------------------------
 */

// --- ACADEMIC PROGRAMS ---

export async function createProgram(uid, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const id = data.id || generateId('prog');
  const ref = doc(db, 'users', uid, 'programs', id);
  const payload = {
    ...data,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  };
  await setDoc(ref, payload);
  return payload;
}

export async function getPrograms(uid) {
  if (!uid || !db) return [];
  const colRef = collection(db, 'users', uid, 'programs');
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateProgram(uid, programId, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'programs', programId);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
  await updateDoc(ref, payload);
  return payload;
}

export async function deleteProgram(uid, programId) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'programs', programId);
  await deleteDoc(ref);
  return programId;
}

// --- CURRICULUM SUBJECTS ---

export async function createSubject(uid, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const id = data.id || generateId('sub');
  const ref = doc(db, 'users', uid, 'subjects', id);
  const payload = {
    ...data,
    id,
    semester: Number(data.semester) || 1,
    credits: Number(data.credits) || 3,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  };
  await setDoc(ref, payload);
  return payload;
}

export async function getSubjects(uid) {
  if (!uid || !db) return [];
  const colRef = collection(db, 'users', uid, 'subjects');
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateSubject(uid, subjectId, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'subjects', subjectId);
  const payload = {
    ...data,
    semester: data.semester !== undefined ? Number(data.semester) : undefined,
    credits: data.credits !== undefined ? Number(data.credits) : undefined,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
  await updateDoc(ref, payload);
  return payload;
}

export async function deleteSubject(uid, subjectId) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'subjects', subjectId);
  await deleteDoc(ref);
  return subjectId;
}

// --- ACADEMIC TOPICS ---

export async function createTopic(uid, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const id = data.id || generateId('top');
  const ref = doc(db, 'users', uid, 'topics', id);
  const payload = {
    ...data,
    id,
    hours: Number(data.hours) || 6,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  };
  await setDoc(ref, payload);
  return payload;
}

export async function getTopics(uid) {
  if (!uid || !db) return [];
  const colRef = collection(db, 'users', uid, 'topics');
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateTopic(uid, topicId, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'topics', topicId);
  const payload = {
    ...data,
    hours: data.hours !== undefined ? Number(data.hours) : undefined,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
  await updateDoc(ref, payload);
  return payload;
}

export async function deleteTopic(uid, topicId) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'topics', topicId);
  await deleteDoc(ref);
  return topicId;
}

// --- INDUSTRY JOB ROLES ---

export async function createIndustryRole(uid, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const id = data.id || generateId('role');
  const ref = doc(db, 'users', uid, 'industryRoles', id);
  const payload = {
    ...data,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  };
  await setDoc(ref, payload);
  return payload;
}

export async function getIndustryRoles(uid) {
  if (!uid || !db) return [];
  const colRef = collection(db, 'users', uid, 'industryRoles');
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateIndustryRole(uid, roleId, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'industryRoles', roleId);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
  await updateDoc(ref, payload);
  return payload;
}

export async function deleteIndustryRole(uid, roleId) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'industryRoles', roleId);
  await deleteDoc(ref);
  return roleId;
}

// --- INDUSTRY SKILLS ---

export async function createIndustrySkill(uid, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const id = data.id || generateId('sk');
  const ref = doc(db, 'users', uid, 'industrySkills', id);
  const payload = {
    ...data,
    id,
    importanceWeight: Number(data.importanceWeight) || 3,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  };
  await setDoc(ref, payload);
  return payload;
}

export async function getIndustrySkills(uid) {
  if (!uid || !db) return [];
  const colRef = collection(db, 'users', uid, 'industrySkills');
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateIndustrySkill(uid, skillId, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'industrySkills', skillId);
  const payload = {
    ...data,
    importanceWeight:
      data.importanceWeight !== undefined
        ? Number(data.importanceWeight)
        : undefined,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
  await updateDoc(ref, payload);
  return payload;
}

export async function deleteIndustrySkill(uid, skillId) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'industrySkills', skillId);
  await deleteDoc(ref);
  return skillId;
}

// --- SKILL MAPPINGS ---

export async function createSkillMapping(uid, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const id = data.id || generateId('map');
  const ref = doc(db, 'users', uid, 'skillMappings', id);
  const payload = {
    ...data,
    id,
    coveragePercentage: Number(data.coveragePercentage) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  };
  await setDoc(ref, payload);
  return payload;
}

export async function getSkillMappings(uid) {
  if (!uid || !db) return [];
  const colRef = collection(db, 'users', uid, 'skillMappings');
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateSkillMapping(uid, mappingId, data) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'skillMappings', mappingId);
  const payload = {
    ...data,
    coveragePercentage:
      data.coveragePercentage !== undefined
        ? Number(data.coveragePercentage)
        : undefined,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
  await updateDoc(ref, payload);
  return payload;
}

export async function deleteSkillMapping(uid, mappingId) {
  if (!uid || !db) throw new Error('Unauthenticated: User UID required');
  const ref = doc(db, 'users', uid, 'skillMappings', mappingId);
  await deleteDoc(ref);
  return mappingId;
}

/**
 * Reset workspace back to default sample benchmarks
 */
export async function resetWorkspaceToSampleData(uid) {
  if (!uid || !db) throw new Error('Unauthenticated');

  const subcollections = [
    'programs',
    'subjects',
    'topics',
    'industryRoles',
    'industrySkills',
    'skillMappings',
  ];

  for (const sub of subcollections) {
    const colRef = collection(db, 'users', uid, sub);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  // Clear initialization metadata & reseed
  const metaRef = doc(db, 'users', uid, 'appMeta', 'workspace');
  await setDoc(metaRef, { isInitialized: false, isSeeded: false });
  return await initializeUserWorkspace({ uid });
}
