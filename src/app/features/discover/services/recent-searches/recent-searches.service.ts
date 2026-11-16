import { Injectable, signal } from '@angular/core';
import { DISCOVER_SEARCH_MAX_RECENTS } from '@shared/constants/ui.const';

/** Le ultime ricerche di Scopri, solo in memoria: ricaricando l'app si perdono (`query-params.md`) */
@Injectable({ providedIn: 'root' })
export class RecentSearchesService {
  private readonly _items = signal<string[]>([]);

  public readonly items = this._items.asReadonly();

  public add(term: string): void {
    const value = term.trim();
    if (!value) return;
    this._items.update((items) =>
      [value, ...items.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(
        0,
        DISCOVER_SEARCH_MAX_RECENTS,
      ),
    );
  }

  public remove(term: string): void {
    this._items.update((items) => items.filter((item) => item !== term));
  }

  public clear(): void {
    this._items.set([]);
  }
}
