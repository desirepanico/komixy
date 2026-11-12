import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComicsNavigationService } from '../../services/comics-navigation/comics-navigation.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matAddOutline,
  matArrowBackOutline,
  matCheckOutline,
  matLockOutline,
  matSearchOffOutline,
} from '@ng-icons/material-symbols/outline';
import { Button } from '@shared/components/button/button';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { Message } from '@shared/components/message/message';
import { Skeleton } from '@shared/components/skeleton/skeleton';
import { Tag } from '@shared/components/tag/tag';
import { map } from 'rxjs';

import { editionSeverity } from '@shared/constants/ui.const';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { WeeklyRankingService } from '@shared/services/weekly-ranking/weekly-ranking.service';

/**
 * Dettaglio di un volume. Un ospite lo vede ma non può salvarlo in lista: al posto del bottone
 * c'è l'invito a iscriversi. La posizione in classifica compare solo a busta aperta (niente spoiler).
 */
@Component({
  selector: 'app-comic-detail-page',
  imports: [RouterLink, TranslocoPipe, NgIcon, Button, EmptyState, Message, Skeleton, Tag],
  providers: [
    provideIcons({
      matAddOutline,
      matArrowBackOutline,
      matCheckOutline,
      matLockOutline,
      matSearchOffOutline,
    }),
  ],
  templateUrl: './comic-detail-page.html',
})
export class ComicDetailPage {
  protected readonly comicsNavigation = inject(ComicsNavigationService);
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly session = inject(SessionService);
  private readonly catalog = inject(ComicCatalogService);
  private readonly ranking = inject(WeeklyRankingService);
  private readonly pack = inject(WeeklyPackService);
  private readonly document = inject(DOCUMENT);

  private readonly id = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null },
  );

  protected readonly comic = computed(() => {
    const id = this.id();
    return id ? this.catalog.find(id) : undefined;
  });
  protected readonly severity = computed(() => editionSeverity(this.comic()?.editionType ?? null));
  protected readonly saved = computed(() => {
    const comic = this.comic();
    return comic ? this.bookmarks.isSaved(comic.id) : false;
  });
  protected readonly weeklyRank = computed(() => {
    const comic = this.comic();
    if (!comic || !this.pack.isOpened()) return null;
    return this.ranking.entries().find((entry) => entry.comic.id === comic.id)?.rank ?? null;
  });

  /** Finché la copertina non è arrivata si vede lo skeleton */
  protected readonly coverLoaded = signal<boolean>(false);
  protected readonly copied = signal<boolean>(false);

  protected toggleSaved(): void {
    const comic = this.comic();
    if (comic) this.bookmarks.toggle(comic.id);
  }

  /** Condivisione di sistema se c'è, altrimenti copia il link */
  protected async share(): Promise<void> {
    const comic = this.comic();
    const window = this.document.defaultView;
    if (!comic || !window) return;
    const url = window.location.href;
    try {
      if (window.navigator.share) {
        await window.navigator.share({ title: comic.title, url });
      } else {
        await window.navigator.clipboard.writeText(url);
        this.copied.set(true);
      }
    } catch {
      // condivisione annullata dall'utente o non permessa: non c'è nulla da segnalare
    }
  }
}
