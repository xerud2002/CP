'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: UserRole) => Promise<User>;
  loginWithGoogle: (role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    // Handle redirect result from Google Sign-In
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User signed in successfully via redirect
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (!userDoc.exists()) {
            // Get role from sessionStorage (set before redirect)
            const role = (sessionStorage.getItem('pendingGoogleRole') || 'client') as UserRole;
            sessionStorage.removeItem('pendingGoogleRole');
            
            // Create new user document
            const userData: User = {
              uid: result.user.uid,
              email: result.user.email || '',
              role,
              createdAt: new Date(),
            };
            
            await setDoc(doc(db, 'users', result.user.uid), userData);
          }
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };

    handleRedirect();

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    
    const userData = { uid: userCredential.user.uid, ...userDoc.data() } as User;
    setUser(userData);
    return userData;
  };

  const register = async (email: string, password: string, role: UserRole): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const userData: User = {
      uid: userCredential.user.uid,
      email,
      role,
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (role: UserRole): Promise<User> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Store role in sessionStorage for after redirect
    sessionStorage.setItem('pendingGoogleRole', role);
    
    // Use redirect instead of popup to avoid COOP issues
    await signInWithRedirect(auth, provider);
    
    // This will never return as the page redirects
    // The actual sign-in is handled in the useEffect hook
    throw new Error('Redirect in progress');
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
