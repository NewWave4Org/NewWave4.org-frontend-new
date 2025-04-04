import JoinCommunity from '@/components/home/JoinCommunity';
import OurMission from '@/components/home/OurMission';
import Partners from '@/components/home/Partners';
import Sponsors from '@/components/home/Sponsors';
import HomeVideo from '@/components/home/HomeVideo';
import WhoWeAre from '@/components/home/WhoWeAre';
import NewsEvents from '@/components/home/NewsEvents';
import GeneralSlider from '@/components/generalSlider/GeneralSlider';
import slides from '@/components/generalSlider/slidesData';
import Programs from '@/components/home/programs/Programs';

const HomePage = () => {
  return (
    <div>
      <GeneralSlider slides={slides} />
      <WhoWeAre />
      <OurMission />
      <Sponsors />
      <Programs />
      <JoinCommunity />
      <Partners />
      <HomeVideo />
      <NewsEvents />
    </div>
  );
};

export default HomePage;
