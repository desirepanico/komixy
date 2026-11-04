import { computed, inject, Injectable, signal } from '@angular/core';
import { LoggedUser } from '../../models/auth.model';
import { AuthNavigationService } from '../auth-navigation/auth-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly navigation = inject(AuthNavigationService);

  private readonly _loggedUser = signal<LoggedUser | null>(null);

  public readonly loggedUser = this._loggedUser.asReadonly();

  public readonly isAuthenticated = computed(() => this._loggedUser() !== null);

  public login(user: LoggedUser): void {
    this._loggedUser.set(user);
  }

  public logout(): void {
    this._loggedUser.set(null);
    void this.navigation.goToLogin();
  }
}
