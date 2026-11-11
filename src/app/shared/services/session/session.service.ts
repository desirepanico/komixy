<<<<<<< HEAD
import { computed, Injectable, signal } from '@angular/core';
import { SessionUser } from '../../models/session-user.model';
import { UserRole } from '../../models/user-role.model';

/** Chi è l'utente corrente, visibile a tutte le feature (l'accesso vero sta in `AuthService`) */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly state = signal<SessionUser | null>(null);

  public readonly user = this.state.asReadonly();
  public readonly isGuest = computed(() => this.state()?.role === UserRole.Guest);

  public start(user: SessionUser): void {
    this.state.set(user);
  }

  public end(): void {
    this.state.set(null);
=======
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
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  }
}
