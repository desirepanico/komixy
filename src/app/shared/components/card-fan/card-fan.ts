import { Component, afterNextRender, computed, input, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CARD_FAN_SPREAD_DEG } from '../../constants/ui.const';
import { RankingEntry } from '../../models/ranking-entry.model';
import { PackCard } from '../pack-card/pack-card';
import { fanAngle } from './fan-layout/fan-layout';

/**
 * Le carte della busta a ventaglio: la 1ª a destra e in primo piano, l'ultima a sinistra.
 * Ogni carta è un bottone (Tab per scorrerle, Invio per sceglierla). Il ventaglio si apre da solo
 * appena compare; con «riduci movimento» compare già aperto.
 *   <app-card-fan [entries]="carte" (cardSelect)="scegli($event)" />
 */
@Component({
  selector: 'app-card-fan',
  imports: [PackCard, TranslocoPipe],
  templateUrl: './card-fan.html',
  host: { class: 'block', 'data-no-swipe': '' },
})
export class CardFan {
  public readonly entries = input.required<readonly RankingEntry[]>();
  public readonly cardSelect = output<RankingEntry>();

  protected readonly cardScale = 0.42;
  protected readonly spread = signal<boolean>(false);

  /** Da sinistra a destra, quindi nell'ordine in cui si legge e si naviga con Tab */
  protected readonly fan = computed(() => {
    const count = this.entries().length;
    return [...this.entries()]
      .sort((a, b) => b.rank - a.rank)
      .map((entry) => ({
        entry,
        angle: fanAngle(entry.rank, count, CARD_FAN_SPREAD_DEG),
        // la 1ª carta è l'ultima a venire disegnata, quindi sta sopra le altre
        layer: count - entry.rank + 1,
      }));
  });

  public constructor() {
    afterNextRender(() => this.spread.set(true));
  }
}
