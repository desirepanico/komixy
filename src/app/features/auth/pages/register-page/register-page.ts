import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { AuthNavigationService } from '../../services/auth-navigation/auth-navigation.service';

@Component({
  selector: 'app-register-page',
  imports: [TranslocoPipe, RouterLink, Button],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  protected readonly navigation = inject(AuthNavigationService);
}
