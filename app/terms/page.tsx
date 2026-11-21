export const metadata = { title: "شروط الاستخدام | مدار" };

export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">شروط الاستخدام</h1>
            <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                <p>باستخدامك لموقع مدار انت بتوافق على الشروط دي.</p>
                <h2 className="text-lg font-bold text-slate-800">طبيعة الخدمة</h2>
                <p>مدار محرك بحث بيجمع إعلانات الوظايف من مصادر عامة وبيرتبها لسهولة التصفح. مدار مش مكتب توظيف ومش طرف في أي اتفاق بينك وبين المكاتب أو الشركات المعلنة.</p>
                <h2 className="text-lg font-bold text-slate-800">دقة المعلومات</h2>
                <p>بنحاول نوفر معلومات صحيحة ومحدثة، لكن محتوى الإعلانات مسؤولية أصحابها الأصليين. دايمًا تأكد من تفاصيل الوظيفة والمكتب (ورقم الترخيص) قبل التقديم أو دفع أي مبالغ.</p>
                <h2 className="text-lg font-bold text-slate-800">الحسابات</h2>
                <p>انت مسؤول عن سرية حسابك. ممنوع استخدام الموقع في أي نشاط مخالف للقانون أو جمع بيانات المستخدمين.</p>
                <h2 className="text-lg font-bold text-slate-800">التعديلات</h2>
                <p>ممكن نحدّث الشروط دي من وقت للتاني، واستمرارك في استخدام الموقع معناه موافقتك على النسخة المحدثة.</p>
                <p className="text-slate-400 text-xs">آخر تحديث: نوفمبر 2026</p>
            </div>
        </main>
    );
}
