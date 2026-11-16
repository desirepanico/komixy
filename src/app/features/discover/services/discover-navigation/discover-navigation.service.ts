import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';
import { DiscoverFilters } from '../../models/discover-filters.model';
import { serializeDiscoverFilters } from '../../utils/serialize-discover-filters/serialize-discover-filters';

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

  /** Mette scheda, ricerca e filtri nell'indirizzo senza aggiungere una voce alla cronologia */
  public goToFilters(filters: DiscoverFilters): Promise<boolean> {
    return this._router.navigate(this.discoverLink, {
      queryParams: serializeDiscoverFilters(filters),
      replaceUrl: true,
      // Cambiare scheda o filtri non deve riportare in cima: chi usa l'isola resta dov'è
      scroll: 'manual',
    });
  }
}
