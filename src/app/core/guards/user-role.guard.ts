import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '../models/app-routes';
import { UserRole } from '@features/auth/models/auth.model';
import { AuthService } from '@features/auth/services/auth.service';

export const userRoleGuard: (userRole: UserRole) => CanActivateFn =
  (userRole) => (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const loggedUser = authService.loggedUser();

    // Utente non autenticato
    if (!loggedUser) {
      return router.createUrlTree([AppRoutes.Login], {
        queryParams: { returnUrl: state.url },
      });
    }

    // Utente autenticato ma senza il ruolo richiesto
    if (loggedUser.userRole !== userRole) {
      return router.createUrlTree([AppRoutes.Discover]);
    }

    return true;
  };
