"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface NavItems {
    key: string;
    href: string;
}

const navItems: NavItems[] = [
    { key: "الرئيسية", href: "/" },
    { key: "الوظائف", href: "/jobs" },
    { key: "المكاتب", href: "/offices" },
    { key: "من نحن", href: "/about" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, dbUser, logout, loading } = useAuth();

    return (
        <>
            <header
                className="sticky top-0 left-0 right-0 z-50 bg-primary text-white py-2 md:py-4 shadow-sm"
            >
                <nav className="px-6 flex items-center justify-between md:justify-around flex-row-reverse md:flex-row">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex p-4 -my-4 md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu size={20} />
                    </button>
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
                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    className={`text-sm transition-colors hover:underline`}
                                >
                                    {item.key}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={32}
                                            height={32}
                                            referrerPolicy="no-referrer"
                                            className="w-8 h-8 rounded-full border border-white/30 object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                                            {(user.displayName || dbUser?.displayName || user.email || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium truncate max-w-[120px]">
                                        {user.displayName || dbUser?.displayName || "مستخدم"}
                                    </span>
                                </div>
                                <Link
                                    href="/saved"
                                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
                                >
                                    المحفوظة
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition cursor-pointer"
                                    title="تسجيل الخروج"
                                >
                                    خروج
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-sm text-white/90 border border-white/50 hover:border-border transition font-medium px-3 py-1.5 rounded-lg"
                                >
                                    دخول
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm bg-white text-primary  font-medium px-4 py-1.5 rounded-lg transition shadow-sm"
                                >
                                   تسجيل
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
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

                <nav
                    data-state={isOpen ? "open" : "closed"}
                    className="fixed h-[100dvh] w-[260px] px-4 pt-8 pb-10 flex flex-col justify-between bg-white rtl:translate-x-full -translate-x-full data-[state=open]:translate-x-0 rtl:data-[state=open]:translate-x-0 duration-200 transition-[translate] overflow-y-scroll overscroll-contain border-white/10 dark:border-white/5 ltr:border-r rtl:border-l backdrop-blur-md"
                >
                    <ul className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <li key={item.key} className="px-2">
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-3 px-4 rounded-2xl transition-all duration-200 text-text-main hover:bg-surface-hover`}
                                >
                                    {item.key}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Auth Button */}
                    <div className="pt-4 border-t border-slate-100 px-2">
                        {loading ? null : user ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 px-3 py-2 text-text-main">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={36}
                                            height={36}
                                            referrerPolicy="no-referrer"
                                            className="w-9 h-9 rounded-full border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                            {(user.displayName || dbUser?.displayName || user.email || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="truncate">
                                        <p className="text-sm font-medium truncate">{user.displayName || dbUser?.displayName || "مستخدم"}</p>
                                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/saved"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center text-primary hover:bg-primary/5 py-2.5 px-4 rounded-xl transition text-sm font-medium"
                                >
                                    الوظائف المحفوظة
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-center text-red-500 hover:bg-red-50 py-2.5 px-4 rounded-xl transition text-sm font-medium cursor-pointer"
                                >
                                    تسجيل الخروج
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center bg-primary text-white py-2.5 px-4 rounded-xl font-medium transition hover:bg-primary-hover text-sm shadow-sm"
                                >
                                   تسجيل
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center border border-border text-text-main py-2.5 px-4 rounded-xl font-medium transition hover:bg-surface-hover text-sm"
                                >
                                   دخول
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </>
    );
}
