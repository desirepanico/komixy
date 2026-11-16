import { DISCOVER_YEAR_MAX, DISCOVER_YEAR_MIN } from '@shared/constants/ui.const';
import { DiscoverChip, DiscoverFilters } from '@shared/models/discover-filters.model';

/** Un chip per ogni valore scelto; l'intervallo di anni è un solo chip */
export function discoverChips(filters: DiscoverFilters): DiscoverChip[] {
  const chips: DiscoverChip[] = [];
  filters.category.forEach((value) => chips.push({ key: 'category', value }));
  filters.format.forEach((value) => chips.push({ key: 'format', value }));
  if (filters.yearFrom !== DISCOVER_YEAR_MIN || filters.yearTo !== DISCOVER_YEAR_MAX)
    chips.push({ key: 'year', value: 'year' });
  filters.volumes.forEach((value) => chips.push({ key: 'volumes', value }));
  filters.status.forEach((value) => chips.push({ key: 'status', value }));
  filters.theme.forEach((value) => chips.push({ key: 'theme', value }));
  if (filters.adult) chips.push({ key: 'adult', value: 'adult' });
  return chips;
}
