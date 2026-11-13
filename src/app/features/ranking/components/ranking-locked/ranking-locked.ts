import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PackNavigationService } from '@features/pack/services/pack-navigation/pack-navigation.service';
import { Button } from '@shared/components/button/button';
import { PACK_IMAGE_URL } from '@shared/constants/pack.const';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

/** Al posto della classifica a busta sigillata, anche da link diretto: niente spoiler. */
@Component({
  selector: 'app-ranking-locked',
  imports: [NgOptimizedImage, RouterLink, TranslocoPipe, Button],
  templateUrl: './ranking-locked.html',
  host: { class: 'block' },
})
export class RankingLocked {
  protected readonly packNavigation = inject(PackNavigationService);
  private readonly _pack = inject(WeeklyPackService);

  protected readonly packImage = PACK_IMAGE_URL;

  protected skip(): void {
    this._pack.open();
  }
}
