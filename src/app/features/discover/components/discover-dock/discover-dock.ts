import { Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matTuneOutline } from '@ng-icons/material-symbols/outline';
import { CatalogComic, ComicKind } from '@shared/models/comic.model';
import { coverBackground } from '@shared/utils/cover-background/cover-background';
import { DiscoverSearch } from '../discover-search/discover-search';

/** L'isola che resta in alto quando la barra dei filtri esce dallo schermo: sezioni, ricerca e Filtri, con la cometa dello scorrimento. */
@Component({
  selector: 'app-discover-dock',
  imports: [DiscoverSearch, NgIcon, TranslocoPipe],
  templateUrl: './discover-dock.html',
  providers: [provideIcons({ matTuneOutline })],
  host: { class: 'sticky top-0 z-30 block h-0' },
})
export class DiscoverDock {
  protected readonly tabs: readonly ComicKind[] = ['manga', 'comic'];

  public readonly on = input.required<boolean>();
  public readonly kind = input.required<ComicKind>();
  public readonly comics = input.required<readonly CatalogComic[]>();
  public readonly kindComics = input.required<readonly CatalogComic[]>();
  public readonly search = input.required<string>();
  public readonly filterCount = input.required<number>();
  public readonly progress = input.required<number>();
  public readonly kindChange = output<ComicKind>();
  public readonly searchChange = output<string>();
  public readonly openFilters = output<void>();

  protected readonly covers = computed<Record<ComicKind, string>>(() => {
    const first = (kind: ComicKind): string => {
      const own = this.comics().filter((c) => c.kind === kind && !c.adult);
      return coverBackground(own[0] ?? { coverUrl: '' });
    };
    return { manga: first('manga'), comic: first('comic') };
  });
}
