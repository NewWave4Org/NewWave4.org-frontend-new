import React from 'react';
import Image from 'next/image';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface IOurMission {
  id: string;
  contentBlockType: string;
  title: string;
  description: string;
  editorState: any;
}

const ourMissionData = {
  items: [
    {
      icon: `/icons/wheat.svg`,
    },
    {
      icon: `/icons/peace-bird.svg`,
    },
    {
      icon: `/icons/coat-of-arms.svg`,
    },
  ],
};

const OurMission = ({ ourMission }: { ourMission: IOurMission[] }) => {
  return (
    <section className="our-mission py-14 my-20 bg-background-primary">
      <div className="container mx-auto px-4">
        <h3 className="section-title text-h3 text-center text-font-primary mb-10 font-ebGaramond">Наша місія</h3>
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {ourMission?.map((item, index) => {
            const ourMissionDescriptionText = convertDraftToHTML(item?.editorState);
            const icon = ourMissionData.items[index]?.icon;

            return (
              <div key={item.id} className="flex w-full flex-col items-center text-center text-font-primary md:w-1/3 lg:px-12 md:px-6 md:py-0 sm:w-full sm:px-0 sm:py-4">
                <Image src={icon} alt={item.title} width={48} height={48} className="mb-4" />
                <h4 className="mb-3 text-h4 text-2xl font-ebGaramond">{item.title}</h4>
                <p className="text-base" dangerouslySetInnerHTML={{ __html: ourMissionDescriptionText }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurMission;
