import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matMenuBookOutline } from '@ng-icons/material-symbols/outline';
import { PACK_CARD_HEIGHT_PX, PACK_CARD_WIDTH_PX } from '../../constants/ui.const';
import { RankingEntry } from '../../models/ranking-entry.model';

/**
 * Carta della busta settimanale: posizione, copertina, titolo, autore, volume ed edizione.
 * Ha sempre le misure di 192×320 px, ridotte da `scale` (1 = carta intera, 0.6 = ventaglio, 0.2 = miniatura).
 *   <app-pack-card [entry]="entry" [scale]="0.6" [decorative]="true" />
 */
@Component({
  selector: 'app-pack-card',
  imports: [TranslocoPipe, NgIcon],
  providers: [provideIcons({ matMenuBookOutline })],
  templateUrl: './pack-card.html',
  host: {
    class: 'block shrink-0 perspective-distant',
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
  /** true quando chi la contiene (es. un bottone con la sua etichetta) descrive già la carta */
  public readonly decorative = input<boolean>(false);

  protected readonly baseWidth = PACK_CARD_WIDTH_PX;
  protected readonly baseHeight = PACK_CARD_HEIGHT_PX;

  protected readonly width = computed(() => PACK_CARD_WIDTH_PX * this.scale());
  protected readonly height = computed(() => PACK_CARD_HEIGHT_PX * this.scale());
}
