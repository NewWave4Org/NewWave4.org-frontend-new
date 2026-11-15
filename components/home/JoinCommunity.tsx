'use client';

import { CSSProperties } from 'react';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { useInView } from '@/utils/hooks/useInView';

interface IJoinCommunity {
  translatable_text_title: string;
  translatable_text_description: string;
  translatable_text_editorState: any;
  className?: string;
}

/*
  The ways to join sit on one dotted path, in the same visual language as the
  About page timeline (`.timeline` rules in styles/globals.css): when the
  section scrolls into view the line draws itself, a gold dot pops in at each
  way and its text rises in behind it. Horizontal on desktop, a vertical line
  down the left edge on smaller screens. The ways aren't a sequence, so they
  carry no numbers. Reduced motion shows everything in its final state.
*/
const JoinCommunity = ({ joinUs }: { joinUs: IJoinCommunity[] }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { ref, inView } = useInView<HTMLElement>();

  const count = joinUs?.length ?? 0;
  if (count === 0) return null;

  // Desktop: the line runs from the first dot to the last one. Each dot sits
  // at its column's left edge, so the line stops one column (minus the dot's
  // half-width) short of the right edge. 4rem = the grid's gap-16.
  const lastColumn = `calc((100% - ${count - 1} * 4rem) / ${count} - 6px)`;

  return (
    <section
      ref={ref}
      className={`timeline join-paths lg:my-10 my-5 py-14 bg-skyBlue-300 ${inView ? 'is-inview' : ''}`}
    >
      <div className="container mx-auto px-4">
        <h4 className="lg:text-[34px] text-[38px] mb-12 text-center md:text-left mx-auto !text-font-primary lora-family font-bold">
          {t('sections_title.join_us')}
        </h4>

        <div className="relative">
          {/* Desktop line (horizontal, through the dots) */}
          <div
            aria-hidden
            className="timeline__line absolute top-[6px] left-[6px] hidden h-2 -translate-y-1/2 lg:block"
            style={{ right: lastColumn }}
          />
          {/* Mobile line (vertical, down the left edge) */}
          <div
            aria-hidden
            className="timeline__line timeline__line--vertical absolute bottom-6 left-[6px] top-2 w-2 -translate-x-1/2 lg:hidden"
          />

          <ul
            className="relative grid grid-cols-1 gap-10 !list-none !pl-0 lg:gap-16 lg:grid-cols-[repeat(var(--join-count),minmax(0,1fr))]"
            style={{ '--join-count': count } as CSSProperties}
          >
            {joinUs.map((item, i) => {
              const joinDescriptionText = convertDraftToHTML(
                item?.translatable_text_editorState,
                locale,
              );
              return (
                <li
                  key={i}
                  style={{ '--i': i } as CSSProperties}
                  className="timeline__item relative mb-0 pl-9 before:hidden lg:pl-0 lg:pt-10"
                >
                  <span
                    aria-hidden
                    className="timeline__dot absolute left-0 top-[8px] block h-3 w-3 rounded-full bg-accent-600 lg:top-0"
                  />
                  <div className="timeline__body">
                    <h5 className="join-paths__title mb-3 font-ebGaramond text-[26px] font-bold leading-[1.2] text-font-accent transition-colors duration-300">
                      {item.translatable_text_title}
                    </h5>
                    {/* div, not p: convertDraftToHTML emits block-level <p> wrappers,
                        and <p> inside <p> is invalid HTML. The browser auto-closes the
                        outer one, leaving DOM React's tree doesn't match — a React 19
                        hydration error (#418), which throws where React 18 only warned.
                        Left-aligned, not justified: justified text at this column
                        width opens wide gaps between words. */}
                    <div
                      className="max-w-[46ch] font-helv text-base leading-[1.6] text-font-primary"
                      dangerouslySetInnerHTML={{ __html: joinDescriptionText }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="timeline__body mt-12 flex justify-center md:justify-start"
          style={{ '--i': count } as CSSProperties}
        >
          <Link
            href="/contacts"
            className="inline-flex h-[56px] items-center rounded-lg bg-primary-50 px-6 text-medium1 text-font-white duration-500 hover:bg-buttons-cta-hover active:bg-buttons-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
          >
            {t('links.contact_us')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;
