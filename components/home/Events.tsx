'use client';

import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useRouter } from 'next/navigation';
import { useArticles } from '@/utils/hooks/useArticles';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import ArticlesGrid from '@/components/news/ArticlesGrid';
import { useTranslations } from 'next-intl';

const Events = () => {
  const router = useRouter();
  const t = useTranslations();

  const { articles, loading } = useArticles({
    articleType: ArticleTypeEnum.EVENT,
    limit: 3,
  });

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

          <ArticlesGrid
            articles={articles}
            loading={loading}
            basePath="/events"
          />
        </div>
      </div>
    </section>
  );
};

export default Events;
