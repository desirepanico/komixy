import { Component, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { RankingView } from '../../models/ranking-view.model';

/**
 * Interruttore a due voci, Elenco e Carte. Il valore si lega con `[(view)]`:
 *   <app-ranking-view-switch [(view)]="vista" />
 */
@Component({
  selector: 'app-ranking-view-switch',
  imports: [TranslocoPipe],
  templateUrl: './ranking-view-switch.html',
  host: { class: 'inline-block' },
})
export class RankingViewSwitch {
  public readonly view = model.required<RankingView>();

  protected readonly options: readonly RankingView[] = ['list', 'cards'];
}
