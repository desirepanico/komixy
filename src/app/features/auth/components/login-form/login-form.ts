import { Component, output, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { InputPassword } from '@shared/components/input/input-password/input-password';
import { InputText } from '@shared/components/input/input-text/input-text';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/form.const';
import { LoginCredentials, SocialProvider } from '../../models/auth.model';

@Component({
  selector: 'app-login-form',
  imports: [FormRoot, FormField, TranslocoPipe, Button, InputText, InputPassword],
  templateUrl: './login-form.html',
})
export class LoginForm {
  public readonly loginSubmit = output<LoginCredentials>();
  public readonly forgotPassword = output<void>();
  public readonly registerClick = output<void>();
  public readonly socialLogin = output<SocialProvider>();
  public readonly guestAccess = output<void>();

  protected readonly socialProviders: readonly SocialProvider[] = ['google', 'apple'];

  private readonly model = signal<LoginCredentials>({ email: '', password: '' });

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
        // Dopo un invio fallito il focus va al primo campo con l'errore, così lo trovano anche tastiera e screen reader
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );
}
