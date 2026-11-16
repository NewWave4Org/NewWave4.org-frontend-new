'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '../icons/social/FacebookIcon';
import { ourTeamProps } from '../about/Team';
import { useLocale } from 'next-intl';
import {
  typeSocialMediaEnum,
  typeSocialMediaList,
} from '@/data/projects/typeSocialMediaList';
import YoutubeIcon from '../icons/social/YoutubeIcon';
import InstagramIcon from '../icons/social/InstagramIcon';
import TelegramIcon from '../icons/social/TelegramIcon';
import LinkedinIcon from '../icons/social/LinkedinIcon';

const socialIcons: Record<string, React.ReactNode> = {
  [typeSocialMediaEnum.Facebook]: <FacebookIcon size="20" />,
  [typeSocialMediaEnum.Instagram]: <InstagramIcon size="20" />,
  [typeSocialMediaEnum.YouTube]: <YoutubeIcon size="20" />,
  [typeSocialMediaEnum.Telegram]: <TelegramIcon size="20" />,
  [typeSocialMediaEnum.Linkedin]: <LinkedinIcon size="20" />,
};

/*
  Compact team card: square portrait, name and role always visible; location
  and the social link live in a footer that slides up over the photo on hover /
  focus, or on tap (phones have no hover, so a tap on the photo toggles it).
  Touch tablets keep it pinned open -- see `.member-card__footer` in globals.css.
*/
const MemberTeaser = ({ member }: { member: ourTeamProps }) => {
  const locale = useLocale();
  const lang = locale === 'ua' ? 'UA' : 'ENG';
  const [isOpen, setIsOpen] = useState(false);

  const name = member[`sectionTitle${lang}`];
  const location = member[`sectionLocation${lang}`];
  const position = member[`sectionPosition${lang}`];
  const nameSocialMedia = typeSocialMediaList.find(
    item => item.value === member.typeSocialMedia,
  )?.label;
  const socialIcon = nameSocialMedia ? socialIcons[nameSocialMedia] : null;

  return (
    <article className="member-card group flex flex-col items-center text-center font-helv">
      <div className="relative w-full max-w-[160px] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1">
        <div
          onClick={() => setIsOpen(open => !open)}
          className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl shadow-[0_4px_14px_0_rgba(15,27,64,0.10)] ring-2 ring-transparent transition-shadow duration-300 group-hover:shadow-[0_12px_28px_0_rgba(15,27,64,0.18)] group-hover:ring-accent-600 group-focus-within:ring-accent-600"
        >
          <Image
            src={member.files[0]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 33vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <div
            data-open={isOpen || undefined}
            className="member-card__footer absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 bg-font-primary/85 px-3 py-2 text-left text-white opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 data-[open]:translate-y-0 data-[open]:opacity-100 max-md:gap-1 max-md:px-2 max-md:py-1.5"
          >
            <span className="truncate text-xs leading-tight max-md:line-clamp-2 max-md:whitespace-normal max-md:text-[11px]">
              {location}
            </span>
            {member.socialMediaUrl && socialIcon && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={member.socialMediaUrl}
                aria-label={`${name} — ${nameSocialMedia}`}
                onClick={e => e.stopPropagation()}
                className="shrink-0 rounded-md bg-white/90 p-1 text-primary-500 transition-colors hover:bg-white"
              >
                {socialIcon}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Phones: name and role each reserve two lines (names are never cut
          off), so cards in a row line up. */}
      <h5 className="mt-3 text-sm font-semibold leading-tight text-font-primary max-md:min-h-[2.5em] sm:text-base">
        {name}
      </h5>
      <p
        title={position}
        className="mt-1 line-clamp-2 text-xs leading-snug text-primary-500 max-md:min-h-[2.75em] sm:text-sm"
      >
        {position}
      </p>
    </article>
  );
};

export default MemberTeaser;
