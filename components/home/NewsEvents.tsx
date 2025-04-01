import { Tab, Tabs } from '../shared/Tabs';
import Events from './Events';
import News from './News';

const NewsEvents = ({textLink="Всі новини", link="/news", titleEvents="Новини та події" }: {textLink?: string, link?: string, titleEvents?: string}) => {
  return (
    <section className="news-section">
      <div className="container mx-auto px-4">
        <h4 className="preheader !text-font-primary">{titleEvents}</h4>
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
