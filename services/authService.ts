import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getFirebaseAuth() {
  if (!auth) {
    throw new Error(
      "لم يتم ضبط إعدادات Firebase بعد. يرجى إضافة مفاتيح Firebase في ملف .env.local"
    );
  }
  return auth;
}

export interface OfficeProfile {
  officeName: string;
  licenseNumber?: string;
}

export async function syncUserWithBackend(user: User, officeProfile?: OfficeProfile) {
  const token = await user.getIdToken(true);
  const res = await fetch(`${API_BASE_URL}/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: officeProfile
      ? JSON.stringify({ role: "office", ...officeProfile })
      : undefined,
  });
  if (!res.ok) {
    throw new Error("فشل مزامنة المستخدم مع السيرفر");
  }
  return res.json();
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  officeProfile?: OfficeProfile
) {
  const firebaseAuth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await updateProfile(credential.user, { displayName });
  const dbUser = await syncUserWithBackend(credential.user, officeProfile);
  return { user: credential.user, dbUser };
}

export async function loginWithEmail(email: string, password: string) {
  const firebaseAuth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const dbUser = await syncUserWithBackend(credential.user);
  return { user: credential.user, dbUser };
}

export async function loginWithGoogle(officeProfile?: OfficeProfile) {
  const firebaseAuth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(firebaseAuth, provider);
  const dbUser = await syncUserWithBackend(credential.user, officeProfile);
  return { user: credential.user, dbUser };
}

export async function logout() {
  const firebaseAuth = getFirebaseAuth();
  await signOut(firebaseAuth);
}
