'use client';

import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useArticles } from '@/utils/hooks/useArticles';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import ArticlesGrid from '@/components/news/ArticlesGrid';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n';

const Events = () => {
  const router = useRouter();
  const t = useTranslations();

  const { articles, loading } = useArticles({
    articleType: ArticleTypeEnum.EVENT,
    pageSize: 3,
  });

  if(loading || !articles) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-y-6">
          <div className="flex justify-end w-full">
            <Button
              variant="tertiary"
              size="small"
              onClick={() => router.push('/events')}
            >
              <span className="flex items-center gap-x-2">
                {t('links.all_events')} <ArrowRightIcon size="20px" />
              </span>
            </Button>
          </div>

          {articles.length > 0
            ? <ArticlesGrid
                articles={articles}
                basePath="/events"
              />
            : <div className='text-center'>{t('articles.articles_empty')}</div>
          }

          
        </div>
      </div>
    </section>
  );
};

export default Events;
