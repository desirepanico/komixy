import { Component, input, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SelectButtonOption } from '../../models/select-button.model';

@Component({
  selector: 'app-select-button',
  imports: [TranslocoPipe],
  templateUrl: './select-button.html',
  host: { class: 'inline-block' },
})
export class SelectButton<T extends string = string> {
  public readonly label = input.required<string>();
  public readonly options = input.required<readonly SelectButtonOption<T>[]>();
  public readonly value = model.required<T>();
}
