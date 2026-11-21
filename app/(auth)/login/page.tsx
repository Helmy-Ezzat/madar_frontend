"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import FloatingInput from "@/components/FloatingInput";
import MarkerHighlight from "@/components/MarkerHighlight";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.014 24.014 0 0 0 0 21.56l7.98-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول بجوجل";
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-text-main text-center mb-6">
        تسجيل <MarkerHighlight>الدخول</MarkerHighlight>
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
  <FloatingInput
    id="email"
    type="email"
    label="البريد الإلكتروني"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <FloatingInput
    id="password"
    type="password"
    label="كلمة المرور"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    type="submit"
    disabled={loading || googleLoading}
    className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? "جاري التحميل..." : "تسجيل الدخول"}
  </button>
</form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-sm">أو</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading || googleLoading}
        className="w-full flex items-center justify-center gap-3 border border-border bg-white hover:bg-surface-hover text-text-main font-medium py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {googleLoading ? "جاري التحميل..." : "الدخول بحساب جوجل"}
      </button>

      <p className="text-center text-text-body text-sm mt-6">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          أنشئ حساب جديد
        </Link>
      </p>
    </div>
  );
}
