const HomeVideo: React.FC = () => {
  return (
    <section className="video-section">
      <h4 className="preheader">Наші проєкти</h4>
      <iframe
        src="https://www.youtube.com/embed/WNMAHLPBUvk?enablejsapi=1"
        allowFullScreen
        width={1246}
        height={640}
        loading="lazy"
        className="rounded-2xl"
      />
    </section>
  );
};

export default HomeVideo;
