import { Routes } from '@angular/router';
export enum AppRoutes {
  Releases = 'releases',
  Scan = 'scan',
  Library = 'library',
  Profile = 'profile',
  Home = 'home',
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),

    children: [
      {
        path: '', //"Se l'URL è esattamente /, vai automaticamente a /home
        pathMatch: 'full',
        redirectTo: AppRoutes.Home,
      },
      {
        path: AppRoutes.Home,
        loadComponent: () =>
          import('./features/home/pages/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: AppRoutes.Releases,
        loadComponent: () =>
          import('./features/releases/pages/releases-page/releases-page').then(
            (m) => m.ReleasesPage,
          ),
      },
    ],
  },
  // {
  //   path: '500',
  //   loadComponent: () =>
  //     import('./common/components/error/error.component').then((m) => m.ErrorComponent),
  //   data: { errorCode: 500 },
  // },
  // {
  //   path: '401',
  //   loadComponent: () =>
  //     import('./common/components/error/error.component').then((m) => m.ErrorComponent),
  //   data: { errorCode: 401 },
  // },
  //TODO craere pagina not_found
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage,
      ),
    data: { title: 'pageNotFound' },
  },
];
