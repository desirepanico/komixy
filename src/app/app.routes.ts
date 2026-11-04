import { Routes } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AppRoutes.Discover,
      },
      {
        path: AppRoutes.Discover,
        loadChildren: () =>
          import('@features/discover/routes/discover.routes').then((m) => m.DISCOVER_ROUTES),
      },
      {
        path: AppRoutes.Releases,
        loadComponent: () =>
          import('@features/releases/pages/releases-page/releases-page').then(
            (m) => m.ReleasesPage,
          ),
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
    loadComponent: () =>
      import('@features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@features/not-found/pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
    data: { title: 'pageNotFound' },
  },
];
