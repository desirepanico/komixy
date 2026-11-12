import { Component, computed, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { FormField, FormValueControl } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

type InputType = 'text' | 'email' | 'tel' | 'url' | 'search';

/**
 * Si lega ai Signal Forms con `[formField]`, che scrive in `value` e `disabled` (contratto `FormValueControl`,
 * solo per il compilatore). Iniettando la direttiva si leggono errori e stato «toccato» senza passarli dal form.
 *   <app-input-text label="login.email" inputId="login-email" placeholder="login.emailPlaceholder" [formField]="form.email" />
 */
@Component({
  selector: 'app-input-text',
  imports: [FieldWrapper, TranslocoPipe],
  templateUrl: './input-text.html',
  host: { class: 'block' },
})
export class InputText implements FormValueControl<string> {
  private readonly formField = inject<FormField<string>>(FormField);

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  public readonly value = model<string>('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly type = input<InputType>('text');
  /** Chiave Transloco del segnaposto */
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input<string>('');
  public readonly disabled = input<boolean>(false);

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
