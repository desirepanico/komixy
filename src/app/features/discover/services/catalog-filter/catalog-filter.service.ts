import { Injectable } from '@angular/core';
import { ERA_RANGES } from '@shared/constants/ui.const';
import { CatalogItem, ComicKind } from '@shared/models/catalog-item.model';
import { DiscoverFilters, EMPTY_FILTERS, FacetKey } from '../../models/discover-filters.model';
import { volumeBucket } from '../../utils/volume-bucket/volume-bucket';

/** Ricerca e filtri sul catalogo: puro, senza stato (lo stato sta nell'indirizzo). */
@Injectable({ providedIn: 'root' })
export class CatalogFilterService {
  /** I gruppi di filtri della scheda: i fumetti non hanno tema né contenuti per adulti. */
  public facetsFor(kind: ComicKind): readonly FacetKey[] {
    const common: FacetKey[] = ['categories', 'formats', 'era', 'volumes', 'statuses'];
    return kind === 'manga' ? [...common, 'themes', 'showAdult'] : common;
  }

  /** I titoli della scheda, esclusi gli adulti dei manga se non richiesti. */
  public itemsOfKind(items: readonly CatalogItem[], filters: DiscoverFilters): CatalogItem[] {
    return items.filter(
      (item) =>
        item.kind === filters.kind &&
        (filters.kind !== 'manga' || filters.showAdult || !item.isAdult),
    );
  }

  /** Applica ricerca e filtri alla scheda scelta. */
  public filter(items: readonly CatalogItem[], filters: DiscoverFilters): CatalogItem[] {
    const facets = this.facetsFor(filters.kind);
    return this.itemsOfKind(items, filters).filter(
      (item) =>
        this._matchesQuery(item, filters.query) &&
        facets.every((facet) => this._matchesFacet(item, filters, facet)),
    );
  }

  /** Accende o toglie un valore di un gruppo (il periodo ne ha uno solo: sceglierlo di nuovo lo toglie). */
  public toggle(filters: DiscoverFilters, facet: FacetKey, value: string): DiscoverFilters {
    if (facet === 'era') {
      return { ...filters, era: filters.era === value ? 'all' : (value as DiscoverFilters['era']) };
    }
    if (facet === 'showAdult') return { ...filters, showAdult: !filters.showAdult };
    const current: readonly string[] = filters[facet];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    return { ...filters, [facet]: next };
  }

  /** Toglie tutte le scelte e tiene scheda e ricerca. */
  public reset(filters: DiscoverFilters): DiscoverFilters {
    return { ...EMPTY_FILTERS, kind: filters.kind, query: filters.query };
  }

  public isActive(filters: DiscoverFilters, facet: FacetKey): boolean {
    if (facet === 'era') return filters.era !== 'all';
    if (facet === 'showAdult') return filters.showAdult;
    return filters[facet].length > 0;
  }

  /** Quanti gruppi hanno una scelta attiva (la ricerca non conta). */
  public activeCount(filters: DiscoverFilters): number {
    return this.facetsFor(filters.kind).filter((facet) => this.isActive(filters, facet)).length;
  }

  private _valuesOf(item: CatalogItem, facet: FacetKey): readonly string[] {
    switch (facet) {
      case 'categories':
        return item.categories;
      case 'formats':
        return [item.format];
      case 'statuses':
        return [item.status];
      case 'volumes':
        return [volumeBucket(item)];
      case 'themes':
        return item.themes;
      default:
        return [];
    }
  }

  private _matchesFacet(item: CatalogItem, filters: DiscoverFilters, facet: FacetKey): boolean {
    if (facet === 'era') {
      const [from, to] = ERA_RANGES[filters.era];
      return item.year >= from && item.year <= to;
    }
    if (facet === 'showAdult') return true;
    const chosen: readonly string[] = filters[facet];
    return chosen.length === 0 || this._valuesOf(item, facet).some((v) => chosen.includes(v));
  }

  private _matchesQuery(item: CatalogItem, query: string): boolean {
    const q = query.trim().toLowerCase();
    return q === '' || `${item.title} ${item.author}`.toLowerCase().includes(q);
  }
}
