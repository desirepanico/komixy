import { inject, Injectable, signal } from '@angular/core';
import {
  AUTH_USER_STORAGE_KEY,
  DEMO_CREDENTIALS,
  FAKE_API_DELAY_MS,
} from '@shared/constants/form.const';
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
  private readonly _navigation = inject(AuthNavigationService);
  private readonly _session = inject(SessionService);

  private readonly _loggedUser = signal<LoggedUser | null>(this._read());

  public readonly loggedUser = this._loggedUser.asReadonly();

  /** Lo stato sta in `SessionService`, che le altre feature possono leggere */
  public readonly isAuthenticated = this._session.isAuthenticated;

  public login(user: LoggedUser): void {
    this._loggedUser.set(user);
    this._write(user);
    this._session.setAuthenticated(true);
  }

  /** L'ospite entra senza account: può guardare ma non salvare in lista */
  public enterAsGuest(): void {
    this._loggedUser.set(null);
    this._write(null);
    this._session.setAuthenticated(false);
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
    this._write(null);
    this._session.setAuthenticated(false);
    void this._navigation.goToLogin();
  }

  /** Dopo un refresh l'utente iscritto si rilegge dallo storage; l'ospite non si salva */
  private _read(): LoggedUser | null {
    if (!this._session.isAuthenticated()) return null;
    try {
      const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      const value: unknown = raw ? JSON.parse(raw) : null;
      if (
        value &&
        typeof value === 'object' &&
        'id' in value &&
        'email' in value &&
        'userRole' in value
      ) {
        return value as LoggedUser;
      }
    } catch {
      // Storage non disponibile o contenuto rovinato: nessun utente
    }
    return null;
  }
  private _write(user: LoggedUser | null): void {
    try {
      if (user) localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch {
      // Storage non disponibile (es. navigazione privata): vale solo finché l'app è aperta
    }
  }
}
