import { Routes } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes';

export const DISCOVER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/discover-page/discover-page').then((m) => m.DiscoverPage),
  },
  {
    path: AppRoutes.Ranking,
    loadComponent: () =>
      import('@features/ranking/pages/ranking-page/ranking-page').then((m) => m.RankingPage),
  },
];
