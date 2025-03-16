import JoinCommunity from '@/components/home/JoinCommunity';
// import MainSlider from '@/components/home/MainSlider';
import OurMission from '@/components/home/OurMission';
import Partners from '@/components/home/Partners';
import Sponsors from '@/components/home/Sponsors';
import HomeVideo from '@/components/home/HomeVideo';
import WhoWeAre from '@/components/home/WhoWeAre';
import NewsEvents from '@/components/home/NewsEvents';
import { prefix } from '@/utils/prefix';
import GeneralSlider from '@/components/generalSlider/GeneralSlider';

const slides = [
  {
    id: 1,
    src: `${prefix}/slider/slide1.png`,
    srchover: `${prefix}/slider/slide1hover.png`,
    alt: 'Slide 1',
    title: 'Фестиваль «Разом до перемоги»',
    text: "Захід об'єднав українців та друзів України для збору коштів, культурного обміну та підтримки української спільноти, яка бореться за незалежність та мир",
    link: '/projects',
  },
  {
    id: 2,
    src: `${prefix}/slider/slide2.jpg`,
    srchover: `${prefix}/slider/slide2hover.png`,
    alt: 'Slide 2',
    title: 'Марш підтримки України у Вашингтоні',
    text: 'Українці та їхні союзники зібралися у столиці США на масовий Марш підтримки України, щоб привернути увагу до важливості міжнародної допомоги та продемонструвати єдність у боротьбі за свободу',
    link: '/projects',
  },
  {
    id: 3,
    src: `${prefix}/slider/slide3.jpg`,
    srchover: `${prefix}/slider/slide3hover.png`,
    alt: 'Slide 3',
    title: 'Співпраця УККА та Посла України до ООН',
    text: 'Представники Українського Конгресового Комітету Америки та Посол України до ООН Сергій Кислиця тісно співпрацювали протягом чотирьохрічної каденції, працюючи над посиленням підтримки України на міжнародній арені',
    link: '/projects',
  },
  {
    id: 4,
    src: `${prefix}/slider/slide4.png`,
    srchover: `${prefix}/slider/slide4hover.png`,
    alt: 'Slide 4',
    title: `Відкриття провулку Ukrainian Way на Брайтоні`,
    text: 'У Нью-Йорку відбулося урочисте відкриття провулку Ukrainian Way на Брайтон-Біч – символу єдності української громади та визнання внеску українців у культурне розмаїття США',
    link: '/projects',
  },
  {
    id: 5,
    src: `${prefix}/slider/slide5.jpg`,
    srchover: `${prefix}/slider/slide5hover.png`,
    alt: 'Slide 5',
    title: 'Зустріч із лідером демократів Чаком Шумером',
    text: 'Під час зустрічі з очільником демократів у Конгресі США Чаком Шумером обговорювалися питання підтримки України, фінансової допомоги та подальшої міжнародної взаємодії для забезпечення безпеки нашої держави',
    link: '/projects',
  },
];

const HomePage = () => {
  return (
    <div>
      <GeneralSlider slides={slides} />
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
