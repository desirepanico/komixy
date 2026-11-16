import { DISCOVER_YEAR_MAX, DISCOVER_YEAR_MIN } from '@shared/constants/ui.const';
import { DiscoverFilterKey, DiscoverFilters } from '@shared/models/discover-filters.model';

/** Toglie un filtro, la ricerca o tutto (`all` tiene solo la sezione) */
export function clearFilter(
  filters: DiscoverFilters,
  key: DiscoverFilterKey | 'search' | 'all',
): DiscoverFilters {
  switch (key) {
    case 'year':
      return { ...filters, yearFrom: DISCOVER_YEAR_MIN, yearTo: DISCOVER_YEAR_MAX };
    case 'adult':
      return { ...filters, adult: false };
    case 'search':
      return { ...filters, search: '' };
    case 'all':
      return {
        ...filters,
        search: '',
        category: [],
        format: [],
        status: [],
        volumes: [],
        theme: [],
        yearFrom: DISCOVER_YEAR_MIN,
        yearTo: DISCOVER_YEAR_MAX,
        adult: false,
      };
    default:
      return { ...filters, [key]: [] };
  }
}
