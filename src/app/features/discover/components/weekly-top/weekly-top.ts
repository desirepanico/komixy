import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { Button } from '@shared/components/button/button';
import { WEEKLY_TOP_COUNT } from '@shared/constants/ui.const';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

/**
 * I primi volumi della classifica della settimana, in un pannello accanto alla busta aperta
 * (su schermi larghi). Ogni copertina porta al dettaglio del volume.
 *   <app-weekly-top />
 */
@Component({
  selector: 'app-weekly-top',
  imports: [RouterLink, TranslocoPipe, Button],
  templateUrl: './weekly-top.html',
  host: { class: 'block' },
})
export class WeeklyTop {
  private readonly pack = inject(WeeklyPackService);
  private readonly comicsNavigation = inject(ComicsNavigationService);
  protected readonly rankingNavigation = inject(RankingNavigationService);

  protected readonly count = WEEKLY_TOP_COUNT;

  protected readonly top = computed(() =>
    this.pack
      .deck()
      .filter((entry) => entry.rank <= WEEKLY_TOP_COUNT)
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => ({ entry, link: this.comicsNavigation.detailLink(entry.comic.id) })),
  );
}
