import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline } from '@ng-icons/material-symbols/outline';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { Button } from '@shared/components/button/button';
import { ComicRankCard } from '../../components/comic-rank-card/comic-rank-card';
import { WeeklyRankingService } from '@shared/services/weekly-ranking/weekly-ranking.service';

@Component({
  selector: 'app-ranking-page',
  imports: [ComicRankCard, Button, RouterLink, NgIcon, TranslocoPipe],
  templateUrl: './ranking-page.html',
  providers: [provideIcons({ matArrowBackOutline })],
})
export class RankingPage {
  protected readonly discoverNavigation = inject(DiscoverNavigationService);
  protected readonly ranking = inject(WeeklyRankingService);

  public readonly selectedId = signal<string | null>(null);

  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
