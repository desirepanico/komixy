import { Component, inject, output, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLoginOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { simpleApple, simpleGoogle } from '@ng-icons/simple-icons';
import { Button } from '@shared/components/button/button';
import { InputPassword } from '@shared/components/input/input-password/input-password';
import { InputText } from '@shared/components/input/input-text/input-text';
import { PASSWORD_MIN_LENGTH } from '@shared/constants/form.const';
import { ApiErrorService } from '@shared/services/api-error/api-error.service';
import { ApiErrorResponse } from '@shared/utils/api-error-response/api-error-response';
import { firstValueFrom } from 'rxjs';
import { LoginRequest, SocialProvider } from '../../models/auth.model';
import { AuthNavigationService } from '../../services/auth-navigation/auth-navigation.service';
import { AuthService } from '../../services/auth/auth.service';

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
  providers: [provideIcons({ matLoginOutline, matVisibilityOutline, simpleApple, simpleGoogle })],
  templateUrl: './login-form.html',
})
export class LoginForm {
  protected readonly navigation = inject(AuthNavigationService);
  private readonly _authService = inject(AuthService);
  private readonly _apiError = inject(ApiErrorService);

  protected readonly socialProviders: readonly SocialProvider[] = ['google', 'apple'];

  public readonly loginSuccess = output<void>();
  public readonly socialLogin = output<SocialProvider>();
  public readonly guestAccess = output<void>();

  private readonly _model = signal<LoginRequest>({ email: '', password: '' });
  protected readonly form = form(
    this._model,
    (path) => {
      required(path.email);
      email(path.email);
      required(path.password);
      minLength(path.password, PASSWORD_MIN_LENGTH);
    },
    {
      submission: {
        action: async () => {
          //firstValueFrom -> Primo valore: appena l’observable emette, la Promise si risolve con quel valore. (Sottoscrizione automatica:)
          await firstValueFrom(this._authService.authenticate(this._model())).then(
            () => this._onLoginSuccess(),
            (error: ApiErrorResponse) => this._onLoginError(error),
          );
        },
        // Dopo un invio fallito il focus va al primo campo con l'errore
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );

  private _onLoginSuccess(): void {
    this.loginSuccess.emit();
  }
  // L'errore dell'API non è di un campo: si mostra in un toast, col messaggio del suo codice o questo di default
  private _onLoginError(error: ApiErrorResponse): void {
    this._apiError.handle(error, {
      summary: 'login.serverError.summaryKo',
      detail: 'login.serverError.detailKo',
    });
  }
}
