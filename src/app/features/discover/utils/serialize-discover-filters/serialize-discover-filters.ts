import { Params } from '@angular/router';
import { DISCOVER_QUERY_PARAMS } from '@shared/constants/navigation.const';
import { DiscoverFilters, EMPTY_FILTERS } from '../../models/discover-filters.model';

/** I filtri come query param: i valori di default non si scrivono, così l'indirizzo resta corto. */
export function serializeDiscoverFilters(filters: DiscoverFilters): Params {
  const p = DISCOVER_QUERY_PARAMS;
  const join = (values: readonly string[]) => (values.length ? values.join(',') : null);
  return {
    [p.kind]: filters.kind === EMPTY_FILTERS.kind ? null : filters.kind,
    [p.query]: filters.query.trim() || null,
    [p.categories]: join(filters.categories),
    [p.formats]: join(filters.formats),
    [p.statuses]: join(filters.statuses),
    [p.volumes]: join(filters.volumes),
    [p.themes]: join(filters.themes),
    [p.era]: filters.era === EMPTY_FILTERS.era ? null : filters.era,
    [p.adult]: filters.showAdult ? '1' : null,
  };
}
