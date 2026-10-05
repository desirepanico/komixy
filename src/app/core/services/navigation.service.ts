import { Injectable, signal } from '@angular/core';
import { AppRoutes } from '../../app.routes';
import { NavItem } from '../models/nav-item.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly navItems = signal<NavItem[]>([
    {
      icon: 'matExploreOutline',
      label: 'menu.discover',
      route: AppRoutes.Discover,
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
  ]);
}
