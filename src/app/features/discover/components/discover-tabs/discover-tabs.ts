import { Component, input, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ComicKind } from '@shared/models/catalog-item.model';
import { DiscoverTab } from '../../models/discover-filters.model';

/** Manga o Fumetti: due bottoni a due stati con le copertine a ventaglio. Con `compact` sono pillole piccole (isola fissa). */
@Component({
  selector: 'app-discover-tabs',
  imports: [TranslocoPipe],
  templateUrl: './discover-tabs.html',
  host: { class: 'block' },
})
export class DiscoverTabs {
  public readonly tabs = input.required<readonly DiscoverTab[]>();
  public readonly compact = input<boolean>(false);
  public readonly kind = model.required<ComicKind>();
}
