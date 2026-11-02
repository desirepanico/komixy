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

  /** Le prime tre posizioni in viola, le altre neutre */
  protected rankClasses = computed(() => {
    const base = 'w-9 shrink-0 text-center text-2xl font-extrabold tabular-nums';
    return `${base} ${this.rank() <= 3 ? 'text-primary-300' : 'text-surface-400'}`;
  });
}
