'use client';
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowBigLeft, ArrowBigRight, FilterIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ActiveFilters from "./ActiveFilters";

export default function FilterDrawerSidbar({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const dragControls = useDragControls();
    const searchParams = useSearchParams();

    // Close drawer when filters change (URL updates)
    useEffect(() => {
        setIsOpen(false);
    }, [searchParams]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col sticky top-24 h-[724px] bg-white border-t-4 border-primary2 rounded-xl shadow-xl divide-y divide-grey-icon">
                <div className="p-5 sticky top-0">
                    <h3 className="text-lg font-bold">فلترة الوظائف</h3>
                </div>
                <div className="overflow-y-auto overscroll-contain flex-1">
                    {children}
                </div>
            </aside>
            {/* Mobile Filter Rail */}
            <div className="lg:hidden bg-white z-40 border-b border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex shrink-0 items-center gap-2 bg-transparent text-slate-800 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold transition-transform active:scale-95"
                    >
                        <FilterIcon className="w-4 h-4" />
                        <span>الفلاتر</span>
                    </button>
                    <div className="w-px h-6 bg-gray-200 shrink-0 mx-1" />
                    {['location', 'company', 'specialization', 'date_posted'].some(k => searchParams.get(k)) ? (
                        <ActiveFilters minimal={true} />
                    ) : (
                        <div className="flex items-center gap-2">
                            <ArrowBigRight className="w-4 h-4 text-slate-400" />
                            <span className="text-lg text-slate-400 whitespace-nowrap">قم بفلترة الوظائف </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-90 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            drag="y"
                            dragControls={dragControls}
                            dragListener={false}
                            dragConstraints={{ top: 0, bottom: 1000 }}
                            dragElastic={{ top: 0, bottom: 0.5 }}
                            dragMomentum={false}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 10) {
                                    setIsOpen(false);
                                }
                            }}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{
                                y: "100%",
                                transition: { type: "tween", duration: 0.2, ease: "easeIn" }
                            }}
                            transition={{ type: "spring", damping: 40, stiffness: 400, mass: 0.1 }}
                            className="fixed bottom-0 left-0 right-0 h-[75vh] z-100 rounded-t-2xl bg-white flex flex-col overflow-hidden lg:hidden"
                            data-modal="filters-drawer"
                            data-state="open"
                        >
                            {/* Drag Handle */}
                            <div
                                onPointerDown={(e) => dragControls.start(e)}
                                className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
                            >
                                <div className="w-10 h-1 rounded-full bg-gray-300" />
                            </div>

                            <div className="px-5 py-2 border-b border-grey-icon" onPointerDown={(e) => dragControls.start(e)}>
                                <h3 className="text-lg font-bold">فلترة الوظائف</h3>
                            </div>

                            <div className="overflow-y-auto overscroll-contain flex-1">
                                {children}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>


        </>
    );
}