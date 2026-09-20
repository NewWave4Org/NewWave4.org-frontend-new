'use client';

import Image from 'next/image';
import { CSSProperties } from 'react';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useLocale, useTranslations } from 'next-intl';
import { useInView } from '@/utils/hooks/useInView';

interface IOurTimeLine {
  year: string;
  translatable_text_title: string;
  translatable_text_text: string;
  translatable_text_editorState: any;
}

/*
  Milestones alternate above / below a horizontal dotted line on desktop and
  stack beside a vertical one on smaller screens. The line draws itself when
  the section scrolls into view and each milestone pops in as the line
  reaches it -- see the `.timeline` rules in styles/globals.css for the
  choreography; this file only sets `--i` (the stagger index) per item.
*/
const HistoryFormation = ({ ourTimeLine }: { ourTimeLine: IOurTimeLine[] }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { ref, inView } = useInView<HTMLElement>();

  const count = ourTimeLine?.length ?? 0;
  if (count === 0) return null;

  // Desktop: the line runs from the first dot's centre to the last dot's, not
  // edge to edge, so it never dangles past the outermost milestones.
  const halfColumn = `calc(100% / ${count} / 2)`;

  return (
    <section
      ref={ref}
      className={`timeline history-formation py-14 ${inView ? 'is-inview' : ''}`}
    >
      <div className="container mx-auto px-4">
        <h4 className="mb-14 text-center md:text-left !text-font-primary lora-family text-2xl font-bold uppercase">
          {t('sections_title.history_formation')}
        </h4>

        <div className="relative">
          {/* Desktop line (horizontal, through the dots) */}
          <div
            aria-hidden
            className="timeline__line absolute top-1/2 hidden h-2 -translate-y-1/2 xl:block"
            style={{ left: halfColumn, right: halfColumn }}
          />
          {/* Mobile line (vertical, down the left edge) */}
          <div
            aria-hidden
            className="timeline__line timeline__line--vertical absolute bottom-6 left-[15px] top-2 w-2 -translate-x-1/2 xl:hidden"
          />

          <ol
            className="relative grid grid-cols-1 !list-none !pl-0 xl:min-h-[460px] xl:grid-cols-[repeat(var(--timeline-count),minmax(0,1fr))]"
            style={{ '--timeline-count': count } as CSSProperties}
          >
            {ourTimeLine.map((event, index) => {
              const above = index % 2 === 0;
              const html = convertDraftToHTML(
                event?.translatable_text_editorState,
                locale,
              );

              return (
                // One set of markup for every breakpoint. Desktop: each
                // milestone owns a column and an [above | dot | below] row
                // triple; `order-*` flips body/year/ornament so the year always
                // sits nearest the line. Mobile: year + ornament inline, body
                // beneath, dot on the vertical line to the left.
                <li
                  key={index}
                  style={{ '--i': index } as CSSProperties}
                  className="timeline__item relative mb-0 block pl-12 pb-10 before:hidden last:pb-0 xl:grid xl:grid-rows-[1fr_auto_1fr] xl:px-3 xl:pb-0 xl:pl-3 xl:text-center"
                >
                  <span
                    aria-hidden
                    className={`timeline__dot absolute left-[15px] top-[14px] block h-3 w-3 -translate-x-1/2 rounded-full bg-accent-600
                      xl:static xl:row-start-2 xl:translate-x-0 xl:justify-self-center`}
                  />

                  <div
                    className={`flex flex-wrap items-center gap-x-3 gap-y-3
                      xl:flex-col xl:flex-nowrap xl:gap-3 ${
                        above
                          ? 'xl:row-start-1 xl:justify-end xl:pb-4'
                          : 'xl:row-start-3 xl:justify-start xl:pt-4'
                      }`}
                  >
                    <div
                      className={`timeline__year order-1 font-ebGaramond text-5xl font-bold leading-[1.1] text-font-accent xl:order-2`}
                    >
                      {event.year}
                    </div>
                    <Image
                      aria-hidden
                      src="/icons/history-icon.svg"
                      width={35}
                      height={36}
                      alt=""
                      className={`timeline__ornament order-2 ${above ? 'xl:order-3' : 'xl:order-1'}`}
                    />
                    <div
                      className={`timeline__body order-3 basis-full ${above ? 'xl:order-1' : 'xl:order-3'} xl:basis-auto`}
                    >
                      <h5 className="mb-2 font-ebGaramond text-xl font-semibold text-font-primary">
                        {event.translatable_text_title}
                      </h5>
                      {/* div, not p — draft-js HTML already contains <p>. */}
                      <div
                        className="font-helv text-base font-normal leading-[1.5] text-font-primary"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HistoryFormation;
