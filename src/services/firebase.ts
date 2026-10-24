import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { QRItemHistory } from '../types/qr';

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without passing firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
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

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database initializing.');
      return false;
    }
    // Expected permission denied or document not found on dummy test doc is fine
    return true;
  }
}

// Google Sign-In with popup
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Persist / update profile doc
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'QR Studio User',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not write user profile doc:', err);
  }

  return user;
}

// Sign Out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Save or sync QR code to Firestore for current user
export async function saveCloudQRCode(userId: string, item: QRItemHistory): Promise<void> {
  const path = `users/${userId}/qr_codes/${item.id}`;
  try {
    const codeRef = doc(db, 'users', userId, 'qr_codes', item.id);
    await setDoc(codeRef, {
      id: item.id,
      userId,
      title: item.title,
      type: item.type,
      payload: item.payload,
      thumbnail: item.thumbnail || '',
      createdAt: new Date(item.createdAt).toISOString(),
      design: item.design || null
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete QR code from cloud
export async function deleteCloudQRCode(userId: string, itemId: string): Promise<void> {
  const path = `users/${userId}/qr_codes/${itemId}`;
  try {
    const codeRef = doc(db, 'users', userId, 'qr_codes', itemId);
    await deleteDoc(codeRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch all cloud codes for a user
export async function fetchUserCloudQRCodes(userId: string): Promise<QRItemHistory[]> {
  const path = `users/${userId}/qr_codes`;
  try {
    const q = query(collection(db, 'users', userId, 'qr_codes'));
    const snapshot = await getDocs(q);
    const codes: QRItemHistory[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      codes.push({
        id: data.id || docSnap.id,
        type: data.type,
        title: data.title,
        payload: data.payload,
        createdAt: data.createdAt ? new Date(data.createdAt).getTime() : Date.now(),
        thumbnail: data.thumbnail,
        design: data.design
      });
    });
    // Sort newest first
    codes.sort((a, b) => b.createdAt - a.createdAt);
    return codes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
