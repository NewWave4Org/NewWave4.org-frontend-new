import { useTranslations } from 'next-intl';
import { Tab, Tabs } from '../shared/Tabs';
import Events from './Events';
import News from './News';

const NewsEvents = ({
  textLink = 'links.all_news',
  link = '/news',
  titleEvents = 'sections_title.news_evens',
  projectId,
  className = '',
}: {
  textLink?: string;
  link?: string;
  titleEvents?: string;
  projectId?: number;
  className?: string;
}) => {
  const t = useTranslations();

  return (
    <section className={`${className} news-section`}>
      <div className="container mx-auto px-4">
        <h4 className="preheader !text-font-primary">{t(`${titleEvents}`)}</h4>
      </div>
      <div>
        <Tabs>
          <Tab title={t('tabs.news_tab')}>
            <News link={link} textLink={t(textLink)} projectId={projectId} />
          </Tab>
          <Tab title={t('tabs.events_tab')}>
            <Events />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};

export default NewsEvents;
