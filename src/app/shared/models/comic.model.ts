/** Solo edizioni che esistono davvero sul mercato (variant, deluxe, limited): nessuna fonte di dati le dà come campo, si ricavano dal titolo o si scelgono a mano. */
export type EditionType = 'variant' | 'deluxe' | 'limited';

export interface ComicItem {
  id: string;
  title: string;
  author: string;
  volume: number;
  totalVolumes: number | null;
  isSingleVolume: boolean;
  editionType: EditionType | null;
  /** Vuota quando la copertina non c'è: la carta ne disegna una con `coverHue` */
  coverUrl: string;
  coverHue?: number;
}

export type ComicKind = 'manga' | 'comic';

/** Categoria dei manga o genere dei fumetti, tema narrativo, formato, stato: i valori sono gli id usati in `DISCOVER_FILTER_OPTIONS` */
export interface CatalogComic extends ComicItem {
  kind: ComicKind;
  categories: readonly string[];
  themes: readonly string[];
  format: string;
  year: number;
  status: string;
  adult: boolean;
}
