import { ComicKind } from './comic.model';

/** Le sezioni del pannello che hanno un elenco di valori */
export type DiscoverListKey = 'category' | 'format' | 'status' | 'volumes' | 'theme';

/** Anche l'anno e i contenuti per adulti sono filtri: servono per i chip e per «Togli il filtro» */
export type DiscoverFilterKey = DiscoverListKey | 'year' | 'adult';

export interface DiscoverFilters {
  kind: ComicKind;
  search: string;
  category: readonly string[];
  format: readonly string[];
  status: readonly string[];
  volumes: readonly string[];
  theme: readonly string[];
  yearFrom: number;
  yearTo: number;
  adult: boolean;
}

/** Un chip dei filtri applicati: `value` è il valore tolto dal chip (per l'anno e gli adulti non serve) */
export interface DiscoverChip {
  key: DiscoverFilterKey;
  value: string;
}

/** Cosa togliere per avere risultati: un filtro o la ricerca testuale */
export interface DiscoverRemoval {
  target: DiscoverFilterKey | 'search';
  count: number;
}
