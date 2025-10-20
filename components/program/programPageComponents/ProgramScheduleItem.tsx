import CalendarIcon from '@/components/icons/symbolic/CalendarIcon';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

type Period = 'AM' | 'PM';

interface ITime {
  hour: string;
  minute: string;
  period: Period;
}

interface IDate {
  year: number;
  month: number;
  day: number;
}

interface IScheduleItem {
  date: IDate;
  startTime: ITime;
  endTime: ITime;
  title: string;
  location: string;
}

function ProgramScheduleItem({ scheduleItem }: { scheduleItem: IScheduleItem }) {
  const formattedDate = scheduleItem?.date ? format(new Date(scheduleItem.date.year, scheduleItem.date.month - 1, scheduleItem.date.day), 'd MMMM', { locale: uk }) : '';

  return (
    <div className="schedule-item">
      <div className="flex items-center mb-1">
        <CalendarIcon />
        <span className="ml-4 font-medium text-lg font-helvetica text-font-primary">{formattedDate}</span>
      </div>
      <div className="ml-10 flex items-baseline">
        <div className="min-w-24 mr-2 font-medium text-medium font-helvetica text-font-primary whitespace-nowrap">
          {scheduleItem?.startTime && (
            <>
              {scheduleItem.startTime.hour}
              {scheduleItem.startTime.minute && `:${scheduleItem.startTime.minute}`}
              {scheduleItem.startTime.period && ` ${scheduleItem.endTime.period.toLowerCase()}`}
            </>
          )}
          {scheduleItem?.endTime && (
            <>
              {' - '}
              {scheduleItem.endTime.hour}
              {scheduleItem.endTime.minute !== undefined && `:${scheduleItem.endTime.minute}`}
              {scheduleItem.endTime.period && ` ${scheduleItem.endTime.period.toLowerCase()}`}
            </>
          )}
        </div>
        <div className="flex-1">
          <div className="text-font-primary text-base">{scheduleItem.title}</div>
          <div className="text-grey-700">{scheduleItem.location}</div>
        </div>
      </div>
    </div>
  );
}

export default ProgramScheduleItem;
