import {
  DISCOVER_LIST_KEYS,
  DISCOVER_YEAR_MAX,
  DISCOVER_YEAR_MIN,
} from '@shared/constants/ui.const';
import { CatalogComic } from '@shared/models/comic.model';
import {
  DiscoverFilterKey,
  DiscoverFilters,
  DiscoverRemoval,
} from '@shared/models/discover-filters.model';
import { filterComics } from '../filter-comics/filter-comics';

/** Il filtro (o la ricerca) che, tolto, lascia più volumi; `null` se nessuno ne dà. */
export function removalSuggestion(
  comics: readonly CatalogComic[],
  filters: DiscoverFilters,
): DiscoverRemoval | null {
  const candidates: (DiscoverFilterKey | 'search')[] = DISCOVER_LIST_KEYS.filter(
    (key) => filters[key].length > 0,
  );
  if (filters.yearFrom !== DISCOVER_YEAR_MIN || filters.yearTo !== DISCOVER_YEAR_MAX)
    candidates.push('year');
  if (filters.search.trim()) candidates.push('search');

  let best: DiscoverRemoval | null = null;
  for (const target of candidates) {
    const count = filterComics(comics, filters, target).length;
    if (count > 0 && (!best || count > best.count)) best = { target, count };
  }
  return best;
}
