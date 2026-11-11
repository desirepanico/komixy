<<<<<<< HEAD
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline, matLockOutline } from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { ComicCover } from '@shared/components/comic-cover/comic-cover';
import { Tag } from '@shared/components/tag/tag';
import { ToggleButton } from '@shared/components/toggle-button/toggle-button';
import { EDITION_SEVERITY } from '@shared/constants/ui.const';
=======
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { Skeleton } from '@shared/components/skeleton/skeleton';
import { Tag } from '@shared/components/tag/tag';
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
import { EditionType } from '@shared/models/comic.model';
@Component({
  selector: 'app-comic-card',
<<<<<<< HEAD
  imports: [TranslocoPipe, RouterLink, ComicCover, Tag, ToggleButton, NgIcon],
  providers: [provideIcons({ matBookmarkOutline, matLockOutline })],
=======
  imports: [TranslocoPipe, RouterLink, Skeleton, Tag, BookmarkButton],
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  templateUrl: './comic-card.html',
})
export class ComicCard {
  private readonly comicsNavigation = inject(ComicsNavigationService);

  public readonly title = input.required<string>();
  public readonly author = input.required<string>();
  public readonly id = input.required<string>();
  public readonly coverUrl = input<string>('https://picsum.photos/seed/komixy-neon/160/200');
  public readonly editionType = input<EditionType | null>(null);

  public readonly isSingleVolume = input<boolean>(false);
  public readonly volume = input<number>();
  public readonly totalVolumes = input<number | null>(null);

<<<<<<< HEAD
  public readonly bookmarked = input<boolean>(false);
  /** L'ospite non può salvare: il segnalibro mostra il lucchetto e il tocco porta all'invito a iscriversi */
  public readonly locked = input<boolean>(false);
  public readonly bookmarkToggle = output<void>();

  protected readonly comicLink = computed(() => this.comicsNavigation.detailLink(this.id()));
  protected readonly bookmarkLabel = computed(() => {
    if (this.locked()) return 'bookmark.locked';
    return this.bookmarked() ? 'bookmark.remove' : 'bookmark.add';
  });
  protected readonly editionSeverity = computed(() => EDITION_SEVERITY[this.editionType() ?? 'none']);

  public handleBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit();
  }
=======
  /** Finché la copertina non è arrivata si vede lo skeleton */
  protected readonly coverLoaded = signal<boolean>(false);

  protected readonly comicLink = computed(() => this.comicsNavigation.detailLink(this.id()));
  protected readonly editionSeverity = computed(() => editionSeverity(this.editionType()));
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
}
