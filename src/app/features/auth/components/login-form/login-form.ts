import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matVisibilityOffOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { Button } from '@shared/components/button/button';
import { LoginCredentials } from '../../models/auth.model';

/** Form di accesso con email e password. Emette le credenziali solo se il form è valido. */
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, TranslocoPipe, NgIcon, Button],
  templateUrl: './login-form.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
})
export class LoginForm {
  public readonly loginSubmit = output<LoginCredentials>();

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /** Gli errori compaiono solo dopo il primo tentativo di invio */
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.loginSubmit.emit(this.form.getRawValue());
  }

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }
}
