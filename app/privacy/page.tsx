export const metadata = { title: "سياسة الخصوصية | مدار" };

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">سياسة الخصوصية</h1>
            <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                <p>مدار منصة بتجمع وظايف مكاتب إلحاق العمالة من مصادر عامة وبتعرضها في مكان واحد. الخصوصية بتاعتك مهمة بالنسبة لنا، والصفحة دي بتوضح إيه البيانات اللي بنجمعها وليه.</p>
                <h2 className="text-lg font-bold text-slate-800">البيانات اللي بنجمعها</h2>
                <p>عند تسجيل حساب بنحفظ بريدك الإلكتروني واسمك عشان نقدر نقدملك مميزات زي حفظ الوظايف والتنبيهات. لو فعّلت الإشعارات بنحفظ معرّف جهازك (رمز الإشعارات) عشان نقدر نبعتلك تنبيهات بالوظايف الجديدة.</p>
                <h2 className="text-lg font-bold text-slate-800">إزاي بنستخدم البيانات</h2>
                <p>البيانات بتتستخدم بس عشان تشغيل الخدمة: تسجيل الدخول، حفظ الوظايف المفضلة، وإرسال التنبيهات اللي انت طلبتها. منبيعش ومنشاركش بياناتك مع أي طرف تالت لأغراض تسويقية.</p>
                <h2 className="text-lg font-bold text-slate-800">مصادر الوظايف</h2>
                <p>الوظايف المعروضة متجمعة من مصادر عامة (قنوات ومواقع مكاتب التوظيف)، وجميع الحقوق محفوظة لأصحاب الإعلانات الأصليين.</p>
                <h2 className="text-lg font-bold text-slate-800">حذف بياناتك</h2>
                <p>تقدر في أي وقت تمسح وظايفك المحفوظة أو توقف التنبيهات. لو عايز حذف حسابك نهائيًا كلمنا على <a href="mailto:hellmyezzat@gmail.com" className="text-primary hover:underline">hellmyezzat@gmail.com</a>.</p>
                <p className="text-slate-400 text-xs">آخر تحديث: نوفمبر 2026</p>
            </div>
        </main>
    );
}
