import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  COVER_PLACEHOLDER,
  DISCOVER_ROW_SIZE,
  STARTER_MAX_VOLUMES,
} from '@shared/constants/ui.const';
import { CatalogItem, ComicKind } from '@shared/models/catalog-item.model';
import { ViewportVisible } from '@shared/directives/viewport-visible/viewport-visible.directive';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { DiscoverActiveChips } from '../../components/discover-active-chips/discover-active-chips';
import { DiscoverDock } from '../../components/discover-dock/discover-dock';
import { DiscoverFiltersButton } from '../../components/discover-filters-button/discover-filters-button';
import { DiscoverFiltersPanel } from '../../components/discover-filters-panel/discover-filters-panel';
import { DiscoverRow } from '../../components/discover-row/discover-row';
import { DiscoverSearch } from '../../components/discover-search/discover-search';
import { DiscoverTabs } from '../../components/discover-tabs/discover-tabs';
import { WeeklyPackBanner } from '../../components/weekly-pack-banner/weekly-pack-banner';
import { WeeklyTop } from '../../components/weekly-top/weekly-top';
import {
  DiscoverFilters,
  DiscoverTab,
  EMPTY_FILTERS,
  FoundTitle,
} from '../../models/discover-filters.model';
import { CatalogFilterService } from '../../services/catalog-filter/catalog-filter.service';
import { DiscoverNavigationService } from '../../services/discover-navigation/discover-navigation.service';
import { parseDiscoverFilters } from '../../utils/parse-discover-filters/parse-discover-filters';

const KINDS: readonly ComicKind[] = ['manga', 'comic'];

/** Scheda, ricerca e filtri stanno nell'indirizzo (`?tab=comic&cat=noir`): il link si condivide e Indietro li ritrova. */
@Component({
  selector: 'app-discover-page',
  imports: [
    DiscoverActiveChips,
    DiscoverDock,
    DiscoverFiltersButton,
    DiscoverFiltersPanel,
    DiscoverRow,
    DiscoverSearch,
    DiscoverTabs,
    TranslocoPipe,
    ViewportVisible,
    WeeklyPackBanner,
    WeeklyTop,
  ],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  private readonly _route = inject(ActivatedRoute);
  private readonly _navigation = inject(DiscoverNavigationService);
  private readonly _catalog = inject(ComicCatalogService);
  private readonly _catalogFilter = inject(CatalogFilterService);
  protected readonly pack = inject(WeeklyPackService);

  private readonly _results = viewChild<ElementRef<HTMLElement>>('resultsArea');

  private readonly _params = toSignal(this._route.queryParamMap, {
    initialValue: this._route.snapshot.queryParamMap,
  });
  protected readonly filters = computed<DiscoverFilters>(() =>
    parseDiscoverFilters(this._params()),
  );
  protected readonly panelOpen = signal<boolean>(false);
  /** La barra dei filtri in cima è nello schermo: se esce compare l'isola fissa */
  protected readonly barVisible = signal<boolean>(true);
  protected readonly tabs = computed<DiscoverTab[]>(() =>
    KINDS.map((kind) => {
      const own = this._catalogFilter.itemsOfKind(this._catalog.items(), {
        ...this.filters(),
        kind,
      });
      return {
        kind,
        count: own.length,
        covers: own
          .filter((item) => item.coverUrl !== COVER_PLACEHOLDER)
          .slice(0, 3)
          .map((item) => item.coverUrl),
      };
    }),
  );
  /** I titoli della scheda che si possono suggerire: senza quelli per adulti */
  protected readonly suggestable = computed<CatalogItem[]>(() =>
    this._catalog.items().filter((item) => item.kind === this.filters().kind && !item.isAdult),
  );
  protected readonly searchable = computed<CatalogItem[]>(() =>
    this._catalog.items().filter((item) => !item.isAdult),
  );
  protected readonly isFiltering = computed<boolean>(
    () => this.filters().query !== '' || this._catalogFilter.activeCount(this.filters()) > 0,
  );
  protected readonly activeCount = computed<number>(() =>
    this._catalogFilter.activeCount(this.filters()),
  );
  protected readonly results = computed<CatalogItem[]>(() =>
    this._catalogFilter.filter(this._catalog.items(), this.filters()),
  );
  protected readonly kindItems = computed<CatalogItem[]>(() =>
    this._catalogFilter.itemsOfKind(this._catalog.items(), this.filters()),
  );
  protected readonly starterItems = computed<CatalogItem[]>(() =>
    this.suggestable()
      .filter(
        (item) =>
          item.isSingleVolume ||
          (item.totalVolumes !== null && item.totalVolumes <= STARTER_MAX_VOLUMES),
      )
      .slice(0, DISCOVER_ROW_SIZE),
  );
  protected readonly newItems = computed<CatalogItem[]>(() =>
    [...this.suggestable()].sort((a, b) => b.year - a.year).slice(0, DISCOVER_ROW_SIZE),
  );

  protected setKind(kind: ComicKind): void {
    // Le scelte dei filtri valgono per una scheda sola: cambiando si riparte puliti, tenendo la ricerca
    void this._navigation.goToFilters({ ...EMPTY_FILTERS, kind, query: this.filters().query });
  }
  /** Un titolo dell'altra scheda: si cambia scheda e lo si cerca, senza tenere i filtri dell'altra */
  protected searchTitle({ title, kind }: FoundTitle): Promise<boolean> {
    return this._navigation.goToFilters({ ...EMPTY_FILTERS, kind, query: title });
  }
  /** Dall'isola la pagina scorre ai risultati: chi cerca da lì deve vedere cosa ha trovato */
  protected async searchFromDock(query: string): Promise<void> {
    await this._navigation.goToFilters({ ...this.filters(), query });
    this._scrollToResults();
  }
  protected async searchTitleFromDock(found: FoundTitle): Promise<void> {
    await this.searchTitle(found);
    this._scrollToResults();
  }
  protected setQuery(query: string): void {
    void this._navigation.goToFilters({ ...this.filters(), query });
  }
  protected setFilters(filters: DiscoverFilters): void {
    void this._navigation.goToFilters(filters);
  }
  // Toglie i filtri e tiene la ricerca scritta
  protected clearFilters(): void {
    const { kind, query } = this.filters();
    void this._navigation.goToFilters({ ...EMPTY_FILTERS, kind, query });
  }
  protected resetAll(): void {
    void this._navigation.goToFilters({ ...EMPTY_FILTERS, kind: this.filters().kind });
  }
  private _scrollToResults(): void {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    // Aspetta il disegno dei risultati, che arrivano dopo il cambio di indirizzo
    requestAnimationFrame(() =>
      this._results()?.nativeElement.scrollIntoView({ behavior, block: 'start' }),
    );
  }
}
