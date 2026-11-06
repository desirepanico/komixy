import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

/**
 * Nome del campo e messaggio d'errore attorno a un controllo, che si passa come contenuto.
 * `label` e `error` sono chiavi Transloco; `inputId` è lo stesso `inputId` del controllo, così
 * l'etichetta lo seleziona e il controllo punta al messaggio con `aria-describedby`.
 *
 * <app-field-wrapper label="login.email" inputId="login-email" [error]="emailError()">
 *   <app-input-text inputId="login-email" [formField]="form.email" />
 * </app-field-wrapper>
 */
@Component({
  selector: 'app-field-wrapper',
  imports: [TranslocoPipe],
  templateUrl: './field-wrapper.html',
  host: { class: 'flex flex-col gap-2' },
})
export class FieldWrapper {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  /** Chiave del messaggio; `null` quando non c'è un errore da mostrare */
  public readonly error = input<string | null>(null);
  public readonly errorParams = input<Record<string, unknown>>({});
}
