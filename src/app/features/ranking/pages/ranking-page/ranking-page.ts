import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline, matLockOutline } from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { Button } from '@shared/components/button/button';
import { CardFan } from '@shared/components/card-fan/card-fan';
import { CardSpotlight } from '@shared/components/card-spotlight/card-spotlight';
import { Hint } from '@shared/components/hint/hint';
import { Message } from '@shared/components/message/message';
import { SelectButton } from '@shared/components/select-button/select-button';
import { RankingEntry } from '@shared/models/ranking-entry.model';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { WeeklyRankingService } from '@shared/services/weekly-ranking/weekly-ranking.service';
import { ComicRankCard } from '../../components/comic-rank-card/comic-rank-card';
import { RankingLocked } from '../../components/ranking-locked/ranking-locked';
import { SelectButtonOption } from '@shared/models/select-button.model';
import { RankingView } from '../../models/ranking-view.model';
import { RankingViewService } from '../../services/ranking-view/ranking-view.service';

/**
 * «Rivedi la settimana»: la classifica in due viste, Elenco e Carte (ventaglio).
 * La vista scelta si ricorda finché l'app è aperta (`RankingViewService`).
 * Finché la busta è sigillata non mostra nulla della classifica.
 */
@Component({
  selector: 'app-ranking-page',
  imports: [
    ComicRankCard,
    RankingLocked,
    SelectButton,
    CardFan,
    CardSpotlight,
    Message,
    Hint,
    Button,
    RouterLink,
    NgIcon,
    TranslocoPipe,
  ],
  templateUrl: './ranking-page.html',
  providers: [provideIcons({ matArrowBackOutline, matLockOutline })],
})
export class RankingPage {
  protected readonly discoverNavigation = inject(DiscoverNavigationService);
  private readonly comicsNavigation = inject(ComicsNavigationService);
  protected readonly ranking = inject(WeeklyRankingService);
  protected readonly pack = inject(WeeklyPackService);
  protected readonly session = inject(SessionService);
  private readonly views = inject(RankingViewService);
  protected readonly view = this.views.view;
  protected readonly viewOptions: readonly SelectButtonOption<RankingView>[] = [
    { value: 'list', label: 'ranking.list' },
    { value: 'cards', label: 'ranking.cards' },
  ];

  /** Carta scelta nella vista Carte */
  protected readonly selected = signal<RankingEntry | null>(null);

  protected changeView(view: RankingView): void {
    this.selected.set(null);
    this.views.setView(view);
  }

  protected detailLink(entry: RankingEntry): readonly string[] {
    return this.comicsNavigation.detailLink(entry.comic.id);
  }
}
