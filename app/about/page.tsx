import Hero from "@/components/ui/Hero";
import { heroData } from "@/data/about/hero";

const AboutPage = () => {
  return (
    <div>
      <Hero data={heroData} />
    </div>
  );
};

export default AboutPage;
