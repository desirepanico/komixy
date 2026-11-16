import { ComicItem } from './comic.model';

/** Manga o fumetto occidentale: le due schede di Scopri. */
export type ComicKind = 'manga' | 'comic';

export type ComicStatus = 'completed' | 'ongoing';

export type ComicFormat = 'series' | 'oneShot' | 'graphicNovel' | 'omnibus';

/** Categoria dei manga (pubblico) o genere dei fumetti: la chiave è anche quella della traduzione. */
export type ComicCategory =
  | 'shonen'
  | 'kodomo'
  | 'shojo'
  | 'seinen'
  | 'josei'
  | 'superheroes'
  | 'scifi'
  | 'fantasy'
  | 'horror'
  | 'noir'
  | 'historical'
  | 'humor';

/** Tema narrativo (solo manga). */
export type ComicTheme =
  | 'action'
  | 'romance'
  | 'fantasy'
  | 'scifiMecha'
  | 'horror'
  | 'mystery'
  | 'comedy'
  | 'sport'
  | 'sliceOfLife'
  | 'isekai';

/** Un volume del catalogo di Scopri: un `ComicItem` con i campi su cui si filtra. */
export interface CatalogItem extends ComicItem {
  kind: ComicKind;
  categories: ComicCategory[];
  format: ComicFormat;
  year: number;
  status: ComicStatus;
  themes: ComicTheme[];
  isAdult: boolean;
}
