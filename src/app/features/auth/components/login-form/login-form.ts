import { Component, output, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { InputPassword } from '@shared/components/input/input-password/input-password';
import { InputText } from '@shared/components/input/input-text/input-text';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/auth.const';
import { LoginCredentials } from '../../models/auth.model';

/** Form di accesso con email e password. Emette le credenziali solo se il form è valido. */
@Component({
  selector: 'app-login-form',
  imports: [FormRoot, FormField, TranslocoPipe, Button, InputText, InputPassword],
  templateUrl: './login-form.html',
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
        // Dopo un invio fallito il focus va al primo campo con l'errore, così lo trovano anche tastiera e screen reader
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );
}
