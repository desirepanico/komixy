import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { matLockOutline } from '@ng-icons/material-symbols/outline';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PackNavigationService } from '@features/pack/services/pack-navigation/pack-navigation.service';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { Button } from '@shared/components/button/button';
import { Message } from '@shared/components/message/message';
import { Tag } from '@shared/components/tag/tag';
import { PACK_IMAGE_URL } from '@shared/constants/pack.const';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

/**
 * Busta della settimana in Scopri: da aprire (con «Salta l'animazione» per chi non vuole il 3D)
 * oppure, una volta aperta, una striscia con il pulsante «Rivedi la settimana».
 * Gli ospiti possono aprirla ma non salvare le carte in lista.
 */
@Component({
  selector: 'app-weekly-pack-banner',
  imports: [NgOptimizedImage, RouterLink, TranslocoPipe, Button, Message, Tag],
  providers: [provideIcons({ matLockOutline })],
  templateUrl: './weekly-pack-banner.html',
  host: { class: 'block' },
})
export class WeeklyPackBanner {
  protected readonly pack = inject(WeeklyPackService);
  protected readonly session = inject(SessionService);
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly packNavigation = inject(PackNavigationService);
  protected readonly rankingNavigation = inject(RankingNavigationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly packImage = PACK_IMAGE_URL;

  private readonly lang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });
  protected readonly openedOn = computed(() => this.pack.openedOnLabel(this.lang()));

  /** Apre la busta senza animazione e va alla revisione della settimana */
  protected skip(): void {
    this.pack.open();
    void this.rankingNavigation.goToRanking();
  }
}
