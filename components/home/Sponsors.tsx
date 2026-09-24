'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { balanceLogos } from './balanceLogos';

interface IOurPartners {
  id: string;
  contentBlockType: string;
  files: any[];
}

/**
 * A marquee only reads as continuous when the track is wider than the
 * viewport, so a short logo list is repeated until each copy has at least
 * this many cards.
 */
const MIN_CARDS_PER_COPY = 8;

const Sponsors = ({ ourPartners }: { ourPartners: IOurPartners[] }) => {
  const t = useTranslations();

  const logos = useMemo(
    () =>
      (ourPartners ?? []).flatMap((item, index) =>
        item.files.map((src, fileIndex) => ({
          key: `${item.id}-${fileIndex}`,
          src,
          alt: `Logo-${index}`,
        })),
      ),
    [ourPartners],
  );

  // Natural aspect ratio per logo, measured once the image is available.
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const measure = useCallback((key: string, img: HTMLImageElement | null) => {
    if (!img?.complete || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setRatios(prev => (prev[key] === ratio ? prev : { ...prev, [key]: ratio }));
  }, []);

  const cards = useMemo(() => {
    const balanced = balanceLogos(logos, ratios);
    if (balanced.length === 0) return [];
    const repeats = Math.ceil(MIN_CARDS_PER_COPY / balanced.length);
    return Array.from({ length: repeats }, (_, r) =>
      balanced.map(logo => ({ ...logo, cardKey: `${logo.key}-${r}` })),
    ).flat();
  }, [logos, ratios]);

  if (cards.length === 0) return null;

  return (
    <section className="sponsors lg:py-14 py-7">
      <section className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="lg:mb-0 mb-4 !text-font-primary font-bold lg:text-[34px] text-[38px] lora-family">
            {t('sections_title.trust_us')}
          </h4>
          {/*
            Continuous logo marquee. The track holds two identical copies of the
            card row and slides by exactly half its width (see the `marquee`
            keyframe), so the loop restarts on the seam without a visible jump.
            Each copy carries the inter-card gap as trailing padding rather than a
            flex gap on the track, which is what keeps the two halves exactly equal.
            Every logo sits in a same-size white card with object-contain, so wide
            wordmarks and square badges carry equal visual weight; wordmarks and
            badges are interleaved (see balanceLogos) so the dense marks don't
            cluster. The second copy is hidden from assistive tech.
          */}
          <div className="sponsors-marquee">
            <div className="sponsors-marquee__track">
              {[0, 1].map(copy => (
                <div
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex items-center gap-x-4 pr-4 sm:gap-x-5 sm:pr-5"
                >
                  {cards.map(({ cardKey, key, src, alt }) => (
                    <div
                      key={cardKey}
                      className="flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-grey-200 bg-white px-6 py-4 sm:h-28 sm:w-56 lg:h-32 lg:w-60 lg:px-8"
                    >
                      <Image
                        // The callback ref catches images that finished loading
                        // before hydration (onLoad never fires for those);
                        // onLoad covers the rest.
                        ref={img => measure(key, img)}
                        onLoad={e => measure(key, e.currentTarget)}
                        className="h-auto max-h-full w-auto max-w-full object-contain mix-blend-multiply"
                        src={src}
                        alt={alt}
                        width={240}
                        height={128}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Sponsors;
