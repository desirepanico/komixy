import { inject, Injectable, signal } from '@angular/core';
import { SessionService } from '@shared/services/session/session.service';
import { LoggedUser } from '../../models/auth.model';
import { AuthNavigationService } from '../auth-navigation/auth-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly navigation = inject(AuthNavigationService);
  private readonly session = inject(SessionService);

  private readonly _loggedUser = signal<LoggedUser | null>(null);

  public readonly loggedUser = this._loggedUser.asReadonly();

  /** Chi non ha fatto l'accesso è un ospite: lo stato sta in `SessionService`, che le altre feature possono leggere */
  public readonly isAuthenticated = this.session.isAuthenticated;

  public login(user: LoggedUser): void {
    this._loggedUser.set(user);
    this.session.setAuthenticated(true);
  }

  public logout(): void {
    this._loggedUser.set(null);
    this.session.setAuthenticated(false);
    void this.navigation.goToLogin();
  }
}
