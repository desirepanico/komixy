import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppRoutes } from '@core/navigation/app-routes';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { Tag } from '@shared/components/tag/tag';
import { InView } from '@shared/directives/in-view/in-view';
import { ComicItem } from '@core/models/comic.model';
import { editionSeverity } from '@core/models/edition-severity';

/**
 * Riga di classifica: posizione, copertina e le stesse informazioni di `app-comic-card`,
 * in orizzontale. Tutta la riga è un link (titolo con link "stirato"); il segnalibro resta cliccabile.
 */
@Component({
  selector: 'app-comic-rank-card',
  imports: [RouterLink, TranslocoPipe, Tag, BookmarkButton, InView],
  templateUrl: './comic-rank-card.html',
  host: { class: 'block' },
})
export class ComicRankCard {
  protected readonly AppRoutes = AppRoutes;

  public readonly comic = input.required<ComicItem>();
  /** Posizione in classifica (1 = primo) */
  public readonly rank = input.required<number>();
  public readonly bookmarked = input<boolean>(false);
  public readonly bookmarkToggle = output<void>();

  protected readonly severity = computed(() => editionSeverity(this.comic().editionType));

  /** Entrata del numero: parte quando entra nello schermo (solo senza "riduci movimento") */
  protected enterClasses =
    '-mr-1 flex w-15 shrink-0 justify-center motion-safe:opacity-0 motion-safe:data-in-view:animate-rank-in md:-mr-2 md:w-20';

  /** Ritardo di entrata: 140ms per posizione, a gruppi di 5 (le righe visibili insieme si accendono in sequenza) */
  protected readonly enterDelay = computed(() => ((this.rank() - 1) % 5) * 140);

  /** Numero grande con sfumatura. Il podio (1-3) è viola con alone che pulsa piano; si ingrandisce al passaggio sulla riga */
  protected readonly rankClasses = computed(() => {
    const base =
      'flex origin-center items-baseline gap-0.5 bg-clip-text font-black leading-none tracking-tighter text-transparent tabular-nums transition-transform duration-300 group-hover:scale-110';
    const tone =
      this.rank() <= 3
        ? 'bg-linear-to-b from-primary-200 to-primary-500 drop-shadow-[0_0_14px_color-mix(in_srgb,var(--color-primary-500)_45%,transparent)] motion-safe:animate-rank-glow'
        : 'bg-linear-to-b from-surface-200 to-surface-500';
    return `${base} ${tone}`;
  });
}
