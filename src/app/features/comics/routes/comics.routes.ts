import { Routes } from '@angular/router';

export const COMICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/comics-page/comics-page').then((m) => m.ComicsPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../pages/comic-detail-page/comic-detail-page').then((m) => m.ComicDetailPage),
  },
];
