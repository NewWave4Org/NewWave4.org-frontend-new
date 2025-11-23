import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface IOurTimeLine {
  year: string;
  title: string;
  text: string;
  editorState: any;
}

const HistoryFormation = ({ ourTimeLine }: { ourTimeLine: IOurTimeLine[] }) => {
  return (
    <section className="history-formation py-14 bg-background-secondary">
      <div className="history-formation__inner">
        <h4 className="preheader mb-10 text-center md:text-left container px-4 mx-auto !text-font-primary">Історія становлення</h4>
        <div className="history-formation__timeline mx-auto w-full md:py-[174px]">
          <div className="history-formation__timeline-dates bg-grey-50 w-full md:h-[180px] py-4 md:py-0">
            <div className="container md:flex justify-between mx-auto px-4">
              {ourTimeLine?.map((event, index) => {
                const ourTimeLineText = convertDraftToHTML(event?.editorState);
                return (
                  <div
                    key={index}
                    className={`md:relative text-center text-5xl text-font-accent font-bold leading-[1.2] w-full md:max-w-[170px] font-ebGaramond mb-8 ${index % 2 === 0 ? 'md:mb-[112px] md:mt-[10px]' : 'md:mt-[112px]'}`}
                  >
                    <div className="history-formation__timeline-date">{event.year}</div>
                    <div
                      className={`history-formation__timeline-info text-center md:text-left md:absolute w-full flex items-start flex-col md:min-h-[140px] md:w-[170px] ${index == 5 ? '-left-[50px]' : 'left-0'} ${
                        index % 2 === 0 ? '-top-[180px]' : '-bottom-[180px]'
                      } ${index < 3 ? 'lg:left-[70px]' : 'md:right-0'}`}
                    >
                      <h4 className="text-xl font-semibold text-font-primary mb-4">{event.title}</h4>
                      <p className="text-base text-font-primary w-full leading-[1.5] font-normal min-h-[96px] font-helv" dangerouslySetInnerHTML={{ __html: ourTimeLineText }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryFormation;
