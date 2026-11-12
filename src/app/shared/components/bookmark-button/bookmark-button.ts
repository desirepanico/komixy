import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline, matLockOutline } from '@ng-icons/material-symbols/outline';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { SessionService } from '../../services/session/session.service';
import { ToggleButton } from '../toggle-button/toggle-button';

/**
 * Segnalibro di un fumetto; per gli ospiti è un lucchetto che porta all'iscrizione.
 *   <app-bookmark-button comicId="w1" class="absolute right-2 top-2 z-10" />
 */
@Component({
  selector: 'app-bookmark-button',
  imports: [RouterLink, TranslocoPipe, NgIcon, ToggleButton],
  providers: [provideIcons({ matBookmarkOutline, matLockOutline })],
  templateUrl: './bookmark-button.html',
  host: { class: 'inline-flex' },
})
export class BookmarkButton {
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly session = inject(SessionService);

  public readonly comicId = input.required<string>();

  protected readonly saved = computed(() => this.bookmarks.isSaved(this.comicId()));
}
