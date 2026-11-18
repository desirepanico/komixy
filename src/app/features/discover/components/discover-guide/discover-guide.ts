import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { form, FormField, FormRoot, pattern, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matArrowBackOutline,
  matCheckOutline,
  matWarningOutline,
} from '@ng-icons/material-symbols/outline';
import { Button } from '@shared/components/button/button';
import { InputText } from '@shared/components/input/input-text/input-text';
import {
  CATEGORY_OPTIONS,
  DISCOVER_FACET_ICONS,
  DISCOVER_OPTION_ICONS,
  FORMAT_OPTIONS,
  GUIDE_SLIDE_MOBILE_MS,
  GUIDE_SLIDE_MS,
  STATUS_OPTIONS,
  THEME_OPTIONS,
} from '@shared/constants/ui.const';
import { InView } from '@shared/directives/in-view/in-view.directive';
import { RestartAnimation } from '@shared/directives/restart-animation/restart-animation.directive';
import { ViewportService } from '@shared/services/viewport/viewport.service';
import { DiscoverFilters, FacetKey } from '../../models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { CatalogFilterService } from '../../services/catalog-filter/catalog-filter.service';
import { CategoryAvatarService } from '../../services/category-avatar/category-avatar.service';
import { FormatIllustration } from '../format-illustration/format-illustration';
import { discoverIcons } from '../../utils/discover-icons/discover-icons';

interface GuideCard {
  value: string;
  icon: string;
  nameKey: string;
  textKey: string;
  exampleKey: string | null;
  avatar: string | null;
}

interface GuideSection {
  facet: Exclude<FacetKey, 'era' | 'showAdult'>;
  icon: string;
  titleKey: string;
  cards: GuideCard[];
}

/** La guida ai filtri: una scheda per ogni valore, che si tocca per accenderlo, e la verifica dell'età per i contenuti 18+. */
@Component({
  selector: 'app-discover-guide',
  imports: [
    FormField,
    FormRoot,
    FormatIllustration,
    InputText,
    InView,
    NgIcon,
    RestartAnimation,
    TranslocoPipe,
    Button,
  ],
  providers: [
    provideIcons({ ...discoverIcons(), matArrowBackOutline, matCheckOutline, matWarningOutline }),
  ],
  templateUrl: './discover-guide.html',
  styleUrl: './discover-guide.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class:
      'flex min-h-0 flex-1 animate-[discover-guide-slide_var(--guide-slide-ms)_cubic-bezier(0.2,0.8,0.2,1)_both] flex-col bg-[linear-gradient(180deg,#19142f,#0f0d1c_45%)]',
  },
})
export class DiscoverGuide {
  private readonly _catalogFilter = inject(CatalogFilterService);
  private readonly _avatars = inject(CategoryAvatarService);
  private readonly _viewport = inject(ViewportService);
  protected readonly age = inject(AgeVerificationService);

  private readonly _shownAt = Date.now();

  private readonly _ageForm = viewChild<ElementRef<HTMLElement>>('ageForm');

  public readonly filters = input.required<DiscoverFilters>();
  /** Aprire la guida dall'interruttore dei contenuti per adulti mostra subito il modulo dell'età */
  public readonly askAge = input<boolean>(false);
  public readonly filtersChange = output<DiscoverFilters>();
  public readonly back = output<void>();
  public readonly done = output<void>();

  private readonly _model = signal<{ day: string; month: string; year: string }>({
    day: '',
    month: '',
    year: '',
  });
  protected readonly formOpen = linkedSignal<boolean>(() => this.askAge() && !this.age.verified());
  protected readonly ageError = signal<string | null>(null);
  protected readonly progress = signal<number>(0);
  /** La scheda appena toccata: fa un piccolo rimbalzo che finisce con `animationend` */
  protected readonly pulse = signal<string>('');
  protected readonly isManga = computed<boolean>(() => this.filters().kind === 'manga');
  protected readonly activeCount = computed<number>(() =>
    this._catalogFilter.activeCount(this.filters()),
  );
  protected readonly sections = computed<GuideSection[]>(() => {
    const kind = this.filters().kind;
    const card = (
      group: string,
      value: string,
      optionGroup: string,
      options: { avatar?: boolean; infoKey?: string; example?: boolean } = {},
    ): GuideCard => ({
      value,
      icon: DISCOVER_OPTION_ICONS[optionGroup]?.[value] ?? DISCOVER_FACET_ICONS[optionGroup],
      nameKey: `discover.options.${optionGroup}.${value}`,
      textKey: `discover.guide.info.${group}.${options.infoKey ?? value}.${options.example === false ? kind : 'text'}`,
      exampleKey:
        options.example === false
          ? null
          : `discover.guide.info.${group}.${options.infoKey ?? value}.example`,
      avatar: options.avatar ? this._avatars.avatar(value) : null,
    });
    const sections: GuideSection[] = [
      {
        facet: 'categories',
        icon: DISCOVER_FACET_ICONS['categories'],
        titleKey: kind === 'manga' ? 'discover.guide.categories' : 'discover.guide.genres',
        cards: CATEGORY_OPTIONS[kind].map((v) =>
          card('categories', v, 'categories', { avatar: kind === 'manga' }),
        ),
      },
      {
        facet: 'formats',
        icon: DISCOVER_FACET_ICONS['formats'],
        titleKey: 'discover.guide.sectionFormats',
        cards: FORMAT_OPTIONS[kind].map((v) =>
          card('formats', v, 'formats', {
            infoKey: v === 'series' && kind === 'comic' ? 'seriesComic' : v,
          }),
        ),
      },
      {
        facet: 'statuses',
        icon: DISCOVER_FACET_ICONS['statuses'],
        titleKey: 'discover.guide.sectionStatus',
        cards: STATUS_OPTIONS.map((v) => card('statuses', v, 'statuses', { example: false })),
      },
    ];
    if (kind === 'manga') {
      sections.push({
        facet: 'themes',
        icon: DISCOVER_FACET_ICONS['themes'],
        titleKey: 'discover.guide.sectionThemes',
        cards: THEME_OPTIONS.map((v) => card('themes', v, 'themes')),
      });
    }
    return sections;
  });
  protected readonly form = form(
    this._model,
    (path) => {
      required(path.day);
      pattern(path.day, /^\d{1,2}$/);
      required(path.month);
      pattern(path.month, /^\d{1,2}$/);
      required(path.year);
      pattern(path.year, /^\d{4}$/);
    },
    {
      submission: {
        action: async () => {
          const { day, month, year } = this._model();
          const result = this.age.check(Number(day), Number(month), Number(year));
          if (result === 'adult') {
            this.ageError.set(null);
            this.formOpen.set(false);
            this.filtersChange.emit({ ...this.filters(), showAdult: true });
          } else {
            this.ageError.set(
              result === 'minor' ? 'discover.guide.ageMinor' : 'discover.guide.ageInvalid',
            );
          }
        },
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );

  constructor() {
    // Il modulo dell'età sta sotto lo schermo: si scende quando esiste e dopo l'ingresso della guida, che scorrendo da destra interromperebbe lo scorrimento
    effect((onCleanup) => {
      const form = this._ageForm()?.nativeElement;
      if (!form) return;
      const slideMs = this._viewport.isMobile() ? GUIDE_SLIDE_MOBILE_MS : GUIDE_SLIDE_MS;
      const wait = Math.max(0, slideMs - (Date.now() - this._shownAt));
      const timer = setTimeout(
        () => form.scrollIntoView?.({ block: 'center', behavior: 'smooth' }),
        wait,
      );
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected selected(facet: GuideSection['facet'], value: string): boolean {
    return (this.filters()[facet] as readonly string[]).includes(value);
  }
  protected selectedCount(facet: GuideSection['facet']): number {
    return this.filters()[facet].length;
  }
  protected onPulseEnd(event: AnimationEvent): void {
    if (event.animationName === 'discover-guide-pop') this.pulse.set('');
  }
  protected toggle(facet: GuideSection['facet'], value: string): void {
    this.pulse.set(facet + value);
    this.filtersChange.emit(this._catalogFilter.toggle(this.filters(), facet, value));
  }
  protected reset(): void {
    this.filtersChange.emit(this._catalogFilter.reset(this.filters()));
  }
  protected onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? el.scrollTop / max : 0);
  }

  protected toggleForm(): void {
    this.formOpen.update((open) => !open);
    this.ageError.set(null);
  }
}
