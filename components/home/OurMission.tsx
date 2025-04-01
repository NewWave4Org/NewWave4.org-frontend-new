import React from 'react';
import Image from 'next/image';
import { ourMissionData } from '@/data/home/ourMissionData';

const OurMission = () => {
  const data = ourMissionData.uk;

  return (
    <section className="our-mission py-14 my-20 bg-background-primary">
      <div className="container mx-auto px-4">
        <h3 className="section-title text-h3 text-center text-font-primary mb-10 font-ebGaramond">{data.title}</h3>
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {data.items.map((item) => {
            return (
              <div key={item.title} className="flex w-full flex-col items-center text-center text-font-primary md:w-1/3 lg:px-12 md:px-6 md:py-0 sm:w-full sm:px-0 sm:py-4">
                <Image src={item.icon} alt={item.title} width={48} height={48} className="mb-4" />
                <h4 className="mb-3 text-h4 text-2xl font-ebGaramond">{item.title}</h4>
                <p className="text-base">{item.description}</p>
              </div>
          );})}
        </div>
      </div>
    </section>
  );
};

export default OurMission;