'use client';
// import { prefix } from '@/utils/prefix';
import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useRouter } from 'next/navigation';
import Card from '../shared/Card';
import { useEffect, useState } from 'react';
import HttpMethod from '@/utils/http/enums/http-method';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { ApiEndpoint } from '@/utils/http/enums/api-endpoint';

interface NewsProps {
  title?: string;
  link: string;
  textLink: string;
}

interface NewsApiResponse {
  content: Article[];
  totalElements: number;
}

interface ContentBlock {
  contentBlockType: string;
  data: any;
}

interface Article {
  id: number;
  title: string;
  contentBlocks: ContentBlock[];
  publishedAt: string;
}

interface PreparedArticle {
  id: number;
  title: string;
  text: string;
  imageSrc: string;
  publishedAt: string;
}

const prepareArticle = (article: Article): PreparedArticle => {
  const mainTextBlock = article.contentBlocks.find(
    block =>
      block.contentBlockType === 'MAIN_NEWS_BLOCK' ||
      block.contentBlockType === 'TEXT',
  );
  const text = mainTextBlock ? mainTextBlock.data : '';

  const photoBlock = article.contentBlocks.find(
    block => block.contentBlockType === 'PHOTO' && block.data,
  );

  const imageSrc = photoBlock
    ? typeof photoBlock.data === 'string'
      ? photoBlock.data
      : Array.isArray(photoBlock.data)
      ? photoBlock.data[0]
      : ''
    : '';

  return {
    id: article.id,
    title: article.title,
    text,
    imageSrc,
    publishedAt: article.publishedAt,
  };
};

// const news = [
//   {
//     id: 1,
//     src: `${prefix}/news/news1.jpg`,
//     title: 'Зустріч українців Брукліна з сенатором Шумером',
//     text: '10 жовтня, відбулася зустріч представників української і проукраїнської громади цієї околиці Брукліна, НЙ з  найбільш впливовим сенатором-демократом Чаком Шумером. Його реакція на дії Путіна в Україні і, на терористичні атаки московських окупантів, здійснені у ці дні, була такою ж сповненою гніву, як кожного з нас українців. Підготовлені нами питання про визнання Росії – державою-терористом на офіційному рівні, про кваліфікацію воєнних злочинів Росії в Україні геноцидом, про надання ще більше зброї Україні знаходили глибоке розуміння і запевнення в тому, що  він, як справжній друг України, прикладе до цього всіх зусиль.v',
//   },
//   {
//     id: 2,
//     src: `${prefix}/news/news2.jpg`,
//     title:
//       'Український фестиваль втретє відбувся у Брукліні, в районі Брайтона',
//     text: 'Першого червня відбувся наш фестиваль "Ангели тримають небо", зорганізований ВГО "Нова українська хвиля" та заснованою нашою організацією школою українознавства "Нова хвилька". ',
//   },
//   {
//     id: 3,
//     src: `${prefix}/news/news3.jpg`,
//     title: 'Відзначення Дня Злуки в Українському Інституті Америки',
//     text: 'Відзначення Дня Злуки в Українському Інституті Америки, в Нью Йорку, стало також доброю нагодою висловити вдячність Постійному Представникові України до ООН Сергію Кислиці за його вагомий внесок у боротьбі за Українські інтереси на дипломатичному фронті та за чудову співпрацю з громадою.',
//   },
// ];

const News: React.FC<NewsProps> = ({ title = false, link, textLink }) => {
  const router = useRouter();
  const [articles, setArticles] = useState<PreparedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;
      const params = {
        // currentPage: page.toString(),
        size: '3',
        articleType: ArticleTypeEnum.NEWS,
        articleStatus: ArticleStatusEnum.PUBLISHED,
      };

      const url = new URL(baseUrl);
      url.search = new URLSearchParams(params).toString();

      const response = await fetch(url, {
        method: HttpMethod.GET,
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`Помилка завантаження новин: ${response.status}`);
      }

      const data: NewsApiResponse = await response.json();
      console.log('data');
      console.log(data);
      const prepared = data.content.map(prepareArticle);
      setArticles(prepared);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Сталася невідома помилка');
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className=" flex flex-col gap-y-6">
          <div
            className={`flex  w-full ${
              title ? 'justify-between items-center' : 'justify-end'
            }`}
          >
            {title && <div className="font-preheader uppercase">{title}</div>}
            <Button
              variant="tertiary"
              size="small"
              onClick={() => router.push(`${link}`)}
            >
              <span className="flex items-center gap-x-2">
                {textLink} <ArrowRightIcon size="20px" color="#3D5EA7" />
              </span>
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row m-[-12px]">
            {loading ? (
              <div className="w-full text-center py-8 text-gray-500">
                Завантаження новин...
              </div>
            ) : error ? (
              <div className="w-full text-center py-8 text-red-500">
                {error}
              </div>
            ) : (
              articles.map(article => (
                <div
                  className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6"
                  key={article.id}
                >
                  <Card
                    link={`/news/${article.id}`}
                    imageSrc={article.imageSrc || undefined}
                    title={article.title}
                    text={article.text}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
