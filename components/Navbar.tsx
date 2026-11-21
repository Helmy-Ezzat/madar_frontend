"use client";

import { useState } from "react";
import {
    Menu,
    X,
    Home,
    Briefcase,
    Building2,
    Info,
    Heart,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { useToast } from "@/components/Toast";
import Logo from "@/components/Logo";

interface NavItem {
    key: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Essentials stay in the top bar; everything else lives in the sidebar.
const topNavItems: NavItem[] = [
    { key: "الرئيسية", href: "/", icon: Home },
    { key: "الوظائف", href: "/jobs", icon: Briefcase },
    { key: "المكاتب", href: "/offices", icon: Building2 },
];

const sidebarNavItems: NavItem[] = topNavItems;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { user, dbUser, logout, loading } = useAuth();
    const toast = useToast();
    const { savedIds } = useSavedJobs();
    const savedCount = user ? savedIds.size : 0;

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
            <header className="sticky top-0 left-0 right-0 z-50 bg-primary text-white py-2 md:py-4 shadow-sm">
                <nav className="px-6 flex items-center justify-between md:justify-around">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center hover:opacity-90 transition-opacity"
                        aria-label="مدار - بحث الوظائف"
                    >
                        <Logo />
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

                    {/* Sidebar trigger: avatar when logged in, menu icon otherwise */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 p-2 -m-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                        aria-label="فتح القائمة"
                    >
                        {loading ? (
                            <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
                        ) : user ? (
                            <span className="relative inline-flex">
                                {avatar}
                                {savedCount > 0 && (
                                    <span className="absolute -top-1 -left-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-primary">
                                        {savedCount}
                                    </span>
                                )}
                            </span>
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>
                </nav>
            </header>

            {/* Sidebar (all screen sizes, slides in from the right) */}
            <div
                data-state={isOpen ? "open" : "closed"}
                className="invisible fixed inset-0 z-50 data-[state=open]:visible"
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
                        <div className="bg-primary text-white p-5">
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
                        <div className="bg-primary text-white p-5">
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
