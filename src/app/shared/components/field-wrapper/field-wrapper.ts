import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from '@ng-icons/material-symbols/outline';
import { VALIDATION_FALLBACK_MESSAGE, VALIDATION_MESSAGES } from '../../constants/form.const';

/**
 * `errors` vuoto = nessun messaggio; altrimenti scrive il primo con il testo del suo tipo
 * (`VALIDATION_MESSAGES`) e il nome del campo. `inputId` collega etichetta e `aria-describedby`.
 */
@Component({
  selector: 'app-field-wrapper',
  imports: [TranslocoPipe, NgIcon],
  templateUrl: './field-wrapper.html',
  providers: [provideIcons({ matErrorOutline })],
  host: { class: 'flex flex-col gap-2' },
})
export class FieldWrapper {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  protected readonly error = computed(() => {
    const error = this.errors()[0];
    if (!error) return null;
    const min = 'minLength' in error && typeof error.minLength === 'number' ? error.minLength : 0;
    return { key: VALIDATION_MESSAGES[error.kind] ?? VALIDATION_FALLBACK_MESSAGE, min };
  });
}
