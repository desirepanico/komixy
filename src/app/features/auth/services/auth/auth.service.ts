import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AUTH_USER_STORAGE_KEY } from '@shared/constants/form.const';
import { ApiResponse } from '@shared/models/api-response.model';
import { SessionService } from '@shared/services/session/session.service';
import { ApiErrorResponse } from '@shared/utils/api-error-response/api-error-response';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoggedUser, LoginRequest, LoginResponse } from '../../models/auth.model';
import { AuthNavigationService } from '../auth-navigation/auth-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _navigation = inject(AuthNavigationService);
  private readonly _session = inject(SessionService);
  private readonly _http = inject(HttpClient);

  private readonly _apiGroup = '/auth';

  private readonly _loggedUser = signal<LoggedUser | null>(this._read());

  public readonly loggedUser = this._loggedUser.asReadonly();

  /** Lo stato sta in `SessionService`, che le altre feature possono leggere */
  public readonly isAuthenticated = this._session.isAuthenticated;

  public login(user: LoggedUser, token: string | null = null): void {
    this._loggedUser.set(user);
    this._write(user);
    this._session.setToken(token);
    this._session.setAuthenticated(true);
  }

  /** L'ospite entra senza account: può guardare ma non salvare in lista */
  public enterAsGuest(): void {
    this._loggedUser.set(null);
    this._write(null);
    this._session.setAuthenticated(false);
  }

  public authenticate(credentials: LoginRequest): Observable<LoginResponse> {
    return this._http.post<ApiResponse<LoginResponse>>(`${this._apiGroup}/login`, credentials).pipe(
      map((response) => response.result), //estrae i dati dell'utente.
      tap(({ token, ...user }) => this.login(user, token)), //esegue il login e aggiorna lo stato di autenticazione.
      catchError((response: HttpErrorResponse) =>
        throwError(() => ApiErrorResponse.fromHttpError(response)),
      ),
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
