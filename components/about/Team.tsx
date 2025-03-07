
"use client";

import { teamData } from  '@/data/about/team';
import MemberTeaser from '@/components/shared/MemberTeaser';
import EmblaCarousel from '@/components/ui/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';

const Team = () => {
  const data = teamData.uk;
  const options: EmblaOptionsType = { 
    dragFree: true, 
    align: 'start',
    loop: true,
    slidesToScroll: 1,
  };

  const slides = data.team.map((member) => {
    return (
      <MemberTeaser key={member.name} member={member} />
    );
  });

  return (
    <section className="team py-14 my-20 bg-background-secondary">
      <h4 className="preheader mb-10 max-w-[1248px] text-center md:text-left mx-auto">{data.title}</h4>
      <div className="max-w-[1248px] mx-auto">
        <div className="flex team-carousel">
          <EmblaCarousel slides={slides} options={options} />
        </div>
      </div>
    </section>
  );
};

export default Team;