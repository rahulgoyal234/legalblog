import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published';
  authorId: string;
  createdAt: any;
  updatedAt: any;
  coverImage?: string;
}

const POSTS_PATH = 'posts';

export const getPublishedPosts = async () => {
  try {
    const q = query(
      collection(db, POSTS_PATH),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, POSTS_PATH);
  }
};

export const getAllPosts = async () => {
  try {
    const q = query(collection(db, POSTS_PATH), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, POSTS_PATH);
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    const q = query(collection(db, POSTS_PATH), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Post;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${POSTS_PATH}/slug:${slug}`);
  }
};

export const getPostById = async (id: string) => {
  try {
    const postDoc = await getDoc(doc(db, POSTS_PATH, id));
    if (!postDoc.exists()) return null;
    return { id: postDoc.id, ...postDoc.data() } as Post;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${POSTS_PATH}/${id}`);
  }
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>) => {
  if (!auth.currentUser) throw new Error("Unauthorized");
  try {
    const newPost = {
      ...post,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, POSTS_PATH), newPost);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, POSTS_PATH);
  }
};

export const updatePost = async (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>) => {
  try {
    const docRef = doc(db, POSTS_PATH, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${POSTS_PATH}/${id}`);
  }
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, POSTS_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${POSTS_PATH}/${id}`);
  }
};
