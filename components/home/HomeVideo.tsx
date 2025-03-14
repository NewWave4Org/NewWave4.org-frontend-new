const HomeVideo: React.FC = () => {
  return (
    <section className="video-section">
      <div className="container mx-auto px-4">
        <div className="video-section__inner">
          <h4 className="preheader">Наші проєкти</h4>
          <div>
            <iframe
              src="https://www.youtube.com/embed/WNMAHLPBUvk?enablejsapi=1"
              allowFullScreen
              loading="lazy"
              className="rounded-2xl w-full lg:h-[640px] sm:h-auto sm:aspect-video"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
