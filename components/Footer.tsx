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
        <footer className="bg-primary-deep text-white/70 py-12 mt-auto rounded-t-2xl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div className="flex flex-col gap-3">
                        <Link href="/" aria-label="مدار - الرئيسية" className="hover:opacity-80 transition-opacity w-fit">
                            <Logo />
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed">
                            وظايف مكاتب إلحاق العمالة المصرية بالخارج، كلها في مكان واحد.
                        </p>
                        <Link
                            href="/login"
                            className="mt-1 inline-flex items-center gap-2 w-fit py-2 px-4 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white hover:text-primary-deep transition-all"
                        >
                            <Bell className="w-4 h-4" />
                            فعّل التنبيهات
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-white">روابط سريعة</h3>
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.href}
                                        className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                                    >
                                        {item.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="flex flex-col gap-2 pt-2 border-t border-white/10">
                            {legalItems.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.href}
                                        className="text-white/70 hover:text-white transition-colors text-sm"
                                    >
                                        {item.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-white">تواصل معنا</h3>
                        <a
                            href="mailto:hellmyezzat@gmail.com"
                            className="inline-flex items-center gap-2 text-white hover:underline text-sm font-medium break-all"
                        >
                            <Mail className="w-4 h-4 shrink-0" />
                            hellmyezzat@gmail.com
                        </a>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                            <p className="text-white text-sm font-semibold mb-1">لأصحاب المكاتب</p>
                            <p className="text-white/70 text-xs leading-relaxed">
                                عندك مكتب إلحاق وعايز وظايفك تظهر على مدار؟{" "}
                                <a href="mailto:hellmyezzat@gmail.com?subject=إضافة مكتب" className="text-white font-semibold hover:underline">
                                    كلمنا من هنا
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-white/10 my-8" />

                {/* Bottom Section */}
                <div className="text-center space-y-2">
                    <p className="text-xs">مدار هو محرك بحث يجمع الوظائف من المصادر العامة، وجميع الحقوق محفوظة لأصحاب الإعلانات الأصليين.</p>
                    <p className="text-xs">© {currentYear} مدار. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
