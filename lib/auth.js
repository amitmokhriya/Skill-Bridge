import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { syncUserProfile, initializeUserWorkspace } from './firestore';

/**
 * Configure Google Auth Provider with account selection prompt
 */
export function getGoogleAuthProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return provider;
}

/**
 * Execute Google Sign-In with popup, fallback to redirect if blocked
 */
export async function loginWithGoogle() {
  if (!auth) {
    throw new Error('Firebase Authentication is not initialized. Please verify your .env.local configuration.');
  }

  // Ensure persistent session across browser restarts
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (err) {
    console.warn('Could not set persistence:', err);
  }

  const provider = getGoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    if (result?.user) {
      // 1. Sync User Profile in users/{uid}/profile/main
      await syncUserProfile(result.user);
      // 2. Perform idempotent workspace initialization
      await initializeUserWorkspace(result.user);
      return { user: result.user, isNewUser: Boolean(result._tokenResponse?.isNewUser) };
    }
    return null;
  } catch (error) {
    // If popup was blocked by browser policies or adblockers, fallback to redirect
    if (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      console.warn('Popup blocked by browser. Falling back to signInWithRedirect...');
      await signInWithRedirect(auth, provider);
      return null;
    }

    // Re-throw other errors (e.g. cancelled, network failure) for UI toast handling
    throw error;
  }
}

/**
 * Check and resolve any pending redirect sign-in results on page mount
 */
export async function handleRedirectResult() {
  if (!auth) return null;

  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await syncUserProfile(result.user);
      await initializeUserWorkspace(result.user);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
}

/**
 * Log out current authenticated user
 */
export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
}
