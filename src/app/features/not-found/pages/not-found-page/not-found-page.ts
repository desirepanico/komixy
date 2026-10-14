import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline, matExploreOutline } from '@ng-icons/material-symbols/outline';
import { ButtonModule } from 'primeng/button';
import { AppRoutes } from '../../../../app.routes';
@Component({
  selector: 'app-not-found-page',

  imports: [RouterLink, ButtonModule, TranslocoModule, NgIcon],
  templateUrl: './not-found-page.html',
  providers: [
    provideIcons({
      matExploreOutline,
      matArrowBackOutline,
    }),
  ],
})
export class NotFoundPage {
  private readonly _location = inject(Location);
  protected readonly AppRoutes = AppRoutes;
  public goBack() {
    this._location.back();
    return;
  }
}
