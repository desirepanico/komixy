import { Component, computed, ElementRef, input, model, output, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';

export type InputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';

/**
 * Campo di testo che si lega ai Signal Forms con `[formField]`. Con `app-field-wrapper` attorno
 * mostra il nome del campo e l'errore; `inputId` deve essere lo stesso del wrapper.
 * Il contenuto passato (es. un bottone) sta sopra al campo: con `trailingSpace` il testo gli lascia posto a destra.
 *
 * <app-input-text inputId="login-email" type="email" placeholder="login.emailPlaceholder" [formField]="form.email" />
 */
@Component({
  selector: 'app-input-text',
  imports: [TranslocoPipe],
  templateUrl: './input-text.html',
  host: { class: 'relative block' },
})
export class InputText implements FormValueControl<string> {
  public readonly value = model('');
  public readonly inputId = input.required<string>();
  public readonly type = input<InputType>('text');
  /** Chiave Transloco del segnaposto; vuota = nessun segnaposto */
  public readonly placeholder = input('');
  public readonly autocomplete = input('');
  public readonly inputmode = input('');
  public readonly trailingSpace = input(false);

  // Stato che `[formField]` scrive da solo
  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly touched = input(false);
  public readonly touch = output<void>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** L'errore si vede (e si annuncia) solo dopo che l'utente ha toccato il campo */
  protected readonly showError = computed(() => this.touched() && this.invalid());

  public focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }
}
