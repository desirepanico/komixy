import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline, matLockOutline } from '@ng-icons/material-symbols/outline';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { SessionService } from '../../services/session/session.service';
import { ToggleButton } from '../toggle-button/toggle-button';

/**
 * Segnalibro di un fumetto (l'«In lista» delle card). Per gli iscritti aggiunge e toglie dalla lista;
 * per gli ospiti ha il lucchetto e porta all'invito a iscriversi.
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
