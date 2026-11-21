/**
 * Intro video section.
 * To swap the video: replace public/videos/madar-hero-promo.mp4 (keeping the
 * same filename) or update the `src` below. Arabic subtitles are burned into
 * the video itself, so no caption track is needed.
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

                <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-white shadow-lg">
                    <video
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
                </div>
            </div>
        </section>
    );
}
