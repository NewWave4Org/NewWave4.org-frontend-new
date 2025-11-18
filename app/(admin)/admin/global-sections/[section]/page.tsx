'use client';

import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import MissionForm from '@/components/admin/GlobalSections/MissionForm';
import PartnersForm from '@/components/admin/GlobalSections/PartnersForm';
import SocialLinksForm from '@/components/admin/GlobalSections/SocialLinksForm';
import { useParams } from 'next/navigation';

function SectionEditPage() {
  const { section } = useParams();

  return (
    <div>
      <h1 className="text-h4 mb-3">Editing: {String(section).replaceAll('-', ' ')}</h1>

      {section === GlobalSectionsType.OUR_SOCIAL_LINKS && <SocialLinksForm />}
      {section === GlobalSectionsType.OUR_MISSION && <MissionForm />}
      {section === GlobalSectionsType.OUR_PARTNERS && <PartnersForm />}
    </div>
  );
}

export default SectionEditPage;
