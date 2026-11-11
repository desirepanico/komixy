import { inject, Injectable, signal } from '@angular/core';
import { SessionService } from '../session/session.service';
import { ToastService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);
  private readonly state = signal<readonly string[]>([]);

  public readonly ids = this.state.asReadonly();
  public readonly locked = this.session.isGuest;

  public isBookmarked(id: string): boolean {
    return this.state().includes(id);
  }

  // TODO: sostituire con PUT/DELETE /me/bookmarks/:id; l'ospite riceve 403
  public toggle(id: string): void {
    if (this.locked()) {
      this.toast.info('bookmark.guestLocked.summaryInfo', 'bookmark.guestLocked.detailInfo');
      return;
    }
    this.state.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }
}
