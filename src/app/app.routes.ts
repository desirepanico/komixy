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
        loadComponent: () => import('./home/pages/home-page').then((m) => m.HomePage),
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
];
