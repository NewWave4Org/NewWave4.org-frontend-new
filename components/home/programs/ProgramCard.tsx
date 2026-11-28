import ArrowRight4Icon from '../../icons/navigation/ArrowRight4Icon';
import Button from '../../shared/Button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LOGO_FALLBACK_SRC } from '@/utils/logo';

type ProgramSlideProps = {
  title: string;
  text: string;
  imgSrc: string;
  alt: string;
  link: string;
};

type ProgramCardProps = {
  slide: ProgramSlideProps;
  onDetailsClick: () => void;
  onDonateClick: () => void;
};

const ProgramCard: React.FC<ProgramCardProps> = ({
  slide,
  onDetailsClick,
  onDonateClick,
}: ProgramCardProps) => {
  const t = useTranslations();

  return (
    <div className="w-full min-w-0 cursor-pointer transition-all duration-300">
      <div className="bg-grey-50 shadow-custom pb-6 rounded-lg">
        <div className="relative w-full h-[183px] rounded-t-lg">
          <Image
            src={slide.imgSrc ? slide.imgSrc : LOGO_FALLBACK_SRC}
            alt={slide.alt ? slide.alt : 'slide image'}
            fill
            className={`object-cover transition-all duration-300 rounded-t-lg`}
          />
        </div>
        <div className="flex flex-col pt-2 pb-4 px-4 gap-y-4">
          <div className="flex flex-col gap-y-4">
            <h4 className="text-body text-font-primary font-medium text-center line-clamp-2">
              {slide.title}
            </h4>
            <p className="text-info h-[112px] overflow-hidden">{slide.text}</p>
          </div>
          <Button
            variant="tertiary"
            size="small"
            className="flex justify-end w-full"
            onClick={() => onDetailsClick()}
          >
            <span className="flex items-center gap-x-2">
              {t('links.more_details')}{' '}
              <ArrowRight4Icon color="#3D5EA7" size="20px" />
            </span>
          </Button>
        </div>

        <Button
          size="large"
          className="flex mx-auto items-center custom-donate-btn"
          onClick={() => onDonateClick()}
        >
          Donate
          <span className="ml-2 duration-500">
            <Image
              src="/icons/Icon_uk-heart.svg"
              width={26}
              height={22}
              alt="icon"
            />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProgramCard;
