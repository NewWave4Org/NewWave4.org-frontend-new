const HomeVideo: React.FC = () => {
  return (
    <section className="video-section">
      <div className="container mx-auto px-4">
        <div className="video-section__inner">
          <h4 className="preheader !text-font-primary">Наші проєкти</h4>
          <div>
            <iframe
              src="https://www.youtube.com/embed/77mC1d9QKRQ"
              allowFullScreen
              loading="lazy"
              className="rounded-2xl w-full lg:h-[640px] sm:h-auto aspect-video"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
