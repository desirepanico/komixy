<<<<<<< HEAD
import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { ComicItem } from '@shared/models/comic.model';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { ComicCard } from '../../components/comic-card/comic-card';
import { WeeklyPack } from '../../components/weekly-pack/weekly-pack';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard, TranslocoPipe, HorizontalScroller, WeeklyPack],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly comics = signal<ComicItem[]>([
    {
      id: '1',
      title: 'Neon Horizon',
      author: 'C. Arisato',
      volume: 4,
      totalVolumes: 12,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-neon/160/200',
    },
    {
      id: '2',
      title: 'Neon Horizon: Chronicles of the Last Star',
      author: 'Chiara Arisato & Lorenzo Hayakawa',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'variant',
      coverUrl: 'https://picsum.photos/seed/komixy-neon-alt/160/200',
    },
    {
      id: '3',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: 6,
      isSingleVolume: false,
      editionType: 'deluxe',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '4',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '5',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '6',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '7',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
  ]);
=======
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { ComicCard } from '../../components/comic-card/comic-card';
import { WeeklyPackBanner } from '../../components/weekly-pack-banner/weekly-pack-banner';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard, TranslocoPipe, HorizontalScroller, WeeklyPackBanner],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  protected readonly catalog = inject(ComicCatalogService);
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
}
