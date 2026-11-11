import { Routes } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Ogni feature porta le sue rotte (`routes/<nome>.routes.ts`, relative): qui si montano sui loro percorsi. */
export const routes: Routes = [
  // L'app parte dalla login; dopo l'accesso si arriva a Scopri (o alla pagina richiesta)
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.Login,
  },
  // L'apertura della busta sta sotto /discover ma a schermo intero, quindi fuori dal layout (niente menu)
  {
    path: `${AppRoutes.Discover}/${AppRoutes.Pack}`,
    loadChildren: () => import('@features/pack/routes/pack.routes').then((m) => m.PACK_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('@core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: AppRoutes.Discover,
        children: [
          {
            path: AppRoutes.Ranking,
            loadChildren: () =>
              import('@features/ranking/routes/ranking.routes').then((m) => m.RANKING_ROUTES),
          },
          {
            path: '',
            loadChildren: () =>
              import('@features/discover/routes/discover.routes').then((m) => m.DISCOVER_ROUTES),
          },
        ],
      },
      {
        path: AppRoutes.Releases,
        loadChildren: () =>
          import('@features/releases/routes/releases.routes').then((m) => m.RELEASES_ROUTES),
      },
      {
        path: AppRoutes.Library,
        loadChildren: () =>
          import('@features/library/routes/library.routes').then((m) => m.LIBRARY_ROUTES),
      },
      {
        path: AppRoutes.Profile,
        loadChildren: () =>
          import('@features/profile/routes/profile.routes').then((m) => m.PROFILE_ROUTES),
      },
      {
        path: AppRoutes.Comic,
        loadChildren: () =>
          import('@features/comics/routes/comics.routes').then((m) => m.COMICS_ROUTES),
      },
    ],
  },
  {
    path: AppRoutes.Login,
    loadChildren: () => import('@features/auth/routes/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@features/not-found/routes/not-found.routes').then((m) => m.NOT_FOUND_ROUTES),
  },
];
