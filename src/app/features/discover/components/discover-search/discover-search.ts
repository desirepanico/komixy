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
  matPersonOutline,
  matSearchOutline,
} from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { SEARCH_AUTHOR_LIMIT, SEARCH_SUGGESTION_LIMIT } from '@shared/constants/ui.const';
import { CatalogItem, ComicKind } from '@shared/models/catalog-item.model';
import { SearchOption } from '../../models/discover-filters.model';
import { RecentSearchesService } from '../../services/recent-searches/recent-searches.service';
import { shortcutModifier } from '../../utils/shortcut-modifier/shortcut-modifier';

/**
 * Ricerca per titolo e autore con i suggerimenti (ricerche recenti, più amati, titoli che corrispondono).
 * Il testo si applica con Invio o scegliendo un suggerimento: `search` emette il testo da cercare.
 * Con `compact` sta nell'isola fissa, il menu si apre sotto tutta l'isola e un titolo scelto apre il suo volume.
 */
@Component({
  selector: 'app-discover-search',
  imports: [NgIcon, TranslocoPipe],
  providers: [
    provideIcons({ matCloseOutline, matHistoryOutline, matPersonOutline, matSearchOutline }),
  ],
  templateUrl: './discover-search.html',
  host: {
    '[class]': 'compact() ? "block min-w-0 flex-1" : "relative block min-w-0 flex-1 md:max-w-170"',
    '(document:keydown)': 'onShortcut($event)',
  },
})
export class DiscoverSearch {
  private readonly _recents = inject(RecentSearchesService);
  private readonly _comicsNavigation = inject(ComicsNavigationService);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly modifier = shortcutModifier(navigator.platform || navigator.userAgent);
  protected readonly listId = `discover-suggestions-${Math.random().toString(36).slice(2, 8)}`;

  private readonly _input = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** Il testo già applicato (sta nell'indirizzo) */
  public readonly query = input.required<string>();
  public readonly kind = input.required<ComicKind>();
  /** I titoli della scheda tra cui suggerire (senza quelli per adulti) */
  public readonly items = input.required<readonly CatalogItem[]>();
  /** Dove cercare quando si scrive, se più largo dei suggerimenti iniziali (l'isola cerca in tutti i titoli) */
  public readonly searchIn = input<readonly CatalogItem[] | null>(null);
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
    return (this.searchIn() ?? this.items())
      .filter((item) => item.title.toLowerCase().includes(text))
      .slice(0, SEARCH_SUGGESTION_LIMIT)
      .map((item) => this._fromItem(item, 'match'));
  });
  protected readonly authors = computed<SearchOption[]>(() => {
    const text = this.typed().toLowerCase();
    if (!text) return [];
    // Un titolo può avere più autori: ognuno conta i volumi in cui compare
    const volumes = new Map<string, number>();
    for (const item of this.searchIn() ?? this.items()) {
      for (const author of item.author.split(', ')) {
        if (author.toLowerCase().includes(text))
          volumes.set(author, (volumes.get(author) ?? 0) + 1);
      }
    }
    return Array.from(volumes, ([author, count]) => ({
      id: `${this.listId}-author-${author}`,
      type: 'author' as const,
      value: author,
      title: author,
      subtitle: String(count),
      cover: null,
      comicId: null,
    })).slice(0, SEARCH_AUTHOR_LIMIT);
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
          comicId: null,
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
            comicId: null,
          },
        ]
      : [],
  );
  /** Tutte le voci nell'ordine in cui compaiono, per le frecce */
  protected readonly options = computed<SearchOption[]>(() => [
    ...this.recents(),
    ...(this.typed() ? [...this.matches(), ...this.authors()] : this.loved()),
    ...this.free(),
  ]);
  protected readonly activeId = computed<string | null>(
    () => this.options()[this.activeIndex()]?.id ?? null,
  );

  /** Ctrl K (o Cmd K) porta il cursore nel campo visibile: con l'isola in vista è quello dell'isola */
  protected onShortcut(event: KeyboardEvent): void {
    if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
    const dockShown = !!document.querySelector('app-discover-dock [role="toolbar"]:not([inert])');
    if (this.compact() !== dockShown || this._host.nativeElement.closest('[inert]')) return;
    event.preventDefault();
    this._input().nativeElement.focus();
  }
  /** Il titolo del gruppo di suggerimenti, solo sulla prima voce del gruppo */
  protected groupKey(index: number): string | null {
    const options = this.options();
    const type = options[index].type;
    if (type === options[index - 1]?.type) return null;
    if (type === 'match') return 'discover.search.titles';
    if (type === 'author') return 'discover.search.authors';
    return type === 'loved' ? `discover.search.loved.${this.kind()}` : null;
  }
  /** Il testo spezzato in parti, per sottolineare quella che corrisponde a ciò che si scrive */
  protected parts(text: string): { text: string; hit: boolean }[] {
    const query = this.typed();
    const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
    if (index < 0) return [{ text, hit: false }];
    return [
      { text: text.slice(0, index), hit: false },
      { text: text.slice(index, index + query.length), hit: true },
      { text: text.slice(index + query.length), hit: false },
    ].filter((part) => part.text);
  }
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
        const chosen = this.options()[this.activeIndex()] ?? this._onlyMatch();
        if (chosen) this.choose(chosen);
        else this.commit(this.draft());
        break;
      }
      case 'Delete': {
        // Con un recente scelto, Canc lo toglie dall'elenco invece di cancellare il testo
        const recent = this.options()[this.activeIndex()];
        if (this.open() && recent?.type === 'recent') {
          event.preventDefault();
          this.removeRecent(recent.value);
          this.activeIndex.set(-1);
        }
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
  /** Nell'isola un titolo scelto porta dritto al suo volume; altrimenti si applica il testo */
  protected choose(option: SearchOption): void {
    if (this.compact() && option.comicId) {
      this._recents.add(option.title);
      this.close();
      void this._comicsNavigation.goToDetail(option.comicId);
      return;
    }
    this.commit(option.value);
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
  /** Nell'isola, un testo che trova un solo titolo vale come sceglierlo */
  private _onlyMatch(): SearchOption | undefined {
    return this.compact() && this.matches().length === 1 ? this.matches()[0] : undefined;
  }
  private _fromItem(item: CatalogItem, type: 'match' | 'loved'): SearchOption {
    return {
      id: `${this.listId}-${type}-${item.id}`,
      type,
      value: item.title,
      title: item.title,
      subtitle: item.author,
      cover: item.coverUrl,
      comicId: item.id,
    };
  }
}
