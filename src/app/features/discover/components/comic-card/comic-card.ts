import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppRoutes } from '../../../../app.routes';
import { BookmarkButton } from '../../../../shared/components/bookmark-button/bookmark-button';
import { Tag } from '../../../../shared/components/tag/tag';
import { EditionType, editionSeverity } from '../../models/comic.model';
@Component({
  selector: 'app-comic-card',
  imports: [TranslocoPipe, RouterLink, Tag, BookmarkButton],
  templateUrl: './comic-card.html',
})
export class ComicCard {
  protected readonly AppRoutes = signal(AppRoutes);

  public title = input.required<string>();
  public author = input.required<string>();
  public id = input.required<string>();
  public coverUrl = input<string>('https://picsum.photos/seed/komixy-neon/160/200');
  public editionType = input<EditionType | null>(null);

  public isSingleVolume = input<boolean>(false);
  public volume = input<number>();
  public totalVolumes = input<number | null>(null);

  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();

  // Stile del tag in base all'edizione
  protected editionSeverity = computed(() => editionSeverity(this.editionType()));

  public handleBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit();
  }
}
