import { ComicItem } from './comic.model';

export type PackStatus = 'sealed' | 'opened';

export interface PackCard {
  rank: number;
  comic: ComicItem;
  detailLink: readonly string[];
}
