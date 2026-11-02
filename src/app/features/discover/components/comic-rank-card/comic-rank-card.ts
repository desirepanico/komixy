import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicItem } from '../../models/comic.model';
import { ComicCard } from '../comic-card/comic-card';

/** Card di un fumetto in classifica: numero grande della posizione + le stesse informazioni di `app-comic-card`. */
@Component({
  selector: 'app-comic-rank-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComicCard, TranslocoPipe],
  templateUrl: './comic-rank-card.html',
  host: { '[class]': 'hostClasses()' },
})
export class ComicRankCard {
  public comic = input.required<ComicItem>();
  /** Posizione in classifica (1 = primo) */
  public rank = input.required<number>();
  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();

  /** Elemento della lista orizzontale: largo quanto serve al numero (2 cifre = più spazio), la card resta w-40/lg:w-44 come le altre */
  protected hostClasses = computed(() =>
    this.rank() < 10
      ? 'block shrink-0 snap-start w-52 lg:w-56'
      : 'block shrink-0 snap-start w-60 lg:w-64',
  );

  /** Spazio a sinistra per il numero */
  protected rootClasses = computed(() => `relative h-full ${this.rank() < 10 ? 'pl-12' : 'pl-20'}`);

  /** Classi del numero: contorno (più spesso sotto i 400px), pieno per il podio, più piccolo da 10 in su */
  protected numberClasses = computed(() => {
    const base =
      'pointer-events-none absolute bottom-6 left-0 select-none font-extrabold leading-none tracking-tighter tabular-nums [-webkit-text-stroke:3px_var(--color-primary-400)] min-[400px]:[-webkit-text-stroke:2px_var(--color-primary-400)]';
    const size = this.rank() < 10 ? 'text-8xl' : 'text-7xl';
    const fill = this.rank() <= 3 ? 'text-primary-400' : 'text-transparent';
    return `${base} ${size} ${fill}`;
  });
}
