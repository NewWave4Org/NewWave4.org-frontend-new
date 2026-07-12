import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '../icons/social/FacebookIcon';
import { ourTeamProps } from '../about/Team';
import { useLocale } from 'next-intl';
import { typeSocialMediaEnum, typeSocialMediaList } from '@/data/projects/typeSocialMediaList';
import YoutubeIcon from '../icons/social/YoutubeIcon';
import InstagramIcon from '../icons/social/InstagramIcon';
import TelegramIcon from '../icons/social/TelegramIcon';

const MemberTeaser = ({ member }: { member: ourTeamProps }) => {
  const locale = useLocale();
  const lang = locale === 'ua' ? 'UA' : 'ENG';

  const name = member[`sectionTitle${lang}`];
  const location = member[`sectionLocation${lang}`];
  const position = member[`sectionPosition${lang}`];
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === member.typeSocialMedia)?.label;

  return (
    <div className="member-teaser text-center rounded-lg font-helv shadow-[0_4px_12px_0_rgba(180,140,100,0.15)]">
      <div className="relative h-[260px] w-full">
        <Image src={member.files[0]} alt={name} fill className="object-cover rounded-tl-lg rounded-tr-lg" />
      </div>
      <div className="info bg-grey-50 pt-3 min-h-[160px] relative rounded-b-lg">
        <div className="name mb-1 text-primary text-base font-medium">{name}</div>
        <div className="location text-sm text-grey-500 font-normal">{location}</div>
        <div className="position mt-2 mb-[21px] text-primary-500 font-medium">{position}</div>
        {member.socialMediaUrl &&   (
          <div className="social text-left">
            <div className="p-3 rounded-lg shadow-custom bg-grey-100 inline-block absolute left-0 bottom-0">
              <Link target="_blank" href={member.socialMediaUrl}>
                {nameSocialMedia === typeSocialMediaEnum.Facebook && <FacebookIcon size="24" />}
                {nameSocialMedia === typeSocialMediaEnum.Instagram && <InstagramIcon size="24" />}
                {nameSocialMedia === typeSocialMediaEnum.YouTube && <YoutubeIcon size="24" />}
                {nameSocialMedia === typeSocialMediaEnum.Telegram && <TelegramIcon size="24" />}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTeaser;
