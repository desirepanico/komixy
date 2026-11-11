import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBackOutline } from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { Button } from '@shared/components/button/button';
import { PackScene } from '@shared/components/pack-scene/pack-scene';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { toPackCards } from '@shared/services/weekly-pack/pack-cards/pack-cards';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { ComicRankCard } from '../../components/comic-rank-card/comic-rank-card';
import { RankingView } from '../../models/ranking-view.model';
import { RankingViewService } from '../../services/ranking-view/ranking-view.service';

/** «Rivedi la settimana»: la classifica come elenco o come carte. Finché la busta è sigillata non si vede */
@Component({
  selector: 'app-ranking-page',
  imports: [ComicRankCard, PackScene, Button, RouterLink, NgIcon, TranslocoPipe],
  templateUrl: './ranking-page.html',
  providers: [provideIcons({ matArrowBackOutline })],
})
export class RankingPage {
  private readonly comicsNavigation = inject(ComicsNavigationService);
  private readonly rankingView = inject(RankingViewService);
  private readonly toast = inject(ToastService);

  protected readonly discoverNavigation = inject(DiscoverNavigationService);
  protected readonly weeklyPack = inject(WeeklyPackService);
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly view = this.rankingView.view;
  protected readonly canChoose = this.rankingView.canChoose;
  protected readonly cards = computed(() =>
    toPackCards(this.weeklyPack.entries(), (id) => this.comicsNavigation.detailLink(id)),
  );

  protected setView(view: RankingView): void {
    this.rankingView.set(view);
  }

  protected onSceneFailed(): void {
    this.rankingView.set('list');
    this.toast.warn('rankingPage.sceneUnavailable.summaryWarn', 'rankingPage.sceneUnavailable.detailWarn');
  }
}
