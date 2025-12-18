import Image from 'next/image';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface IOurTimeLine {
  year: string;
  title: string;
  text: string;
  editorState: any;
}

const HistoryFormation = ({ ourTimeLine }: { ourTimeLine: IOurTimeLine[] }) => {
  return (
    <section className="history-formation py-14">
      <div className="history-formation__inner">
        <h4 className="preheader mb-14 text-center md:text-left container px-4 mx-auto !text-font-primary">Історія становлення</h4>

        <div className="container mx-auto px-4">
          <div className="xl:py-[300px] w-full flex xl:flex-row flex-col relative">
            {ourTimeLine?.map((event, index) => {
              const ourTimeLineText = convertDraftToHTML(event?.editorState);
              const iconCircus = `after:content-[""] after:absolute xl:after:w-[8px] after:w-[20px] xl:after:h-[8px] after:h-[20px] after:bg-accent-600 after:z-[1] after:rounded-full xl:after:left-1/2 after:-translate-x-1/2 ${
                index % 2 === 0 ? 'xl:after:-bottom-1 xl:after:top-auto after:top-1/2 after:-right-[36px] after:left-auto' : 'xl:after:-top-1  after:top-1/2 after:-left-4 after:right-auto'
              }`;

              const lineBlock = `xl:after-content-none after:content-[""] after:absolute after:w-[2px] after:h-full xl:after:border-none after:border-[1px] after:border-dashed after:border-primary-900 after:top-0`;

              return (
                <div
                  key={index}
                  className={`relative text-center text-5xl text-font-accent font-bold leading-[1.2] flex-1
                font-ebGaramond xl:border-[1px] border-none xl:border-dashed border-primary-900 xl:mr-0.5 mb-0.5 xl:block flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`xl:absolute relative xl:w-full w-1/2 xl:h-[300px] px-4 xl:border-none border-dashed border-primary-900 xl:py-0 py-6 ${lineBlock} ${
                      index % 2 === 0 ? 'justify-start after:-right-[1px]' : 'justify-end after:-left-[1px]'
                    }`}
                  >
                    <div className={`relative h-full ${iconCircus} flex ${index % 2 === 0 ? 'xl:flex-col-reverse flex-col xl:bottom-[300px] justify-between' : 'flex-col'}`}>
                      <span className={`flex justify-center ${index % 2 === 0 ? 'mt-5 mb-3' : 'mb-5 mt-3'}`}>
                        <Image src="/icons/history-icon.svg" width={35} height={36} alt="icon" />
                      </span>
                      <div className={`history-formation__timeline-date ${index % 2 === 0 ? 'mt-4' : 'mb-4'}`}>{event.year}</div>

                      <div className={`history-formation__timeline-info text-center`}>
                        <h4 className="text-xl font-semibold text-font-primary mb-4 line-clamp-1">{event.title}</h4>
                        <p className="text-base text-font-primary w-full leading-[1.5] font-normal font-helv line-clamp-4" dangerouslySetInnerHTML={{ __html: ourTimeLineText }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryFormation;
