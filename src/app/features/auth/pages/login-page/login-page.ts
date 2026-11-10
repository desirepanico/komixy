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
  private readonly authService = inject(AuthService);
  private readonly navigation = inject(AuthNavigationService);
  private readonly route = inject(ActivatedRoute);

  protected loginWithProvider(provider: SocialProvider): void {
    // TODO: sostituire con l'accesso reale con Google o Apple
    this.authService.login({ id: provider, email: '', userRole: UserRole.User });
    this.goAfterLogin();
  }

  protected enterAsGuest(): void {
    // TODO: bloccare modifica, aggiunta ed eliminazione per UserRole.Guest e mostrare l'invito «Iscriviti all'applicazione»
    this.authService.login({ id: 'guest', email: '', userRole: UserRole.Guest });
    this.goAfterLogin();
  }

  protected goAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    void this.navigation.goAfterLogin(returnUrl);
  }
}
