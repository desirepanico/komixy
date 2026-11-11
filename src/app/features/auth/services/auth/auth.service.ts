<<<<<<< HEAD
import { computed, inject, Injectable, signal } from '@angular/core';
import { DEMO_CREDENTIALS, FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { LoggedUser, LoginCredentials } from '../../models/auth.model';
=======
import { inject, Injectable, signal } from '@angular/core';
import { SessionService } from '@shared/services/session/session.service';
import { LoggedUser } from '../../models/auth.model';
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
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
<<<<<<< HEAD
    this.session.start({ id: user.id, role: user.userRole });
  }

  // TODO: sostituire con la chiamata all'API di autenticazione
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
=======
    this.session.setAuthenticated(true);
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  }

  public logout(): void {
    this._loggedUser.set(null);
<<<<<<< HEAD
    this.session.end();
=======
    this.session.setAuthenticated(false);
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
    void this.navigation.goToLogin();
  }
}
