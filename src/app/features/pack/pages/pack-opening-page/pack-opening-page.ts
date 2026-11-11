import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { Button } from '@shared/components/button/button';
import { CardFan } from '@shared/components/card-fan/card-fan';
import { CardSpotlight } from '@shared/components/card-spotlight/card-spotlight';
import { PackCard } from '@shared/components/pack-card/pack-card';
import { PACK_TEAR_ANIMATION_MS } from '@shared/constants/ui.const';
import { RankingEntry } from '@shared/models/ranking-entry.model';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { PackTear } from '../../components/pack-tear/pack-tear';

/** sealed = busta da strappare, cards = si girano le carte una alla volta, collection = tutte girate */
type Phase = 'sealed' | 'cards' | 'collection';

/**
 * Apertura della busta a schermo intero: si strappa, si girano le 10 carte dalla 10ª alla 1ª
 * e si arriva alla raccolta a ventaglio. L'apertura si registra allo strappo.
 */
@Component({
  selector: 'app-pack-opening-page',
  imports: [PackTear, CardSpotlight, CardFan, PackCard, Button, RouterLink, TranslocoPipe],
  templateUrl: './pack-opening-page.html',
  host: { class: 'block', '(document:keydown.escape)': 'close()' },
})
export class PackOpeningPage {
  protected readonly pack = inject(WeeklyPackService);
  protected readonly session = inject(SessionService);
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly rankingNavigation = inject(RankingNavigationService);
  private readonly comicsNavigation = inject(ComicsNavigationService);
  private readonly discoverNavigation = inject(DiscoverNavigationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  private readonly primary = viewChild('primary', { read: ElementRef });

  /** Una busta già aperta non si riapre: si rimanda alla revisione della settimana */
  protected readonly alreadyOpened = this.pack.isOpened();

  protected readonly phase = signal<Phase>('sealed');
  protected readonly torn = signal<boolean>(false);
  protected readonly index = signal<number>(0);
  protected readonly faceUp = signal<boolean>(false);
  protected readonly selected = signal<RankingEntry | null>(null);

  protected readonly total = computed(() => this.pack.deck().length);
  protected readonly current = computed(() => this.pack.deck()[this.index()]);
  protected readonly previous = computed(() => this.pack.deck().slice(0, this.index()));
  protected readonly isLast = computed(() => this.index() === this.total() - 1);

  protected readonly flippedCount = computed(() => {
    switch (this.phase()) {
      case 'collection':
        return this.total();
      case 'cards':
        return this.index();
      default:
        return 0;
    }
  });

  protected readonly currentLink = computed(() =>
    this.comicsNavigation.detailLink(this.current().comic.id),
  );
  protected readonly selectedLink = computed(() => {
    const entry = this.selected();
    return entry ? this.comicsNavigation.detailLink(entry.comic.id) : [];
  });

  public constructor() {
    if (this.alreadyOpened) {
      void this.rankingNavigation.goToRanking();
    }
  }

  protected tear(): void {
    if (this.torn()) return;
    this.torn.set(true);
    this.pack.open();
    const timer = setTimeout(() => this.goTo('cards'), PACK_TEAR_ANIMATION_MS);
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }

  /** Un tocco sulla carta o sul bottone principale: prima la gira, poi passa alla prossima */
  protected onPrimary(): void {
    if (!this.faceUp()) {
      this.faceUp.set(true);
    } else if (this.isLast()) {
      this.goTo('collection');
    } else {
      this.index.update((i) => i + 1);
      this.faceUp.set(false);
    }
  }

  protected select(entry: RankingEntry): void {
    this.selected.set(entry);
    this.focusPrimary();
  }

  protected backToCollection(): void {
    this.selected.set(null);
  }

  protected close(): void {
    void this.discoverNavigation.goToDiscover();
  }

  private goTo(phase: Phase): void {
    this.phase.set(phase);
    this.focusPrimary();
  }

  /** Il bottone che aveva il focus sparisce con la fase: il focus passa al bottone principale della nuova */
  private focusPrimary(): void {
    afterNextRender(() => (this.primary()?.nativeElement as HTMLElement | undefined)?.focus(), { injector: this.injector });
  }
}
