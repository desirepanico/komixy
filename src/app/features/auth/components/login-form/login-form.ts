import { Component, inject, output, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLoginOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { InputPassword } from '@shared/components/input/input-password/input-password';
import { InputText } from '@shared/components/input/input-text/input-text';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/form.const';
import { firstValueFrom } from 'rxjs';
import { LoginCredentials, SocialProvider } from '../../models/auth.model';
import { AuthNavigationService } from '../../services/auth-navigation/auth-navigation.service';
import { ApiError, AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    FormRoot,
    FormField,
    TranslocoPipe,
    Button,
    InputText,
    InputPassword,
    NgIcon,
    RouterLink,
  ],
  providers: [provideIcons({ matLoginOutline, matVisibilityOutline })],
  templateUrl: './login-form.html',
})
export class LoginForm {
  public readonly loginSuccess = output<void>();
  public readonly socialLogin = output<SocialProvider>();
  public readonly guestAccess = output<void>();

  protected readonly navigation = inject(AuthNavigationService);
  private readonly authService = inject(AuthService);

  protected readonly socialProviders: readonly SocialProvider[] = ['google', 'apple'];

  private readonly model = signal<LoginCredentials>({ email: '', password: '' });

  protected readonly apiError = signal<string>('');

  protected readonly form = form(
    this.model,
    (path) => {
      required(path.email);
      email(path.email);
      required(path.password);
      minLength(path.password, PASSWORD_MIN_LENGTH);
    },
    {
      submission: {
        action: async () => {
          this.apiError.set('');
          try {
            await firstValueFrom(this.authService.authenticate(this.model()));
            this.loginSuccess.emit();
          } catch (error) {
            const invalidCredentials = error instanceof ApiError && error.status === 401;
            this.apiError.set(
              invalidCredentials ? 'login.invalidCredentials' : 'login.serverError',
            );
          }
          return undefined;
        },
        // Dopo un invio fallito il focus va al primo campo con l'errore, così lo trovano anche tastiera e screen reader
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );
}
