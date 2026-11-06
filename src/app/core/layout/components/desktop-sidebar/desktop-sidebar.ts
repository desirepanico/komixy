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
import { Button } from '@shared/components/button/button';
import { AppRoutes } from '@shared/constants/navigation.const';
import { UserRole } from '@shared/models/user-role.model';
import { NavGroup } from '@shared/models/nav-item.model';
@Component({
  selector: 'app-desktop-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, TranslocoPipe, Button],
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
  protected readonly profileLink = ['/', AppRoutes.Profile];

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
          label: 'common.releases',
          route: AppRoutes.Releases,
          roles: [UserRole.User, UserRole.Admin],
        },
      ],
    },
    {
      title: 'common.library',
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
