'use client';

import { teamData } from '@/data/about/team';
import MemberTeaser from '@/components/shared/MemberTeaser';

const Team = () => {
  const data = teamData.uk;

  return (
    <section className="team py-14 my-20 bg-skyBlue-300">
      <div className="container px-4 mx-auto">
        <h4 className="preheader mb-10 max-w-[1248px] text-center md:text-left mx-auto !text-font-primary">{data.title}</h4>
        <div className="">
          <div className="grid grid-cols-1 lg:gap-12 gap-6 md:grid-cols-3 sm:grid-cols-2 md:grid-cols-4">
            {data.team.map(member => (
              <MemberTeaser key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
