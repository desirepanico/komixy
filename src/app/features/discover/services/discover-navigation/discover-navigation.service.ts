import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

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
}
