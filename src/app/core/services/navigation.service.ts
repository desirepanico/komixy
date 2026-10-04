import { Injectable } from '@angular/core';
import { AppRoutes } from '../../app.routes';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly navItems: NavItem[] = [
    {
      icon: 'matHomeOutline',
      label: 'menu.home',
      route: AppRoutes.Home,
    },
    {
      icon: 'matCalendarTodayOutline',
      label: 'menu.releases',
      route: AppRoutes.Releases,
    },
    {
      icon: 'matCollectionsBookmarkOutline',
      label: 'menu.library',
      route: AppRoutes.Library,
    },
    {
      icon: 'matPersonOutline',
      label: 'menu.profile',
      route: AppRoutes.Profile,
    },
  ];
}
