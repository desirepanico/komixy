import { Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { InView } from '@shared/directives/in-view/in-view.directive';
import { InputText } from '@shared/components/input/input-text/input-text';
import {
  DISCOVER_FILTER_OPTIONS,
  DISCOVER_ICON_SET,
  DISCOVER_OPTION_ICONS,
  DISCOVER_SECTION_ICONS,
} from '@shared/constants/ui.const';
import { DiscoverFilters, DiscoverListKey } from '@shared/models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { CategoryAvatarService } from '../../services/category-avatar/category-avatar.service';
import { DiscoverToggle } from '../discover-filters-panel/discover-filters-panel';

/** La guida ai filtri: una schermata che scorre sopra il pannello, con una scheda per ogni valore e la verifica dell'età per i 18+. */
@Component({
  selector: 'app-discover-guide',
  imports: [FormField, FormRoot, InView, InputText, NgIcon, TranslocoPipe],
  templateUrl: './discover-guide.html',
  providers: [provideIcons(DISCOVER_ICON_SET)],
  host: { class: 'contents' },
})
export class DiscoverGuide {
  protected readonly avatars = inject(CategoryAvatarService);
  protected readonly age = inject(AgeVerificationService);

  protected readonly sectionIcons = DISCOVER_SECTION_ICONS;
  protected readonly optionIcons = DISCOVER_OPTION_ICONS;

  public readonly open = input.required<boolean>();
  public readonly filters = input.required<DiscoverFilters>();
  public readonly resultCount = input.required<number>();
  public readonly back = output<void>();
  public readonly valueToggle = output<DiscoverToggle>();
  public readonly adultChange = output<boolean>();
  public readonly clear = output<void>();

  protected readonly options = computed(() => DISCOVER_FILTER_OPTIONS[this.filters().kind]);
  protected readonly progress = signal<number>(0);
  protected readonly formOpen = signal<boolean>(false);
  protected readonly ageError = signal<string | null>(null);

  protected readonly activeCount = computed(() => {
    const f = this.filters();
    return (
      f.category.length +
      f.format.length +
      f.status.length +
      f.volumes.length +
      f.theme.length +
      (f.adult ? 1 : 0)
    );
  });

  private readonly _model = signal<{ day: string; month: string; year: string }>({
    day: '',
    month: '',
    year: '',
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
            this.adultChange.emit(true);
          } else {
            this.ageError.set(
              result === 'minor'
                ? 'discoverFilters.guide.ageMinor'
                : 'discoverFilters.guide.ageInvalid',
            );
          }
        },
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );

  protected selected(key: DiscoverListKey, value: string): boolean {
    return this.filters()[key].includes(value);
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

  /** Dall'interruttore del pannello: se l'età non è verificata si apre il modulo, altrimenti si attiva il filtro */
  public requestAdult(): void {
    if (this.age.verified()) this.adultChange.emit(true);
    else this.formOpen.set(true);
  }
}
