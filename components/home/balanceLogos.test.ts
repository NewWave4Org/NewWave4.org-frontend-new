import { describe, expect, it } from 'vitest';
import { balanceLogos } from './balanceLogos';

const logos = [
  { key: 'wide-a' },
  { key: 'wide-b' },
  { key: 'badge-a' },
  { key: 'badge-b' },
];

const keys = (items: { key: string }[]) => items.map(l => l.key);

describe('balanceLogos', () => {
  it('alternates wide wordmarks with compact badges', () => {
    const ratios = {
      'wide-a': 3.8,
      'wide-b': 5.8,
      'badge-a': 0.9,
      'badge-b': 1,
    };
    expect(keys(balanceLogos(logos, ratios))).toEqual([
      'wide-a',
      'badge-a',
      'wide-b',
      'badge-b',
    ]);
  });

  it('keeps the original order until every logo is measured', () => {
    const ratios = { 'wide-a': 3.8, 'wide-b': 5.8, 'badge-a': 0.9 };
    expect(balanceLogos(logos, ratios)).toBe(logos);
  });

  it('keeps the original order when all logos are the same kind', () => {
    const ratios = { 'wide-a': 3, 'wide-b': 4, 'badge-a': 2, 'badge-b': 5 };
    expect(balanceLogos(logos, ratios)).toBe(logos);
  });

  it('leads with the larger group and appends its leftovers', () => {
    const many = [...logos, { key: 'badge-c' }, { key: 'badge-d' }];
    const ratios = {
      'wide-a': 3.8,
      'wide-b': 5.8,
      'badge-a': 1,
      'badge-b': 1,
      'badge-c': 1,
      'badge-d': 1,
    };
    expect(keys(balanceLogos(many, ratios))).toEqual([
      'badge-a',
      'wide-a',
      'badge-b',
      'wide-b',
      'badge-c',
      'badge-d',
    ]);
  });
});
