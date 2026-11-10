import { Component, inject, output, signal } from '@angular/core';
import {
  email,
  FieldTree,
  form,
  FormRoot,
  minLength,
  required,
  TreeValidationResult,
} from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLoginOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { InputPassword } from '@shared/components/input/input-password/input-password';
import { InputText } from '@shared/components/input/input-text/input-text';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/form.const';
import { LoginCredentials, SocialProvider } from '../../models/auth.model';
import { AuthNavigationService } from '../../services/auth-navigation/auth-navigation.service';
import { ApiError, AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [FormRoot, TranslocoPipe, Button, InputText, InputPassword, NgIcon, RouterLink],
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
        action: (field) =>
          new Promise<TreeValidationResult>((resolve) => {
            this.apiError.set('');
            this.authService.authenticate(this.model()).subscribe({
              next: () => {
                this.onLoginSuccess();
                resolve(undefined);
              },
              error: (error: unknown) => resolve(this.onLoginError(error, field)),
            });
          }),
        // Dopo un invio fallito il focus va al primo campo con l'errore, così lo trovano anche tastiera e screen reader
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );
  private onLoginSuccess(): void {
    this.loginSuccess.emit();
  }

  // Le credenziali sbagliate stanno sul campo; un errore del server no, così si può riprovare senza modificare nulla
  private onLoginError(error: unknown, field: FieldTree<LoginCredentials>): TreeValidationResult {
    if (error instanceof ApiError && error.status === 401) {
      return { kind: 'invalidCredentials', fieldTree: field.password };
    }
    this.apiError.set('login.serverError');
    return undefined;
  }
}
