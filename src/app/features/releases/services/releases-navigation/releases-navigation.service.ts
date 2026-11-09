import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

@Injectable({ providedIn: 'root' })
export class ReleasesNavigationService {
  private readonly router = inject(Router);

  public readonly releasesLink: readonly string[] = ['/', AppRoutes.Releases];

  public goToReleases(): Promise<boolean> {
    return this.router.navigate(this.releasesLink);
  }
}
