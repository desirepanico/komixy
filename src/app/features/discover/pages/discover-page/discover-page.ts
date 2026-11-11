import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HorizontalScroller } from '@shared/components/horizontal-scroller/horizontal-scroller';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { ComicCard } from '../../components/comic-card/comic-card';
import { WeeklyPackBanner } from '../../components/weekly-pack-banner/weekly-pack-banner';
import { WeeklyTop } from '../../components/weekly-top/weekly-top';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard, TranslocoPipe, HorizontalScroller, WeeklyPackBanner, WeeklyTop],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  protected readonly catalog = inject(ComicCatalogService);
  protected readonly pack = inject(WeeklyPackService);
}
