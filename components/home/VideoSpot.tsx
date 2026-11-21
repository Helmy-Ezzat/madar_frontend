import { PlayCircle } from "lucide-react";

/**
 * VIDEO EMBED SPOT
 * A short infographic/explainer video about Madar will be embedded here later.
 * To add it: replace the placeholder div below with the video <iframe> or
 * <video> element, keeping the `aspect-video` wrapper so the layout holds.
 */
export default function VideoSpot() {
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

                {/* VIDEO PLACEHOLDER: swap this div for the video embed when ready */}
                <div className="aspect-video rounded-2xl border-2 border-dashed border-border bg-white flex flex-col items-center justify-center gap-4 text-text-muted">
                    <PlayCircle className="w-16 h-16 text-primary/40" strokeWidth={1.2} />
                    <p className="text-sm md:text-base font-medium">الفيديو التعريفي هيتضاف هنا قريبًا</p>
                </div>
            </div>
        </section>
    );
}
