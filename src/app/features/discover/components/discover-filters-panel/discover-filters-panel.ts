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
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matCloseOutline,
  matVisibilityOffOutline,
  matVisibilityOutline,
} from '@ng-icons/material-symbols/outline';
import {
  CATEGORY_OPTIONS,
  DISCOVER_FACET_ICONS,
  DISCOVER_OPTION_ICONS,
  ERA_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
  THEME_OPTIONS,
  VOLUME_OPTIONS,
} from '@shared/constants/ui.const';
import { RestartAnimation } from '@shared/directives/restart-animation/restart-animation.directive';
import { Button } from '@shared/components/button/button';
import { ComicCategory } from '@shared/models/catalog-item.model';
import { DiscoverFilters, FacetKey } from '../../models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { CatalogFilterService } from '../../services/catalog-filter/catalog-filter.service';
import { CategoryAvatarService } from '../../services/category-avatar/category-avatar.service';
import { DiscoverGuide } from '../discover-guide/discover-guide';
import { discoverIcons } from '../../utils/discover-icons/discover-icons';

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
  imports: [Button, DiscoverGuide, NgIcon, RestartAnimation, TranslocoPipe],
  providers: [
    provideIcons({
      ...discoverIcons(),
      matCloseOutline,
      matVisibilityOffOutline,
      matVisibilityOutline,
    }),
  ],
  templateUrl: './discover-filters-panel.html',
  styleUrl: './discover-filters-panel.css',
  encapsulation: ViewEncapsulation.None,
})
export class DiscoverFiltersPanel {
  private readonly _catalogFilter = inject(CatalogFilterService);
  private readonly _age = inject(AgeVerificationService);
  private readonly _avatars = inject(CategoryAvatarService);
  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = model.required<boolean>();
  public readonly filters = input.required<DiscoverFilters>();
  public readonly filtersChange = output<DiscoverFilters>();

  protected readonly view = signal<'filters' | 'guide'>('filters');
  protected readonly askAge = signal<boolean>(false);
  protected readonly infoOpen = signal<boolean>(true);
  // Dopo la guida la vista dei filtri rientra da sinistra, ma non alla prima apertura
  protected readonly returned = signal<boolean>(false);
  /** Di quanto il foglio (sotto i 768px) è stato trascinato in giù */
  protected readonly dragY = signal<number>(0);
  protected readonly dragging = signal<boolean>(false);
  private readonly _touch = signal<{
    y: number;
    time: number;
    scrollable: HTMLElement | null;
  } | null>(null);
  /** La categoria della scheda informativa: l'ultima scelta, o la prima */
  protected readonly infoCategory = linkedSignal<ComicCategory>(
    () => this.filters().categories.at(-1) ?? CATEGORY_OPTIONS.manga[0],
  );
  protected readonly infoAvatar = computed<string | null>(() =>
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
  protected readonly hasChoices = computed<boolean>(
    () => this._catalogFilter.activeCount(this.filters()) > 0,
  );

  constructor() {
    // Il dialog nativo dà da solo focus trap, Esc e sfondo, ma si apre solo da codice
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

  protected isSelected(view: FacetView, value: string): boolean {
    return view.selected.includes(value);
  }

  // Il periodo ha sempre un valore: conta come scelta solo se non è «tutti»
  protected selectedCount(view: FacetView): number {
    return view.facet === 'era' ? (this.filters().era === 'all' ? 0 : 1) : view.selected.length;
  }

  protected toggle(view: FacetView, value: string): void {
    this.filtersChange.emit(this._catalogFilter.toggle(this.filters(), view.facet, value));
  }

  // Senza età verificata gli adulti non si accendono: si apre il modulo dell'età nella guida
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
    this.returned.set(false);
    this.view.set('guide');
  }

  // Il gesto vale solo se parte dall'intestazione o da una lista già in cima: altrimenti è uno scorrimento
  protected onTouchStart(event: TouchEvent): void {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const scrollable = (event.target as HTMLElement).closest<HTMLElement>('[data-sheet-scroll]');
    if (scrollable && scrollable.scrollTop > 0) return;
    this._touch.set({ y: event.touches[0].clientY, time: Date.now(), scrollable });
  }

  protected onTouchMove(event: TouchEvent): void {
    const start = this._touch();
    if (!start) return;
    const distance = event.touches[0].clientY - start.y;
    if (distance <= 0 || (start.scrollable && start.scrollable.scrollTop > 0)) {
      this._touch.set(null);
      this.dragging.set(false);
      this.dragY.set(0);
      return;
    }
    if (event.cancelable) event.preventDefault();
    this.dragging.set(true);
    this.dragY.set(distance);
  }

  /** Si chiude oltre 120px, o con uno scatto veloce (più di 0,5px per ms) già dopo 40px */
  protected onTouchEnd(): void {
    const start = this._touch();
    this._touch.set(null);
    if (!start || !this.dragging()) return;
    this.dragging.set(false);
    const distance = this.dragY();
    const speed = distance / Math.max(1, Date.now() - start.time);
    if (distance > 120 || (distance > 40 && speed > 0.5)) {
      this.dragY.set(window.innerHeight);
      setTimeout(() => {
        this.close();
        this.dragY.set(0);
      }, 200);
    } else {
      this.dragY.set(0);
    }
  }

  // La chiave si compone qui: scritta a pezzi nel template, i controlli delle traduzioni la leggono male
  protected infoKey(category: ComicCategory, part: 'text' | 'example'): string {
    return `discover.guide.info.categories.${category}.${part}`;
  }

  protected examples(text: string): string[] {
    return text.split(', ');
  }

  protected close(): void {
    this.returned.set(false);
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
