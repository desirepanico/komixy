import { Injectable, computed, inject, signal } from '@angular/core';
import { SessionService } from '../session/session.service';

/** Segnalibri («In lista»). Gli ospiti non possono salvare: la UI li blocca prima e qui il metodo non fa nulla. */
@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private readonly session = inject(SessionService);

  // TODO: sostituire con PUT/DELETE /me/bookmarks/:comicId dell'API
  private readonly _savedIds = signal<ReadonlySet<string>>(new Set());

  public readonly savedCount = computed(() => this._savedIds().size);
  public readonly canSave = this.session.isAuthenticated;

  public isSaved(comicId: string): boolean {
    return this._savedIds().has(comicId);
  }

  /** Aggiunge o toglie il fumetto dalla lista. Restituisce false se l'ospite non può salvare. */
  public toggle(comicId: string): boolean {
    if (!this.canSave()) return false;
    this._savedIds.update((ids) => {
      const next = new Set(ids);
      if (!next.delete(comicId)) next.add(comicId);
      return next;
    });
    return true;
  }
}
