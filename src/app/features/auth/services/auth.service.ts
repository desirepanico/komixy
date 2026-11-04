import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../app.routes';
import { LoggedUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private readonly _loggedUser = signal<LoggedUser | null>(null);

  public readonly loggedUser = this._loggedUser.asReadonly();

  public readonly isAuthenticated = computed(() => this._loggedUser() !== null);

  public login(user: LoggedUser): void {
    this._loggedUser.set(user);
  }

  public logout(): void {
    this._loggedUser.set(null);
    void this.router.navigate([AppRoutes.Login]);
  }
}
