import { Tab, Tabs } from '../shared/Tabs';
import Events from './Events';
import News from './News';

const NewsEvents: React.FC = () => {
  return (
    <section className="news-section">
      <h4 className="preheader px-24">Новини та події</h4>
      <div>
        <Tabs>
          <Tab title="Новини">
            <News />
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
