import { Component, computed, ElementRef, input, model, output, viewChild } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

type InputType = 'text' | 'email' | 'tel' | 'url' | 'search';

/**
 * Campo di testo con nome del campo ed errore (`app-field-wrapper`), che si lega ai Signal Forms con
 * `[formField]`. `label` è una chiave Transloco; i messaggi d'errore li scrive il wrapper. Per le password c'è `app-input-password`.
 *
 * <app-input-text
 *   label="login.email" inputId="login-email" type="email" placeholder="login.emailPlaceholder"
 *   [formField]="form.email" />
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
  /** Chiave Transloco del segnaposto */
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input('');
  public readonly inputmode = input('');

  // Stato che `[formField]` scrive da solo
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);
  public readonly disabled = input(false);
  public readonly touched = input(false);
  public readonly touch = output<void>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(() => this.touched() && this.errors().length > 0);
  protected readonly visibleErrors = computed(() => (this.showError() ? this.errors() : []));

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }
}
