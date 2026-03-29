'use client';

import { typeSocialMediaEnum } from '@/data/projects/typeSocialMediaList';
import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import LinkBtn from '../shared/LinkBtn';
import FacebookIcon from '../icons/social/FacebookIcon';
import InstagramIcon from '../icons/social/InstagramIcon';
import YoutubeIcon from '../icons/social/YoutubeIcon';
import TelegramIcon from '../icons/social/TelegramIcon';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface IProjectContentLinks {
  index: number;
  siteLink?: string;
  linkSocialMedia?: string;
  nameSocialMedia?: string;
  showLinksInIndex: number | null;
}

function ProjectContentLinks({ index, siteLink, linkSocialMedia, nameSocialMedia, showLinksInIndex }: IProjectContentLinks) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();
  return (
    <>
      <div className="mt-6 text-font-primary text-body">{t('projects_page.learn_more')}</div>
      {showLinksInIndex === index && (siteLink || linkSocialMedia) && (
        <div className="flex gap-x-4 mt-4">
          {siteLink && (
            <LinkBtn href={siteLink} className="px-[30px]" setIsHovered={setIsHovered}>
              <span className="mr-1 text-medium1 inline-block mt-[-2px]">{t('projects_page.on_the_site')}</span>
              <div className="mt-[3px]">
                <ArrowRightIcon size="20" className="hover:duration-500 duration-500" color={isHovered ? 'white' : '#3D5EA7'} />
              </div>
            </LinkBtn>
          )}

          {linkSocialMedia && (
            <LinkBtn href={linkSocialMedia} className="px-[26px]">
              <span className="inline-block mr-1 text-medium1">{t('projects_page.on_the_page')} {nameSocialMedia}</span>
              {nameSocialMedia === typeSocialMediaEnum.Facebook && <FacebookIcon size="24" />}
              {nameSocialMedia === typeSocialMediaEnum.Instagram && <InstagramIcon size="24" />}
              {nameSocialMedia === typeSocialMediaEnum.YouTube && <YoutubeIcon size="24" />}
              {nameSocialMedia === typeSocialMediaEnum.Telegram && <TelegramIcon size="24" />}
            </LinkBtn>
          )}
        </div>
      )}
    </>
  );
}

export default ProjectContentLinks;
