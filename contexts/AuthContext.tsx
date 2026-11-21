"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  loginWithEmail as _loginWithEmail,
  registerWithEmail as _registerWithEmail,
  loginWithGoogle as _loginWithGoogle,
  logout as _logout,
  syncUserWithBackend,
} from "@/services/authService";

interface DbUser {
  _id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: string;
  role: string;
  officeStatus: "pending" | "approved" | "rejected" | null;
  officeName: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, officeProfile?: { officeName: string; licenseNumber?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await syncUserWithBackend(firebaseUser);
          setDbUser(data.user ?? data);
        } catch {
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    const result = await _loginWithEmail(email, password);
    setUser(result.user);
    setDbUser(result.dbUser?.user ?? result.dbUser);
  }

  async function register(email: string, password: string, displayName: string, officeProfile?: { officeName: string; licenseNumber?: string }) {
    const result = await _registerWithEmail(email, password, displayName, officeProfile);
    setUser(result.user);
    setDbUser(result.dbUser?.user ?? result.dbUser);
  }

  async function handleLoginWithGoogle() {
    const result = await _loginWithGoogle();
    setUser(result.user);
    setDbUser(result.dbUser?.user ?? result.dbUser);
  }

  async function handleLogout() {
    await _logout();
    setUser(null);
    setDbUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        login,
        register,
        loginWithGoogle: handleLoginWithGoogle,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
