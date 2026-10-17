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
  matKeyboardArrowDownOutline,
  matPersonOutline,
} from '@ng-icons/material-symbols/outline';
import { AvatarModule } from 'primeng/avatar';
import { AppRoutes } from '../../../../app.routes';
import { UserRole } from '../../../../features/auth/models/auth.model';
import { NavGroup } from '../../../models/nav-item.model';
@Component({
  selector: 'app-desktop-sidebar',
  imports: [AvatarModule, RouterLink, RouterLinkActive, NgIcon, TranslocoPipe],
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
    }),
  ],
})
export class DesktopSidebar {
  public readonly navGroups = signal<NavGroup[]>([
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

  public toggleGroup(group: NavGroup) {
    const index = this.navGroups().findIndex((g) => g.title === group.title);

    this.navGroups.update((groups) => {
      groups[index].expandable = !groups[index].expandable;
      return [...groups];
    });
  }
}
