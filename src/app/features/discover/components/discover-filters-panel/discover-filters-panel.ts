import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCloseOutline, matInfoOutline } from '@ng-icons/material-symbols/outline';
import {
  CATEGORY_OPTIONS,
  ERA_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
  THEME_OPTIONS,
  VOLUME_OPTIONS,
} from '@shared/constants/ui.const';
import { CatalogItem } from '@shared/models/catalog-item.model';
import { DiscoverFilters, FacetKey } from '../../models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { CatalogFilterService } from '../../services/catalog-filter/catalog-filter.service';
import { DiscoverGuide } from '../discover-guide/discover-guide';

interface FacetView {
  facet: Exclude<FacetKey, 'showAdult'>;
  titleKey: string;
  values: readonly string[];
  selected: readonly string[];
  /** Una sola scelta (il periodo) o più scelte insieme */
  single: boolean;
}

/** Il pannello dei filtri: un cassetto dal basso sui telefoni, una finestra al centro dagli schermi più larghi. */
@Component({
  selector: 'app-discover-filters-panel',
  imports: [DiscoverGuide, NgIcon, TranslocoPipe],
  providers: [provideIcons({ matCloseOutline, matInfoOutline })],
  templateUrl: './discover-filters-panel.html',
})
export class DiscoverFiltersPanel {
  private readonly _catalogFilter = inject(CatalogFilterService);
  private readonly _age = inject(AgeVerificationService);
  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = model.required<boolean>();
  public readonly filters = input.required<DiscoverFilters>();
  public readonly items = input.required<readonly CatalogItem[]>();
  public readonly filtersChange = output<DiscoverFilters>();

  protected readonly view = signal<'filters' | 'guide'>('filters');
  protected readonly askAge = signal<boolean>(false);
  protected readonly facets = computed<FacetView[]>(() => {
    const f = this.filters();
    const shown = this._catalogFilter.facetsFor(f.kind);
    const views: FacetView[] = [
      {
        facet: 'categories',
        titleKey: `discover.filters.groups.categories.${f.kind}`,
        values: CATEGORY_OPTIONS[f.kind],
        selected: f.categories,
        single: false,
      },
      {
        facet: 'formats',
        titleKey: 'discover.filters.groups.formats',
        values: FORMAT_OPTIONS[f.kind],
        selected: f.formats,
        single: false,
      },
      {
        facet: 'era',
        titleKey: 'discover.filters.groups.era',
        values: ERA_OPTIONS,
        selected: [f.era],
        single: true,
      },
      {
        facet: 'volumes',
        titleKey: 'discover.filters.groups.volumes',
        values: VOLUME_OPTIONS[f.kind],
        selected: f.volumes,
        single: false,
      },
      {
        facet: 'statuses',
        titleKey: 'discover.filters.groups.statuses',
        values: STATUS_OPTIONS,
        selected: f.statuses,
        single: false,
      },
      {
        facet: 'themes',
        titleKey: 'discover.filters.groups.themes',
        values: THEME_OPTIONS,
        selected: f.themes,
        single: false,
      },
    ];
    return views.filter((view) => shown.includes(view.facet));
  });
  protected readonly showAdultOption = computed<boolean>(() =>
    this._catalogFilter.facetsFor(this.filters().kind).includes('showAdult'),
  );
  protected readonly resultCount = computed<number>(
    () => this._catalogFilter.filter(this.items(), this.filters()).length,
  );
  protected readonly hasChoices = computed<boolean>(
    () => this._catalogFilter.activeCount(this.filters()) > 0,
  );

  constructor() {
    // Il dialog nativo si apre e si chiude da codice: dà da solo focus trap, Esc e sfondo
    effect(() => {
      const dialog = this._dialog().nativeElement;
      if (this.open() && !dialog.open) {
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      } else if (!this.open() && dialog.open) {
        if (typeof dialog.close === 'function') dialog.close();
        else dialog.removeAttribute('open');
      }
    });
  }

  protected count(facet: FacetView['facet'], value: string): number {
    return this._catalogFilter.count(this.items(), this.filters(), facet, value);
  }

  protected isSelected(view: FacetView, value: string): boolean {
    return view.selected.includes(value);
  }

  protected toggle(view: FacetView, value: string): void {
    this.filtersChange.emit(this._catalogFilter.toggle(this.filters(), view.facet, value));
  }

  /** Accendere gli adulti senza età verificata apre la guida sul modulo dell'età */
  protected toggleAdult(): void {
    if (!this.filters().showAdult && !this._age.verified()) {
      this.askAge.set(true);
      this.view.set('guide');
      return;
    }
    this.filtersChange.emit(this._catalogFilter.toggle(this.filters(), 'showAdult', '1'));
  }

  protected reset(): void {
    this.filtersChange.emit(this._catalogFilter.reset(this.filters()));
  }

  protected openGuide(): void {
    this.askAge.set(false);
    this.view.set('guide');
  }

  protected close(): void {
    this.open.set(false);
    this.view.set('filters');
  }

  /** Un clic sullo sfondo (il dialog stesso, fuori dal contenuto) chiude il pannello */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  /** Esc chiude il dialog nativo: il modello segue */
  protected onNativeClose(): void {
    this.open.set(false);
    this.view.set('filters');
  }
}
