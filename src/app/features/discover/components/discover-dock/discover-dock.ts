import { Component, input, model, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicKind, CatalogItem } from '@shared/models/catalog-item.model';
import { DiscoverTab } from '../../models/discover-filters.model';
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
  host: { class: 'sticky top-0 z-30 block h-0' },
})
export class DiscoverDock {
  public readonly visible = input.required<boolean>();
  public readonly tabs = input.required<readonly DiscoverTab[]>();
  public readonly query = input.required<string>();
  public readonly items = input.required<readonly CatalogItem[]>();
  public readonly activeCount = input.required<number>();
  public readonly kind = model.required<ComicKind>();
  public readonly searched = output<string>();
  public readonly openFilters = output<void>();
}
