import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Rotte della feature ranking: la classifica, che sta sotto il percorso di Scopri. */
@Injectable({ providedIn: 'root' })
export class RankingNavigationService {
  private readonly router = inject(Router);

  public readonly rankingLink: readonly string[] = ['/', AppRoutes.Discover, AppRoutes.Ranking];

  public goToRanking(): Promise<boolean> {
    return this.router.navigate(this.rankingLink);
  }
}
