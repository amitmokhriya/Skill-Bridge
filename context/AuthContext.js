'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { loginWithGoogle, handleRedirectResult, logoutUser } from '../lib/auth';
import { syncUserProfile, initializeUserWorkspace, getUserProfile } from '../lib/firestore';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  isConfigured: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    // Purge any legacy demo mock keys from previous sessions
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('skillbridge_demo_user');
      } catch (e) {
        // Ignore localStorage errors
      }
    }

    const configured = isFirebaseConfigured();
    setIsConfigured(configured);

    if (!configured || !auth) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // Check pending redirect sign in results (fallback for mobile/strict popup blockers)
    handleRedirectResult()
      .then(async (redirectUser) => {
        if (redirectUser) {
          setUser(redirectUser);
          const userProf = await getUserProfile(redirectUser.uid);
          setProfile(userProf);
        }
      })
      .catch((err) => {
        console.error('Redirect sign-in resolution error:', err);
      });

    // Real Firebase Authentication state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // 1. Sync real user profile to users/{uid}/profile/main
          const userProf = await syncUserProfile(currentUser);
          // 2. Idempotent workspace seed check for user UID
          await initializeUserWorkspace(currentUser);
          setUser(currentUser);
          setProfile(userProf);
        } catch (err) {
          console.error('Error syncing profile on auth state change:', err);
          setUser(currentUser);
        }
      } else {
        // No authenticated session
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isConfigured || !auth) {
      throw new Error(
        'Firebase configuration is missing or incomplete in .env.local'
      );
    }

    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.user) {
        setUser(res.user);
        const userProf = await getUserProfile(res.user.uid);
        setProfile(userProf);
        return res.user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setProfile(null);
    setUser(null);
    await logoutUser();
  };

  const refreshProfile = async () => {
    if (user?.uid) {
      const userProf = await getUserProfile(user.uid);
      setProfile(userProf);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured,
        signInWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
