import { Routes } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: AppRoutes.ForgotPassword,
    loadComponent: () =>
      import('../pages/forgot-password-page/forgot-password-page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
];
