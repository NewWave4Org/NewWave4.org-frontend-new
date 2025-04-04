
"use client";

import { teamData } from  '@/data/about/team';
import MemberTeaser from '@/components/shared/MemberTeaser';

const Team = () => {
  const data = teamData.uk;

  return (
    <section className="team py-14 my-20 bg-background-secondary">
      <div className="container px-4 mx-auto">
        <h4 className="preheader mb-10 max-w-[1248px] text-center md:text-left mx-auto !text-font-primary">{data.title}</h4>
        <div className="max-w-[180px] sm:max-w-[392px] md:max-w-[816px] mx-auto">
          <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 md:grid-cols-4">
            { data.team.map((member) => <MemberTeaser key={member.name} member={member} />) }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;