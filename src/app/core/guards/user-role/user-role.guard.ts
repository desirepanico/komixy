import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserRole } from '@shared/models/user-role.model';
import { AuthNavigationService } from '@features/auth/services/auth-navigation/auth-navigation.service';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { AuthService } from '@features/auth/services/auth/auth.service';

export const userRoleGuard: (userRole: UserRole) => CanActivateFn =
  (userRole) => (route, state) => {
    const authService = inject(AuthService);
    const authNavigation = inject(AuthNavigationService);
    const discoverNavigation = inject(DiscoverNavigationService);

    const loggedUser = authService.loggedUser();

    if (!loggedUser) {
      return authNavigation.loginUrlTree(state.url);
    }

    if (loggedUser.userRole !== userRole) {
      return discoverNavigation.discoverUrlTree();
    }

    return true;
  };
