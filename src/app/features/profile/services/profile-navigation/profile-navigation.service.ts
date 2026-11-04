import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Rotte della feature profile: la pagina del profilo. */
@Injectable({ providedIn: 'root' })
export class ProfileNavigationService {
  private readonly router = inject(Router);

  public readonly profileLink: readonly string[] = ['/', AppRoutes.Profile];

  public goToProfile(): Promise<boolean> {
    return this.router.navigate(this.profileLink);
  }
}
