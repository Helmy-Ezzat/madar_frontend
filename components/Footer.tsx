import Link from "next/link";
import { Bell, Mail } from "lucide-react";
import Logo from "@/components/Logo";

const navItems = [
    { key: "الرئيسية", href: "/" },
    { key: "الوظائف", href: "/jobs" },
    { key: "المحفوظة", href: "/saved" },
    { key: "من نحن", href: "/about" },
];
const legalItems = [
    { key: "سياسة الخصوصية", href: "/privacy" },
    { key: "شروط الاستخدام", href: "/terms" },
];
const currentYear = new Date().getFullYear();

export default function Footer() {

    return (
        <footer className="bg-background text-text-muted py-12 mt-auto rounded-t-2xl border-t border-border-light shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div className="flex flex-col gap-3">
                        <Link href="/" aria-label="مدار - الرئيسية" className="hover:opacity-80 transition-opacity w-fit">
                            <Logo dark />
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed">
                            وظايف مكاتب إلحاق العمالة المصرية بالخارج، كلها في مكان واحد.
                        </p>
                        <Link
                            href="/login"
                            className="mt-1 inline-flex items-center gap-2 w-fit py-2 px-4 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                        >
                            <Bell className="w-4 h-4" />
                            فعّل التنبيهات
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-text-main">روابط سريعة</h3>
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.href}
                                        className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        {item.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="flex flex-col gap-2 pt-2 border-t border-border-light">
                            {legalItems.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.href}
                                        className="text-text-muted hover:text-primary transition-colors text-sm"
                                    >
                                        {item.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-text-main">تواصل معنا</h3>
                        <a
                            href="mailto:hellmyezzat@gmail.com"
                            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium break-all"
                        >
                            <Mail className="w-4 h-4 shrink-0" />
                            hellmyezzat@gmail.com
                        </a>
                        <div className="bg-slate-50 border border-border-light rounded-xl p-3.5">
                            <p className="text-text-main text-sm font-semibold mb-1">لأصحاب المكاتب</p>
                            <p className="text-text-muted text-xs leading-relaxed">
                                عندك مكتب إلحاق وعايز وظايفك تظهر على مدار؟{" "}
                                <a href="mailto:hellmyezzat@gmail.com?subject=إضافة مكتب" className="text-primary hover:underline">
                                    كلمنا من هنا
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-border-light my-8" />

                {/* Bottom Section */}
                <div className="text-center space-y-2">
                    <p className="text-xs">مدار هو محرك بحث يجمع الوظائف من المصادر العامة، وجميع الحقوق محفوظة لأصحاب الإعلانات الأصليين.</p>
                    <p className="text-xs">© {currentYear} مدار. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
