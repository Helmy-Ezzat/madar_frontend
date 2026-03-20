'use client';
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface FilterAccordionProps { title: string, children: React.ReactNode, defaultOpen?: boolean }

export default function FilterAccordion({ title, children, defaultOpen = false }: FilterAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [showAll, setShowAll] = useState(false);

    const childrenArray = React.Children.toArray(children);
    const hasMore = childrenArray.length > 6;

    return (
        <div className="border-b border-icon-bg last:border-0">
            <div
                onClick={() => setIsOpen(!isOpen)}
                data-state={isOpen ? "open" : "closed"}
                className="group px-5 py-2 lg:py-0 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
                <div className="text-sm group-data-[state=open]:font-bold">{title}</div>

                <ChevronDown
                    className="duration-300 ease-in-out w-6 h-6 -rotate-90 group-data-[state=open]:rotate-0 text-[#828A93]"
                />
            </div>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div>
                    {showAll ? <>
                        {childrenArray}
                    </> : <>
                        {childrenArray.slice(0, 6)}
                    </>}
                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full text-left px-5 py-2 text-xs text-primary font-regular underline mt-1 text-slate-300 cursor-pointer"
                        >
                            {showAll ? "" : "عرض المزيد"}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}