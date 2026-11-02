import { Routes } from '@angular/router';
export enum AppRoutes {
  Releases = 'releases',
  Scan = 'scan',
  Library = 'library',
  Profile = 'profile',
  Discover = 'discover',
  Login = 'login',
  Comic = 'comic',
  Ranking = 'ranking',
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AppRoutes.Discover,
      },
      {
        path: AppRoutes.Discover,
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/discover/pages/discover-page/discover-page').then(
                (m) => m.DiscoverPage,
              ),
          },
          {
            path: AppRoutes.Ranking,
            loadComponent: () =>
              import('./features/discover/pages/ranking-page/ranking-page').then(
                (m) => m.RankingPage,
              ),
          },
        ],
      },
      {
        path: AppRoutes.Releases,
        loadComponent: () =>
          import('./features/releases/pages/releases-page/releases-page').then(
            (m) => m.ReleasesPage,
          ),
      },
      //TODO insierire pagina dettaglio manga
      {
        path: AppRoutes.Comic,
        loadComponent: () =>
          import('./features/comics/pages/comics-page/comics-page').then((m) => m.ComicsPage),
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./features/comics/pages/comics-page/comics-page').then((m) => m.ComicsPage),
            // loadComponent: () =>
            //   import('./features/comicd/pages/comicd-detail-page/comic-detail-page').then(
            //     (m) => m.ComicDetailPage,
            //   ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage,
      ),
    data: { title: 'pageNotFound' },
  },
];
