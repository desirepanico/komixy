import { Routes } from '@angular/router';

export const RANKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/ranking-page/ranking-page').then((m) => m.RankingPage),
  },
];
