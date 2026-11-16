import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicItem } from '../../models/comic.model';
import { editionSeverity } from '../../utils/edition-severity/edition-severity';
import { CardFrame } from '../card-frame/card-frame';
import { Skeleton } from '../skeleton/skeleton';
import { Tag } from '../tag/tag';

/**
 * Carta di un volume, larga quanto il suo contenitore. Con `link` il titolo porta alla pagina e la carta intera è cliccabile.
 * Le edizioni speciali sono «rare»: cornice sfumata e un riflesso che attraversa la copertina. Lo spazio `cardAction` in alto a destra ospita il segnalibro.
 *   <app-comic-card [comic]="comic" [link]="detailLink">
 *     <app-bookmark-button cardAction [comicId]="comic.id" />
 *   </app-comic-card>
 */
@Component({
  selector: 'app-comic-card',
  imports: [TranslocoPipe, RouterLink, CardFrame, Skeleton, Tag],
  templateUrl: './comic-card.html',
  host: { class: 'block h-full' },
})
export class ComicCard {
  public readonly comic = input.required<ComicItem>();
  public readonly link = input<readonly string[] | null>(null);

  /** Finché la copertina non è arrivata si vede lo skeleton */
  protected readonly coverLoaded = signal<boolean>(false);

  protected readonly isRare = computed(() => this.comic().editionType !== null);
  protected readonly editionSeverity = computed(() => editionSeverity(this.comic().editionType));
}
