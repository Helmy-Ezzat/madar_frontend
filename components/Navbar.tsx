"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

    return (
        <>
            <header
                className="sticky top-0 left-0 right-0 z-50 bg-primary text-white py-2 md:py-4"
            >
                <nav className="px-6  flex items-center justify-between md:justify-around flex-row-reverse md:flex-row">
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
                    className="fixed h-[100dvh] w-[260px] px-4 pt-8 pb-10 flex flex-col  justify-between bg-white rtl:translate-x-full -translate-x-full data-[state=open]:translate-x-0 rtl:data-[state=open]:translate-x-0 duration-200 transition-[translate] overflow-y-scroll overscroll-contain border-white/10 dark:border-white/5 ltr:border-r rtl:border-l backdrop-blur-md"
                >
                    <ul className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <li key={item.key} className="px-2">
                                <a
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-3 px-4 rounded-2xl transition-all duration-200`}
                                >
                                    {item.key}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

        </>
    );
}
