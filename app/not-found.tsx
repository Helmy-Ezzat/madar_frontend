import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-md">
        <Image
          src="/undraw_page-not-found_6wni.svg"
          alt="404"
          width={256}
          height={192}
          className="w-full max-w-sm mx-auto mb-8 opacity-80"
        />
        <p className="text-slate-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary2 text-white rounded-lg font-semibold hover:bg-primary2/90 transition-all"
          >
            الصفحة الرئيسية
          </Link>
          
          <Link
            href="/jobs"
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
          >
            تصفح الوظائف
          </Link>
        </div>
      </div>
    </div>
  );
}