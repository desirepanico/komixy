import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicItem } from '../../models/comic.model';
import { ComicCard } from '../comic-card/comic-card';

/** Card di un fumetto in classifica: numero grande della posizione + le stesse informazioni di `app-comic-card`. */
@Component({
  selector: 'app-comic-rank-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComicCard, TranslocoPipe],
  templateUrl: './comic-rank-card.html',
})
export class ComicRankCard {
  public comic = input.required<ComicItem>();
  /** Posizione in classifica (1 = primo) */
  public rank = input.required<number>();
  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();
}
