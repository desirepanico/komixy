import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  CARD_FAN_BASE_HEIGHT_PX,
  CARD_FAN_BASE_SCALE,
  CARD_FAN_BASE_TOP_PX,
  CARD_FAN_BASE_WIDTH_PX,
  CARD_FAN_GROW_FROM_PX,
  CARD_FAN_MIN_GROWTH,
  CARD_FAN_SHRINK_BELOW_PX,
  CARD_FAN_MAX_GROWTH,
  CARD_FAN_SPREAD_DEG,
  PACK_CARD_WIDTH_PX,
} from '../../constants/ui.const';
import { RankingEntry } from '../../models/ranking-entry.model';
import { PackCard } from '../pack-card/pack-card';
import { fanAngle } from './fan-layout/fan-layout';

/**
 * Le carte della busta a ventaglio: la 1ª a destra e in primo piano, l'ultima a sinistra.
 * Ogni carta è un bottone (Tab per scorrerle, Invio per sceglierla). Il ventaglio si apre da solo
 * appena compare; con «riduci movimento» compare già aperto. Su tablet e desktop si ingrandisce con
 * la larghezza disponibile (le carte, fino a una certa scala, mostrano solo copertina e posizione).
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

  protected readonly spread = signal<boolean>(false);

  /** Larghezza del contenitore, 0 finché non è stata misurata */
  private readonly hostWidth = signal<number>(0);

  /** Scala del ventaglio: 1 sui telefoni, fino a `CARD_FAN_MAX_GROWTH` su tablet e desktop, sotto 1 solo in un contenitore stretto */
  protected readonly growth = computed(() => {
    const width = this.hostWidth();
    if (width === 0) return 1;
    // Sui telefoni resta alla grandezza base; solo un contenitore più stretto la riduce
    if (width < CARD_FAN_SHRINK_BELOW_PX) {
      return Math.max(CARD_FAN_MIN_GROWTH, width / CARD_FAN_SHRINK_BELOW_PX);
    }
    return Math.min(CARD_FAN_MAX_GROWTH, Math.max(1, width / CARD_FAN_GROW_FROM_PX));
  });
  protected readonly cardScale = computed(() => CARD_FAN_BASE_SCALE * this.growth());
  protected readonly width = computed(() => CARD_FAN_BASE_WIDTH_PX * this.growth());
  protected readonly height = computed(() => CARD_FAN_BASE_HEIGHT_PX * this.growth());
  protected readonly top = computed(() => CARD_FAN_BASE_TOP_PX * this.growth());
  /** Metà larghezza della carta: la centra sul perno del ventaglio */
  protected readonly cardHalfWidth = computed(() => (PACK_CARD_WIDTH_PX * this.cardScale()) / 2);

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
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.spread.set(true);
      const observer = new ResizeObserver(([entry]) => this.hostWidth.set(entry.contentRect.width));
      observer.observe(host.nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
