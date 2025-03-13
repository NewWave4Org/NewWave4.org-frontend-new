import OurMission from "@/components/home/OurMission";
import Hero from "@/components/ui/Hero";
import DetailedTextInformation from "@/components/about/DetailedTextInformation";
import { heroData } from "@/data/about/hero";
import { commonData } from "@/data/about/commonData";

const AboutPage = () => {
  const detailed_text_information = {
    top: commonData.uk.detailed_text_information.top.map((text, i) => <p key={i} className="font-accent">{text}</p>),
    bottom: commonData.uk.detailed_text_information.bottom.map((text, i) => <p key={i} className="font-accent">{text}</p>)
  };

  return (
    <div>
      <Hero data={heroData} />
      <OurMission />
      <DetailedTextInformation text={detailed_text_information} />
    </div>
  );
};

export default AboutPage;
