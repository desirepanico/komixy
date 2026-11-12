import { inject, Injectable, signal } from '@angular/core';
import { DEMO_CREDENTIALS, FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { LoggedUser, LoginCredentials } from '../../models/auth.model';
import { AuthNavigationService } from '../auth-navigation/auth-navigation.service';

export class ApiError extends Error {
  public constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

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

  /** L'ospite entra senza account: può guardare ma non salvare in lista */
  public enterAsGuest(): void {
    this._loggedUser.set(null);
    this.session.setAuthenticated(false);
  }

  // TODO(api): sostituire con la chiamata all'API di autenticazione
  public authenticate(credentials: LoginCredentials): Observable<LoggedUser> {
    const email = credentials.email.trim().toLowerCase();
    if (email !== DEMO_CREDENTIALS.email || credentials.password !== DEMO_CREDENTIALS.password) {
      return throwError(() => new ApiError(401, 'Credenziali non valide')).pipe(
        delay(FAKE_API_DELAY_MS),
      );
    }
    return of<LoggedUser>({ id: email, email, userRole: UserRole.User }).pipe(
      delay(FAKE_API_DELAY_MS),
      tap((user) => this.login(user)),
    );
  }

  public logout(): void {
    this._loggedUser.set(null);
    this.session.setAuthenticated(false);
    void this.navigation.goToLogin();
  }
}
