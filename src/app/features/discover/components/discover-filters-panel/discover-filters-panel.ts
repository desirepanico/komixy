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

import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { DiscoverGuide } from '../discover-guide/discover-guide';
import { CategoryAvatarService } from '../../services/category-avatar/category-avatar.service';

export interface DiscoverToggle {
  key: DiscoverListKey;
  value: string;
}

/** Cassetto a destra da 768px, foglio dal basso sotto: un `<dialog>` modale, con focus e Esc gestiti dal browser. */
@Component({
  selector: 'app-discover-filters-panel',
  imports: [DiscoverGuide, NgIcon, TranslocoPipe],
  templateUrl: './discover-filters-panel.html',
  providers: [provideIcons(DISCOVER_ICON_SET)],
})
export class DiscoverFiltersPanel {
  protected readonly avatars = inject(CategoryAvatarService);
  protected readonly age = inject(AgeVerificationService);

  protected readonly eras = DISCOVER_ERAS;
  protected readonly sectionIcons = DISCOVER_SECTION_ICONS;
  protected readonly optionIcons = DISCOVER_OPTION_ICONS;

  private readonly _guide = viewChild.required(DiscoverGuide);
  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = model.required<boolean>();
  public readonly filters = input.required<DiscoverFilters>();
  public readonly resultCount = input.required<number>();
  public readonly valueToggle = output<DiscoverToggle>();
  public readonly period = output<{ from: number; to: number }>();
  public readonly adultChange = output<boolean>();
  public readonly clear = output<void>();

  /** La scheda con la descrizione della categoria si può nascondere */
  protected readonly infoOpen = signal<boolean>(true);
  /** La categoria della scheda: l'ultima scelta, o quella toccata tra le linguette */
  protected readonly infoCategory = linkedSignal<readonly string[], string>({
    source: () => this.filters().category,
    computation: (selected, previous) =>
      previous && selected.includes(previous.value) ? previous.value : (selected.at(-1) ?? ''),
  });
  /** La guida scorre sopra i filtri; Esc e la freccia riportano ai filtri */
  protected readonly guideOpen = signal<boolean>(false);

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

  protected onCancel(event: Event): void {
    if (!this.guideOpen()) return;
    event.preventDefault();
    this.guideOpen.set(false);
  }

  protected onClosed(): void {
    this.guideOpen.set(false);
    this.open.set(false);
  }

  /** Senza età verificata l'interruttore apre la guida sul modulo, altrimenti attiva il filtro */
  protected onAdultToggle(input: HTMLInputElement): void {
    if (input.checked && !this.age.verified()) {
      input.checked = false;
      this.guideOpen.set(true);
      this._guide().requestAdult();
      return;
    }
    this.adultChange.emit(input.checked);
  }
}
