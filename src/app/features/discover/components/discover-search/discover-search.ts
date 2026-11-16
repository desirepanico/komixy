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
import {
  DISCOVER_SEARCH_FEATURED,
  DISCOVER_SEARCH_MAX_AUTHORS,
  DISCOVER_SEARCH_MAX_TITLES,
} from '@shared/constants/ui.const';
import { CatalogComic, ComicKind } from '@shared/models/comic.model';
import { coverBackground } from '@shared/utils/cover-background/cover-background';
import { RecentSearchesService } from '../../services/recent-searches/recent-searches.service';

interface SearchOption {
  type: 'recent' | 'title' | 'author';
  value: string;
  comic?: CatalogComic;
  volumes?: number;
}

interface SearchPart {
  text: string;
  mark: boolean;
}

/** Ricerca per titolo e autore con suggerimenti (combobox): frecce, Invio, Canc per le recenti, Esc, Ctrl/⌘ K */
@Component({
  selector: 'app-discover-search',
  imports: [NgIcon, TranslocoPipe],
  templateUrl: './discover-search.html',
  providers: [
    provideIcons({ matCloseOutline, matHistoryOutline, matPersonOutline, matSearchOutline }),
  ],
  host: {
    class: 'relative block min-w-0',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(focusout)': 'onFocusout($event)',
  },
})
export class DiscoverSearch {
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly recents = inject(RecentSearchesService);

  protected readonly modKey = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

  private readonly _input = viewChild.required<ElementRef<HTMLInputElement>>('field');

  public readonly value = input.required<string>();
  public readonly kind = input.required<ComicKind>();
  public readonly comics = input.required<readonly CatalogComic[]>();
  public readonly searchChange = output<string>();

  protected readonly text = linkedSignal<string>(() => this.value());
  protected readonly open = signal<boolean>(false);
  protected readonly activeIndex = signal<number>(-1);

  private readonly _query = computed(() => this.text().trim().toLowerCase());

  protected readonly titles = computed<SearchOption[]>(() => {
    const query = this._query();
    const list = query
      ? this.comics().filter((c) => c.title.toLowerCase().includes(query))
      : this.comics().filter((c) => !c.adult);
    return list
      .slice(0, query ? DISCOVER_SEARCH_MAX_TITLES : DISCOVER_SEARCH_FEATURED)
      .map((comic) => ({ type: 'title', value: comic.title, comic }));
  });

  protected readonly authors = computed<SearchOption[]>(() => {
    const query = this._query();
    if (!query) return [];
    const counts = new Map<string, number>();
    for (const comic of this.comics()) {
      for (const author of comic.author.split(', ')) {
        if (author.toLowerCase().includes(query)) counts.set(author, (counts.get(author) ?? 0) + 1);
      }
    }
    return [...counts]
      .slice(0, DISCOVER_SEARCH_MAX_AUTHORS)
      .map(([value, volumes]) => ({ type: 'author', value, volumes }));
  });

  protected readonly recentOptions = computed<SearchOption[]>(() =>
    this._query() ? [] : this.recents.items().map((value) => ({ type: 'recent', value })),
  );

  /** L'ordine in cui le voci si scelgono con le frecce */
  protected readonly options = computed<SearchOption[]>(() => [
    ...this.recentOptions(),
    ...this.titles(),
    ...this.authors(),
  ]);

  protected readonly activeId = computed<string | null>(() =>
    this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null,
  );

  protected optionId(index: number): string {
    return `discover-search-option-${index}`;
  }

  protected parts(text: string): SearchPart[] {
    const query = this.text().trim();
    const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
    if (at < 0) return [{ text, mark: false }];
    return [
      { text: text.slice(0, at), mark: false },
      { text: text.slice(at, at + query.length), mark: true },
      { text: text.slice(at + query.length), mark: false },
    ];
  }

  protected background(comic: CatalogComic): string {
    return coverBackground(comic);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.text.set(value);
    this.searchChange.emit(value);
    this.activeIndex.set(-1);
    this.open.set(true);
  }

  protected openList(): void {
    this.open.set(true);
  }

  protected clear(): void {
    this._apply('', false);
    this._input().nativeElement.focus();
    this.open.set(true);
  }

  protected removeRecent(term: string): void {
    this.recents.remove(term);
    this.activeIndex.set(-1);
    this._input().nativeElement.focus();
  }

  protected clearRecents(): void {
    this.recents.clear();
    this._input().nativeElement.focus();
  }

  protected choose(option: SearchOption): void {
    this._apply(option.value, true);
    this.open.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const options = this.options();
    const open = this.open();
    const index = this.activeIndex();

    switch (event.key) {
      case 'Escape':
        if (open) {
          event.preventDefault();
          this.open.set(false);
        } else if (this.text()) {
          event.preventDefault();
          this._apply('', false);
        }
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          this.open.set(true);
        } else if (options.length) {
          const next =
            event.key === 'ArrowDown'
              ? (index + 1) % options.length
              : index <= 0
                ? options.length - 1
                : index - 1;
          this.activeIndex.set(next);
          this._host.nativeElement
            .querySelector(`#${this.optionId(next)}`)
            ?.scrollIntoView?.({ block: 'nearest' });
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (open && index >= 0) this.choose(options[index]);
        else {
          this._apply(this.text(), true);
          this.open.set(false);
        }
        break;
      case 'Delete':
        if (open && index >= 0 && options[index].type === 'recent') {
          event.preventDefault();
          this.recents.remove(options[index].value);
          this.activeIndex.set(-1);
        }
        break;
    }
  }

  protected onFocusout(event: FocusEvent): void {
    if (!this._host.nativeElement.contains(event.relatedTarget as Node | null))
      this.open.set(false);
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const field = this._input().nativeElement;
      field.focus();
      field.select();
      this.open.set(true);
    }
  }

  private _apply(value: string, save: boolean): void {
    this.text.set(value);
    this.searchChange.emit(value);
    if (save) this.recents.add(value);
  }
}
