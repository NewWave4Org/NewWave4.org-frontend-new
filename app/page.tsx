
import JoinCommunity from '@/components/home/JoinCommunity';
import MainSlider from '@/components/home/MainSlider';
import OurMission from '@/components/home/OurMission';
import Sponsors from '@/components/home/Sponsors';

const HomePage = () => {
  return (
    <div>
      <MainSlider />
      <OurMission />
      <Sponsors />
      <JoinCommunity />
    </div>
  );
};

export default HomePage;
