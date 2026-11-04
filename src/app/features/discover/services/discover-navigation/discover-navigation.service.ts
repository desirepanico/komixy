import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Rotte della feature discover: la pagina Scopri. */
@Injectable({ providedIn: 'root' })
export class DiscoverNavigationService {
  private readonly router = inject(Router);

  public readonly discoverLink: readonly string[] = ['/', AppRoutes.Discover];

  public discoverUrlTree(): UrlTree {
    return this.router.createUrlTree(this.discoverLink);
  }

  public goToDiscover(): Promise<boolean> {
    return this.router.navigate(this.discoverLink);
  }
}
