import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowForwardOutline } from '@ng-icons/material-symbols/outline';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { Button } from '@shared/components/button/button';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { ComicCard } from '../../components/comic-card/comic-card';
import { ComicRankCard } from '@features/ranking/components/comic-rank-card/comic-rank-card';
import { ComicItem } from '@shared/models/comic.model';
import { WeeklyRankingService } from '@shared/services/weekly-ranking/weekly-ranking.service';

@Component({
  selector: 'app-discover-page',
  imports: [
    ComicCard,
    ComicRankCard,
    TranslocoPipe,
    HorizontalScroller,
    Button,
    RouterLink,
    NgIcon,
  ],
  templateUrl: './discover-page.html',
  providers: [provideIcons({ matArrowForwardOutline })],
})
export class DiscoverPage {
  protected readonly selectedId = signal<string | null>(null); // ID del fumetto attualmente selezionato nei preferiti
  protected readonly comics = signal<ComicItem[]>([
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
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '5',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '6',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '7',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
  ]);

  // In Discover si mostrano le prime 6 posizioni (la sesta solo da tablet in su, per avere due colonne piene)
  protected readonly weeklyRanking = inject(WeeklyRankingService);
  protected readonly rankingNavigation = inject(RankingNavigationService);
  protected readonly topEntries = computed(() => this.weeklyRanking.entries().slice(0, 6));

  protected toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
