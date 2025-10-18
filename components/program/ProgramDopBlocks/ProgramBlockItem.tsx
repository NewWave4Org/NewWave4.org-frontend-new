import Image from 'next/image';
import Link from 'next/link';

interface IProgramBlockItem {
  id: number;
  title: string;
  description: string;
  imageSrc: string[];
}

function ProgramBlockItem({ title, description, imageSrc, id }: IProgramBlockItem) {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6 program-block">
      <Link href={`/program/${id}`} className="bg-white shadow-custom rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg duration-500 ">
        <div className="relative lg:h-[208px] sm:h-[300px] h-[200px]">{imageSrc && imageSrc?.length > 0 && <Image src={imageSrc.toString()} alt={title} fill style={{ objectFit: 'cover' }} />}</div>
        <div className="pt-2 pb-4 px-4 flex flex-col gap-y-2 flex-1">
          <h2 className="text-font-primary text-body font-medium">{title}</h2>
          <p className="text-grey-700 text-info truncate">{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProgramBlockItem;
