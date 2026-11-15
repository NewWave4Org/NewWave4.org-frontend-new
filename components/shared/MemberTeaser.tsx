import React from 'react';
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
  Compact team card: square portrait, name and role always visible. From md
  up, location and the social link live in a footer that slides up over the
  photo on hover / focus. Below md there is no hover, so the same data sits in
  an info row under the role instead (the in-photo footer is hidden there);
  each piece renders in exactly one place per breakpoint.
*/
const MemberTeaser = ({ member }: { member: ourTeamProps }) => {
  const locale = useLocale();
  const lang = locale === 'ua' ? 'UA' : 'ENG';

  const name = member[`sectionTitle${lang}`];
  const location = member[`sectionLocation${lang}`];
  const position = member[`sectionPosition${lang}`];
  const nameSocialMedia = typeSocialMediaList.find(
    item => item.value === member.typeSocialMedia,
  )?.label;
  const socialIcon = nameSocialMedia ? socialIcons[nameSocialMedia] : null;
  const hasSocial = Boolean(member.socialMediaUrl && socialIcon);
  const socialLabel = `${name} — ${nameSocialMedia}`;

  return (
    <article className="member-card group flex flex-col items-center text-center font-helv">
      <div className="relative w-full max-w-[160px] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1">
        <div
          data-testid="member-photo"
          className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-[0_4px_14px_0_rgba(15,27,64,0.10)] ring-2 ring-transparent transition-shadow duration-300 group-hover:shadow-[0_12px_28px_0_rgba(15,27,64,0.18)] group-hover:ring-accent-600 group-focus-within:ring-accent-600"
        >
          <Image
            src={member.files[0]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 50vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Footer: location + social, revealed on hover / focus (md+). */}
          <div className="member-card__footer max-md:hidden absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 bg-font-primary/85 px-3 py-2 text-left text-white opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <span className="truncate text-xs leading-tight">{location}</span>
            {hasSocial && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={member.socialMediaUrl}
                aria-label={socialLabel}
                className="shrink-0 rounded-md bg-white/90 p-1 text-primary-500 transition-colors hover:bg-white"
              >
                {socialIcon}
              </Link>
            )}
          </div>
        </div>
      </div>

      <h5 className="mt-3 break-words text-base font-semibold leading-tight text-font-primary">
        {name}
      </h5>
      {/* !mb-0: the info row below makes this <p> no longer :last-child,
          which would pick up the global `p:not(:last-child)` 10px margin. */}
      <p
        title={position}
        className="!mb-0 mt-1 line-clamp-3 text-sm leading-snug text-primary-500 md:line-clamp-2"
      >
        {position}
      </p>

      {/* Phone info row: full location + a 44px social link (no hover here). */}
      {(location || hasSocial) && (
        <div
          data-testid="member-info"
          className="mt-1 flex items-center justify-center gap-1 md:hidden"
        >
          {location && (
            <span
              data-testid="member-location"
              className="text-sm leading-snug text-grey-600"
            >
              {location}
            </span>
          )}
          {hasSocial && (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={member.socialMediaUrl}
              aria-label={socialLabel}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-primary-500"
            >
              {socialIcon}
            </Link>
          )}
        </div>
      )}
    </article>
  );
};

export default MemberTeaser;
