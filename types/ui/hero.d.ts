interface HeroData {
  title: string;
  img: string;
}

interface HeroProps {
  baseClassname?: string;
  data: {
    uk: HeroData;
    en: HeroData | null;
  };
}