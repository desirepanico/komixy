import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
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
 *   label="login.password" inputId="login-password"
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
  /** Chiave Transloco del segnaposto; vuota = nessun segnaposto */
  public readonly placeholder = input('');
  public readonly autocomplete = input('current-password');

  // Stato che `[formField]` scrive da solo
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly touched = input(false);
  public readonly touch = output<void>();

  protected readonly visible = signal(false);

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(() => this.touched() && this.invalid());
  protected readonly visibleErrors = computed(() => (this.showError() ? this.errors() : []));

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }

  protected toggleVisible(): void {
    this.visible.update((visible) => !visible);
  }
}
