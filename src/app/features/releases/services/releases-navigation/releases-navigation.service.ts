import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Navigazione della feature releases: percorsi e spostamenti che partono dalle uscite. */
@Injectable({ providedIn: 'root' })
export class ReleasesNavigationService {
  private readonly router = inject(Router);

  public readonly releasesLink: readonly string[] = ['/', AppRoutes.Releases];
  public readonly discoverLink: readonly string[] = ['/', AppRoutes.Discover];

  public goToDiscover(): Promise<boolean> {
    return this.router.navigate(this.discoverLink);
  }
}
