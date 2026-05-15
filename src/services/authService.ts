import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
  bio?: string;
}

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      const isAdmin = user.email === 'rahulgyl48@gmail.com';
      const newProfile = {
        name: user.displayName || 'Anonymous',
        email: user.email || '',
        role: isAdmin ? 'admin' : 'editor',
        avatar: user.photoURL || '',
        createdAt: serverTimestamp()
      };
      await setDoc(userDocRef, newProfile);
      return { ...newProfile, uid: user.uid };
    }
    return { ...userDoc.data(), uid: user.uid } as UserProfile;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};

export const loginWithEmail = async (username: string, pass: string) => {
  try {
    // Map 'admin' username to a placeholder email for Firebase Auth
    const email = username === 'admin' ? 'admin@rahulgoyal.com' : username;
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return { ...userDoc.data(), uid: user.uid } as UserProfile;
    }
    
    // If auth exists but no doc, create a default admin doc for the specific email
    if (email === 'admin@rahulgoyal.com') {
      const adminProfile = {
        name: 'Rahul Goyal',
        email: email,
        role: 'admin',
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', user.uid), adminProfile);
      return { ...adminProfile, uid: user.uid } as UserProfile;
    }

    throw new Error("User record not found.");
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const setupAdminAccount = async (username: string, pass: string) => {
  const email = username === 'admin' ? 'admin@rahulgoyal.com' : username;
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  
  const adminProfile = {
    name: 'Rahul Goyal',
    email: email,
    role: 'admin',
    createdAt: serverTimestamp()
  };
  
  await setDoc(doc(db, 'users', user.uid), adminProfile);
  return { ...adminProfile, uid: user.uid } as UserProfile;
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback: (user: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        callback({ ...userDoc.data(), uid: user.uid } as UserProfile);
      } else {
        // This case handles if they are logged in but doc doesn't exist yet (e.g. session persisted but doc deleted)
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
