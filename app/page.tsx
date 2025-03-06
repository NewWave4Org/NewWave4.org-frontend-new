import JoinCommunity from '@/components/home/JoinCommunity';
import MainSlider from '@/components/home/MainSlider';
import OurMission from '@/components/home/OurMission';
import Partners from '@/components/home/Partners';
import Sponsors from '@/components/home/Sponsors';
import HomeVideo from '@/components/home/HomeVideo';
import WhoWeAre from '@/components/home/WhoWeAre';
import NewsEvents from '@/components/home/NewsEvents';

const HomePage = () => {
  return (
    <div>
      <MainSlider />
      <WhoWeAre />
      <OurMission />
      <Sponsors />
      <JoinCommunity />
      <Partners />
      <HomeVideo />
      <NewsEvents />
    </div>
  );
};

export default HomePage;
