import { Routes } from '@angular/router';

// TODO: sostituire con la pagina di dettaglio del fumetto
export const COMICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/comics-page/comics-page').then((m) => m.ComicsPage),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./pages/comics-page/comics-page').then((m) => m.ComicsPage),
      },
    ],
  },
];
