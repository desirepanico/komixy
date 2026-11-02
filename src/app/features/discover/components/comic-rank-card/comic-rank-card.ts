import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppRoutes } from '../../../../app.routes';
import { BookmarkButton } from '../../../../shared/components/bookmark-button/bookmark-button';
import { Tag } from '../../../../shared/components/tag/tag';
import { ComicItem, editionSeverity } from '../../models/comic.model';

/**
 * Riga di classifica: posizione, copertina e le stesse informazioni di `app-comic-card`,
 * in orizzontale. Tutta la riga è un link (titolo con link "stirato"); il segnalibro resta cliccabile.
 */
@Component({
  selector: 'app-comic-rank-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, Tag, BookmarkButton],
  templateUrl: './comic-rank-card.html',
  host: { class: 'block' },
})
export class ComicRankCard {
  protected readonly AppRoutes = AppRoutes;

  public comic = input.required<ComicItem>();
  /** Posizione in classifica (1 = primo) */
  public rank = input.required<number>();
  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();

  protected severity = computed(() => editionSeverity(this.comic().editionType));

  /** Chip della posizione: 1° pieno viola con bagliore, 2° e 3° viola trasparente, le altre vetro neutro */
  protected rankClasses = computed(() => {
    const base =
      'flex size-9 shrink-0 items-center justify-center rounded-xl text-base font-extrabold tabular-nums';
    const rank = this.rank();
    const tone =
      rank === 1
        ? 'bg-primary-500 text-surface-900 shadow-lg shadow-primary-500/40'
        : rank <= 3
          ? 'border border-primary-300/40 bg-primary-500/25 text-primary-100'
          : 'border border-surface-50/10 bg-surface-800/70 text-surface-300';
    return `${base} ${tone}`;
  });
}
