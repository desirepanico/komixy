import { Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCloseOutline } from '@ng-icons/material-symbols/outline';
import { DISCOVER_FACET_ICONS, DISCOVER_ICON_SET } from '@shared/constants/ui.const';
import { DiscoverFilters, FacetKey } from '../../models/discover-filters.model';

interface Chip {
  facet: FacetKey;
  value: string;
  /** Chiave di traduzione del testo */
  labelKey: string;
  /** Icona del gruppo; i contenuti per adulti hanno il bollino 18+ */
  icon: string | null;
}

/** Un chip per ogni filtro attivo: un tocco lo toglie. Su telefono scorrono di lato, da tablet vanno a capo. */
@Component({
  selector: 'app-discover-active-chips',
  imports: [NgIcon, TranslocoPipe],
  providers: [provideIcons({ ...DISCOVER_ICON_SET, matCloseOutline })],
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
        chips.push({
          facet,
          value,
          labelKey: `discover.options.${facet}.${value}`,
          icon: DISCOVER_FACET_ICONS[facet],
        }),
      );
    add('categories', f.categories);
    add('formats', f.formats);
    add('statuses', f.statuses);
    add('volumes', f.volumes);
    add('themes', f.themes);
    if (f.era !== 'all')
      chips.push({
        facet: 'era',
        value: f.era,
        labelKey: `discover.options.era.${f.era}`,
        icon: DISCOVER_FACET_ICONS['era'],
      });
    if (f.showAdult)
      chips.push({
        facet: 'showAdult',
        value: '1',
        labelKey: 'discover.options.showAdult',
        icon: null,
      });
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
}
