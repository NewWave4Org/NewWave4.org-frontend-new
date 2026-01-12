import Image from 'next/image';
import ProgramScheduleItem from './ProgramScheduleItem';
import { useTranslations } from 'next-intl';

interface IProgramSchedule {
  schedulePoster: string[];
  scheduleTitle: string;
  scheduleInfo: any[] | undefined;
}

function ProgramSchedule({ schedulePoster, scheduleTitle, scheduleInfo }: IProgramSchedule) {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4">
      <div className="lg:mb-20 mb-10">
        <div className="rounded-2xl shadow-inner bg-grey-50">
          <div className="flex lg:min-h-[867px] lg:flex-nowrap flex-wrap">
            {schedulePoster?.length > 0 && (
              <div className="lg:w-[49%] w-full relative">
                <Image src={schedulePoster?.toString()} fill className="object-cover rounded-tl-2xl lg:rounded-bl-2xl lg:rounded-tr-none rounded-tr-2xl !relative" alt="schedulePoster" />
              </div>
            )}
            <div className="flex-1 w-full">
              <div className="p-12">
                <h2 className="font-ebGaramond text-4xl font-semibold mb-8 text-font-primary">{scheduleTitle ? scheduleTitle : `${t('program_page.schedule_title')}`}</h2>
                <div className="flex flex-col gap-4">
                  {scheduleInfo?.map((scheduleItem, index) => (
                    <ProgramScheduleItem key={index} scheduleItem={scheduleItem} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramSchedule;
