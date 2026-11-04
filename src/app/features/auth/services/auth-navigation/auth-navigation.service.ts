import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';
import { safeReturnUrl } from '../../utils/safe-return-url/safe-return-url';

/** Navigazione della feature auth: percorsi e spostamenti da e verso il login. */
@Injectable({ providedIn: 'root' })
export class AuthNavigationService {
  private readonly router = inject(Router);

  public readonly loginLink: readonly string[] = ['/', AppRoutes.Login];

  /** Percorso del login che ricorda la pagina richiesta, per i guard. */
  public loginUrlTree(returnUrl: string): UrlTree {
    return this.router.createUrlTree([AppRoutes.Login], { queryParams: { returnUrl } });
  }

  /** Percorso di arrivo di chi non ha il ruolo richiesto, per i guard. */
  public forbiddenUrlTree(): UrlTree {
    return this.router.createUrlTree([AppRoutes.Discover]);
  }

  public goToLogin(): Promise<boolean> {
    return this.router.navigate([AppRoutes.Login]);
  }

  /** Dopo l'accesso: torna alla pagina richiesta, se è interna all'app, o a Scopri. */
  public goAfterLogin(returnUrl: string | null): Promise<boolean> {
    return this.router.navigateByUrl(safeReturnUrl(returnUrl, `/${AppRoutes.Discover}`));
  }
}
