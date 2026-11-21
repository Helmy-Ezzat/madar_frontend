export const dynamic = 'force-dynamic';

import Hero from "@/components/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import LatestJobs from "@/components/home/LatestJobs";
import HowItWorks from "@/components/home/HowItWorks";
import BrowseSections from "@/components/home/BrowseSections";
import WhyMadar from "@/components/home/WhyMadar";
import VideoSpot from "@/components/home/VideoSpot";
import CtaSection from "@/components/home/CtaSection";
import OfficesSection from "@/components/OfficesSection";

export default function Home() {
   return (
      <>
         <Hero />
         <StatsStrip />
         <LatestJobs />
         <HowItWorks />
         <BrowseSections />
         <WhyMadar />
         <VideoSpot />
         <OfficesSection />
         <CtaSection />
      </>
   );
}
