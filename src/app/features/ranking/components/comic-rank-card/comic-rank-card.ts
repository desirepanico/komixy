import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { Skeleton } from '@shared/components/skeleton/skeleton';
import { Tag } from '@shared/components/tag/tag';
import { ToggleButton } from '@shared/components/toggle-button/toggle-button';
import { InView } from '@shared/directives/in-view/in-view.directive';
import { ComicItem } from '@shared/models/comic.model';
import { editionSeverity } from '@shared/models/edition-severity/edition-severity';

/** Tutta la riga è un link (titolo con link "stirato"); il segnalibro resta cliccabile. */
@Component({
  selector: 'app-comic-rank-card',
  imports: [RouterLink, TranslocoPipe, Skeleton, Tag, ToggleButton, NgIcon, InView],
  providers: [provideIcons({ matBookmarkOutline })],
  templateUrl: './comic-rank-card.html',
  styleUrl: './comic-rank-card.css',
  host: { class: 'block' },
})
export class ComicRankCard {
  private readonly comicsNavigation = inject(ComicsNavigationService);

  public readonly comic = input.required<ComicItem>();
  public readonly rank = input.required<number>();
  /** Riga visibile senza scorrere: la copertina si scarica subito e non in lazy (migliora l'LCP) */
  public readonly priority = input<boolean>(false);
  public readonly bookmarked = input<boolean>(false);
  public readonly bookmarkToggle = output<void>();

  protected readonly coverLoaded = signal<boolean>(false);

  protected readonly comicLink = computed(() => this.comicsNavigation.detailLink(this.comic().id));
  /** Solo la prima copertina ha la priorità più alta: è quasi sempre l'elemento più grande della pagina */
  protected readonly fetchPriority = computed(() =>
    this.priority() && this.rank() === 1 ? 'high' : 'auto',
  );

  protected readonly severity = computed(() => editionSeverity(this.comic().editionType));

  /** Entrata del numero: parte quando entra nello schermo (solo senza "riduci movimento") */
  protected enterClasses =
    '-mr-1 flex w-12 shrink-0 justify-center rank-enter xs:w-15 md:-mr-2 md:w-20';

  /** Ritardo di entrata: 140ms per posizione, a gruppi di 5 (le righe visibili insieme si accendono in sequenza) */
  protected readonly enterDelay = computed(() => ((this.rank() - 1) % 5) * 140);

  /** Il podio (1-3) è viola con alone che pulsa piano */
  protected readonly rankClasses = computed(() => {
    const base =
      'flex origin-center items-baseline gap-0.5 bg-clip-text font-black leading-none tracking-tighter text-transparent tabular-nums transition-transform duration-300 group-hover:scale-110';
    const tone =
      this.rank() <= 3
        ? 'bg-linear-to-b from-primary-200 to-primary-500 drop-shadow-[0_0_14px_color-mix(in_srgb,var(--color-primary-500)_45%,transparent)] rank-glow'
        : 'bg-linear-to-b from-surface-200 to-surface-500';
    return `${base} ${tone}`;
  });
}
