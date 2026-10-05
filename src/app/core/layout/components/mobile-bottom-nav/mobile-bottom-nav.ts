import { Component, inject, signal, WritableSignal } from '@angular/core';
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
import { NavigationService } from '../../../services/navigation.service';

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
  private readonly navigationService = inject(NavigationService);

  public appRoutes: WritableSignal<typeof AppRoutes>;
  protected readonly navItems = this.navigationService.navItems;
  constructor() {
    this.appRoutes = signal(AppRoutes);
  }
}
