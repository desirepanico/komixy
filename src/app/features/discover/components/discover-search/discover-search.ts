import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matCloseOutline,
  matHistoryOutline,
  matSearchOutline,
} from '@ng-icons/material-symbols/outline';
import { SEARCH_SUGGESTION_LIMIT } from '@shared/constants/ui.const';
import { CatalogItem, ComicKind } from '@shared/models/catalog-item.model';
import { SearchOption } from '../../models/discover-filters.model';
import { RecentSearchesService } from '../../services/recent-searches/recent-searches.service';

/**
 * Ricerca per titolo e autore con i suggerimenti (ricerche recenti, più amati, titoli che corrispondono).
 * Il testo si applica con Invio o scegliendo un suggerimento: `search` emette il testo da cercare.
 * Con `compact` sta nell'isola fissa, e il menu si apre sotto tutta l'isola.
 */
@Component({
  selector: 'app-discover-search',
  imports: [NgIcon, TranslocoPipe],
  providers: [provideIcons({ matCloseOutline, matHistoryOutline, matSearchOutline })],
  templateUrl: './discover-search.html',
  host: { '[class]': 'compact() ? "block min-w-0 flex-1" : "relative block min-w-0 flex-1"' },
})
export class DiscoverSearch {
  private readonly _recents = inject(RecentSearchesService);

  protected readonly listId = `discover-suggestions-${Math.random().toString(36).slice(2, 8)}`;

  private readonly _input = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** Il testo già applicato (sta nell'indirizzo) */
  public readonly query = input.required<string>();
  public readonly kind = input.required<ComicKind>();
  /** I titoli della scheda tra cui suggerire (senza quelli per adulti) */
  public readonly items = input.required<readonly CatalogItem[]>();
  public readonly compact = input<boolean>(false);
  public readonly searched = output<string>();

  protected readonly draft = linkedSignal<string>(() => this.query());
  protected readonly open = signal<boolean>(false);
  protected readonly activeIndex = signal<number>(-1);
  protected readonly recent = this._recents.recent;
  protected readonly typed = computed(() => this.draft().trim());
  protected readonly matches = computed<SearchOption[]>(() => {
    const text = this.typed().toLowerCase();
    if (!text) return [];
    return this.items()
      .filter((item) => `${item.title} ${item.author}`.toLowerCase().includes(text))
      .slice(0, SEARCH_SUGGESTION_LIMIT)
      .map((item) => this._fromItem(item, 'match'));
  });
  protected readonly loved = computed<SearchOption[]>(() =>
    this.items()
      .slice(0, SEARCH_SUGGESTION_LIMIT)
      .map((item) => this._fromItem(item, 'loved')),
  );
  protected readonly recents = computed<SearchOption[]>(() =>
    this.typed()
      ? []
      : this.recent().map((value) => ({
          id: `${this.listId}-r-${value}`,
          type: 'recent',
          value,
          title: value,
          subtitle: '',
          cover: null,
        })),
  );
  protected readonly free = computed<SearchOption[]>(() =>
    this.typed()
      ? [
          {
            id: `${this.listId}-free`,
            type: 'free',
            value: this.typed(),
            title: this.typed(),
            subtitle: '',
            cover: null,
          },
        ]
      : [],
  );
  /** Tutte le voci nell'ordine in cui compaiono, per le frecce */
  protected readonly options = computed<SearchOption[]>(() => [
    ...this.recents(),
    ...(this.typed() ? this.matches() : this.loved()),
    ...this.free(),
  ]);
  protected readonly activeId = computed<string | null>(
    () => this.options()[this.activeIndex()]?.id ?? null,
  );

  protected onInput(value: string): void {
    this.draft.set(value);
    this.activeIndex.set(-1);
    this.open.set(true);
  }
  protected onKeydown(event: KeyboardEvent): void {
    const count = this.options().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.open.set(true);
        this.activeIndex.update((i) => (count ? (i + 1) % count : -1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.open.set(true);
        this.activeIndex.update((i) => (count ? (i <= 0 ? count - 1 : i - 1) : -1));
        break;
      case 'Enter': {
        event.preventDefault();
        const chosen = this.options()[this.activeIndex()];
        this.commit(chosen ? chosen.value : this.draft());
        break;
      }
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.open.set(false);
        }
        break;
    }
  }
  /** Applica il testo: chiude il menu, ricorda la ricerca e toglie il focus dal campo */
  protected commit(value: string): void {
    const text = value.trim();
    this.draft.set(text);
    this.searched.emit(text);
    this._recents.add(text);
    this.close();
  }
  protected clear(): void {
    this.draft.set('');
    this.searched.emit('');
    this._input().nativeElement.focus();
  }
  protected close(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
    this._input().nativeElement.blur();
  }
  protected removeRecent(value: string): void {
    this._recents.remove(value);
  }
  protected clearRecents(): void {
    this._recents.clear();
    this._input().nativeElement.focus();
  }
  /** Il focus esce dal componente: il menu si chiude (il testo scritto resta) */
  protected onFocusOut(event: FocusEvent, root: HTMLElement): void {
    if (!root.contains(event.relatedTarget as Node | null)) {
      this.open.set(false);
      this.activeIndex.set(-1);
    }
  }
  private _fromItem(item: CatalogItem, type: 'match' | 'loved'): SearchOption {
    return {
      id: `${this.listId}-${type}-${item.id}`,
      type,
      value: item.title,
      title: item.title,
      subtitle: item.author,
      cover: item.coverUrl,
    };
  }
}
