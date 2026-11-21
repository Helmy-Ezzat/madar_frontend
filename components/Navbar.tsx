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
    const { user, dbUser, logout, loading } = useAuth();

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
                        className="text-xl font-bold gradient-text flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Image
                            src="/undraw_searching-everywhere_tffi.svg"
                            alt="مدار - بحث الوظائف"
                            className="drop-shadow-xl "
                            width={40}
                            height={40}
                            priority
                        />
                        <span className="gradient-text">مدار</span>
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
                            avatar
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
                data-modal="sidebar-menu"
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
                    {/* Account section */}
                    <div className="bg-primary text-white p-5">
                        <div className="flex items-start justify-between">
                            {loading ? (
                                <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
                            ) : user ? (
                                <div className="flex items-center gap-3">
                                    <div className="[&>div]:w-12 [&>div]:h-12 [&>div]:text-lg [&_img]:w-12 [&_img]:h-12">
                                        {avatar}
                                    </div>
                                    <div className="truncate max-w-[170px]">
                                        <p className="text-sm font-bold truncate">{displayName}</p>
                                        <p className="text-xs text-white/70 truncate">{user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-bold">أهلاً بك في مدار</p>
                                    <p className="text-xs text-white/70 mt-1">
                                        سجل دخولك لحفظ الوظائف وتفعيل التنبيهات
                                    </p>
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
                        {!loading && !user && (
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
                        )}
                    </div>

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

                    {/* Logout */}
                    {user && (
                        <div className="p-4 border-t border-slate-100">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2.5 px-4 rounded-xl transition text-sm font-medium cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    )}
                </aside>
            </div>
        </>
    );
}
