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
  signInWithPopup
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
    // Configure provider to avoid popup blockers
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        // User exists, return existing data
        const userData = { uid: userCredential.user.uid, ...userDoc.data() } as User;
        setUser(userData);
        return userData;
      } else {
        // New user, create record with the specified role
        const userData: User = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          role,
          createdAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        setUser(userData);
        return userData;
      }
    } catch (error: unknown) {
      // If popup is blocked, provide helpful error
      if (error instanceof Error && error.message.includes('popup')) {
        throw new Error('Pop-up blocat de browser. Vă rugăm să permiteți pop-up-uri pentru acest site.');
      }
      throw error;
    }
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
