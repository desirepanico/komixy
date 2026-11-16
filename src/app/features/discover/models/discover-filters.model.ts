import { VolumeBucket, YearEra } from '@shared/models/catalog-filter.model';
import {
  ComicCategory,
  ComicFormat,
  ComicKind,
  ComicStatus,
  ComicTheme,
} from '@shared/models/catalog-item.model';

/** Scheda, ricerca e filtri di Scopri: è ciò che sta nell'indirizzo. */
export interface DiscoverFilters {
  kind: ComicKind;
  query: string;
  categories: ComicCategory[];
  formats: ComicFormat[];
  statuses: ComicStatus[];
  volumes: VolumeBucket[];
  themes: ComicTheme[];
  era: YearEra;
  showAdult: boolean;
}

/** I gruppi del pannello; `era` e `showAdult` hanno un solo valore, gli altri sono liste. */
export type FacetKey =
  'categories' | 'formats' | 'statuses' | 'volumes' | 'themes' | 'era' | 'showAdult';

export const EMPTY_FILTERS: DiscoverFilters = {
  kind: 'manga',
  query: '',
  categories: [],
  formats: [],
  statuses: [],
  volumes: [],
  themes: [],
  era: 'all',
  showAdult: false,
};

/** Una scheda con quanti titoli ha e le copertine del ventaglio. */
export interface DiscoverTab {
  kind: ComicKind;
  count: number;
  covers: string[];
}

/** Una voce dei suggerimenti della ricerca: un titolo, una ricerca recente o il testo digitato. */
export interface SearchOption {
  id: string;
  type: 'recent' | 'loved' | 'match' | 'author' | 'free';
  value: string;
  title: string;
  subtitle: string;
  cover: string | null;
  /** La scheda del titolo suggerito; null per autori, ricerche recenti e testo libero */
  kind: ComicKind | null;
}

/** Un titolo scelto dalla ricerca che sta nell'altra scheda: la pagina cambia scheda e lo cerca. */
export interface FoundTitle {
  title: string;
  kind: ComicKind;
}
