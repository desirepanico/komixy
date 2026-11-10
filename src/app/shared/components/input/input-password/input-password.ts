import { Component, computed, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matVisibilityOffOutline, matVisibilityOutline } from '@ng-icons/material-symbols/outline';
import { Button } from '../../button/button';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

@Component({
  selector: 'app-input-password',
  imports: [FieldWrapper, TranslocoPipe, NgIcon, Button, FormField],
  templateUrl: './input-password.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
  host: { class: 'block' },
})
export class InputPassword {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly placeholder = input.required<string>();
  public readonly field = input.required<FieldTree<string>>();
  public readonly autocomplete = input<string>('current-password');

  protected readonly visible = signal<boolean>(false);

  protected readonly showError = computed(() => {
    const state = this.field()();
    return state.touched() && state.invalid();
  });

  protected toggleVisible(): void {
    this.visible.update((visible) => !visible);
  }
}
