import { Component, computed, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { FormField, FormValueControl } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

type InputType = 'text' | 'email' | 'tel' | 'url' | 'search';

/**
 * Campo di testo con nome del campo ed errore (`app-field-wrapper`), che si lega ai Signal Forms con
 * `[formField]`. `label` è una chiave Transloco; i messaggi d'errore li scrive il wrapper. Per le password c'è `app-input-password`.
 *
 * `implements FormValueControl` è il contratto dei controlli per `[formField]`: la direttiva scrive da sola
 * in `value` (a due vie con il modello del form) e in `disabled`. A runtime l'interfaccia non c'è: la usa
 * solo il compilatore, per controllare i tipi.
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

  /**
   * La direttiva `[formField]` sta sullo stesso elemento di questo componente: iniettandola si ottiene
   * lo stato del campo del form (es. `form.email`). Da qui si leggono gli errori e se il campo è stato
   * toccato, così il form non deve passarli al componente.
   */
  private readonly formField = inject<FormField<string>>(FormField);
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(
    () => this.formField.state().touched() && this.formField.errors().length > 0,
  );
  protected readonly visibleErrors = computed(() =>
    this.showError() ? this.formField.errors() : [],
  );

  /** All'uscita dal campo: da qui in poi gli errori si vedono */
  protected markAsTouched(): void {
    this.formField.state().markAsTouched();
  }

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }
}
