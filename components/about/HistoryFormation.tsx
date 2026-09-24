'use client';

import Image from 'next/image';
import { CSSProperties, useId, useState } from 'react';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useLocale, useTranslations } from 'next-intl';
import { useInView } from '@/utils/hooks/useInView';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';

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

  Each milestone shows just its year and title until the year or the dot is
  pressed, which unfolds the description (and folds it again on the next
  press). Milestones toggle independently. The fold is a grid-template-rows
  0fr -> 1fr transition, so no heights are measured in JS; the dots stay on
  one line because the [1fr | auto | 1fr] rows of every milestone size
  symmetrically in the auto-height grid.
*/
const HistoryFormation = ({ ourTimeLine }: { ourTimeLine: IOurTimeLine[] }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { ref, inView } = useInView<HTMLElement>();
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const idPrefix = useId();

  const toggle = (index: number) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

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
        <h4 className="mb-14 text-center md:text-left !text-font-primary lora-family lg:text-[34px] text-[38px] font-bold">
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
              const isOpen = open.has(index);
              const panelId = `${idPrefix}-milestone-${index}`;
              const toggleLabel = `${event.year} — ${event.translatable_text_title}`;
              const caretDesktop = above
                ? isOpen
                  ? 'xl:rotate-0'
                  : 'xl:rotate-180'
                : '';

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
                  {/* The dot is a 28px hit target with the 12px dot inside. */}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={toggleLabel}
                    onClick={() => toggle(index)}
                    className={`absolute left-[15px] top-[6px] flex h-7 w-7 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2
                      xl:static xl:row-start-2 xl:-my-2 xl:translate-x-0 xl:justify-self-center`}
                  >
                    <span
                      aria-hidden
                      className="timeline__dot relative block h-3 w-3 rounded-full bg-accent-600"
                    />
                  </button>

                  <div
                    className={`flex flex-wrap items-center gap-x-3 gap-y-3
                      xl:flex-col xl:flex-nowrap xl:gap-3 ${
                        above
                          ? 'xl:row-start-1 xl:justify-end xl:pb-4'
                          : 'xl:row-start-3 xl:justify-start xl:pt-4'
                      }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className={`timeline__year order-1 cursor-pointer rounded font-ebGaramond text-5xl font-bold leading-[1.1] text-font-accent
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 xl:order-2 ${
                          isOpen ? 'text-accent-700' : ''
                        }`}
                    >
                      {event.year}
                    </button>
                    <Image
                      aria-hidden
                      src="/icons/history-icon.svg"
                      width={35}
                      height={36}
                      alt=""
                      className={`timeline__ornament order-2 ${above ? 'xl:order-3' : 'xl:order-1'}`}
                    />
                    <div
                      className={`timeline__body order-3 flex basis-full ${
                        above
                          ? 'xl:order-1 xl:flex-col-reverse'
                          : 'xl:order-3 xl:flex-col'
                      } flex-col xl:basis-auto xl:items-center`}
                    >
                      <h5
                        className={`flex items-center gap-1 font-ebGaramond text-xl font-semibold text-font-primary xl:gap-0 ${
                          above ? 'xl:flex-col-reverse' : 'xl:flex-col'
                        }`}
                      >
                        <span>{event.translatable_text_title}</span>
                        {/* Caret: points toward where the text unfolds and
                            flips once it's open. Mobile and "below" items
                            unfold downward; desktop "above" items unfold
                            upward, so their caret starts pointing up. */}
                        <ArrowDown4Icon
                          size="16"
                          className={`shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          } ${caretDesktop}`}
                        />
                      </h5>
                      {/* Collapsible description: grid-rows 0fr -> 1fr animates height. */}
                      <div
                        id={panelId}
                        aria-hidden={!isOpen}
                        className={`grid transition-[grid-template-rows,opacity] duration-350 ease-out motion-reduce:transition-none ${
                          isOpen
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          {/* div, not p — draft-js HTML already contains <p>. */}
                          <div
                            className={`font-helv text-base font-normal leading-[1.5] text-font-primary ${
                              above ? 'xl:pb-2' : 'pt-2'
                            }`}
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        </div>
                      </div>
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
