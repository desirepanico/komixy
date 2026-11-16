import { describe, expect, it } from 'vitest';
import { CatalogItem } from '@shared/models/catalog-item.model';
import { volumeBucket } from './volume-bucket';

const base: CatalogItem = {
  id: 'a',
  title: 'T',
  author: 'A',
  volume: 1,
  totalVolumes: null,
  isSingleVolume: false,
  editionType: null,
  coverUrl: '/x.webp',
  kind: 'manga',
  categories: [],
  format: 'series',
  year: 2000,
  status: 'ongoing',
  themes: [],
  isAdult: false,
};

describe('volumeBucket', () => {
  it('mette un manga corto in 1–5', () => {
    expect(volumeBucket({ ...base, totalVolumes: 5 })).toBe('oneToFive');
  });

  it('mette un manga lungo oltre 20', () => {
    expect(volumeBucket({ ...base, totalVolumes: 110 })).toBe('overTwenty');
  });

  it('usa il volume quando il totale non si sa', () => {
    expect(volumeBucket({ ...base, volume: 12 })).toBe('sixToTwenty');
  });

  it('riconosce il volume unico di un fumetto', () => {
    expect(volumeBucket({ ...base, kind: 'comic', isSingleVolume: true })).toBe('single');
  });

  it('mette un fumetto di 3 volumi in 2–5', () => {
    expect(volumeBucket({ ...base, kind: 'comic', totalVolumes: 3 })).toBe('twoToFive');
  });
});
