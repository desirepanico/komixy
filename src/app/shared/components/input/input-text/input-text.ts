import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

export type InputType = 'text' | 'email';

@Component({
  selector: 'app-input-text',
  imports: [FieldWrapper, TranslocoPipe, FormField],
  templateUrl: './input-text.html',
  host: { class: 'block' },
})
export class InputText {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly placeholder = input.required<string>();
  public readonly field = input.required<FieldTree<string>>();
  public readonly autocomplete = input<string>('');
  public readonly type = input<InputType>('text');

  protected readonly showError = computed(() => {
    const state = this.field()();
    return state.touched() && state.invalid();
  });
}
