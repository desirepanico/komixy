import { Component, input, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SelectButtonOption } from '../../models/select-button.model';

/**
 * Scelta singola con `[(value)]`; `label` dà il nome al gruppo.
 *   <app-select-button label="ranking.viewLabel" [options]="options" [(value)]="view" />
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
