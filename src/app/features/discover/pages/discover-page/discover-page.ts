import { Component, signal } from '@angular/core';
import { ComicCard } from '../../components/comic-card/comic-card';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  readonly selectedId = signal<string | null>(null);

  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
