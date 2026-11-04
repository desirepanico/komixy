import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserRole } from '@shared/models/user-role.model';
import { AuthNavigationService } from '@features/auth/services/auth-navigation/auth-navigation.service';
import { AuthService } from '@features/auth/services/auth/auth.service';

export const userRoleGuard: (userRole: UserRole) => CanActivateFn =
  (userRole) => (route, state) => {
    const authService = inject(AuthService);
    const navigation = inject(AuthNavigationService);

    const loggedUser = authService.loggedUser();

    if (!loggedUser) {
      return navigation.loginUrlTree(state.url);
    }

    if (loggedUser.userRole !== userRole) {
      return navigation.forbiddenUrlTree();
    }

    return true;
  };
