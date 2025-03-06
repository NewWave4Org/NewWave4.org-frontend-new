import Team from "@/components/about/Team";
import OurMission from "@/components/home/OurMission";
import Hero from "@/components/ui/Hero";
import { heroData } from "@/data/about/hero";

const AboutPage = () => {
  return (
    <div>
      <Hero data={heroData} />
      <OurMission />
      <Team />
    </div>
  );
};

export default AboutPage;
