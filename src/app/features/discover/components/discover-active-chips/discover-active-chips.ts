import { Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCloseOutline } from '@ng-icons/material-symbols/outline';
import { DiscoverFilters, EMPTY_FILTERS, FacetKey } from '../../models/discover-filters.model';

interface Chip {
  facet: FacetKey;
  value: string;
  /** Chiave di traduzione del testo */
  labelKey: string;
}

/** Un chip per ogni filtro attivo: un tocco lo toglie, «Cancella tutto» li toglie tutti. */
@Component({
  selector: 'app-discover-active-chips',
  imports: [NgIcon, TranslocoPipe],
  providers: [provideIcons({ matCloseOutline })],
  templateUrl: './discover-active-chips.html',
  host: { class: 'block' },
})
export class DiscoverActiveChips {
  public readonly filters = input.required<DiscoverFilters>();
  public readonly filtersChange = output<DiscoverFilters>();

  protected readonly chips = computed<Chip[]>(() => {
    const f = this.filters();
    const chips: Chip[] = [];
    const add = (facet: Exclude<FacetKey, 'era' | 'showAdult'>, values: readonly string[]) =>
      values.forEach((value) =>
        chips.push({ facet, value, labelKey: `discover.options.${facet}.${value}` }),
      );
    add('categories', f.categories);
    add('formats', f.formats);
    add('statuses', f.statuses);
    add('volumes', f.volumes);
    add('themes', f.themes);
    if (f.era !== 'all')
      chips.push({ facet: 'era', value: f.era, labelKey: `discover.options.era.${f.era}` });
    if (f.showAdult)
      chips.push({ facet: 'showAdult', value: '1', labelKey: 'discover.options.showAdult' });
    return chips;
  });

  protected remove(chip: Chip): void {
    const f = this.filters();
    if (chip.facet === 'era') this.filtersChange.emit({ ...f, era: 'all' });
    else if (chip.facet === 'showAdult') this.filtersChange.emit({ ...f, showAdult: false });
    else
      this.filtersChange.emit({
        ...f,
        [chip.facet]: f[chip.facet].filter((value: string) => value !== chip.value),
      });
  }

  protected clearAll(): void {
    const { kind, query } = this.filters();
    this.filtersChange.emit({ ...EMPTY_FILTERS, kind, query });
  }
}
