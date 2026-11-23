"use client";

import { useEffect } from "react";

/**
 * Locks body scroll on mobile while the job details modal is open.
 *
 * Replaces the old CSS `body:has(...) { position: fixed }` lock: making the
 * body fixed resets window.scrollY to 0, which both caused a visible jolt
 * when opening a job and lost the list's scroll position on close. This
 * effect pins the body at the current scroll offset instead and restores
 * it on unlock. No-op on desktop (>= lg), where the details panel is a
 * sticky column and the page must stay scrollable.
 */
export default function BodyScrollLock() {
    useEffect(() => {
        if (!window.matchMedia("(max-width: 1023px)").matches) return;

        const scrollY = window.scrollY;
        const { body } = document;
        const previous = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
        };

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";

        return () => {
            body.style.position = previous.position;
            body.style.top = previous.top;
            body.style.width = previous.width;
            body.style.overflow = previous.overflow;
            window.scrollTo(0, scrollY);
        };
    }, []);

    return null;
}
