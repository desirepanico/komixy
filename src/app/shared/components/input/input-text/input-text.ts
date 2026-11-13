import { Component, computed, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { FormField, FormValueControl } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

type InputType = 'text' | 'email' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-input-text',
  imports: [FieldWrapper, TranslocoPipe],
  templateUrl: './input-text.html',
  host: { class: 'block' },
})
export class InputText implements FormValueControl<string> {
  private readonly _formField = inject<FormField<string>>(FormField);

  private readonly _field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  public readonly value = model<string>('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly type = input<InputType>('text');
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input<string>('');
  public readonly disabled = input<boolean>(false);

  protected readonly showError = computed(
    () => this._formField.state().touched() && this._formField.errors().length > 0,
  );
  protected readonly visibleErrors = computed(() =>
    this.showError() ? this._formField.errors() : [],
  );

  protected markAsTouched(): void {
    this._formField.state().markAsTouched();
  }
  public focus(options?: FocusOptions): void {
    this._field().nativeElement.focus(options);
  }
}
