import PartnerForm from './PartnerForm';

const Partners: React.FC = () => {
  return (
    <section className="sponsors">
      <h4 className="preheader">Стати партнером</h4>
      <div className="flex gap-x-[108px]">
        <div className="partners-text">
          <h4 className="text-h4 text-font-accent font-baskervville">
            Ми можемо зміцнювати Україну разом
          </h4>
          <p className="text-body text-font-primary">
            Спільними зусиллями ми можемо розвивати освітньо-культурні програми
            та інформаційно-соціальні центри, створювати майданчики для
            зустрічей і співпраці, допомагати та підтримувати одні одних та
            Україну у боротьбі з ворогом нашої держави та у її розбудові.
          </p>
        </div>
        <div className="partners-form">
          <p className="text-body text-grey-700">
            Залиште свій email та ми з Вами зв’яжемось
          </p>
          <PartnerForm />
        </div>
      </div>
    </section>
  );
};

export default Partners;
