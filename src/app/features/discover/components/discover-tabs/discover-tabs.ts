import { Component, computed, ElementRef, inject, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DISCOVER_FAN_CLASSES } from '@shared/constants/ui.const';
import { CatalogComic, ComicKind } from '@shared/models/comic.model';
import { coverBackground } from '@shared/utils/cover-background/cover-background';

/** Le sezioni Manga e Fumetti come due carte: tablist con frecce, Home e Fine, e tre copertine a ventaglio */
@Component({
  selector: 'app-discover-tabs',
  imports: [TranslocoPipe],
  templateUrl: './discover-tabs.html',
  host: { class: 'block' },
})
export class DiscoverTabs {
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly tabs: readonly ComicKind[] = ['manga', 'comic'];

  protected readonly fanClasses = DISCOVER_FAN_CLASSES;

  public readonly kind = input.required<ComicKind>();
  public readonly comics = input.required<readonly CatalogComic[]>();
  public readonly mangaCount = input.required<number>();
  public readonly comicCount = input.required<number>();
  public readonly kindChange = output<ComicKind>();

  // Le copertine vere vanno prima di quelle disegnate, e i titoli per adulti non si mostrano
  protected readonly fans = computed<Record<ComicKind, string[]>>(() => {
    const fan = (kind: ComicKind): string[] => {
      const own = this.comics().filter((c) => c.kind === kind && !c.adult);
      const real = own.filter((c) => c.coverUrl);
      return (real.length > 1 ? real : own).slice(0, 3).map((c) => coverBackground(c));
    };
    return { manga: fan('manga'), comic: fan('comic') };
  });

  protected count(kind: ComicKind): number {
    return kind === 'manga' ? this.mangaCount() : this.comicCount();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const index = this.tabs.indexOf(this.kind());
    const target =
      event.key === 'ArrowRight'
        ? (index + 1) % this.tabs.length
        : event.key === 'ArrowLeft'
          ? (index + this.tabs.length - 1) % this.tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? this.tabs.length - 1
              : -1;
    if (target < 0) return;
    event.preventDefault();
    this.kindChange.emit(this.tabs[target]);
    // Il tab raggiunto da tastiera riceve il focus (tabindex a rotazione)
    this._host.nativeElement.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus();
  }
}
