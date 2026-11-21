"use client";

import { useEffect, useState } from "react";
import {
    Menu,
    X,
    Home,
    Briefcase,
    Info,
    Heart,
    FileText,
    LogOut,
    Bell,
} from "lucide-react";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { useToast } from "@/components/Toast";
import Logo from "@/components/Logo";
import { fromNow } from "@/lib/date-utils";

interface NavItem {
    key: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Essentials stay in the top bar; everything else lives in the sidebar.
const topNavItems: NavItem[] = [
    { key: "الرئيسية", href: "/", icon: Home },
    { key: "الوظائف", href: "/jobs", icon: Briefcase },
    { key: "من نحن", href: "/about", icon: Info },
];

// من نحن renders separately at the bottom of the sidebar, so keep it out here
const sidebarNavItems: NavItem[] = topNavItems.filter((i) => i.key !== "من نحن");

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, dbUser, logout, loading } = useAuth();
    const toast = useToast();
    const { savedIds } = useSavedJobs();
    const savedCount = user ? savedIds.size : 0;

    // Mobile home: nav blends into the hero at the top, navy appears on scroll
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const blendTop = pathname === "/" && !scrolled;

    const isAdminEmail = user?.email === "hellmyezzat@gmail.com";
    const [adminPending, setAdminPending] = useState(0);
    useEffect(() => {
        if (!isAdminEmail) return;
        let alive = true;
        const load = async () => {
            try {
                const { adminGetCounts } = await import("@/services/officeDashboardService");
                const res = await adminGetCounts();
                const d = res?.data;
                if (alive && d) setAdminPending((d.pendingOffices ?? 0) + (d.pendingJobs ?? 0));
            } catch {
                // badge failure should never break the nav
            }
        };
        load();
        const t = setInterval(load, 60000);
        return () => { alive = false; clearInterval(t); };
    }, [isAdminEmail]);

    const sendTestNotification = async () => {
        try {
            const { auth } = await import("@/lib/firebase");
            const idToken = await auth?.currentUser?.getIdToken();
            const base = process.env.NEXT_PUBLIC_API_URL || "";
            const res = await fetch(`${base}/notifications/test`, {
                method: "POST",
                headers: { Authorization: `Bearer ${idToken}` },
            });
            const json = await res.json();
            const sent = json?.data?.sent ?? 0;
            const devices = json?.data?.devices ?? 0;
            const firstError = json?.data?.firstError;
            const tokenInfo = json?.data?.tokenInfo as { updatedAt: string }[] | undefined;
            const ages = tokenInfo?.length
                ? ` [${tokenInfo.map((t) => fromNow(t.updatedAt)).join("، ")}]`
                : "";
            toast(
                sent > 0
                    ? `اتبعت الإشعار لـ ${sent} من ${devices} جهاز مسجل 🔔${ages}`
                    : devices > 0
                      ? `فيه ${devices} جهاز مسجل بس الإرسال فشل${firstError ? ` (${firstError})` : ""} - جرب تاني${ages}`
                      : `مفيش أجهزة مسجلة - الجهاز ده لسه ما اتسجلش للإشعارات${firstError ? ` (${firstError})` : ""}`
            );
        } catch {
            toast("حصل خطأ أثناء إرسال الإشعار");
        }
    };

    const displayName = user?.displayName || dbUser?.displayName || "مستخدم";
    const initial = (user?.displayName || dbUser?.displayName || user?.email || "U")
        .charAt(0)
        .toUpperCase();

    const avatar = user?.photoURL ? (
        <Image
            src={user.photoURL}
            alt={displayName}
            width={36}
            height={36}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full border border-white/30 object-cover"
        />
    ) : (
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
            {initial}
        </div>
    );

    return (
        <>
            <header className={`top-0 left-0 right-0 z-50 py-2 md:py-4 transition-colors duration-300 ${
                blendTop
                    ? "sticky bg-transparent text-primary shadow-none"
                    : "sticky bg-primary-deep text-white shadow-sm"
            }`}>
                <nav className="px-6 flex items-center justify-between md:justify-around">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center hover:opacity-90 transition-opacity"
                        aria-label="مدار - بحث الوظائف"
                    >
                        <Logo dark={blendTop} />
                    </Link>

                    {/* Desktop essentials */}
                    <ul className="hidden md:flex items-center gap-8">
                        {topNavItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    className="text-sm transition-colors hover:underline"
                                >
                                    {item.key}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Trigger: desktop (logged in) opens a dropdown; mobile opens the sidebar. Guests on desktop get auth buttons instead. */}
                    <div className={`relative ${user ? "" : "md:hidden"}`}>
                        <button
                            onClick={() => {
                                if (user && window.matchMedia("(min-width: 768px)").matches) {
                                    setMenuOpen((v) => !v);
                                } else {
                                    setIsOpen(true);
                                }
                            }}
                            className={`flex items-center gap-2 p-2 -m-2 rounded-lg transition cursor-pointer ${blendTop ? "hover:bg-primary/10" : "hover:bg-white/10"}`}
                            aria-label="فتح القائمة"
                        >
                        {loading ? (
                            <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
                        ) : user ? (
                            <span className="relative inline-flex">
                                {avatar}
                                <span className="md:hidden absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-white text-primary border border-primary/60 flex items-center justify-center shadow-sm">
                                    <Menu size={9} strokeWidth={3.5} />
                                </span>
                                {savedCount > 0 && (
                                    <span className="absolute -top-1 -left-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-primary-deep">
                                        {savedCount}
                                    </span>
                                )}
                            </span>
                        ) : (
                            <Menu size={22} />
                            )}
                        </button>

                        {/* Desktop account dropdown */}
                        {menuOpen && user && (
                            <>
                                <div
                                    className="fixed inset-0 z-40 hidden md:block"
                                    onClick={() => setMenuOpen(false)}
                                />
                                <div className="absolute end-0 top-full mt-2 z-50 w-64 hidden md:block bg-white text-text-main rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                                    <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                                        {avatar}
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate">{displayName}</p>
                                            <p className="text-xs text-text-muted truncate" dir="ltr">{user?.email}</p>
                                        </div>
                                    </div>
                                    {dbUser?.role !== "office" && (
                                        <Link
                                            href="/applications"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover transition text-sm"
                                        >
                                            <FileText className="w-4.5 h-4.5 text-slate-400" />
                                            <span>طلباتي</span>
                                        </Link>
                                    )}
                                    <Link
                                        href="/saved"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover transition text-sm"
                                    >
                                        <Heart className="w-4.5 h-4.5 text-slate-400" />
                                        <span>المحفوظة</span>
                                        {savedCount > 0 && (
                                            <span className="ms-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                                                {savedCount}
                                            </span>
                                        )}
                                    </Link>
                                    {dbUser?.role === "office" && (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover transition text-sm"
                                        >
                                            <LayoutDashboard className="w-4.5 h-4.5 text-slate-400" />
                                            <span>لوحة المكتب</span>
                                        </Link>
                                    )}
                                    {user?.email === "hellmyezzat@gmail.com" && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover transition text-sm"
                                        >
                                            <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
                                            <span>الإدارة</span>
                                            {adminPending > 0 && (
                                                <span className="ms-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                                                    {adminPending}
                                                </span>
                                            )}
                                        </Link>
                                    )}
                                    {user?.email === "hellmyezzat@gmail.com" && (
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                sendTestNotification();
                                            }}
                                            className="w-full flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover transition text-sm cursor-pointer text-start"
                                        >
                                            <Bell className="w-4.5 h-4.5 text-slate-400" />
                                            <span>جرّب الإشعارات</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setShowLogoutConfirm(true);
                                        }}
                                        className="w-full flex items-center gap-3 py-2.5 px-4 border-t border-slate-100 text-red-500 hover:bg-red-50 transition text-sm cursor-pointer text-start"
                                    >
                                        <LogOut className="w-4.5 h-4.5" />
                                        <span>تسجيل الخروج</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Guest actions on desktop: login/signup instead of the sidebar */}
                    {!loading && !user && (
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm transition-colors hover:underline"
                            >
                                دخول
                            </Link>
                            <Link
                                href="/register"
                                className="bg-white text-primary text-sm font-semibold py-1.5 px-4 rounded-lg hover:bg-white/90 transition"
                            >
                                تسجيل
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            {/* Sidebar (all screen sizes, slides in from the right) */}
            <div
                data-state={isOpen ? "open" : "closed"}
                className="invisible fixed inset-0 z-50 transition-[visibility] duration-200 data-[state=open]:visible"
                data-modal="mobile-menu"
            >
                <div
                    data-state={isOpen ? "open" : "closed"}
                    className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 data-[state=open]:opacity-100"
                    onClick={() => setIsOpen(false)}
                />

                <aside
                    data-state={isOpen ? "open" : "closed"}
                    className="fixed top-0 right-0 h-[100dvh] w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col translate-x-full data-[state=open]:translate-x-0 duration-200 transition-transform overflow-y-auto overscroll-contain"
                    aria-label="القائمة الجانبية"
                >
                    {/* Header: account card when logged in, brand logo otherwise */}
                    {user || loading ? (
                        <div className="bg-primary-deep text-white p-5">
                            <div className="flex items-start justify-between">
                                {loading ? (
                                    <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="[&>div]:w-12 [&>div]:h-12 [&>div]:text-lg [&_img]:w-12 [&_img]:h-12">
                                            {avatar}
                                        </div>
                                        <div className="truncate max-w-[170px]">
                                            <p className="text-sm font-bold truncate">{displayName}</p>
                                            <p className="text-xs text-white/70 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                                    aria-label="إغلاق القائمة"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="hover:opacity-80 transition-opacity"
                                aria-label="مدار - الرئيسية"
                            >
                                <Logo dark />
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                                aria-label="إغلاق القائمة"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {/* Links */}
                    <ul className="flex flex-col gap-1 p-4 flex-1">
                        {sidebarNavItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-text-main hover:bg-surface-hover"
                                >
                                    <item.icon className="w-5 h-5 text-slate-400" />
                                    <span>{item.key}</span>
                                </Link>
                            </li>
                        ))}
                        {user && dbUser?.role !== "office" && (
                            <li>
                                <Link
                                    href="/applications"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-text-main hover:bg-surface-hover"
                                >
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <span>طلباتي</span>
                                </Link>
                            </li>
                        )}
                        {user && (
                            <li>
                                <Link
                                    href="/saved"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-text-main hover:bg-surface-hover"
                                >
                                    <Heart className="w-5 h-5 text-slate-400" />
                                    <span>المحفوظة</span>
                                    {savedCount > 0 && (
                                        <span className="ms-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                                            {savedCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )}
                        {dbUser?.role === "office" && (
                            <li>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-text-main hover:bg-surface-hover"
                                >
                                    <LayoutDashboard className="w-5 h-5 text-slate-400" />
                                    <span>لوحة المكتب</span>
                                </Link>
                            </li>
                        )}
                        {user?.email === "hellmyezzat@gmail.com" && (
                            <li>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-text-main hover:bg-surface-hover"
                                >
                                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                                    <span>الإدارة</span>
                                    {adminPending > 0 && (
                                        <span className="ms-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                                            {adminPending}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )}
                        {/* من نحن stays last in the sidebar */}
                        <li>
                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 text-text-main hover:bg-surface-hover"
                            >
                                <Info className="w-5 h-5 text-slate-400" />
                                <span>من نحن</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Guest welcome, pinned to the bottom */}
                    {!loading && !user && (
                        <div className="bg-primary-deep text-white p-5">
                            <p className="font-bold">أهلاً بك في مدار</p>
                            <p className="text-xs text-white/70 mt-1">
                                سجل دخولك لحفظ الوظائف وتفعيل التنبيهات
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 text-center bg-white text-primary font-semibold py-2 px-4 rounded-lg transition shadow-sm text-sm"
                                >
                                    تسجيل
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 text-center border border-white/50 text-white font-medium py-2 px-4 rounded-lg transition hover:bg-white/10 text-sm"
                                >
                                    دخول
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Push preview: test button visible only on Helmy's account */}
                    {user?.email === "hellmyezzat@gmail.com" && (
                        <div className="px-4 pb-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    sendTestNotification();
                                }}
                                className="w-full flex items-center justify-center gap-2 border border-primary/30 text-primary hover:bg-primary/5 py-2 px-4 rounded-xl transition text-sm font-medium cursor-pointer"
                            >
                                جرّب الإشعارات
                            </button>
                        </div>
                    )}

                    {/* Logout */}
                    {user && (
                        <div className="p-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2.5 px-4 rounded-xl transition text-sm font-medium cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    )}
                </aside>
            </div>

            {/* Logout confirmation */}
            {showLogoutConfirm && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6"
                    onClick={() => setShowLogoutConfirm(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="تأكيد تسجيل الخروج"
                        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[320px] flex flex-col gap-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <LogOut className="w-10 h-10 text-red-500 mx-auto" strokeWidth={1.8} />
                        <p className="font-bold text-text-main">متأكد إنك عايز تسجل خروج؟</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setShowLogoutConfirm(false);
                                    setIsOpen(false);
                                    logout();
                                    toast("تم تسجيل الخروج بنجاح");
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition text-sm cursor-pointer"
                            >
                                تسجيل خروج
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 px-4 rounded-xl transition hover:bg-slate-50 text-sm cursor-pointer"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
