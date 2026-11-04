import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline } from '@ng-icons/material-symbols/outline';
import { AppRoutes } from '../../../../app.routes';
import { Button } from '@shared/components/button/button';
import { ComicRankCard } from '../../components/comic-rank-card/comic-rank-card';
import { WeeklyRankingService } from '../../services/weekly-ranking.service';

/** Classifica completa dei manga più letti della settimana. */
@Component({
  selector: 'app-ranking-page',
  imports: [ComicRankCard, Button, RouterLink, NgIcon, TranslocoPipe],
  templateUrl: './ranking-page.html',
  providers: [provideIcons({ matArrowBackOutline })],
})
export class RankingPage {
  protected readonly AppRoutes = AppRoutes;
  protected readonly ranking = inject(WeeklyRankingService);

  public readonly selectedId = signal<string | null>(null); // ID del fumetto attualmente selezionato nei preferiti

  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
