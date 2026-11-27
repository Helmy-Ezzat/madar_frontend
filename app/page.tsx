export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import LatestJobs from "@/components/home/LatestJobs";
import HowItWorks from "@/components/home/HowItWorks";
import BrowseSections from "@/components/home/BrowseSections";
import WhyMadar from "@/components/home/WhyMadar";
import VideoSpot from "@/components/home/VideoSpot";
import CtaSection from "@/components/home/CtaSection";
import OfficesSection from "@/components/OfficesSection";
import StatsStripSkeleton from "@/components/home/skeleton/StatsStripSkeleton";
import LatestJobsSkeleton from "@/components/home/skeleton/LatestJobsSkeleton";
import BrowseSectionsSkeleton from "@/components/home/skeleton/BrowseSectionsSkeleton";
import OfficesSectionSkeleton from "@/components/home/skeleton/OfficesSectionSkeleton";

export default function Home() {
   return (
      <>
         <Hero />
         <VideoSpot />
         <Suspense fallback={<StatsStripSkeleton />}>
            <StatsStrip />
         </Suspense>
         <Suspense fallback={<LatestJobsSkeleton />}>
            <LatestJobs />
         </Suspense>
         <HowItWorks />
         <Suspense fallback={<BrowseSectionsSkeleton />}>
            <BrowseSections />
         </Suspense>
         <WhyMadar />
         <Suspense fallback={<OfficesSectionSkeleton />}>
            <OfficesSection />
         </Suspense>
         <CtaSection />
      </>
   );
}
