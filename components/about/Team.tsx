'use client';

import MemberTeaser from '@/components/shared/MemberTeaser';
import { useTranslations } from 'next-intl';

export interface ourTeamProps {
  contentBlockType: string;
  files: string[];
  id: string;
  sectionLocationENG: string;
  sectionLocationUA: string;
  sectionPositionENG: string;
  sectionPositionUA: string;
  sectionTitleENG: string;
  sectionTitleUA: string;
  socialMediaUrl: string;
  typeSocialMedia: string;
}

const Team = ({ourTeam}: {ourTeam: ourTeamProps[]}) => {

  const t = useTranslations();

  return (
    <section className="team py-14 my-20 bg-skyBlue-300">
      <div className="container px-4 mx-auto">
        <h4 className="preheader mb-10 max-w-[1248px] text-center md:text-left mx-auto !text-font-primary">{t('sections_title.our_team')}</h4>
        <div className="">
          <div className="grid grid-cols-1 lg:gap-12 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {ourTeam.map(member => (
              <MemberTeaser key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
