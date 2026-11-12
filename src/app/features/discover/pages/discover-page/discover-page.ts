import { Component, inject } from '@angular/core';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { BookmarkButton } from '@shared/components/bookmark-button/bookmark-button';
import { ComicCard } from '@shared/components/comic-card/comic-card';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { WeeklyPackBanner } from '../../components/weekly-pack-banner/weekly-pack-banner';
import { WeeklyTop } from '../../components/weekly-top/weekly-top';

@Component({
  selector: 'app-discover-page',
  imports: [
    BookmarkButton,
    ComicCard,
    TranslocoPipe,
    HorizontalScroller,
    WeeklyPackBanner,
    WeeklyTop,
  ],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  protected readonly comicsNavigation = inject(ComicsNavigationService);
  protected readonly catalog = inject(ComicCatalogService);
  protected readonly pack = inject(WeeklyPackService);
}
