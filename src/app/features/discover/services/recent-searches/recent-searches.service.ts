import { Service, signal } from '@angular/core';
import { RECENT_SEARCH_LIMIT, RECENT_SEARCH_SAMPLES } from '@shared/constants/ui.const';

/** Le ultime ricerche, solo finché l'app è aperta (non è una preferenza di interfaccia da ricordare). */
@Service()
export class RecentSearchesService {
  // TODO(api): la cronologia delle ricerche dell'utente (GET /me/recent-searches) al posto degli esempi
  private readonly _recent = signal<string[]>([...RECENT_SEARCH_SAMPLES]);

  public readonly recent = this._recent.asReadonly();

  public add(query: string): void {
    const value = query.trim();
    if (!value) return;
    this._recent.update((list) =>
      [value, ...list.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(
        0,
        RECENT_SEARCH_LIMIT,
      ),
    );
  }

  public remove(query: string): void {
    this._recent.update((list) => list.filter((item) => item !== query));
  }

  public clear(): void {
    this._recent.set([]);
  }
}
