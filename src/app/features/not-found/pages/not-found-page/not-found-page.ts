import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline, matExploreOutline } from '@ng-icons/material-symbols/outline';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';
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
  protected readonly AppRoutes = AppRoutes;
}
