import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import Button from '@/components/shared/Button';

interface IDateProgram {
  year: number;
  month: number;
  day: number;
}

interface IProgramFirstBlocks {
  title: string;
  description: string;
  dateProgram: {
    from: IDateProgram;
    to: IDateProgram;
  };
}

function ProgramFirstBlocks({ title, description, dateProgram }: IProgramFirstBlocks) {
  const router = useRouter();

  const dateNumberFormatFrom = new Date(dateProgram.from.year, dateProgram.from.month - 1, dateProgram.from.day);
  const dateNumberFormatTo = new Date(dateProgram.to.year, dateProgram.to.month - 1, dateProgram.to.day);
  const formattedDateFrom = format(new Date(dateNumberFormatFrom), 'd MMMM', { locale: uk });
  const formattedDateTo = format(new Date(dateNumberFormatTo), 'd MMMM', { locale: uk });

  return (
    <section className="flex lg:flex-row flex-col lg:mb-20 mb-10">
      <div className=" bg-background-secondary flex-1 flex lg:justify-end justify-center">
        <div className="lg:max-w-[708px] max-w-full md:py-12 md:px-24 py-6 px-12">
          <div className="container">
            <h2 className="lg:text-h2 text-h5 text-font-primary font-ebGaramond">{title}</h2>
          </div>
        </div>
      </div>
      <div className=" bg-font-white items-center flex-1 flex justify-start relative">
        <span className="bg-accent-300 rounded-tr-[4px] rounded-br-[4px] font-helv text-base text-font-primary py-1.5 px-4 font-medium absolute left-0 top-8">{`${formattedDateFrom} - ${formattedDateTo}`}</span>
        <div className="lg:max-w-[732px] max-w-full w-full md:px-24 md:py-[70px] pt-[100px] pb-[50px] px-12 ">
          <div className="container">
            <p className="text-body text-font-primary">{description}</p>
            <div className="mt-4 flex">
              <Button size="large" className="flex justify-self-center" onClick={() => router.push('/donation')}>
                Donate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgramFirstBlocks;
