import { Component, input, model, output, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matVisibilityOffOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { Button } from '../../button/button';
import { InputText } from '../input-text/input-text';

/**
 * Campo password con il bottone per mostrarla o nasconderla; si lega ai Signal Forms con `[formField]`.
 * Come `app-input-text`, `inputId` deve essere lo stesso di `app-field-wrapper`.
 *
 * <app-input-password inputId="login-password" [formField]="form.password" />
 */
@Component({
  selector: 'app-input-password',
  imports: [InputText, Button, NgIcon, TranslocoPipe],
  templateUrl: './input-password.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
  host: { class: 'block' },
})
export class InputPassword implements FormValueControl<string> {
  public readonly value = model('');
  public readonly inputId = input.required<string>();
  /** Chiave Transloco del segnaposto; vuota = nessun segnaposto */
  public readonly placeholder = input('');
  public readonly autocomplete = input('current-password');

  // Stato che `[formField]` scrive da solo
  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly touched = input(false);
  public readonly touch = output<void>();

  protected readonly visible = signal(false);

  private readonly text = viewChild.required(InputText);

  public focus(options?: FocusOptions): void {
    this.text().focus(options);
  }

  protected toggle(): void {
    this.visible.update((visible) => !visible);
  }
}
