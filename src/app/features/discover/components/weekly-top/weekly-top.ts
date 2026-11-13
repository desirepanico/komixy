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
import { packCardRadius } from '@shared/utils/pack-card-radius/pack-card-radius';
import {
  WEEKLY_TOP_CARD_SCALE,
  WEEKLY_TOP_CARD_WIDTH_PX,
  WEEKLY_TOP_COUNT,
  WEEKLY_TOP_FRAME_PX,
  WEEKLY_TOP_GAP_PX,
  WEEKLY_TOP_INITIAL_COUNT,
} from '@shared/constants/pack.const';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';

/** Mostra le carte che stanno intere nella larghezza del pannello, dalla 1ª in poi. */
@Component({
  selector: 'app-weekly-top',
  imports: [RouterLink, TranslocoPipe, PackCard],
  templateUrl: './weekly-top.html',
  host: { class: 'block', '[style.max-width.px]': 'maxWidth()' },
})
export class WeeklyTop {
  private readonly _pack = inject(WeeklyPackService);
  private readonly _comicsNavigation = inject(ComicsNavigationService);

  protected readonly cardScale = WEEKLY_TOP_CARD_SCALE;
  protected readonly cardRadius = packCardRadius(WEEKLY_TOP_CARD_SCALE);
  protected readonly gap = WEEKLY_TOP_GAP_PX;

  private readonly _list = viewChild.required<ElementRef<HTMLElement>>('list');

  /** Larghezza della lista, 0 finché non è stata misurata */
  private readonly _listWidth = signal<number>(0);
  private readonly _top = computed(() =>
    this._pack
      .deck()
      .filter((entry) => entry.rank <= WEEKLY_TOP_COUNT)
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => ({ entry, link: this._comicsNavigation.detailLink(entry.comic.id) })),
  );
  /** Le carte che ci stanno intere nella larghezza misurata */
  protected readonly visible = computed(() => {
    const width = this._listWidth();
    const fit =
      width > 0
        ? Math.floor((width + WEEKLY_TOP_GAP_PX) / (WEEKLY_TOP_CARD_WIDTH_PX + WEEKLY_TOP_GAP_PX))
        : WEEKLY_TOP_INITIAL_COUNT;
    return this._top().slice(0, Math.max(1, fit));
  });
  /** Oltre questa larghezza non servirebbe altro spazio: tutte le carte sono già in fila */
  protected readonly maxWidth = computed(() => {
    const count = this._top().length;
    return count * WEEKLY_TOP_CARD_WIDTH_PX + (count - 1) * WEEKLY_TOP_GAP_PX + WEEKLY_TOP_FRAME_PX;
  });

  public constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) =>
        this._listWidth.set(entry.contentRect.width),
      );
      observer.observe(this._list().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
