"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

/**
 * Intro video section.
 * - Autoplays muted as soon as the section scrolls into view (IntersectionObserver),
 *   pauses when it leaves the viewport.
 * - "اسمع الفيديو بصوت" overlay button: a user gesture that unmutes + plays with sound.
 * To swap the video: replace public/videos/madar-hero-promo.mp4 (same filename)
 * or update the `src` below. Arabic subtitles are burned into the video itself.
 */
export default function VideoSpot() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [withSound, setWithSound] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        /* autoplay can be blocked before any user interaction; the sound button doubles as a manual play */
                    });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.4 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    const playWithSound = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = false;
        video.volume = 1;
        video.currentTime = 0;
        video.play().catch(() => {});
        setWithSound(true);
    };

    return (
        <section className="py-16 px-4 bg-surface" aria-labelledby="video-heading">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 id="video-heading" className="text-2xl md:text-4xl font-bold text-text-main mb-4">
                        شوف <span className="text-primary">مدار</span> في دقيقة
                    </h2>
                    <p className="text-text-body text-lg max-w-2xl mx-auto">
                        فيديو قصير بيشرح إزاي تلاقي فرصتك على المنصة
                    </p>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-white shadow-lg">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src="/videos/madar-hero-promo.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="metadata"
                        aria-label="فيديو تعريفي عن منصة مدار"
                    />

                    {!withSound && (
                        <button
                            type="button"
                            onClick={playWithSound}
                            className="absolute bottom-16 inset-x-0 mx-auto w-fit flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full font-bold text-base md:text-lg shadow-2xl hover:bg-primary/90 hover:scale-105 transition-all animate-pulse"
                        >
                            <Volume2 className="w-6 h-6" />
                            اسمع الفيديو بصوت
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
