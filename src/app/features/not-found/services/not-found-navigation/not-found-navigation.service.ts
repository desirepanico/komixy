import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Rotte della feature not-found: la pagina 404, servita da ogni percorso che non esiste. */
@Injectable({ providedIn: 'root' })
export class NotFoundNavigationService {
  private readonly _router = inject(Router);

  public readonly notFoundLink: readonly string[] = ['/', AppRoutes.NotFound];

  public goToNotFound(): Promise<boolean> {
    return this._router.navigate(this.notFoundLink, { skipLocationChange: true });
  }
}
