import { Component, inject, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { ComicCard } from '@shared/components/comic-card/comic-card';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { CatalogItem } from '@shared/models/catalog-item.model';

/** Una riga di Scopri: titolo, sottotitolo e i volumi, che scorrono di lato o stanno in griglia (`grid`, per i risultati). */
@Component({
  selector: 'app-discover-row',
  imports: [BookmarkButton, ComicCard, HorizontalScroller, TranslocoPipe],
  templateUrl: './discover-row.html',
  host: { class: 'block min-w-0' },
})
export class DiscoverRow {
  protected readonly comicsNavigation = inject(ComicsNavigationService);

  /** Titolo e sottotitolo già tradotti */
  public readonly title = input.required<string>();
  public readonly subtitle = input<string>('');
  /** Quanti titoli ha la riga: se manca, non si mostra */
  public readonly count = input<number | null>(null);
  public readonly items = input.required<readonly CatalogItem[]>();
  public readonly grid = input<boolean>(false);
}
