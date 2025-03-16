const WhoWeAre: React.FC = () => {
  return (
    <div className="whoWeAre">
      <section className="flex lg:flex-row flex-col">
        <div className=" bg-background-secondary flex-1 flex lg:justify-end justify-center">
          <div className="lg:max-w-[708px] max-w-full md:py-12 md:px-24 py-6 px-12">
            <div className="container">
              <h2 className="text-h2 text-font-primary font-ebGaramond">
                Всеамериканська громадська Організація «Нова Українська Хвиля»
              </h2>
            </div>
          </div>
        </div>
        <div className=" bg-font-white items-center flex-1 flex justify-start">
          <div className="lg:max-w-[732px] max-w-full md:px-24 md:py-12 py-6 px-12">
            <div className="container">
              <p className="text-body text-font-primary">
                <span className="text-body text-font-secondary font-medium">
                  Ми —
                </span>{' '}
                громадська організація, створена на основі спільності інтересів
                насамперед вихідців з України останньої еміґраційної четвертої хвилі,
                сприяємо відродженню духу національної єдності, збереженню українських
                звичаїв і традицій, утвердженню української національної ідеї, захисту
                політичних, культурних та історичних здобутків українського народу.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;
