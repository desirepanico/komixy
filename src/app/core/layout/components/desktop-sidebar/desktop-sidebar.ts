import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matBarcodeScannerOutline,
  matCalendarTodayOutline,
  matCollectionsBookmarkOutline,
  matExploreOutline,
  matHomeOutline,
  matChevronRightOutline,
  matKeyboardArrowDownOutline,
  matMenuBookOutline,
  matPersonOutline,
} from '@ng-icons/material-symbols/outline';
import { AppRoutes } from '../../../navigation/app-routes';
import { UserRole } from '../../../auth/auth.model';
import { NavGroup } from '../../../navigation/nav-item.model';
@Component({
  selector: 'app-desktop-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, TranslocoPipe],
  templateUrl: './desktop-sidebar.html',
  providers: [
    provideIcons({
      matBarcodeScannerOutline,
      matHomeOutline,
      matCollectionsBookmarkOutline,
      matCalendarTodayOutline,
      matPersonOutline,
      matExploreOutline,
      matKeyboardArrowDownOutline,
      matChevronRightOutline,
      matMenuBookOutline,
    }),
  ],
})
export class DesktopSidebar {
  protected readonly navGroups = signal<NavGroup[]>([
    {
      title: 'menu.main',
      expandable: true,
      items: [
        {
          icon: 'matExploreOutline',
          label: 'menu.discover',
          route: AppRoutes.Discover,
          roles: [UserRole.User, UserRole.Admin],
        },
        {
          icon: 'matCalendarTodayOutline',
          label: 'menu.releases',
          route: AppRoutes.Releases,
          roles: [UserRole.User, UserRole.Admin],
        },
      ],
    },
    {
      title: 'menu.library',
      expandable: true,
      items: [
        {
          icon: 'matCollectionsBookmarkOutline',
          label: 'menu.collection',
          route: AppRoutes.Library,
          roles: [UserRole.User, UserRole.Admin],
        },
      ],
    },
  ]);

  protected toggleGroup(group: NavGroup): void {
    this.navGroups.update((groups) =>
      groups.map((g) => (g.title === group.title ? { ...g, expandable: !g.expandable } : g)),
    );
  }
}
