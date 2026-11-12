import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  LOGO_URL,
  PACK_CARD_COMPACT_BELOW,
  PACK_CARD_HEIGHT_PX,
  PACK_CARD_WIDTH_PX,
} from '../../constants/pack.const';
import { RankingEntry } from '../../models/ranking-entry.model';

/**
 * Carta della busta settimanale: posizione, copertina, titolo, autore, volume ed edizione. Sotto `PACK_CARD_COMPACT_BELOW` di scala mostra solo copertina e un numero di posizione grande (senza «#»: nel ventaglio le carte si sovrappongono e le due cifre del 10 resterebbero coperte).
 * Ha sempre le misure di 192×320 px, ridotte da `scale` (1 = carta intera, 0.6 = ventaglio, 0.2 = miniatura).
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
  public readonly entry = input.required<RankingEntry>();
  /** 1 = carta a grandezza naturale */
  public readonly scale = input<number>(1);
  /** false = si vede il dorso: la carta gira per mostrare il fronte */
  public readonly faceUp = input<boolean>(true);
  /**
   * true se la carta può girarsi (anima il passaggio dal dorso al fronte, con il 3D). Altrimenti è piatta:
   * il 3D del browser non allinea il testo ai pixel e lo rende sfocato.
   */
  public readonly flippable = input<boolean>(false);
  /** true quando chi la contiene (es. un bottone con la sua etichetta) descrive già la carta */
  public readonly decorative = input<boolean>(false);
  /** true = sempre copertina e numero (carte sovrapposte, come nel ventaglio); se non c'è, dipende dalla scala */
  public readonly compact = input<boolean | undefined>(undefined);

  protected readonly logo = LOGO_URL;
  protected readonly baseWidth = PACK_CARD_WIDTH_PX;
  protected readonly baseHeight = PACK_CARD_HEIGHT_PX;

  /** Una carta piccola mostra copertina e posizione, ben leggibili; i testi sono solo nella carta grande */
  protected readonly isCompact = computed(
    () => this.compact() ?? this.scale() < PACK_CARD_COMPACT_BELOW,
  );

  protected readonly width = computed(() => PACK_CARD_WIDTH_PX * this.scale());
  protected readonly height = computed(() => PACK_CARD_HEIGHT_PX * this.scale());
}
