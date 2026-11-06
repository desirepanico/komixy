import { Component, computed, output, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@shared/components/button/button';
import { FieldWrapper } from '@shared/components/field-wrapper/field-wrapper';
import { InputPassword } from '@shared/components/input/input-password/input-password';
import { InputText } from '@shared/components/input/input-text/input-text';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/auth.const';
import { LoginCredentials } from '../../models/auth.model';

/** Form di accesso con email e password. Emette le credenziali solo se il form è valido. */
@Component({
  selector: 'app-login-form',
  imports: [FormRoot, FormField, TranslocoPipe, Button, FieldWrapper, InputText, InputPassword],
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
      },
    },
  );

  protected readonly passwordMinLength = PASSWORD_MIN_LENGTH;

  /** Chiavi di traduzione degli errori: compaiono solo dopo che il campo è stato toccato */
  protected readonly emailError = computed(() => {
    const campo = this.form.email();
    if (!campo.touched() || !campo.invalid()) return null;
    return campo.errors()[0].kind === 'required'
      ? 'login.errors.emailRequired'
      : 'login.errors.emailInvalid';
  });

  protected readonly passwordError = computed(() => {
    const campo = this.form.password();
    if (!campo.touched() || !campo.invalid()) return null;
    return campo.errors()[0].kind === 'required'
      ? 'login.errors.passwordRequired'
      : 'login.errors.passwordMinLength';
  });
}
