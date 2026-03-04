import Link from "next/link";

const navItems = [
    { key: "الرئيسية", href: "/" },
    { key: "المكاتب", href: "/offices" },
    { key: "الوظائف", href: "/jobs" },
    { key: "من نحن", href: "/about" },
];
const currentYear = new Date().getFullYear();

export default function Footer() {

    return (
        <footer className="bg-white text-slate-500 py-12 mt-auto rounded-t-2xl border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-2xl font-bold text-primary2">
                            مدار
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            منصة تجمع لك كل وظائف مكاتب إلحاق العمالة المصرية بالخارج في مكان واحد.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-900">روابط سريعة</h3>
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-500 hover:text-primary2 transition-colors text-sm font-medium"
                                    >
                                        {item.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-900">تواصل معنا</h3>
                        <p className="text-slate-500 text-sm">
                            لديك أي استفسار؟ تواصل معنا عبر البريد الإلكتروني
                        </p>
                        <a
                            href="mailto:hellmyezzat@gmail.com"
                            className="text-primary2 hover:underline text-sm font-medium"
                        >
                            hellmyezzat@gmail.com
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-slate-100 my-8" />

                {/* Disclaimer & Copyright */}
                <div className="text-center text-slate-400 text-sm flex flex-col gap-1">
                    <p>مدار هو محرك بحث يجمع الوظائف من المصادر العامة، وجميع الحقوق محفوظة لأصحاب الإعلانات الأصليين.</p>
                    <p>© {currentYear} مدار. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
