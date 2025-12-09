import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';

interface HomeVideoProps {
  videoUrl: string;
}

const HomeVideo: React.FC<HomeVideoProps> = ({ videoUrl }) => {
  const embedUrl = convertYoutubeUrlToEmbed(videoUrl);
  if (!embedUrl) {
    return null;
  }
  return (
    <section className="video-section">
      <div className="container mx-auto px-4">
        <div className="video-section__inner">
          <iframe src={embedUrl} allowFullScreen loading="lazy" className="rounded-2xl w-full lg:h-[640px] sm:h-auto aspect-video" />
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
