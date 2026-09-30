import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBarcodeScannerOutline, matHomeOutline } from '@ng-icons/material-symbols/outline';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [NgIcon, TranslocoPipe, RouterLink, RouterLinkActive],
  templateUrl: './mobile-bottom-nav.html',
  providers: [provideIcons({ matBarcodeScannerOutline, matHomeOutline })],
})
export class MobileBottomNav {
  navItems = [
    {
      icon: 'matHomeOutline',
      label: 'home',
      route: '',
    },
    {
      icon: 'matCollectionsBookmarkOutline',
      label: 'uscite',
      route: '/releases',
    },
    {
      icon: 'matFavoriteBorder',
      label: 'library',
      route: '/favorites',
    },
    {
      icon: 'matPersonOutline',
      label: 'profile',
      route: '/profile',
    },
  ];
}
