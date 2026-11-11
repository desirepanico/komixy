import { Routes } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: AppRoutes.Register,
    loadComponent: () => import('../pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: AppRoutes.ForgotPassword,
    loadComponent: () =>
      import('../pages/forgot-password-page/forgot-password-page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
];
