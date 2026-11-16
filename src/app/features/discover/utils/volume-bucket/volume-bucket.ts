import { VolumeBucket } from '@shared/models/catalog-filter.model';
import { CatalogItem } from '@shared/models/catalog-item.model';

/** In quale fascia di volumi cade un titolo (conta i volumi della serie, o il volume se non si sa). */
export function volumeBucket(item: CatalogItem): VolumeBucket {
  const volumes = item.totalVolumes ?? item.volume;
  if (item.kind === 'comic') {
    if (item.isSingleVolume || volumes <= 1) return 'single';
    if (volumes <= 5) return 'twoToFive';
  } else if (volumes <= 5) {
    return 'oneToFive';
  }
  return volumes <= 20 ? 'sixToTwenty' : 'overTwenty';
}
