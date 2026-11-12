import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RANKING_VIEW_QUERY_PARAM } from '@shared/constants/navigation.const';
import { AppRoutes } from '@shared/models/app-routes.model';
import { RankingView } from '../../models/ranking-view.model';

/** Rotte della feature ranking: la classifica, che sta sotto il percorso di Scopri. */
@Injectable({ providedIn: 'root' })
export class RankingNavigationService {
  private readonly router = inject(Router);

  public readonly rankingLink: readonly string[] = ['/', AppRoutes.Discover, AppRoutes.Ranking];

  public goToRanking(): Promise<boolean> {
    return this.router.navigate(this.rankingLink);
  }

  /** Mette la vista nell'indirizzo (`?view=cards` o `?view=list`), senza aggiungere una voce alla cronologia */
  public goToView(view: RankingView): Promise<boolean> {
    return this.router.navigate(this.rankingLink, {
      queryParams: { [RANKING_VIEW_QUERY_PARAM]: view },
      replaceUrl: true,
    });
  }
}
