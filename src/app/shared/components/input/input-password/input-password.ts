import { Component, input, model, output, viewChild } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { InputText } from '../input-text/input-text';

/**
 * Campo password (nome del campo, errore e bottone per mostrarla), per i Signal Forms con `[formField]`.
 * Gli input sono quelli di `app-input-text`.
 *
 * <app-input-password
 *   label="login.password" inputId="login-password"
 *   [errorMessages]="{ required: 'login.errors.passwordRequired' }" [formField]="form.password" />
 */
@Component({
  selector: 'app-input-password',
  imports: [InputText],
  templateUrl: './input-password.html',
  host: { class: 'block' },
})
export class InputPassword implements FormValueControl<string> {
  public readonly value = model('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  /** Chiave Transloco del segnaposto; vuota = nessun segnaposto */
  public readonly placeholder = input('');
  public readonly autocomplete = input('current-password');
  /** Chiave del messaggio per ogni `kind` di errore (`required`, `minLength`, ...) */
  public readonly errorMessages = input<Record<string, string>>({});
  public readonly errorParams = input<Record<string, unknown>>({});

  // Stato che `[formField]` scrive da solo
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly touched = input(false);
  public readonly touch = output<void>();

  private readonly text = viewChild.required(InputText);

  public focus(options?: FocusOptions): void {
    this.text().focus(options);
  }
}
