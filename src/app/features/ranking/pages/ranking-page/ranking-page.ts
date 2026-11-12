import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { RANKING_VIEW_QUERY_PARAM } from '@shared/constants/navigation.const';
import { RankingEntry } from '@shared/models/ranking-entry.model';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { WeeklyRankingService } from '@shared/services/weekly-ranking/weekly-ranking.service';
import { ComicRankCard } from '../../components/comic-rank-card/comic-rank-card';
import { RankingLocked } from '../../components/ranking-locked/ranking-locked';
import { SelectButtonOption } from '@shared/models/select-button.model';
import { RankingView } from '../../models/ranking-view.model';
import { RankingNavigationService } from '../../services/ranking-navigation/ranking-navigation.service';
import { RankingViewService } from '../../services/ranking-view/ranking-view.service';

/**
 * «Rivedi la settimana»: la classifica in due viste, Elenco e Carte (ventaglio).
 * La vista sta nell'indirizzo (`?view=cards`), così il link si condivide; senza parametro vale l'ultima
 * scelta, ricordata in memoria finché l'app è aperta (`RankingViewService`).
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
  private readonly rankingNavigation = inject(RankingNavigationService);
  private readonly queryParams = toSignal(inject(ActivatedRoute).queryParamMap, {
    requireSync: true,
  });

  /** La vista scritta nell'indirizzo (`?view=`), se c'è ed è valida */
  private readonly urlView = computed<RankingView | null>(() => {
    const value = this.queryParams().get(RANKING_VIEW_QUERY_PARAM);
    return value === 'cards' || value === 'list' ? value : null;
  });

  /** L'indirizzo vince (un link condiviso apre la vista scelta da chi l'ha condiviso); senza, vale l'ultima scelta */
  protected readonly view = computed<RankingView>(() => this.urlView() ?? this.views.view());
  protected readonly viewOptions: readonly SelectButtonOption<RankingView>[] = [
    { value: 'list', label: 'ranking.list' },
    { value: 'cards', label: 'ranking.cards' },
  ];

  /** Carta scelta nella vista Carte */
  protected readonly selected = signal<RankingEntry | null>(null);

  public constructor() {
    // Un link con la vista nell'indirizzo diventa anche l'ultima scelta: uscendo e rientrando resta quella
    const fromUrl = this.urlView();
    if (fromUrl) this.views.setView(fromUrl);
  }

  protected changeView(view: RankingView): void {
    this.selected.set(null);
    this.views.setView(view);
    void this.rankingNavigation.goToView(view);
  }

  protected detailLink(entry: RankingEntry): readonly string[] {
    return this.comicsNavigation.detailLink(entry.comic.id);
  }
}
