import { ParamMap } from '@angular/router';
import { DISCOVER_QUERY_PARAMS } from '@shared/constants/navigation.const';
import {
  CATEGORY_OPTIONS,
  ERA_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
  THEME_OPTIONS,
  VOLUME_OPTIONS,
} from '@shared/constants/ui.const';
import { ComicKind } from '@shared/models/catalog-item.model';
import { DiscoverFilters, EMPTY_FILTERS } from '../../models/discover-filters.model';

/** I valori del parametro che stanno tra quelli ammessi, senza doppioni: il resto si scarta. */
function listOf<T extends string>(params: ParamMap, name: string, allowed: readonly T[]): T[] {
  const raw = params.get(name)?.split(',') ?? [];
  return allowed.filter((value) => raw.includes(value));
}

/** Legge scheda, ricerca e filtri dall'indirizzo. Un valore mancante o sconosciuto non è un errore. */
export function parseDiscoverFilters(params: ParamMap): DiscoverFilters {
  const kind: ComicKind = params.get(DISCOVER_QUERY_PARAMS.kind) === 'comic' ? 'comic' : 'manga';
  const era = params.get(DISCOVER_QUERY_PARAMS.era);
  return {
    kind,
    query: params.get(DISCOVER_QUERY_PARAMS.query)?.trim() ?? '',
    categories: listOf(params, DISCOVER_QUERY_PARAMS.categories, CATEGORY_OPTIONS[kind]),
    formats: listOf(params, DISCOVER_QUERY_PARAMS.formats, FORMAT_OPTIONS[kind]),
    statuses: listOf(params, DISCOVER_QUERY_PARAMS.statuses, STATUS_OPTIONS),
    volumes: listOf(params, DISCOVER_QUERY_PARAMS.volumes, VOLUME_OPTIONS[kind]),
    themes: kind === 'manga' ? listOf(params, DISCOVER_QUERY_PARAMS.themes, THEME_OPTIONS) : [],
    era: ERA_OPTIONS.find((option) => option === era) ?? EMPTY_FILTERS.era,
    showAdult: kind === 'manga' && params.get(DISCOVER_QUERY_PARAMS.adult) === '1',
  };
}
