import { Component, input, model, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicKind, CatalogItem } from '@shared/models/catalog-item.model';
import { DiscoverTab, FoundTitle } from '../../models/discover-filters.model';
import { DiscoverFiltersButton } from '../discover-filters-button/discover-filters-button';
import { DiscoverSearch } from '../discover-search/discover-search';
import { DiscoverTabs } from '../discover-tabs/discover-tabs';

/**
 * L'isola fissa: quando la barra dei filtri esce dallo schermo resta in alto una pillola con
 * Manga/Fumetti, la ricerca e i Filtri. Appena si usa la ricerca le schede lasciano il posto al campo.
 */
@Component({
  selector: 'app-discover-dock',
  imports: [DiscoverTabs, DiscoverSearch, DiscoverFiltersButton, TranslocoPipe],
  templateUrl: './discover-dock.html',
  host: {
    // mb-0: la pagina spazia i blocchi con space-y, e l'isola alta zero non deve spingere giù il titolo
    class: 'sticky top-0 z-30 mb-0! block h-0',
    '(window:scroll)': 'onScroll()',
  },
})
export class DiscoverDock {
  public readonly visible = input.required<boolean>();
  public readonly tabs = input.required<readonly DiscoverTab[]>();
  public readonly query = input.required<string>();
  public readonly items = input.required<readonly CatalogItem[]>();
  /** Tutti i titoli: dall'isola si trova subito un manga o un fumetto, qualunque sia la scheda */
  public readonly searchIn = input.required<readonly CatalogItem[]>();
  public readonly activeCount = input.required<number>();
  public readonly kind = model.required<ComicKind>();
  public readonly searched = output<string>();
  public readonly titleFound = output<FoundTitle>();
  public readonly openFilters = output<void>();

  protected readonly progress = signal<number>(0);

  /** Quanto della pagina è stato scorso: riempie la linea sotto l'isola */
  protected onScroll(): void {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    this.progress.set(max > 0 ? Math.min(1, window.scrollY / max) : 0);
  }
}
