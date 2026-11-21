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

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<"seeker" | "office">("seeker");
  const [displayName, setDisplayName] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await register(
        email,
        password,
        displayName,
        accountType === "office"
          ? { officeName: officeName.trim(), licenseNumber: licenseNumber.trim() || undefined }
          : undefined
      );
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الحساب";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    if (accountType === "office" && !officeName.trim()) {
      setError("اكتب اسم المكتب الأول");
      return;
    }
    setGoogleLoading(true);
    try {
      await loginWithGoogle(
        accountType === "office"
          ? { officeName: officeName.trim(), licenseNumber: licenseNumber.trim() || undefined }
          : undefined
      );
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
        إنشاء <MarkerHighlight>حساب جديد</MarkerHighlight>
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Account type: job seeker or labor-recruitment office */}
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="نوع الحساب">
          <button
            type="button"
            onClick={() => setAccountType("seeker")}
            aria-pressed={accountType === "seeker"}
            className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
              accountType === "seeker"
                ? "border-primary bg-primary-tint text-primary"
                : "border-border text-text-body hover:border-primary/40"
            }`}
          >
            باحث عن عمل
          </button>
          <button
            type="button"
            onClick={() => setAccountType("office")}
            aria-pressed={accountType === "office"}
            className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
              accountType === "office"
                ? "border-primary bg-primary-tint text-primary"
                : "border-border text-text-body hover:border-primary/40"
            }`}
          >
            مكتب إلحاق عمالة
          </button>
        </div>

        <FloatingInput
          id="name"
          type="text"
          label={accountType === "office" ? "اسم المسؤول" : "الإسم"}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        {accountType === "office" && (
          <>
            <FloatingInput
              id="officeName"
              type="text"
              label="اسم المكتب"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              required
            />
            <FloatingInput
              id="licenseNumber"
              type="text"
              label="رقم الترخيص (اختياري)"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            <p className="text-xs text-text-muted -mt-2">
              حسابات مكاتب إلحاق العمالة بتتفعّل بعد مراجعة الإدارة، وبعدها بتقدر تنزل وظائف بشارة "مكتب إلحاق عمالة معتمد".
            </p>
          </>
        )}
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
          minLength={6}
        />
        <FloatingInput
          id="confirmPassword"
          type="password"
          label="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "جاري التحميل..." : "إنشاء حساب"}
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
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
