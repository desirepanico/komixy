import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { safeReturnUrl } from '../../utils/safe-return-url/safe-return-url';

@Injectable({ providedIn: 'root' })
export class AuthNavigationService {
  private readonly _router = inject(Router);
  private readonly _discoverNavigation = inject(DiscoverNavigationService);

  public readonly loginLink: readonly string[] = ['/', AppRoutes.Login];
  public readonly registerLink: readonly string[] = ['/', AppRoutes.Login, AppRoutes.Register];
  public readonly forgotPasswordLink: readonly string[] = [
    '/',
    AppRoutes.Login,
    AppRoutes.ForgotPassword,
  ];

  /** Percorso del login che ricorda la pagina richiesta, per i guard. */
  public loginUrlTree(returnUrl: string): UrlTree {
    return this._router.createUrlTree(this.loginLink, { queryParams: { returnUrl } });
  }

  public goToLogin(): Promise<boolean> {
    return this._router.navigate(this.loginLink);
  }

  /** Dopo l'accesso: torna alla pagina richiesta, se è interna all'app, o a Scopri. */
  public goAfterLogin(returnUrl: string | null): Promise<boolean> {
    const requestedPage = safeReturnUrl(returnUrl, '');
    return requestedPage
      ? this._router.navigateByUrl(requestedPage)
      : this._discoverNavigation.goToDiscover();
  }
}
