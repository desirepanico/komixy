import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppRoutes } from '@shared/constants/app-routes.const';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { Tag } from '@shared/components/tag/tag';
import { EditionType } from '@shared/models/comic.model';
import { editionSeverity } from '@shared/models/edition-severity';
@Component({
  selector: 'app-comic-card',
  imports: [TranslocoPipe, RouterLink, Tag, BookmarkButton],
  templateUrl: './comic-card.html',
})
export class ComicCard {
  protected readonly AppRoutes = AppRoutes;

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

  // Stile del tag in base all'edizione
  protected readonly editionSeverity = computed(() => editionSeverity(this.editionType()));

  public handleBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit();
  }
}
