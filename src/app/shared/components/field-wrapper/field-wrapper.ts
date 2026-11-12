import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from '@ng-icons/material-symbols/outline';
import { VALIDATION_FALLBACK_MESSAGE, VALIDATION_MESSAGES } from '../../constants/form.const';

/**
 * Etichetta ed errore attorno a un controllo passato come contenuto. `inputId` è l'id del controllo:
 * collega l'etichetta e l'`aria-describedby` del messaggio.
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

  /** Chiave del messaggio e lunghezza minima richiesta (solo per `minLength`) */
  protected readonly error = computed(() => {
    const error = this.errors()[0];
    if (!error) return null;
    const min = 'minLength' in error && typeof error.minLength === 'number' ? error.minLength : 0;
    return { key: VALIDATION_MESSAGES[error.kind] ?? VALIDATION_FALLBACK_MESSAGE, min };
  });
}
