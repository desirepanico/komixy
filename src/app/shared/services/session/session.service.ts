import { Injectable, computed, signal } from '@angular/core';
import { SESSION_STORAGE_KEY } from '../../constants/form.const';
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

  public setAuthenticated(value: boolean): void {
    this._isAuthenticated.set(value);
    this._write(value);
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
  private _write(value: boolean): void {
    try {
      if (value) localStorage.setItem(SESSION_STORAGE_KEY, 'true');
      else localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Storage non disponibile (es. navigazione privata): vale solo finché l'app è aperta
    }
  }
}
