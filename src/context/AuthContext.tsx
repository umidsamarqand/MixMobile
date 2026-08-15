import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Only this account has admin/seller privileges (Add Phone, Edit Specs,
// Inventory management). This matches the Firestore security rules, which
// restrict all writes to this same email server-side - this client-side
// check only controls what UI is shown, it is not itself a security
// boundary (the Firestore rules are the real enforcement).
export const ADMIN_EMAIL = 'michaelerosif@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  isAuthLoading: boolean;
  // True only when the signed-in user's email matches ADMIN_EMAIL. Anyone
  // else who signs in (or signs up) is treated as a regular visitor with no
  // admin UI shown, and their writes would be rejected by Firestore rules
  // regardless.
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Firebase persists the session itself (localStorage under the hood, via
    // its own SDK, refreshed against the server) - this listener just mirrors
    // that live state into React, it does not read/write localStorage directly.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    await firebaseSignOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    isAuthLoading,
    isAdmin: currentUser?.email === ADMIN_EMAIL,
    signIn,
    signUp,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
