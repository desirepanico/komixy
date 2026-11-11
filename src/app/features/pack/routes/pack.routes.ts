import { Routes } from '@angular/router';

export const PACK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/pack-opening-page/pack-opening-page').then((m) => m.PackOpeningPage),
  },
];
