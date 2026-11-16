import { Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  DISCOVER_ICON_SET,
  DISCOVER_OPTION_ICONS,
  DISCOVER_SECTION_ICONS,
} from '@shared/constants/ui.const';
import { ComicKind } from '@shared/models/comic.model';
import { DiscoverChip, DiscoverFilters } from '@shared/models/discover-filters.model';
import { discoverChips } from '../../utils/discover-chips/discover-chips';

@Component({
  selector: 'app-discover-chips',
  imports: [NgIcon, TranslocoPipe],
  templateUrl: './discover-chips.html',
  providers: [provideIcons(DISCOVER_ICON_SET)],
  host: { class: 'block' },
})
export class DiscoverChips {
  public readonly filters = input.required<DiscoverFilters>();
  public readonly remove = output<DiscoverChip>();

  protected readonly chips = computed(() => discoverChips(this.filters()));

  protected sectionKey(chip: DiscoverChip, kind: ComicKind): string {
    return chip.key === 'category' && kind === 'comic' ? 'genre' : chip.key;
  }

  /** Il valore tradotto: l'intervallo di anni e gli adulti hanno un testo proprio */
  protected labelKey(chip: DiscoverChip): string {
    return chip.key === 'year' || chip.key === 'adult'
      ? `discoverFilters.chipValue.${chip.key}`
      : `discoverFilters.options.${chip.key}.${chip.value}`;
  }

  protected icon(chip: DiscoverChip): string | null {
    if (chip.key === 'theme') return DISCOVER_OPTION_ICONS.theme[chip.value] ?? null;
    if (chip.key === 'format') return DISCOVER_OPTION_ICONS.format[chip.value] ?? null;
    if (chip.key === 'status') return DISCOVER_OPTION_ICONS.status[chip.value] ?? null;
    if (chip.key === 'adult') return null;
    return DISCOVER_SECTION_ICONS[chip.key] ?? null;
  }
}
