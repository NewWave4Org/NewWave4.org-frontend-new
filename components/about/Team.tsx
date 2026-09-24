'use client';

import { CSSProperties } from 'react';
import MemberTeaser from '@/components/shared/MemberTeaser';
import { useTranslations } from 'next-intl';
import { useInView } from '@/utils/hooks/useInView';

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

const Team = ({ ourTeam }: { ourTeam: ourTeamProps[] }) => {
  const t = useTranslations();
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`team team-grid bg-skyBlue-300 py-7 my-10 md:py-14 md:my-20 ${
        inView ? 'is-inview' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h4 className="lora-family lg:text-[34px] text-[38px] font-bold !text-font-primary">
            {t('sections_title.our_team')}
          </h4>
          <p className="mt-2 font-helv text-base text-grey-600">
            {t('sections_title.our_team_subtitle')}
          </p>
        </div>

        {/* Compact portrait grid: the whole team fits on one screen. Cards
            cascade in (see `.team-grid` in styles/globals.css, driven by `--i`). */}
        <ul className="list-none grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-6">
          {ourTeam.map((member, index) => (
            <li
              key={member.id}
              className="team-grid__item mb-0 pl-0 before:hidden"
              style={{ '--i': index } as CSSProperties}
            >
              <MemberTeaser member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Team;
