import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matTuneOutline } from '@ng-icons/material-symbols/outline';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { ComicCard } from '@shared/components/comic-card/comic-card';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { DISCOVER_FILTER_OPTIONS } from '@shared/constants/ui.const';
import { ComicKind } from '@shared/models/comic.model';
import { DiscoverChip, DiscoverFilters } from '@shared/models/discover-filters.model';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { DiscoverChips } from '../../components/discover-chips/discover-chips';
import {
  DiscoverFiltersPanel,
  DiscoverToggle,
} from '../../components/discover-filters-panel/discover-filters-panel';
import { DiscoverSearch } from '../../components/discover-search/discover-search';
import { DiscoverTabs } from '../../components/discover-tabs/discover-tabs';
import { WeeklyPackBanner } from '../../components/weekly-pack-banner/weekly-pack-banner';
import { WeeklyTop } from '../../components/weekly-top/weekly-top';
import { DiscoverNavigationService } from '../../services/discover-navigation/discover-navigation.service';
import { clearFilter } from '../../utils/clear-filter/clear-filter';
import { discoverChips } from '../../utils/discover-chips/discover-chips';
import { filterComics } from '../../utils/filter-comics/filter-comics';
import { parseDiscoverFilters } from '../../utils/parse-discover-filters/parse-discover-filters';
import { removalSuggestion } from '../../utils/removal-suggestion/removal-suggestion';
import { toggleFilterValue } from '../../utils/toggle-filter-value/toggle-filter-value';

/** Sezione, ricerca e filtri stanno nell'indirizzo (`?type=`, `?q=`, `?category=`…): vedi `DISCOVER_QUERY_PARAMS`. */
@Component({
  selector: 'app-discover-page',
  imports: [
    BookmarkButton,
    ComicCard,
    DiscoverChips,
    DiscoverFiltersPanel,
    DiscoverSearch,
    DiscoverTabs,
    HorizontalScroller,
    NgIcon,
    TranslocoPipe,
    WeeklyPackBanner,
    WeeklyTop,
  ],
  templateUrl: './discover-page.html',
  providers: [provideIcons({ matTuneOutline })],
})
export class DiscoverPage {
  protected readonly comicsNavigation = inject(ComicsNavigationService);
  protected readonly catalog = inject(ComicCatalogService);
  protected readonly pack = inject(WeeklyPackService);
  private readonly _navigation = inject(DiscoverNavigationService);

  private readonly _queryParams = toSignal(inject(ActivatedRoute).queryParamMap, {
    requireSync: true,
  });

  protected readonly filters = computed<DiscoverFilters>(() =>
    parseDiscoverFilters(this._queryParams()),
  );
  protected readonly panelOpen = signal<boolean>(false);

  protected readonly chipCount = computed(() => discoverChips(this.filters()).length);
  protected readonly isFiltering = computed(
    () => this.chipCount() > 0 || this.filters().search.trim().length > 0,
  );
  /** I titoli della sezione, senza filtri: la base delle ricerche e dei conteggi */
  protected readonly kindComics = computed(() =>
    filterComics(this.catalog.toDiscover(), this.filters(), 'all'),
  );
  protected readonly results = computed(() =>
    filterComics(this.catalog.toDiscover(), this.filters()),
  );
  protected readonly mangaCount = computed(
    () =>
      filterComics(this.catalog.toDiscover(), { ...this.filters(), kind: 'manga' }, 'all').length,
  );
  protected readonly comicCount = computed(
    () =>
      filterComics(this.catalog.toDiscover(), { ...this.filters(), kind: 'comic' }, 'all').length,
  );
  protected readonly percent = computed(() =>
    this.kindComics().length
      ? Math.round((this.results().length / this.kindComics().length) * 100)
      : 0,
  );
  protected readonly removal = computed(() =>
    this.results().length ? null : removalSuggestion(this.catalog.toDiscover(), this.filters()),
  );

  protected setKind(kind: ComicKind): void {
    const options = DISCOVER_FILTER_OPTIONS[kind];
    const current = this.filters();
    // Cambiando sezione restano solo i valori che esistono anche nell'altra
    const keep = (values: readonly string[], valid: readonly string[]) =>
      values.filter((value) => valid.includes(value));
    void this._navigation.goToFilters({
      ...current,
      kind,
      category: keep(current.category, options.category),
      format: keep(current.format, options.format),
      status: keep(current.status, options.status),
      volumes: keep(current.volumes, options.volumes),
      theme: keep(current.theme, options.theme),
      adult: kind === 'manga' && current.adult,
    });
  }

  protected setSearch(search: string): void {
    void this._navigation.goToFilters({ ...this.filters(), search });
  }

  protected toggle(change: DiscoverToggle): void {
    void this._navigation.goToFilters(toggleFilterValue(this.filters(), change.key, change.value));
  }

  protected setPeriod(period: { from: number; to: number }): void {
    void this._navigation.goToFilters({
      ...this.filters(),
      yearFrom: period.from,
      yearTo: period.to,
    });
  }

  protected setAdult(adult: boolean): void {
    void this._navigation.goToFilters({ ...this.filters(), adult });
  }

  protected removeChip(chip: DiscoverChip): void {
    const filters = this.filters();
    void this._navigation.goToFilters(
      chip.key === 'year' || chip.key === 'adult'
        ? clearFilter(filters, chip.key)
        : toggleFilterValue(filters, chip.key, chip.value),
    );
  }

  protected clearFilters(): void {
    void this._navigation.goToFilters({
      ...clearFilter(this.filters(), 'all'),
      search: this.filters().search,
    });
  }

  protected undo(
    target: 'all' | 'search' | NonNullable<ReturnType<typeof removalSuggestion>>['target'],
  ): void {
    void this._navigation.goToFilters(clearFilter(this.filters(), target));
  }
}
