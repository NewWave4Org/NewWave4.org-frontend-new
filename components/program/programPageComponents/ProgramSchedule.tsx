import Image from 'next/image';
import ProgramScheduleItem from './ProgramScheduleItem';

interface IProgramSchedule {
  schedulePoster: string[];
  scheduleTitle: string;
  scheduleInfo: any[] | undefined;
}

function ProgramSchedule({ schedulePoster, scheduleTitle = 'Програма заходів', scheduleInfo }: IProgramSchedule) {
  return (
    <div className="rounded-2xl shadow-inner bg-grey-50">
      <div className="flex">
        {schedulePoster?.length > 0 && (
          <div className="w-1/2 relative">
            <Image src={schedulePoster?.toString()} fill className="object-cover rounded-tl-2xl rounded-bl-2xl" alt="schedulePoster" />
          </div>
        )}
        <div className="w-1/2">
          <div className="p-12">
            <h2 className="font-ebGaramond text-4xl font-semibold mb-8 text-font-primary">{scheduleTitle}</h2>
            <div className="flex flex-col gap-4">
              {scheduleInfo?.map((scheduleItem, index) => (
                <ProgramScheduleItem key={index} scheduleItem={scheduleItem} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramSchedule;
