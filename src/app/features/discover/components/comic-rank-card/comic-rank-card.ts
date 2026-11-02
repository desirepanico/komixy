import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicItem } from '../../models/comic.model';
import { ComicCard } from '../comic-card/comic-card';

/** Card di un fumetto in classifica: badge glass con la posizione sulla copertina + le stesse informazioni di `app-comic-card`. */
@Component({
  selector: 'app-comic-rank-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComicCard, TranslocoPipe],
  templateUrl: './comic-rank-card.html',
  // Stessa larghezza delle altre card
  host: { class: 'relative block h-full w-40 shrink-0 snap-start lg:w-44' },
})
export class ComicRankCard {
  public comic = input.required<ComicItem>();
  /** Posizione in classifica (1 = primo) */
  public rank = input.required<number>();
  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();

  /** Badge glass; le prime tre posizioni hanno una tinta viola */
  protected badgeClasses = computed(() => {
    const base =
      'pointer-events-none absolute left-4 top-4 z-20 flex h-10 min-w-10 select-none items-center justify-center rounded-full border px-3 text-lg font-extrabold tabular-nums shadow-lg shadow-surface-950/40 backdrop-blur-md';
    const tone =
      this.rank() <= 3
        ? 'border-primary-300/50 bg-primary-500/30 text-primary-100'
        : 'border-surface-50/20 bg-surface-950/55 text-surface-50';
    return `${base} ${tone}`;
  });
}
