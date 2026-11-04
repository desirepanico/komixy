import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { DiscoverNavigationService } from '../../services/discover-navigation/discover-navigation.service';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { Tag } from '@shared/components/tag/tag';
import { EditionType } from '@shared/models/comic.model';
import { editionSeverity } from '@shared/models/edition-severity/edition-severity';
@Component({
  selector: 'app-comic-card',
  imports: [TranslocoPipe, RouterLink, Tag, BookmarkButton],
  templateUrl: './comic-card.html',
})
export class ComicCard {
  private readonly navigation = inject(DiscoverNavigationService);

  public readonly title = input.required<string>();
  public readonly author = input.required<string>();
  public readonly id = input.required<string>();
  public readonly coverUrl = input<string>('https://picsum.photos/seed/komixy-neon/160/200');
  public readonly editionType = input<EditionType | null>(null);

  public readonly isSingleVolume = input<boolean>(false);
  public readonly volume = input<number>();
  public readonly totalVolumes = input<number | null>(null);

  public readonly bookmarked = input<boolean>(false);
  public readonly bookmarkToggle = output<void>();

  protected readonly comicLink = computed(() => this.navigation.comicLink(this.id()));
  protected readonly editionSeverity = computed(() => editionSeverity(this.editionType()));

  public handleBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit();
  }
}
