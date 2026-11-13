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

@Component({
  selector: 'app-input-password',
  imports: [FieldWrapper, TranslocoPipe, NgIcon, Button],
  templateUrl: './input-password.html',
  providers: [provideIcons({ matVisibilityOutline, matVisibilityOffOutline })],
  host: { class: 'block' },
})
export class InputPassword implements FormValueControl<string> {
  private readonly _formField = inject<FormField<string>>(FormField);

  private readonly _field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  public readonly value = model<string>('');
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input<string>('current-password');
  public readonly disabled = input<boolean>(false);

  protected readonly visible = signal<boolean>(false);
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
  protected toggleVisible(): void {
    this.visible.update((visible) => !visible);
  }
}
