'use client';
import { prefix } from '@/utils/prefix';
import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useRouter } from 'next/navigation';
import Card from '../shared/Card';
import Link from 'next/link';

const news = [
  {
    id: 1,
    src: `${prefix}/news/news1.jpg`,
    title: 'Зустріч українців Брукліна з сенатором Шумером',
    text: '10 жовтня, відбулася зустріч представників української і проукраїнської громади цієї околиці Брукліна, НЙ з  найбільш впливовим сенатором-демократом Чаком Шумером. Його реакція на дії Путіна в Україні і, на терористичні атаки московських окупантів, здійснені у ці дні, була такою ж сповненою гніву, як кожного з нас українців. Підготовлені нами питання про визнання Росії – державою-терористом на офіційному рівні, про кваліфікацію воєнних злочинів Росії в Україні геноцидом, про надання ще більше зброї Україні знаходили глибоке розуміння і запевнення в тому, що  він, як справжній друг України, прикладе до цього всіх зусиль.v',
    link: '/news',
  },
  {
    id: 2,
    src: `${prefix}/news/news2.jpg`,
    title:
      'Український фестиваль втретє відбувся у Брукліні, в районі Брайтона',
    text: 'Першого червня відбувся наш фестиваль "Ангели тримають небо", зорганізований ВГО "Нова українська хвиля" та заснованою нашою організацією школою українознавства "Нова хвилька". ',
    link: '/news',
  },
  {
    id: 3,
    src: `${prefix}/news/news3.jpg`,
    title: 'Відзначення Дня Злуки в Українському Інституті Америки',
    text: 'Відзначення Дня Злуки в Українському Інституті Америки, в Нью Йорку, стало також доброю нагодою висловити вдячність Постійному Представникові України до ООН Сергію Кислиці за його вагомий внесок у боротьбі за Українські інтереси на дипломатичному фронті та за чудову співпрацю з громадою.',
    link: '/news',
  },
];

const News: React.FC = () => {
  const router = useRouter();
  return (
    <section className="px-24 flex flex-col gap-y-6 w-fit">
      <div className="flex justify-end w-full">
        <Button
          variant="tertiary"
          size="small"
          onClick={() => router.push('/news')}
        >
          <span className="flex items-center gap-x-2">
            Всі новини <ArrowRightIcon size="20px" />
          </span>
        </Button>
      </div>
      <div className="flex gap-x-6">
        {news.map(card => (
          <Link key={card.id} href={card.link}>
            <Card imageSrc={card.src} title={card.title} text={card.text} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default News;
