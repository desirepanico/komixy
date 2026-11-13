import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginVolumes } from '../../components/login-volumes/login-volumes';
import { SocialProvider } from '../../models/auth.model';
import { UserRole } from '@shared/models/user-role.model';
import { AuthNavigationService } from '../../services/auth-navigation/auth-navigation.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm, LoginVolumes, TranslocoPipe],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly _authService = inject(AuthService);
  private readonly _navigation = inject(AuthNavigationService);
  private readonly _route = inject(ActivatedRoute);

  protected loginWithProvider(provider: SocialProvider): void {
    // TODO(api): sostituire con l'accesso reale con Google o Apple
    this._authService.login({ id: provider, email: '', userRole: UserRole.User });
    this.goAfterLogin();
  }

  protected enterAsGuest(): void {
    this._authService.enterAsGuest();
    this.goAfterLogin();
  }

  protected goAfterLogin(): void {
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
    void this._navigation.goAfterLogin(returnUrl);
  }
}
