const WhoWeAre: React.FC = () => {
  return (
    <section className="flex ">
      <div className="w-[708px] bg-background-secondary py-12 px-24">
        <h2 className="text-h2 text-font-primary font-ebGaramond">
          Всеамериканська громадська Організація «Нова Українська Хвиля»
        </h2>
      </div>
      <div className="w-[732px] bg-font-white flex items-center px-24">
        <p className="text-body text-font-primary font-medium">
          Ми — громадська організація, створена на основі спільності інтересів
          насамперед вихідців з України останньої еміґраційної четвертої хвилі,
          сприяємо відродженню духу національної єдності, збереженню українських
          звичаїв і традицій, утвердженню української національної ідеї, захисту
          політичних, культурних та історичних здобутків українського народу.
        </p>
      </div>
    </section>
  );
};

export default WhoWeAre;
