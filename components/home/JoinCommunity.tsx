import { joinCommunityData } from '@/data/home/joinCommunityData';
import React from 'react';

const JoinCommunity = () => {
  const data = joinCommunityData.uk;

  return (
    <section className="our-mission py-14 my-20 bg-background-secondary">
      <h4 className="preheader mb-10 max-w-[1248px] text-center md:text-left mx-auto">{data.title}</h4>
      <div className="flex flex-col items-top gap-6 md:flex-row md:justify-between max-w-[1248px] mx-auto">
        {data.items.map((item, i) => {
          return (
            <div key={item.title} className="flex w-full flex-col items-center md:w-1/3 px-2 md:px-0">
              <h4 className="mb-4 flex md:justify-items-start items-baseline text-font-accent text-left text-h4 font-ebGaramond gap-4 md:w-full">
                <span className="text-5xl font-bold text-primary-700 leading-[120%]">0{i + 1}</span>
                <span className="text-2xl">{item.title}</span>
              </h4>
              <p className="text-font-primary text-base text-justify">{item.description}</p>
            </div>
        );})}
      </div>
    </section>
  );
};

export default JoinCommunity;