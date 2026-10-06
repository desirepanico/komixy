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
  matPersonOutline,
} from '@ng-icons/material-symbols/outline';
import { AvatarModule } from 'primeng/avatar';
import { AppRoutes } from '../../../../app.routes';
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
    }),
  ],
})
export class DesktopSidebar {
  public readonly navGroups = signal<NavGroup[]>([
    {
      title: 'menu.main',
      items: [
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
      ],
    },
    {
      title: 'menu.library',
      items: [
        {
          icon: 'matCollectionsBookmarkOutline',
          label: 'menu.collection',
          route: AppRoutes.Library,
        },
      ],
    },
  ]);
}
