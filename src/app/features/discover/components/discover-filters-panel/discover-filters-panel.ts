import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  DISCOVER_ERAS,
  DISCOVER_FILTER_OPTIONS,
  DISCOVER_ICON_SET,
  DISCOVER_OPTION_ICONS,
  DISCOVER_SECTION_ICONS,
} from '@shared/constants/ui.const';
import { DiscoverFilters, DiscoverListKey } from '@shared/models/discover-filters.model';

export interface DiscoverToggle {
  key: DiscoverListKey;
  value: string;
}

/** Cassetto a destra da 768px, foglio dal basso sotto: un `<dialog>` modale, con focus e Esc gestiti dal browser. */
@Component({
  selector: 'app-discover-filters-panel',
  imports: [NgIcon, TranslocoPipe],
  templateUrl: './discover-filters-panel.html',
  providers: [provideIcons(DISCOVER_ICON_SET)],
})
export class DiscoverFiltersPanel {
  protected readonly eras = DISCOVER_ERAS;
  protected readonly sectionIcons = DISCOVER_SECTION_ICONS;
  protected readonly optionIcons = DISCOVER_OPTION_ICONS;

  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = model.required<boolean>();
  public readonly filters = input.required<DiscoverFilters>();
  public readonly resultCount = input.required<number>();
  public readonly valueToggle = output<DiscoverToggle>();
  public readonly period = output<{ from: number; to: number }>();
  public readonly adultChange = output<boolean>();
  public readonly clear = output<void>();

  protected readonly options = computed(() => DISCOVER_FILTER_OPTIONS[this.filters().kind]);
  protected readonly categorySection = computed(() =>
    this.filters().kind === 'manga' ? 'category' : 'genre',
  );

  public constructor() {
    effect(() => {
      const dialog = this._dialog().nativeElement;
      if (this.open() && !dialog.open) {
        // jsdom non ha showModal: nei test il dialog si apre senza modalità
        if (dialog.showModal) dialog.showModal();
        else dialog.setAttribute('open', '');
      } else if (!this.open() && dialog.open) {
        if (dialog.close) dialog.close();
        else dialog.removeAttribute('open');
      }
    });
  }

  protected selected(key: DiscoverListKey, value: string): boolean {
    return this.filters()[key].includes(value);
  }
  protected eraActive(era: { from: number; to: number }): boolean {
    return this.filters().yearFrom === era.from && this.filters().yearTo === era.to;
  }
  /** Un clic sul fondo scuro (cioè sul dialog stesso, non sul suo contenuto) lo chiude */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this._dialog().nativeElement) this.open.set(false);
  }
}
