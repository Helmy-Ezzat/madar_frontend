'use client';

import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen lg:p-6 text-center bg-white">
      <Image
        src="/undraw_server-down_lxs9.svg"
        alt="لا توجد نتائج"
        width={256}
        height={192}
        className="w-64 mb-6 opacity-80"
      />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">عفواً، حدث خطأ في الاتصال</h2>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
        يبدو أن هناك مشكلة في الإنترنت أو في خوادمنا. يرجى المحاولة مرة أخرى.
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary2 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary2/90 transition-all"
      >
        حاول مرة أخرى
      </button>
    </div>
  );
}