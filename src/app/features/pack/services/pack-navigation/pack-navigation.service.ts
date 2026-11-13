import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Rotte di `pack`: l'apertura della busta, a schermo intero. */
@Injectable({ providedIn: 'root' })
export class PackNavigationService {
  private readonly _router = inject(Router);

  public readonly packLink: readonly string[] = ['/', AppRoutes.Discover, AppRoutes.Pack];

  public goToPack(): Promise<boolean> {
    return this._router.navigate(this.packLink);
  }
}
