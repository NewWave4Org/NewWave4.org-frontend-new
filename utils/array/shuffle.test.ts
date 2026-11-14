import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

// Deterministic random source: replays the given values in order.
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('shuffle', () => {
  it('returns a new array and leaves the input untouched', () => {
    const input = [1, 2, 3, 4];
    const out = shuffle(input, seq(0));

    expect(out).not.toBe(input);
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it('keeps every element exactly once', () => {
    const input = Array.from({ length: 50 }, (_, i) => i);
    const out = shuffle(input);

    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it('is a Fisher-Yates shuffle driven by the random source', () => {
    // random() = 0 always swaps index i with 0:
    // [a,b,c] -> i=2,j=0 -> [c,b,a] -> i=1,j=0 -> [b,c,a]
    expect(shuffle(['a', 'b', 'c'], seq(0))).toEqual(['b', 'c', 'a']);
    // random() just under 1 always picks j = i: identity
    expect(shuffle(['a', 'b', 'c'], seq(0.999))).toEqual(['a', 'b', 'c']);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([7])).toEqual([7]);
  });
});
