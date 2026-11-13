"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-muted">جاري التحميل...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
