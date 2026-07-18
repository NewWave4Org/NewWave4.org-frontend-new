import type { Metadata } from 'next';
import { getArticleByIdCached } from '@/utils/article-content/getArticleCached';
import { getBlockValue } from '@/utils/articles/type/prepareArticle';
import { ContentBlockType } from '@/utils/articles/type/contentBlockType';
import { EN_LOCALE } from '@/i18n';
import { prefix } from '@/utils/prefix';
import { buildAlternates, truncate } from '@/utils/seo';

/**
 * Reads plain text straight out of a raw Draft.js content state ({blocks, entityMap})
 * without going through the draft-js/draft-js-export-html libraries. Those libraries
 * are fine client-side (see components/TextEditor/utils/convertDraftToHTML.tsx) but
 * break Next.js's isolated bundle for generateMetadata collection at build time, so
 * metadata extraction stays intentionally dependency-free.
 */
function rawDraftToPlainText(raw: unknown): string {
  const blocks = (raw as { blocks?: { text?: string }[] } | undefined)?.blocks;

  if (!Array.isArray(blocks)) return '';

  return blocks
    .map(block => block?.text ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Shared by news/[id], events/[id] and program/[id]: fetches the real article
 * server-side and builds per-article title/description/OG image, falling back
 * to generic metadata if the fetch fails (deleted article, bad id, API down).
 */
export async function buildArticleMetadata({
  id,
  locale,
  routeBase,
  fallbackTitle,
}: {
  id: number;
  locale: string;
  routeBase: string;
  fallbackTitle: string;
}): Promise<Metadata> {
  const alternates = buildAlternates(locale, `${routeBase}/${id}`);

  if (!Number.isFinite(id)) {
    return { title: fallbackTitle, alternates };
  }

  try {
    const dto = await getArticleByIdCached(id);
    const isEng = locale === EN_LOCALE;
    const blocks = (isEng && dto.contentBlocksEng?.length ? dto.contentBlocksEng : dto.contentBlocks) ?? [];
    const title = (isEng && dto.titleEng ? dto.titleEng : dto.title) || fallbackTitle;

    const mainTextRaw = getBlockValue<unknown>(blocks, ContentBlockType.MAIN_NEWS_BLOCK) ?? getBlockValue<unknown>(blocks, ContentBlockType.TEXT);
    const description = truncate(rawDraftToPlainText(mainTextRaw));

    const photoData = getBlockValue<string | string[]>(blocks, ContentBlockType.PHOTO);
    const image = (Array.isArray(photoData) ? photoData[0] : photoData) || `${prefix}/logo.png`;

    return {
      title,
      description: description || undefined,
      alternates,
      openGraph: {
        type: 'article',
        title,
        description: description || undefined,
        images: [{ url: image }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description || undefined,
        images: [image],
      },
    };
  } catch {
    return { title: fallbackTitle, alternates };
  }
}
