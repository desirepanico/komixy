import { Component, signal } from '@angular/core';
import { ComicCard } from '../../components/comic-card/comic-card';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  readonly bookmarked = signal(false);

  public toggleBookmark(): void {
    this.bookmarked.update((value) => !value);
  }
}
