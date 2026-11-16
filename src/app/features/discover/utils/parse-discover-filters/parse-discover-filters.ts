import { ParamMap } from '@angular/router';
import { DISCOVER_QUERY_PARAMS } from '@shared/constants/navigation.const';
import {
  DISCOVER_FILTER_OPTIONS,
  DISCOVER_YEAR_MAX,
  DISCOVER_YEAR_MIN,
} from '@shared/constants/ui.const';
import { ComicKind } from '@shared/models/comic.model';
import { DiscoverFilters, DiscoverListKey } from '@shared/models/discover-filters.model';

/** Un valore mancante o sconosciuto non è un errore: si usa quello di riserva */
export function parseDiscoverFilters(params: ParamMap): DiscoverFilters {
  const kind: ComicKind = params.get(DISCOVER_QUERY_PARAMS.kind) === 'comic' ? 'comic' : 'manga';
  const options = DISCOVER_FILTER_OPTIONS[kind];
  const list = (key: DiscoverListKey): string[] =>
    params
      .getAll(DISCOVER_QUERY_PARAMS[key])
      .filter((value, i, all) => options[key].includes(value) && all.indexOf(value) === i);
  const year = (name: string, fallback: number): number => {
    const value = Number(params.get(name));
    return Number.isInteger(value) && value >= DISCOVER_YEAR_MIN && value <= DISCOVER_YEAR_MAX
      ? value
      : fallback;
  };
  const from = year(DISCOVER_QUERY_PARAMS.yearFrom, DISCOVER_YEAR_MIN);
  const to = year(DISCOVER_QUERY_PARAMS.yearTo, DISCOVER_YEAR_MAX);
  const ordered = from <= to;

  return {
    kind,
    search: params.get(DISCOVER_QUERY_PARAMS.search) ?? '',
    category: list('category'),
    format: list('format'),
    status: list('status'),
    volumes: list('volumes'),
    theme: list('theme'),
    yearFrom: ordered ? from : DISCOVER_YEAR_MIN,
    yearTo: ordered ? to : DISCOVER_YEAR_MAX,
    // Solo i manga hanno il filtro per adulti
    adult: kind === 'manga' && params.get(DISCOVER_QUERY_PARAMS.adult) === '1',
  };
}
