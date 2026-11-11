import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { AuthNavigationService } from '../../services/auth-navigation/auth-navigation.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [TranslocoPipe, RouterLink, Button],
  templateUrl: './forgot-password-page.html',
})
export class ForgotPasswordPage {
  protected readonly navigation = inject(AuthNavigationService);
}
