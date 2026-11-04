import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matMenuBookOutline } from '@ng-icons/material-symbols/outline';
import { AppRoutes } from '@shared/constants/app-routes';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginCredentials, UserRole } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { safeReturnUrl } from '../../utils/safe-return-url';

/** Pagina di accesso. Dopo il login torna alla pagina richiesta (`returnUrl`) o a Scopri. */
@Component({
  selector: 'app-login-page',
  imports: [LoginForm, NgIcon, TranslocoPipe],
  templateUrl: './login-page.html',
  providers: [provideIcons({ matMenuBookOutline })],
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected login(credentials: LoginCredentials): void {
    // TODO: sostituire con la chiamata all'API di autenticazione
    this.authService.login({
      id: credentials.email,
      email: credentials.email,
      userRole: UserRole.User,
    });

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    void this.router.navigateByUrl(safeReturnUrl(returnUrl, `/${AppRoutes.Discover}`));
  }
}
