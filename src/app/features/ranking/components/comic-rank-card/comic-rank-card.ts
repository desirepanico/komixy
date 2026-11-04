import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { Tag } from '@shared/components/tag/tag';
import { ToggleButton } from '@shared/components/toggle-button/toggle-button';
import { InView } from '@shared/directives/in-view/in-view.directive';
import { ComicItem } from '@shared/models/comic.model';
import { editionSeverity } from '@shared/models/edition-severity/edition-severity';

/**
 * Riga di classifica: posizione, copertina e le stesse informazioni di `app-comic-card`,
 * in orizzontale. Tutta la riga è un link (titolo con link "stirato"); il segnalibro resta cliccabile.
 */
@Component({
  selector: 'app-comic-rank-card',
  imports: [RouterLink, TranslocoPipe, Tag, ToggleButton, NgIcon, InView],
  providers: [provideIcons({ matBookmarkOutline })],
  templateUrl: './comic-rank-card.html',
  host: { class: 'block' },
})
export class ComicRankCard {
  private readonly comicsNavigation = inject(ComicsNavigationService);

  public readonly comic = input.required<ComicItem>();
  /** Posizione in classifica (1 = primo) */
  public readonly rank = input.required<number>();
  public readonly bookmarked = input<boolean>(false);
  public readonly bookmarkToggle = output<void>();

  protected readonly comicLink = computed(() => this.comicsNavigation.detailLink(this.comic().id));
  protected readonly severity = computed(() => editionSeverity(this.comic().editionType));

  /** Entrata del numero: parte quando entra nello schermo (solo senza "riduci movimento") */
  protected enterClasses =
    '-mr-1 flex w-12 shrink-0 justify-center motion-safe:opacity-0 motion-safe:data-in-view:animate-rank-in xs:w-15 md:-mr-2 md:w-20';

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
