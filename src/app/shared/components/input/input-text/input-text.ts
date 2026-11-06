import { Component, computed, ElementRef, input, model, output, viewChild } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

export type InputType = 'text' | 'email' | 'tel' | 'url' | 'search';

/**
 * Campo di testo con nome del campo ed errore (`app-field-wrapper`), che si lega ai Signal Forms con
 * `[formField]`. `label` e i messaggi sono chiavi Transloco; `errorMessages` associa il `kind` di
 * ogni errore alla sua chiave. Per le password c'è `app-input-password`.
 *
 * <app-input-text
 *   label="login.email" inputId="login-email" type="email"
 *   [errorMessages]="{ required: 'login.errors.emailRequired' }" [formField]="form.email" />
 */
@Component({
  selector: 'app-input-text',
  imports: [FieldWrapper, TranslocoPipe],
  templateUrl: './input-text.html',
  host: { class: 'block' },
})
export class InputText implements FormValueControl<string> {
  public readonly value = model('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly type = input<InputType>('text');
  /** Chiave Transloco del segnaposto; vuota = nessun segnaposto */
  public readonly placeholder = input('');
  public readonly autocomplete = input('');
  public readonly inputmode = input('');
  /** Chiave del messaggio per ogni `kind` di errore (`required`, `email`, ...) */
  public readonly errorMessages = input<Record<string, string>>({});
  public readonly errorParams = input<Record<string, unknown>>({});

  // Stato che `[formField]` scrive da solo
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly touched = input(false);
  public readonly touch = output<void>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(() => this.touched() && this.invalid());
  protected readonly error = computed(() =>
    this.showError() ? (this.errorMessages()[this.errors()[0]?.kind ?? ''] ?? null) : null,
  );

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }
}
