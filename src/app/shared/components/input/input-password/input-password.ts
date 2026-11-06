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
 * Campo password con nome del campo, errore (`app-field-wrapper`) e bottone per mostrarla; si lega
 * ai Signal Forms con `[formField]`. `label` è una chiave Transloco.
 *
 * <app-input-password
 *   label="login.password" inputId="login-password" placeholder="login.passwordPlaceholder"
 *   [formField]="form.password" />
 */
@Component({
  selector: 'app-input-password',
  imports: [FieldWrapper, TranslocoPipe, NgIcon, Button],
  templateUrl: './input-password.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
  host: { class: 'block' },
})
export class InputPassword implements FormValueControl<string> {
  public readonly value = model('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  /** Chiave Transloco del segnaposto */
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input('current-password');

  // Stato che `[formField]` scrive da solo
  public readonly disabled = input(false);

  protected readonly visible = signal(false);

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

  /** All'uscita dal campo: da qui in poi gli errori si vedono */
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
