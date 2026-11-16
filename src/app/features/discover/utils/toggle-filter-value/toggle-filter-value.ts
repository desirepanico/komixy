import { DiscoverFilters, DiscoverListKey } from '@shared/models/discover-filters.model';

/** Aggiunge il valore se non c'è, lo toglie se c'è */
export function toggleFilterValue(
  filters: DiscoverFilters,
  key: DiscoverListKey,
  value: string,
): DiscoverFilters {
  const current = filters[key];
  return {
    ...filters,
    [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
  };
}
