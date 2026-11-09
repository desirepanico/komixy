import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { safeReturnUrl } from '../../utils/safe-return-url/safe-return-url';

@Injectable({ providedIn: 'root' })
export class AuthNavigationService {
  private readonly router = inject(Router);
  private readonly discoverNavigation = inject(DiscoverNavigationService);

  public readonly loginLink: readonly string[] = ['/', AppRoutes.Login];
  public readonly registerLink: readonly string[] = ['/', AppRoutes.Login, AppRoutes.Register];
  public readonly forgotPasswordLink: readonly string[] = [
    '/',
    AppRoutes.Login,
    AppRoutes.ForgotPassword,
  ];

  /** Percorso del login che ricorda la pagina richiesta, per i guard. */
  public loginUrlTree(returnUrl: string): UrlTree {
    return this.router.createUrlTree(this.loginLink, { queryParams: { returnUrl } });
  }

  public goToLogin(): Promise<boolean> {
    return this.router.navigate(this.loginLink);
  }

  /** Dopo l'accesso: torna alla pagina richiesta, se è interna all'app, o a Scopri. */
  public goAfterLogin(returnUrl: string | null): Promise<boolean> {
    const paginaRichiesta = safeReturnUrl(returnUrl, '');
    return paginaRichiesta
      ? this.router.navigateByUrl(paginaRichiesta)
      : this.discoverNavigation.goToDiscover();
  }
}
