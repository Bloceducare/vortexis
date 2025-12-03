import { Hero } from "@/components/Hero";
import ExploreActiveHackathons from "@/components/ActiveHackatons";
import PlatformOverview from "@/components/PlatformOverview";
import HackathonCTA from "@/components/Hero2";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Hero />
      <PlatformOverview />
      <ExploreActiveHackathons />
      <HowItWorks />
      <HackathonCTA />
    </div>
  );
}
