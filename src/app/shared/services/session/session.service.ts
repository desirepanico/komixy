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
  }
}
