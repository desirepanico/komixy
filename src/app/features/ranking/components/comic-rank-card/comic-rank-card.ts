import { Component, ViewEncapsulation, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { ComicCover } from '@shared/components/comic-cover/comic-cover';
import { Tag } from '@shared/components/tag/tag';
import { ToggleButton } from '@shared/components/toggle-button/toggle-button';
import { EDITION_SEVERITY } from '@shared/constants/ui.const';
import { InView } from '@shared/directives/in-view/in-view.directive';
import { ComicItem } from '@shared/models/comic.model';

/** Tutta la riga è un link (titolo con link "stirato"); il segnalibro resta cliccabile. */
@Component({
  selector: 'app-comic-rank-card',
  imports: [RouterLink, TranslocoPipe, ComicCover, Tag, ToggleButton, NgIcon, InView],
  providers: [provideIcons({ matBookmarkOutline })],
  templateUrl: './comic-rank-card.html',
  styleUrl: './comic-rank-card.css',
  encapsulation: ViewEncapsulation.None,
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

  protected readonly comicLink = computed(() => this.comicsNavigation.detailLink(this.comic().id));
  /** Solo la prima copertina ha la priorità più alta: è quasi sempre l'elemento più grande della pagina */
  protected readonly fetchPriority = computed(() =>
    this.priority() && this.rank() === 1 ? 'high' : 'auto',
  );

  protected readonly severity = computed(() => EDITION_SEVERITY[this.comic().editionType ?? 'none']);

  /** Entrata del numero: parte quando entra nello schermo (solo senza "riduci movimento") */
  protected enterClasses =
    '-mr-1 flex w-12 shrink-0 justify-center motion-safe:opacity-0 motion-safe:data-in-view:animate-[rank-in_1400ms_cubic-bezier(0.16,1,0.3,1)_both] xs:w-15 md:-mr-2 md:w-20';

  /** Ritardo di entrata: 140ms per posizione, a gruppi di 5 (le righe visibili insieme si accendono in sequenza) */
  protected readonly enterDelay = computed(() => ((this.rank() - 1) % 5) * 140);

  /** Il podio (1-3) è viola con alone che pulsa piano */
  protected readonly rankClasses = computed(() => {
    const base =
      'flex origin-center items-baseline gap-0.5 bg-clip-text font-black leading-none tracking-tighter text-transparent tabular-nums transition-transform duration-300 group-hover:scale-110';
    const tone =
      this.rank() <= 3
        ? 'bg-linear-to-b from-primary-200 to-primary-500 drop-shadow-[0_0_14px_color-mix(in_srgb,var(--color-primary-500)_45%,transparent)] motion-safe:animate-[rank-glow_5s_ease-in-out_infinite]'
        : 'bg-linear-to-b from-surface-200 to-surface-500';
    return `${base} ${tone}`;
  });
}
