import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import SocialButtons from '@/components/socialButtons/SocialButtons';
import NewsQuote from '@/components/news/NewsQuote';
import GeneralSlider from '@/components/generalSlider/GeneralSlider';
import News from '@/components/home/News';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import CalendarIcon from '@/components/icons/symbolic/CalendarIcon';



export async function generateStaticParams() {
  const newsIds = ['1', '2', '3'];

  return newsIds.map((id) => ({
    newsId: id,
  }));
}


const slides = [
  {
    id: 1,
    src: `${prefix}/slider/slide1.png`,
    srchover: `${prefix}/slider/slide1hover.png`,
    alt: 'Slide 1',
    title: 'Фестиваль «Разом до перемоги»',
    text: "Захід об'єднав українців та друзів України для збору коштів, культурного обміну та підтримки української спільноти, яка бореться за незалежність та мир",
    link: '/projects',
  },
  {
    id: 2,
    src: `${prefix}/slider/slide2.jpg`,
    srchover: `${prefix}/slider/slide2hover.png`,
    alt: 'Slide 2',
    title: 'Марш підтримки України у Вашингтоні',
    text: 'Українці та їхні союзники зібралися у столиці США на масовий Марш підтримки України, щоб привернути увагу до важливості міжнародної допомоги та продемонструвати єдність у боротьбі за свободу',
    link: '/projects',
  },
  {
    id: 3,
    src: `${prefix}/slider/slide3.jpg`,
    srchover: `${prefix}/slider/slide3hover.png`,
    alt: 'Slide 3',
    title: 'Співпраця УККА та Посла України до ООН',
    text: 'Представники Українського Конгресового Комітету Америки та Посол України до ООН Сергій Кислиця тісно співпрацювали протягом чотирьохрічної каденції, працюючи над посиленням підтримки України на міжнародній арені',
    link: '/projects',
  },
  {
    id: 4,
    src: `${prefix}/slider/slide4.png`,
    srchover: `${prefix}/slider/slide4hover.png`,
    alt: 'Slide 4',
    title: `Відкриття провулку Ukrainian Way на Брайтоні`,
    text: 'У Нью-Йорку відбулося урочисте відкриття провулку Ukrainian Way на Брайтон-Біч – символу єдності української громади та визнання внеску українців у культурне розмаїття США',
    link: '/projects',
  },
  {
    id: 5,
    src: `${prefix}/slider/slide5.jpg`,
    srchover: `${prefix}/slider/slide5hover.png`,
    alt: 'Slide 5',
    title: 'Зустріч із лідером демократів Чаком Шумером',
    text: 'Під час зустрічі з очільником демократів у Конгресі США Чаком Шумером обговорювалися питання підтримки України, фінансової допомоги та подальшої міжнародної взаємодії для забезпечення безпеки нашої держави',
    link: '/projects',
  },
];


const Article = () => {
  return (
    <div className="article_page pt-[145px]">
      <div className="container px-4 mx-auto">
        <div className="flex lg:gap-6 md:gap-0 lg:flex-row md:flex-col mb-[56px]">
          <div className="lg:w-[718px] lg:flex-1 md:w-full  lg:mb-0 md:mb-6">
            <Image src={`${prefix}/slider/slide3.jpg`} className="w-full" width={100} height={100} alt="" />
          </div>
          <div className="lg:w-[506px] lg:flex-none md:flex-1 md:w-full flex flex-col justify-between">
            <div className="font-ebGaramond text-h3 text-font-primary mb-6">Зустріч українців Брукліна з сенатором Шумером</div>
            <div>
              <div className='mb-4'>
                <div className="flex items-center mb-1">
                  <div className="mr-2">
                    <UserIcon size="16" color="#7A7A7A" />
                  </div>
                  <span className="text-grey-600 text-small2 inline-block leading-none">Автор</span>
                </div>
                <div className="text-font-primary text-small">Мирослава Роздольська</div>
              </div>
              <div className='mb-4'>
                <div className='flex items-center mb-1'>
                  <div className="mr-2">
                    <CalendarIcon size="16" color="#7A7A7A" />
                  </div>
                  <span className="text-grey-600 text-small2 inline-block leading-none">Дата</span>
                </div>
                <div className='text-font-primary text-small'>17 жовтня 2024</div>
              </div>
            </div>
            <div>
              <div className='text-small text-grey-700 mb-2'>Поділись з друзями</div>
              <SocialButtons />
            </div>
          </div>
        </div>

        <div className='mb-[40px]'>
          <p className='text-font-primary text-body'>
            10 жовтня, відбулася зустріч представників української і проукраїнської громади цієї околиці Брукліна, НЙ з  найбільш впливовим сенатором-демократом Чаком Шумером. Його реакція на дії Путіна в Україні і, на терористичні атаки московських окупантів, здійснені у ці дні, була такою ж сповненою гніву, як кожного з нас українців. Підготовлені нами питання про визнання Росії – державою-терористом на офіційному рівні, про кваліфікацію воєнних злочинів Росії в Україні геноцидом, про надання ще більше зброї Україні знаходили глибоке розуміння і запевнення в тому, що  він, як справжній друг України, прикладе до цього всіх зусиль.
          </p>
        </div>

        <div className='flex lg:gap-6 md:gap-0 lg:flex-row md:flex-col mb-[40px] lg:h-[370px]'>
          <div className="lg:w-[718px] lg:flex-1 md:w-full  lg:mb-0 md:mb-6">
            <Image src={`${prefix}/slider/slide3.jpg`} className="w-full h-full" width={100} height={100} style={{ objectFit: 'cover' }} alt="" />
          </div>
          <div className="lg:w-[506px] lg:flex-none md:flex-1 md:w-full">
            <Image src={`${prefix}/slider/slide3.jpg`} className="w-full h-full" width={100} style={{ objectFit: 'cover' }} height={100} alt="" />
          </div>
        </div>

        <NewsQuote />

        <div className='mb-[56px]'>
          <p>
            Розмова про пришвидшення розгляду еміграційних питань,  зокрема, щодо отримання дозволу на працю для українських біженців також була в числі першочергових. Заторкнули ми і питання   про створення українського освітньо-культурного центру у  Брукліні для потреб громади.
          </p>
        </div>
      </div>

      <div className='mb-[55px]'>
        <GeneralSlider slides={slides} hasLink={false} slideHover={false} />
      </div>

      <div className='mb-[80px] flex justify-center'>
        <iframe
          src="https://www.youtube.com/embed/WNMAHLPBUvk?enablejsapi=1"
          allowFullScreen
          width={1246}
          height={640}
          loading="lazy"
          className="rounded-2xl"
        />
      </div>

      <div className='mb-[80px]'>
        <News title="Інші новини" link='#' textLink="Всі новини Культурного Центру" />
      </div>
    </div>
  );
};




export default Article;