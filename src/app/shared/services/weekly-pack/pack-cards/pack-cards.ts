import { PackCard } from '../../../models/pack.model';
import { RankingEntry } from '../../../models/ranking-entry.model';

/** Le carte della busta sono le voci della classifica, con il link al dettaglio che sa costruire chi le usa */
export function toPackCards(
  entries: readonly RankingEntry[],
  detailLink: (comicId: string) => readonly string[],
): PackCard[] {
  return entries.map(({ rank, comic }) => ({ rank, comic, detailLink: detailLink(comic.id) }));
}
