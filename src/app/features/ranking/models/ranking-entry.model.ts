import { ComicItem } from '@core/models/comic.model';

/** Una posizione della classifica: il fumetto e il suo piazzamento (1 = primo). */
export interface RankingEntry {
  rank: number;
  comic: ComicItem;
}
