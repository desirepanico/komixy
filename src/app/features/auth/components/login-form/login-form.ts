import { Component, output, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matVisibilityOffOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { Button } from '@shared/components/button/button';
import { LoginCredentials } from '../../models/auth.model';

const PASSWORD_MIN_LENGTH = 6;

/** Form di accesso con email e password. Emette le credenziali solo se il form è valido. */
@Component({
  selector: 'app-login-form',
  imports: [FormRoot, FormField, TranslocoPipe, NgIcon, Button],
  templateUrl: './login-form.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
})
export class LoginForm {
  public readonly loginSubmit = output<LoginCredentials>();

  private readonly model = signal<LoginCredentials>({ email: '', password: '' });

  /** L'azione di invio parte solo se i campi sono validi; `submit` segna i campi come toccati e così compaiono gli errori */
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
          this.loginSubmit.emit(this.model());
          return undefined;
        },
      },
    },
  );

  protected readonly passwordMinLength = PASSWORD_MIN_LENGTH;
  protected readonly showPassword = signal(false);

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }
}
