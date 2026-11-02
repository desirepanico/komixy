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
import { MAIN_PAGES } from '../../../navigation/main-pages';

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
  readonly navItems = signal<readonly NavItem[]>(MAIN_PAGES);
  constructor() {
    this.appRoutes = signal(AppRoutes);
  }
}
