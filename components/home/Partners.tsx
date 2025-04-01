import PartnerForm from './PartnerForm';

const Partners: React.FC = () => {
  return (
    <section className="sponsors">
      <div className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="preheader !text-font-primary">Стати партнером</h4>
          <div className="flex gap-x-[108px] lg:flex-row flex-col">
            <div className="partners-text lg:max-w-[524px] max-w-full">
              <h4 className="text-h4 text-font-accent font-ebGaramond">
                Ми можемо зміцнювати Україну разом
              </h4>
              <p className="text-body text-font-primary">
                Спільними зусиллями ми можемо розвивати освітньо-культурні
                програми та інформаційно-соціальні центри, створювати майданчики
                для зустрічей і співпраці, допомагати та підтримувати одні одних
                та Україну у боротьбі з ворогом нашої держави та у її розбудові.
              </p>
            </div>
            <div className="partners-form">
              <p className="text-body text-grey-700 font-medium">
                Залиште свій email та ми з Вами зв’яжемось
              </p>
              <PartnerForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
