import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldWrapper } from '../../field-wrapper/field-wrapper';

type InputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'number' | 'date';

/**
 * Campo di testo con nome del campo ed errore (`app-field-wrapper`). Riceve il campo del form come `field`
 * e lo lega al suo `<input>` con `[formField]`. `label` e `placeholder` sono chiavi Transloco.
 * Per le password c'è `app-input-password`.
 *
 * <app-input-text
 *   label="login.email" inputId="login-email" type="email" placeholder="login.emailPlaceholder"
 *   [field]="form.email" />
 */
@Component({
  selector: 'app-input-text',
  imports: [FormField, FieldWrapper, TranslocoPipe],
  templateUrl: './input-text.html',
  host: { class: 'block' },
})
export class InputText {
  public readonly field = input.required<
    FieldTree<string> | FieldTree<number | null> | FieldTree<Date | null>
  >();
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly type = input<InputType>('text');
  public readonly placeholder = input.required<string>();
  public readonly autocomplete = input<string>('');

  // `type` decide il tipo del campo: i cast servono solo al type-check del template
  protected readonly asString = computed(() => this.field() as FieldTree<string>);
  protected readonly asNumber = computed(() => this.field() as FieldTree<number | null>);
  protected readonly asDate = computed(() => this.field() as FieldTree<Date | null>);

  protected readonly showError = computed(() => {
    const state = this.field()();
    return state.touched() && state.invalid();
  });
  protected readonly visibleErrors = computed(() =>
    this.showError() ? this.field()().errors() : [],
  );
}
