import { Component, input, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SelectButtonOption } from '../../models/select-button.model';

/**
 * Interruttore a voci (una sola attiva alla volta, come Elenco / Carte). Il valore si lega con `[(value)]`;
 * `label` è la chiave Transloco che dà un nome al gruppo e il testo di ogni voce è la sua `label`.
 *   <app-select-button label="ranking.viewLabel" [options]="viste" [(value)]="vista" />
 */
@Component({
  selector: 'app-select-button',
  imports: [TranslocoPipe],
  templateUrl: './select-button.html',
  host: { class: 'inline-block' },
})
export class SelectButton<T extends string = string> {
  /** Nome del gruppo per gli screen reader: chiave Transloco */
  public readonly label = input.required<string>();
  public readonly options = input.required<readonly SelectButtonOption<T>[]>();
  public readonly value = model.required<T>();
}
