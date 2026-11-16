import { ComicItem } from '../../models/comic.model';

/** La copertina come `background-image`; senza immagine, un fondale spaziale dal colore del volume */
export function coverBackground(comic: Pick<ComicItem, 'coverUrl' | 'coverHue'>): string {
  if (comic.coverUrl) return `url(${comic.coverUrl})`;
  const hue = comic.coverHue ?? 270;
  return `linear-gradient(165deg, hsl(${hue} 55% 30%), hsl(${hue + 28} 65% 11%))`;
}
