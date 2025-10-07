'use client';
import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useRouter } from 'next/navigation';

const Events: React.FC = () => {
  const router = useRouter();
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-y-6 w-full">
          <div className="flex justify-end w-full">
            <Button
              disabled
              variant="tertiary"
              size="small"
              onClick={() => router.push('/news')}
            >
              <span className="flex items-center gap-x-2">
                Всі події <ArrowRightIcon size="20px" />
              </span>
            </Button>
          </div>
          <div className="flex gap-x-6 items-center justify-center">
            <div className="text-grey-700 text-quote">
              Незабаром тут будуть події
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
