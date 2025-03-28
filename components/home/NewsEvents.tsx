import { Tab, Tabs } from '../shared/Tabs';
import Events from './Events';
import News from './News';

const NewsEvents = ({textLink="Всі новини", link="/news"}: {textLink?: string, link?: string}) => {
  return (
    <section className="news-section">
      <div className="container mx-auto px-4">
        <h4 className="preheader">Новини та події</h4>
      </div>
      <div>
        <Tabs>
          <Tab title="Новини">
            <News link={link} textLink={textLink} />
          </Tab>
          <Tab title="Події">
            <Events />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};

export default NewsEvents;
