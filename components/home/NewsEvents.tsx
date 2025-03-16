import { Tab, Tabs } from '../shared/Tabs';
import Events from './Events';
import News from './News';

const NewsEvents: React.FC = () => {
  return (
    <section className="news-section">
      <div className="container mx-auto px-4">
        <h4 className="preheader">Новини та події</h4>
      </div>
      <div>
        <Tabs>
          <Tab title="Новини">
            <News link='/news' textLink='Всі новини'/>
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
