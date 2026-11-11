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
}
