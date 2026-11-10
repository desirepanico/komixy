import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { translateSignal } from '@jsverse/transloco';
import { ErrorMessage } from '../error-message/error-message';

@Component({
  selector: 'app-field-wrapper',
  imports: [ErrorMessage],
  templateUrl: './field-wrapper.html',
  host: { class: 'flex flex-col gap-2' },
})
export class FieldWrapper {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly errors = input<readonly ValidationError[]>([]);

  protected readonly name = translateSignal(this.label);

  // Nel messaggio il nome sta a metà frase: iniziale minuscola («Il campo email è obbligatorio»)
  protected readonly fieldName = computed(() => {
    const name = this.name();
    return name.charAt(0).toLowerCase() + name.slice(1);
  });
}
