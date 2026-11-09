import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

@Injectable({ providedIn: 'root' })
export class RankingNavigationService {
  private readonly router = inject(Router);

  public readonly rankingLink: readonly string[] = ['/', AppRoutes.Discover, AppRoutes.Ranking];

  public goToRanking(): Promise<boolean> {
    return this.router.navigate(this.rankingLink);
  }
}
