'use client';

import { typeSocialMediaEnum } from '@/data/projects/typeSocialMediaList';
import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import LinkBtn from '../shared/LinkBtn';
import FacebookIcon from '../icons/social/FacebookIcon';
import InstagramIcon from '../icons/social/InstagramIcon';
import YoutubeIcon from '../icons/social/YoutubeIcon';
import TelegramIcon from '../icons/social/TelegramIcon';
import { useState } from 'react';

interface IProjectContentLinks {
  index: number;
  siteLink?: string;
  linkSocialMedia?: string;
  nameSocialMedia?: string;
  showLinksInIndex: number | null;
}

function ProjectContentLinks({ index, siteLink, linkSocialMedia, nameSocialMedia, showLinksInIndex }: IProjectContentLinks) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <div className="mt-6 text-font-primary text-body">Дізнатися більше:</div>
      {showLinksInIndex === index && (siteLink || linkSocialMedia) && (
        <div className="flex gap-x-4 mt-4">
          {siteLink && (
            <LinkBtn href={siteLink} className="px-[30px]" setIsHovered={setIsHovered}>
              <span className="mr-1 text-medium1 inline-block mt-[-2px]">На сайт школи</span>
              <div className="mt-[3px]">
                <ArrowRightIcon size="20" className="hover:duration-500 duration-500" color={isHovered ? 'white' : '#3D5EA7'} />
              </div>
            </LinkBtn>
          )}

          {linkSocialMedia && (
            <LinkBtn href={linkSocialMedia} className="px-[26px]">
              <span className="inline-block mr-1 text-medium1">На сторінку {nameSocialMedia}</span>
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
