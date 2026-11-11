import { Injectable, computed, signal } from '@angular/core';
import { AppRoutes } from '../../models/app-routes.model';

/**
 * Chi sta usando l'app: iscritto o ospite. Lo stato lo imposta `AuthService` (feature auth);
 * sta in `shared` perché serve a più feature, che non possono importarsi tra loro.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _isAuthenticated = signal<boolean>(false);

  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
  public readonly isGuest = computed(() => !this._isAuthenticated());

  /** Dove si invita un ospite a iscriversi: stessa pagina di `AuthNavigationService.loginLink`, che qui non si può importare */
  public readonly signUpLink: readonly string[] = ['/', AppRoutes.Login];

  public setAuthenticated(value: boolean): void {
    this._isAuthenticated.set(value);
  }
}
