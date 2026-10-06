import { Component, signal, WritableSignal } from '@angular/core';
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
import { AppRoutes } from '../../../../app.routes';
import { NavItem } from '../../../models/nav-item.model';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [NgIcon, TranslocoPipe, RouterLink, RouterLinkActive],
  templateUrl: './mobile-bottom-nav.html',
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
export class MobileBottomNav {
  public appRoutes: WritableSignal<typeof AppRoutes>;
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
  constructor() {
    this.appRoutes = signal(AppRoutes);
  }
}
