import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { Skeleton } from '@shared/components/skeleton/skeleton';
import { Tag } from '@shared/components/tag/tag';
import { editionSeverity } from '@shared/constants/ui.const';
import { EditionType } from '@shared/models/comic.model';

@Component({
  selector: 'app-comic-card',
  imports: [TranslocoPipe, RouterLink, Skeleton, Tag, BookmarkButton],
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

  /** Finché la copertina non è arrivata si vede lo skeleton */
  protected readonly coverLoaded = signal<boolean>(false);

  protected readonly comicLink = computed(() => this.comicsNavigation.detailLink(this.id()));
  protected readonly editionSeverity = computed(() => editionSeverity(this.editionType()));
}
