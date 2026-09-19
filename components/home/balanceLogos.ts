/**
 * Aspect ratio (width / height) at or above which a logo is treated as a
 * "wide" wordmark rather than a compact badge/seal.
 */
export const WIDE_LOGO_RATIO = 1.6;

/**
 * Reorders logos so wide wordmarks and compact badges alternate, which keeps
 * the visual weight of a logo row even instead of clustering the dense square
 * marks together. Returns the input order untouched until every logo has a
 * measured ratio, or when all logos are of the same kind.
 */
export function balanceLogos<T extends { key: string }>(
  logos: T[],
  ratios: Record<string, number | undefined>,
): T[] {
  if (logos.some(logo => ratios[logo.key] === undefined)) {
    return logos;
  }

  const wide = logos.filter(logo => ratios[logo.key]! >= WIDE_LOGO_RATIO);
  const compact = logos.filter(logo => ratios[logo.key]! < WIDE_LOGO_RATIO);
  if (wide.length === 0 || compact.length === 0) {
    return logos;
  }

  // Lead with the larger group so any leftovers of it land at the end rather
  // than the row opening with two of the same kind.
  const [lead, follow] =
    wide.length >= compact.length ? [wide, compact] : [compact, wide];

  const balanced: T[] = [];
  for (let i = 0; i < lead.length; i++) {
    balanced.push(lead[i]);
    if (follow[i]) balanced.push(follow[i]);
  }
  return balanced;
}
