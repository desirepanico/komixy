import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { PackCard } from '@shared/components/pack-card/pack-card';
import { packCardRadius } from '@shared/components/pack-card/pack-card-radius/pack-card-radius';
import {
  PACK_CARD_WIDTH_PX,
  WEEKLY_TOP_CARD_SCALE,
  WEEKLY_TOP_COUNT,
  WEEKLY_TOP_FRAME_PX,
  WEEKLY_TOP_GAP_PX,
  WEEKLY_TOP_INITIAL_COUNT,
} from '@shared/constants/ui.const';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

const CARD_WIDTH = PACK_CARD_WIDTH_PX * WEEKLY_TOP_CARD_SCALE;

/**
 * Le carte della classifica della settimana in un pannello accanto alla busta aperta (su schermi larghi):
 * ne mostra tante quante ne stanno intere nella larghezza, dalla 1ª in poi, e non oltre la larghezza
 * che servirebbe per tutte. Ogni carta porta al dettaglio del volume.
 *   <app-weekly-top />
 */
@Component({
  selector: 'app-weekly-top',
  imports: [RouterLink, TranslocoPipe, PackCard],
  templateUrl: './weekly-top.html',
  host: { class: 'block', '[style.max-width.px]': 'maxWidth()' },
})
export class WeeklyTop {
  private readonly pack = inject(WeeklyPackService);
  private readonly comicsNavigation = inject(ComicsNavigationService);

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  /** Larghezza della lista, 0 finché non è stata misurata */
  private readonly listWidth = signal<number>(0);

  protected readonly cardScale = WEEKLY_TOP_CARD_SCALE;
  /** Gli angoli dell'anello di focus seguono quelli della carta rimpicciolita */
  protected readonly cardRadius = packCardRadius(WEEKLY_TOP_CARD_SCALE);
  protected readonly gap = WEEKLY_TOP_GAP_PX;

  private readonly top = computed(() =>
    this.pack
      .deck()
      .filter((entry) => entry.rank <= WEEKLY_TOP_COUNT)
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => ({ entry, link: this.comicsNavigation.detailLink(entry.comic.id) })),
  );

  /** Le carte che ci stanno intere nella larghezza misurata */
  protected readonly visible = computed(() => {
    const width = this.listWidth();
    const fit =
      width > 0
        ? Math.floor((width + WEEKLY_TOP_GAP_PX) / (CARD_WIDTH + WEEKLY_TOP_GAP_PX))
        : WEEKLY_TOP_INITIAL_COUNT;
    return this.top().slice(0, Math.max(1, fit));
  });

  /** Oltre questa larghezza non servirebbe altro spazio: tutte le carte sono già in fila */
  protected readonly maxWidth = computed(() => {
    const count = this.top().length;
    return count * CARD_WIDTH + (count - 1) * WEEKLY_TOP_GAP_PX + WEEKLY_TOP_FRAME_PX;
  });

  public constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) => this.listWidth.set(entry.contentRect.width));
      observer.observe(this.list().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
