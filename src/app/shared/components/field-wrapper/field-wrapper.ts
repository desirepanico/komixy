import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from '@ng-icons/material-symbols/outline';
import { VALIDATION_FALLBACK_MESSAGE, VALIDATION_MESSAGES } from '../../constants/validation.const';

/**
 * Nome del campo e messaggio d'errore attorno a un controllo, che si passa come contenuto.
 * `label` è una chiave Transloco; `inputId` è l'id del controllo, così l'etichetta lo seleziona e il
 * controllo punta al messaggio con `aria-describedby`.
 * `errors` sono gli errori da mostrare (vuoti = nessun messaggio): il wrapper scrive il primo con il
 * testo del suo tipo (`VALIDATION_MESSAGES`) e il nome del campo, uguale per tutti i form.
 * Lo usano `app-input-text` e `app-input-password`: un nuovo tipo di campo lo usa allo stesso modo.
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
