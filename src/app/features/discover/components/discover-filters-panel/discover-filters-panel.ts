import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCloseOutline } from '@ng-icons/material-symbols/outline';
import {
  CATEGORY_OPTIONS,
  DISCOVER_FACET_ICONS,
  DISCOVER_ICON_SET,
  DISCOVER_OPTION_ICONS,
  ERA_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
  THEME_OPTIONS,
  VOLUME_OPTIONS,
} from '@shared/constants/ui.const';
import { CatalogItem, ComicCategory } from '@shared/models/catalog-item.model';
import { DiscoverFilters, FacetKey } from '../../models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { CatalogFilterService } from '../../services/catalog-filter/catalog-filter.service';
import { CategoryAvatarService } from '../../services/category-avatar/category-avatar.service';
import { DiscoverGuide } from '../discover-guide/discover-guide';

type FacetStyle = 'pills' | 'cards' | 'grid';

interface FacetView {
  facet: Exclude<FacetKey, 'showAdult'>;
  titleKey: string;
  icon: string;
  values: readonly string[];
  selected: readonly string[];
  /** Una sola scelta (il periodo) o più scelte insieme */
  single: boolean;
  style: FacetStyle;
  valueIcons: Readonly<Record<string, string>>;
}

/** Il pannello dei filtri: un cassetto dal basso sotto i 768px, un pannello a destra da lì in su. */
@Component({
  selector: 'app-discover-filters-panel',
  imports: [DiscoverGuide, NgIcon, TranslocoPipe],
  providers: [provideIcons({ ...DISCOVER_ICON_SET, matCloseOutline })],
  templateUrl: './discover-filters-panel.html',
})
export class DiscoverFiltersPanel {
  private readonly _catalogFilter = inject(CatalogFilterService);
  private readonly _age = inject(AgeVerificationService);
  private readonly _avatars = inject(CategoryAvatarService);
  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = model.required<boolean>();
  public readonly filters = input.required<DiscoverFilters>();
  public readonly items = input.required<readonly CatalogItem[]>();
  public readonly filtersChange = output<DiscoverFilters>();

  protected readonly view = signal<'filters' | 'guide'>('filters');
  protected readonly askAge = signal<boolean>(false);
  protected readonly infoOpen = signal<boolean>(true);
  /** La categoria della scheda informativa: l'ultima scelta, o la prima */
  protected readonly infoCategory = linkedSignal<ComicCategory>(
    () => this.filters().categories.at(-1) ?? CATEGORY_OPTIONS.manga[0],
  );
  protected readonly infoAvatar = computed<SafeHtml | null>(() =>
    this._avatars.avatar(this.infoCategory()),
  );
  protected readonly isManga = computed<boolean>(() => this.filters().kind === 'manga');
  protected readonly facets = computed<FacetView[]>(() => {
    const f = this.filters();
    const shown = this._catalogFilter.facetsFor(f.kind);
    const view = (
      facet: FacetView['facet'],
      values: readonly string[],
      selected: readonly string[],
      style: FacetStyle,
      single = false,
    ): FacetView => ({
      facet,
      titleKey:
        facet === 'categories'
          ? `discover.filters.groups.categories.${f.kind}`
          : `discover.filters.groups.${facet}`,
      icon: DISCOVER_FACET_ICONS[facet],
      values,
      selected,
      single,
      style,
      valueIcons: DISCOVER_OPTION_ICONS[facet] ?? {},
    });
    const views: FacetView[] = [
      view(
        'categories',
        CATEGORY_OPTIONS[f.kind],
        f.categories,
        f.kind === 'manga' ? 'pills' : 'cards',
      ),
      view('formats', FORMAT_OPTIONS[f.kind], f.formats, 'pills'),
      view('statuses', STATUS_OPTIONS, f.statuses, 'pills'),
      view('era', ERA_OPTIONS, [f.era], 'pills', true),
      view('volumes', VOLUME_OPTIONS[f.kind], f.volumes, 'grid'),
      view('themes', THEME_OPTIONS, f.themes, 'cards'),
    ];
    return views.filter((v) => shown.includes(v.facet));
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

  /** Il valore non darebbe nessun titolo: si mostra spento, a meno che sia già scelto */
  protected isDisabled(view: FacetView, value: string): boolean {
    return this.count(view.facet, value) === 0 && !this.isSelected(view, value);
  }

  protected selectedCount(view: FacetView): number {
    return view.facet === 'era' ? (this.filters().era === 'all' ? 0 : 1) : view.selected.length;
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
