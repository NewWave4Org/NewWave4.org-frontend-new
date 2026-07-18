import Contacts from '@/components/contacts/Contacts';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/utils/seo';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.contacts' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale, '/contacts'),
    openGraph: { title: t('title'), description: t('description') },
    twitter: { title: t('title'), description: t('description') },
  };
}

const ContactsPage = () => {
  return (
    <div className="lg:mt-[144px] mt-11 mb-[84px]">
      <Contacts />
    </div>
  );
};

export default ContactsPage;
