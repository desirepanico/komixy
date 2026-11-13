import { Injectable, computed, signal } from '@angular/core';
import {
  AUTH_TOKEN_STORAGE_KEY,
  GUEST_ID_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from '../../constants/form.const';
import { AppRoutes } from '../../models/app-routes.model';

/**
 * Chi sta usando l'app: iscritto o ospite. Lo stato lo imposta `AuthService` (feature auth);
 * sta in `shared` perché serve a più feature, che non possono importarsi tra loro.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  /** Come `AuthNavigationService.loginLink`, che qui non si può importare */
  public readonly signUpLink: readonly string[] = ['/', AppRoutes.Login];

  private readonly _isAuthenticated = signal<boolean>(this._read());
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
  public readonly isGuest = computed(() => !this._isAuthenticated());

  private readonly _token = signal<string | null>(this._readToken());
  /** Il token di accesso dell'iscritto, che il bearer-token interceptor manda al backend */
  public readonly token = this._token.asReadonly();

  private readonly _guestId = signal<string>(this._readGuestId());
  /**
   * Identificativo anonimo di questo browser, creato la prima volta e conservato: il backend lo usa per
   * riconoscere l'ospite (es. la busta settimanale, una apertura per ospite) anche se non ha un account.
   */
  public readonly guestId = this._guestId.asReadonly();

  public setAuthenticated(value: boolean): void {
    this._isAuthenticated.set(value);
    this._write(value);
    // Un ospite non ha token: uscire lo toglie sempre
    if (!value) this.setToken(null);
  }
  public setToken(token: string | null): void {
    this._token.set(token);
    this._writeToken(token);
  }

  /** Dopo un refresh l'iscritto resta tale: lo stato si rilegge dallo storage */
  private _read(): boolean {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY) === 'true';
    } catch {
      // Storage non disponibile: si riparte da ospite
      return false;
    }
  }
  private _readGuestId(): string {
    try {
      const saved = localStorage.getItem(GUEST_ID_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // Storage non disponibile: l'identificativo vale solo finché l'app è aperta
    }
    const created = crypto.randomUUID();
    try {
      localStorage.setItem(GUEST_ID_STORAGE_KEY, created);
    } catch {
      // Storage non disponibile (es. navigazione privata): vale solo finché l'app è aperta
    }
    return created;
  }
  private _readToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {
      // Storage non disponibile: nessun token, si riparte da ospite
      return null;
    }
  }
  private _writeToken(token: string | null): void {
    try {
      if (token) localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      else localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {
      // Storage non disponibile (es. navigazione privata): il token vale solo finché l'app è aperta
    }
  }
  private _write(value: boolean): void {
    try {
      if (value) localStorage.setItem(SESSION_STORAGE_KEY, 'true');
      else localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Storage non disponibile (es. navigazione privata): vale solo finché l'app è aperta
    }
  }
}
