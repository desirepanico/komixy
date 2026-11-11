import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PackNavigationService } from '@features/pack/services/pack-navigation/pack-navigation.service';
import { Button } from '@shared/components/button/button';
import { PACK_IMAGE_URL } from '@shared/constants/ui.const';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

/**
 * Al posto della classifica finché la busta è sigillata: niente spoiler, nemmeno da un link diretto.
 * «Salta l'animazione» apre la busta senza lasciare la pagina.
 */
@Component({
  selector: 'app-ranking-locked',
  imports: [NgOptimizedImage, RouterLink, TranslocoPipe, Button],
  templateUrl: './ranking-locked.html',
  host: { class: 'block' },
})
export class RankingLocked {
  protected readonly packNavigation = inject(PackNavigationService);
  private readonly pack = inject(WeeklyPackService);

  protected readonly packImage = PACK_IMAGE_URL;

  protected skip(): void {
    this.pack.open();
  }
}
