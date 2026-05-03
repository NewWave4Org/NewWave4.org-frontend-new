'use client';

import { convertDraftToHTML } from "@/components/TextEditor/utils/convertDraftToHTML";
import { Link } from "@/i18n";
import { ArticleType, ArticleTypeEnum } from "@/utils/ArticleType";
import { Locale } from "next-intl";
import Image from "next/image";

interface IProgramBlockItem {
  id: number;
  title: string;
  description: any;
  imageSrc: string[];
  link: ArticleType;
  locale: Locale
}

function DopBlockItem({ title, description, imageSrc, id, link, locale }: IProgramBlockItem) {
  const curLink = link === `${ArticleTypeEnum.EVENT}`.toLowerCase() ? `${ArticleTypeEnum.EVENTS}`.toLowerCase() : link.toLowerCase();
  const newDescription = convertDraftToHTML(description, locale);

  return (
      <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6 program-block">
        <Link href={`/${curLink}/${id}`} className="bg-white shadow-custom rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg duration-500 ">
          <div className="relative lg:h-[208px] sm:h-[300px] h-[200px]">
            {imageSrc && imageSrc?.length > 0 && <Image src={imageSrc.toString()} alt={title} fill style={{ objectFit: 'cover' }} />}
            </div>
          <div className="pt-2 pb-4 px-4 flex flex-col gap-y-2 flex-1">
            <h2 className="text-font-primary text-body font-medium">{title}</h2>
            <div className="text-grey-700 text-info line-clamp-3" dangerouslySetInnerHTML={{ __html: newDescription }} />
          </div>
        </Link>
      </div>
    );
}

export default DopBlockItem;