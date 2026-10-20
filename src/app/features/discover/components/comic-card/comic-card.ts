import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AppRoutes } from '../../../../app.routes';
export type EditionType = 'variant' | 'deluxe' | 'limited' | 'collector' | 'exclusive';
export type TagSeverity = 'secondary' | undefined;
@Component({
  selector: 'app-comic-card',
  imports: [NgIcon, TranslocoPipe, RouterLink, TagModule, ButtonModule],
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
  public id = input.required<string>();
  public coverUrl = input<string>('https://picsum.photos/seed/komixy-neon/160/200');
  public editionType = input<EditionType | null>(null);

  public isSingleVolume = input<boolean>(false);
  public volume = input<number>();
  public totalVolumes = input<number | null>(null);

  public bookmarked = input<boolean>(false);
  public bookmarkToggle = output<void>();

  // Mappa le edizioni su soli 2 stili visivi coerenti
  editionSeverity = computed<TagSeverity>(() => {
    switch (this.editionType()) {
      // 🟣 EDIZIONI SPECIALI / RARITÀ: Stile Primary Viola (nessuna severity = default primary)
      case 'collector':
      case 'limited':
      case 'exclusive':
        return undefined;

      // ⚪ EDIZIONI STANDARD / VARIANTI: Stile Secondary Neutro
      case 'variant':
      case 'deluxe':
      default:
        return 'secondary';
    }
  });

  public handleBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit();
  }
}
