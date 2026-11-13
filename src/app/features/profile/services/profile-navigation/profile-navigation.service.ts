import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Rotte della feature profile: la pagina del profilo. */
@Injectable({ providedIn: 'root' })
export class ProfileNavigationService {
  private readonly _router = inject(Router);

  public readonly profileLink: readonly string[] = ['/', AppRoutes.Profile];

  public goToProfile(): Promise<boolean> {
    return this._router.navigate(this.profileLink);
  }
}
