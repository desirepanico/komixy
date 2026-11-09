import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormField, FormValueControl } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matVisibilityOffOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { Button } from '../../button/button';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

/**
 * `implements FormValueControl` è il contratto dei controlli per `[formField]`, che scrive da solo in
 * `value` e `disabled`: a runtime l'interfaccia non c'è, la usa solo il compilatore.
 */
@Component({
  selector: 'app-input-password',
  imports: [FieldWrapper, TranslocoPipe, NgIcon, Button],
  templateUrl: './input-password.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
  host: { class: 'block' },
})
export class InputPassword implements FormValueControl<string> {
  public readonly value = model<string>('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input<string>('current-password');

  // Stato che `[formField]` scrive da solo
  public readonly disabled = input<boolean>(false);

  protected readonly visible = signal<boolean>(false);

  // Stessa direttiva `[formField]` del form: da qui si leggono gli errori e se il campo è stato toccato
  private readonly formField = inject<FormField<string>>(FormField);
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(
    () => this.formField.state().touched() && this.formField.errors().length > 0,
  );
  protected readonly visibleErrors = computed(() =>
    this.showError() ? this.formField.errors() : [],
  );

  protected markAsTouched(): void {
    this.formField.state().markAsTouched();
  }

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }

  protected toggleVisible(): void {
    this.visible.update((visible) => !visible);
  }
}
