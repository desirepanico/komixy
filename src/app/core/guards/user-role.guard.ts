import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes.const';
import { UserRole } from '@shared/models/user-role.model';
import { AuthService } from '@features/auth/services/auth.service';

export const userRoleGuard: (userRole: UserRole) => CanActivateFn =
  (userRole) => (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const loggedUser = authService.loggedUser();

    if (!loggedUser) {
      return router.createUrlTree([AppRoutes.Login], {
        queryParams: { returnUrl: state.url },
      });
    }

    if (loggedUser.userRole !== userRole) {
      return router.createUrlTree([AppRoutes.Discover]);
    }

    return true;
  };
