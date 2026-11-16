import { inject, Injectable } from '@angular/core';
import { Params, Router, UrlTree } from '@angular/router';
import { DISCOVER_QUERY_PARAMS } from '@shared/constants/navigation.const';
import {
  DISCOVER_LIST_KEYS,
  DISCOVER_YEAR_MAX,
  DISCOVER_YEAR_MIN,
} from '@shared/constants/ui.const';
import { AppRoutes } from '@shared/models/app-routes.model';
import { DiscoverFilters } from '@shared/models/discover-filters.model';

/** Rotte della feature discover: la pagina Scopri. */
@Injectable({ providedIn: 'root' })
export class DiscoverNavigationService {
  private readonly _router = inject(Router);

  public readonly discoverLink: readonly string[] = ['/', AppRoutes.Discover];

  public discoverUrlTree(): UrlTree {
    return this._router.createUrlTree(this.discoverLink);
  }

  public goToDiscover(): Promise<boolean> {
    return this._router.navigate(this.discoverLink);
  }

  /** Mette sezione, ricerca e filtri nell'indirizzo senza aggiungere una voce alla cronologia */
  public goToFilters(filters: DiscoverFilters): Promise<boolean> {
    const queryParams: Params = { [DISCOVER_QUERY_PARAMS.kind]: filters.kind };
    if (filters.search.trim()) queryParams[DISCOVER_QUERY_PARAMS.search] = filters.search;
    for (const key of DISCOVER_LIST_KEYS) {
      if (filters[key].length) queryParams[DISCOVER_QUERY_PARAMS[key]] = filters[key];
    }
    if (filters.yearFrom !== DISCOVER_YEAR_MIN || filters.yearTo !== DISCOVER_YEAR_MAX) {
      queryParams[DISCOVER_QUERY_PARAMS.yearFrom] = filters.yearFrom;
      queryParams[DISCOVER_QUERY_PARAMS.yearTo] = filters.yearTo;
    }
    if (filters.adult) queryParams[DISCOVER_QUERY_PARAMS.adult] = '1';
    return this._router.navigate(this.discoverLink, { queryParams, replaceUrl: true });
  }
}
