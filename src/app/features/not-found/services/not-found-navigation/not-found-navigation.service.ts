import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Navigazione della feature not-found: da una pagina inesistente si torna a Scopri. */
@Injectable({ providedIn: 'root' })
export class NotFoundNavigationService {
  private readonly router = inject(Router);

  public readonly homeLink: readonly string[] = ['/', AppRoutes.Discover];

  public goHome(): Promise<boolean> {
    return this.router.navigate(this.homeLink);
  }
}
