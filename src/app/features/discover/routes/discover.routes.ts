import { Routes } from '@angular/router';

export const DISCOVER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/discover-page/discover-page').then((m) => m.DiscoverPage),
  },
];
