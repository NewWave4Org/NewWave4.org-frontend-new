import JoinCommunity from '@/components/home/JoinCommunity';
import MainSlider from '@/components/home/MainSlider';
import OurMission from '@/components/home/OurMission';
import Partners from '@/components/home/Partners';
import Sponsors from '@/components/home/Sponsors';

const HomePage = () => {
  return (
    <div>
      <MainSlider />
      <OurMission />
      <Sponsors />
      <JoinCommunity />
      <Partners />
    </div>
  );
};

export default HomePage;
