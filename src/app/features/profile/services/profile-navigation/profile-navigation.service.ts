import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

@Injectable({ providedIn: 'root' })
export class ProfileNavigationService {
  private readonly router = inject(Router);

  public readonly profileLink: readonly string[] = ['/', AppRoutes.Profile];

  public goToProfile(): Promise<boolean> {
    return this.router.navigate(this.profileLink);
  }
}
