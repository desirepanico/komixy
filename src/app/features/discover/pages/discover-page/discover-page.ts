import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppRoutes } from '../../../../app.routes';
import { Button } from '../../../../shared/components/button/button';
import { HorizontalScroller } from '../../../../shared/components/horizontal-scroller/horizontal-scroller';
import { ComicCard } from '../../components/comic-card/comic-card';
import { ComicRankCard } from '../../../../shared/components/comic-rank-card/comic-rank-card';
import { ComicItem } from '../../../../core/models/comic.model';
import { WeeklyRankingService } from '../../../../core/services/weekly-ranking.service';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard, ComicRankCard, TranslocoPipe, HorizontalScroller, Button, RouterLink],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  public selectedId = signal<string | null>(null); // ID del fumetto attualmente selezionato nei preferiti
  public comics = signal<ComicItem[]>([
    {
      id: '1',
      title: 'Neon Horizon',
      author: 'C. Arisato',
      volume: 4,
      totalVolumes: 12,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-neon/160/200',
    },
    {
      id: '2',
      title: 'Neon Horizon: Chronicles of the Last Star',
      author: 'Chiara Arisato & Lorenzo Hayakawa',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'variant',
      coverUrl: 'https://picsum.photos/seed/komixy-neon-alt/160/200',
    },
    {
      id: '3',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: 6,
      isSingleVolume: false,
      editionType: 'deluxe',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '4',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '5',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '6',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '7',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
  ]);

  // In Discover si mostrano solo le prime 5 posizioni della classifica
  protected readonly weeklyRanking = inject(WeeklyRankingService);
  protected readonly AppRoutes = AppRoutes;
  public topWeeklyComics = computed(() => this.weeklyRanking.comics().slice(0, 5));

  // Seleziona o deseleziona un fumetto dai preferiti
  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
