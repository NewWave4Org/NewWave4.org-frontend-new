'use client';

import React, { JSX, useEffect, useState } from 'react';
import IconButton from '../icons/IconButton';
import FacebookIcon from '../icons/social/FacebookIcon';
import InstagramIcon from '../icons/social/InstagramIcon';
import { useAppDispatch } from '@/store/hook';
import { getGlobalSectionByKey } from '@/store/global-sections/action';
import { GlobalSectionsType } from '../admin/GlobalSections/enum/types';
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';
import YoutubeIcon from '../icons/social/YoutubeIcon';

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  FACEBOOK: <FacebookIcon />,
  INSTAGRAM: <InstagramIcon />,
  YOUTUBE: <YoutubeIcon />,
};

const SocialButtons = () => {
  const dispatch = useAppDispatch();
  const [socialLinks, setSocialLinks] = useState<IGlobalSectionsResponseDTO | null>(null);

  useEffect(() => {
    async function fetchSocial() {
      try {
        const response = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_SOCIAL_LINKS)).unwrap();

        setSocialLinks(response);
      } catch (error) {
        setSocialLinks(null);
        console.log('fetchSocial error', error);
      }
    }

    fetchSocial();
  }, [dispatch]);

  return (
    <div className="flex gap-x-2">
      {socialLinks?.contentBlocks.map(item => {
        if (!item.isActive) return null;

        const Icon = SOCIAL_ICONS[item.contentBlockType];

        return (
          <IconButton key={item.contentBlockType} onClick={() => window.open(item.link)}>
            {Icon ?? null}
          </IconButton>
        );
      })}
    </div>
  );
};

export default SocialButtons;
