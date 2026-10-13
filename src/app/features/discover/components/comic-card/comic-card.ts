import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';
import { AppRoutes } from '../../../../app.routes';
import { StatusTag } from '../../../../shared/components/status-tag/status-tag';

@Component({
  selector: 'app-comic-card',
  imports: [NgIcon, TranslocoPipe, RouterLink, StatusTag],
  templateUrl: './comic-card.html',
  providers: [
    provideIcons({
      matBookmarkOutline,
    }),
  ],
})
export class ComicCard {
  protected readonly AppRoutes = signal(AppRoutes);
  public title = input.required<string>();
  public author = input.required<string>();
  public volume = input.required<number>();
  public description = input.required<string>();
  public id = input.required<string>();
  public genre = input<string[]>([]);
  public coverUrl = input<string>('https://picsum.photos/seed/komixy-neon/160/200');
  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();

  public handleBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit();
  }
}
