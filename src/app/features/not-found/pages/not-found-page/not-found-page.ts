import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline, matExploreOutline } from '@ng-icons/material-symbols/outline';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { Button } from '@shared/components/button/button';
@Component({
  selector: 'app-not-found-page',

  imports: [RouterLink, TranslocoPipe, NgIcon, Button],
  templateUrl: './not-found-page.html',
  providers: [
    provideIcons({
      matExploreOutline,
      matArrowBackOutline,
    }),
  ],
})
export class NotFoundPage {
  protected readonly discoverNavigation = inject(DiscoverNavigationService);
}
