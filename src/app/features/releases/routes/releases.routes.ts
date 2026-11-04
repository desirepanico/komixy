import { Routes } from '@angular/router';

export const RELEASES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/releases-page/releases-page').then((m) => m.ReleasesPage),
  },
];
