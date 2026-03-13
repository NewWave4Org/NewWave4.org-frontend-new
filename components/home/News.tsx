'use client';

import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useArticles } from '@/utils/hooks/useArticles';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import ArticlesGrid from '@/components/news/ArticlesGrid';
import { useRouter } from '@/i18n';
import { useTranslations } from 'next-intl';

interface NewsProps {
  title?: boolean;
  link: string;
  textLink: string;
  projectId?: number;
}

const News = ({ title = false, link, textLink, projectId }: NewsProps) => {
  const router = useRouter();
  const t = useTranslations();

  const { articles, loading } = useArticles({
    articleType: ArticleTypeEnum.NEWS,
    projectId,
    limit: 3,
  });

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-y-6">
          <div
            className={`flex  w-full ${
              title ? 'justify-between items-center' : 'justify-end'
            }`}
          >
            {title && <div className="font-preheader uppercase">{title}</div>}
            <Button
              variant="tertiary"
              size="small"
              onClick={() =>
                router.push(projectId ? `${link}?projectId=${projectId}` : link)
              }
            >
              <span className="flex items-center gap-x-2">
                {textLink} <ArrowRightIcon size="20px" color="#3D5EA7" />
              </span>
            </Button>
          </div>

          {articles.length > 0
            ? <ArticlesGrid
                articles={articles}
                loading={loading}
                basePath="/news"
              />
            : <div className='text-center'>{t('projects_page.project_news_empty')}</div>
          }

          
        </div>
      </div>
    </section>
  );
};

export default News;
