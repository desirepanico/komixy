import { Injectable, computed, inject, signal } from '@angular/core';
import { SessionService } from '../session/session.service';
import { ToastService } from '../toast/toast.service';

/** Gli ospiti non possono salvare: `toggle` li avvisa con un toast */
@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);

  // TODO(api): sostituire con PUT/DELETE /me/bookmarks/:comicId dell'API
  private readonly _savedIds = signal<ReadonlySet<string>>(new Set());

  public readonly savedCount = computed(() => this._savedIds().size);
  public readonly canSave = this.session.isAuthenticated;

  public isSaved(comicId: string): boolean {
    return this._savedIds().has(comicId);
  }

  /** Restituisce false se l'ospite non può salvare */
  public toggle(comicId: string): boolean {
    if (!this.canSave()) {
      this.toast.info('bookmark.guestLocked.summaryInfo', 'bookmark.guestLocked.detailInfo');
      return false;
    }
    const added = !this.isSaved(comicId);
    this._savedIds.update((ids) => {
      const next = new Set(ids);
      if (!next.delete(comicId)) next.add(comicId);
      return next;
    });
    this.toast.success(
      added ? 'bookmark.added.summaryOk' : 'bookmark.removed.summaryOk',
      added ? 'bookmark.added.detailOk' : 'bookmark.removed.detailOk',
    );
    return true;
  }
}
