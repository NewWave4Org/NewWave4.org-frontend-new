interface HeroData {
  title: string;
  img: string;
}

interface HeroProps {
  data: {
    uk: HeroData;
    en: HeroData | null;
  };
}