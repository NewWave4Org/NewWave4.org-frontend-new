import Team from "@/components/about/Team";
import OurMission from "@/components/home/OurMission";
import Hero from "@/components/ui/Hero";
import DetailedTextInformation from "@/components/about/DetailedTextInformation";
import { heroData } from "@/data/about/hero";
import { commonData } from "@/data/about/commonData";
import HistoryCard from "@/components/about/HistoryCard";
import HistoryFormation from "@/components/about/HistoryFormation";
import Sponsors from '@/components/home/Sponsors';

const AboutPage = () => {
  // todo: get locale from context
  const locale = 'uk';
  const detailed_text_information = {
    top: commonData[locale].detailed_text_information.top.map((text, i) => <p key={i} className="font-accent">{text}</p>),
    bottom: commonData[locale].detailed_text_information.bottom.map((text, i) => <p key={i} className="font-accent">{text}</p>)
  };

  return (
    <div>
      <Hero data={heroData} />
      <OurMission />
      <DetailedTextInformation text={detailed_text_information} />
      <Team />
      <HistoryCard data={commonData[locale].history_card} />
      <HistoryFormation data={commonData[locale].history_formation} />
      <Sponsors />
    </div>
  );
};

export default AboutPage;
