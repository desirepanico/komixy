import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { FormField, FormValueControl } from '@angular/forms/signals';
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
  public readonly disabled = input(false);
  public readonly touch = output<void>();

  /** Stato del campo: `touched` ed errori si leggono da qui e non da `input()`, che il form non userebbe mai */
  private readonly formField = inject<FormField<string>>(FormField);
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(
    () => this.formField.state().touched() && this.formField.errors().length > 0,
  );
  protected readonly visibleErrors = computed(() =>
    this.showError() ? this.formField.errors() : [],
  );

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }
}
