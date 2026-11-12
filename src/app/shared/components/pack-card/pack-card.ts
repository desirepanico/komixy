import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  LOGO_URL,
  PACK_CARD_COMPACT_BELOW,
  PACK_CARD_HEIGHT_PX,
  PACK_CARD_SHEEN_FROM,
  PACK_CARD_WIDTH_PX,
} from '../../constants/pack.const';
import { RankingEntry } from '../../models/ranking-entry.model';

/**
 * Disegnata a 192×320 px e ridotta da `scale`; sotto `PACK_CARD_COMPACT_BELOW` mostra solo copertina e posizione.
 *   <app-pack-card [entry]="entry" [scale]="0.6" [decorative]="true" />
 */
@Component({
  selector: 'app-pack-card',
  imports: [TranslocoPipe, NgOptimizedImage],
  templateUrl: './pack-card.html',
  host: {
    class: 'block shrink-0',
    '[class.perspective-distant]': 'flippable()',
    '[style.width.px]': 'width()',
    '[style.height.px]': 'height()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class PackCard {
  protected readonly logo = LOGO_URL;
  protected readonly baseWidth = PACK_CARD_WIDTH_PX;
  protected readonly baseHeight = PACK_CARD_HEIGHT_PX;

  public readonly entry = input.required<RankingEntry>();
  /** 1 = carta a grandezza naturale */
  public readonly scale = input<number>(1);
  /** false = si vede il dorso: la carta gira per mostrare il fronte */
  public readonly faceUp = input<boolean>(true);
  /** true = si può girare (con il 3D). Altrimenti è piatta: il 3D del browser sfoca il testo */
  public readonly flippable = input<boolean>(false);
  /** true se chi la contiene (es. un bottone con la sua etichetta) la descrive già */
  public readonly decorative = input<boolean>(false);
  /** true = sempre copertina e numero (carte sovrapposte); se manca, dipende dalla scala */
  public readonly compact = input<boolean | undefined>(undefined);

  protected readonly isRare = computed(() => this.entry().comic.editionType !== null);
  protected readonly hasSheen = computed(
    () => this.isRare() && this.scale() >= PACK_CARD_SHEEN_FROM,
  );
  /** Ogni carta parte da un punto diverso, così i riflessi non scorrono tutti insieme */
  protected readonly sheenDelayMs = computed(() => -this.entry().rank * 700);
  protected readonly isCompact = computed(
    () => this.compact() ?? this.scale() < PACK_CARD_COMPACT_BELOW,
  );
  protected readonly width = computed(() => PACK_CARD_WIDTH_PX * this.scale());
  protected readonly height = computed(() => PACK_CARD_HEIGHT_PX * this.scale());
}
