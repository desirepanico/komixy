import { NgOptimizedImage } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCloseOutline, matLockOutline } from '@ng-icons/material-symbols/outline';
import { firstValueFrom } from 'rxjs';
import { AuthNavigationService } from '@features/auth/services/auth-navigation/auth-navigation.service';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { Button } from '@shared/components/button/button';
import { PackScene } from '@shared/components/pack-scene/pack-scene';
import { Tag } from '@shared/components/tag/tag';
import { PackCard } from '@shared/models/pack.model';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { PackSupportService } from '@shared/services/pack-support/pack-support.service';
import { SessionService } from '@shared/services/session/session.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { toPackCards } from '@shared/services/weekly-pack/pack-cards/pack-cards';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

/**
 * Busta della settimana in Scopri: da aprire (con la scena 3D a schermo intero) oppure già aperta,
 * con il collegamento a «Rivedi la settimana». Si apre una sola volta a settimana.
 */
@Component({
  selector: 'app-weekly-pack',
  imports: [Button, NgIcon, NgOptimizedImage, PackScene, RouterLink, Tag, TranslocoPipe],
  providers: [provideIcons({ matCloseOutline, matLockOutline })],
  templateUrl: './weekly-pack.html',
})
export class WeeklyPack {
  private readonly weeklyPack = inject(WeeklyPackService);
  private readonly bookmarks = inject(BookmarksService);
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly rankingNavigation = inject(RankingNavigationService);
  private readonly comicsNavigation = inject(ComicsNavigationService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly status = this.weeklyPack.status;
  protected readonly weekNumber = this.weeklyPack.weekNumber;
  protected readonly days = this.weeklyPack.daysToNextPack;
  protected readonly isGuest = this.session.isGuest;
  protected readonly locked = this.bookmarks.locked;
  protected readonly bookmarkedIds = this.bookmarks.ids;
  protected readonly supports3d = inject(PackSupportService).supports3d;
  protected readonly rankingLink = this.rankingNavigation.rankingLink;
  protected readonly registerLink = this.authNavigation.registerLink;
  protected readonly cardCount = computed(() => this.weeklyPack.entries().length);
  protected readonly nextPackKey = computed(() =>
    this.days === 1 ? 'weeklyPack.opened.nextPackOne' : 'weeklyPack.opened.nextPackOther',
  );

  protected readonly sceneOpen = signal<boolean>(false);
  protected readonly cards = signal<readonly PackCard[]>([]);

  protected openWithScene(): void {
    if (!this.supports3d) {
      void this.requestOpen();
      return;
    }
    this.cards.set([]);
    this.sceneOpen.set(true);
    this.dialog().nativeElement.showModal();
  }

  protected openWithoutScene(): void {
    void this.requestOpen();
  }

  // Lo strappo è completo: la busta si considera aperta solo quando il server risponde
  protected onTearComplete(): void {
    void this.requestOpen();
  }

  protected onFinished(): void {
    this.closeDialog();
    void this.rankingNavigation.goToRanking();
  }

  protected onSceneFailed(): void {
    this.closeDialog();
    this.toast.warn('weeklyPack.sceneUnavailable.summaryWarn', 'weeklyPack.sceneUnavailable.detailWarn');
    void this.requestOpen();
  }

  protected toggleBookmark(comicId: string): void {
    this.bookmarks.toggle(comicId);
  }

  protected closeDialog(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
    this.sceneOpen.set(false);
  }

  protected onDialogClosed(): void {
    this.sceneOpen.set(false);
  }

  private async requestOpen(): Promise<void> {
    try {
      const entries = await firstValueFrom(this.weeklyPack.open());
      this.cards.set(toPackCards(entries, (id) => this.comicsNavigation.detailLink(id)));
    } catch {
      this.toast.error('weeklyPack.openError.summaryKo', 'weeklyPack.openError.detailKo');
      this.closeDialog();
    }
  }
}
