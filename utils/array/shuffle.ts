/**
 * Returns a shuffled copy of `items` (Fisher-Yates). The input is not mutated.
 * `random` is injectable so callers and tests can make the order deterministic.
 */
export function shuffle<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
