/** Solo edizioni che esistono davvero sul mercato (variant, deluxe, limited): nessuna fonte di dati le dà come campo, si ricavano dal titolo o si scelgono a mano. */
export type EditionType = 'variant' | 'deluxe' | 'limited';

// Modello che rappresenta un fumetto nella pagina Discovery
export interface ComicItem {
  id: string;
  title: string;
  author: string;
  volume: number;
  totalVolumes: number | null;
  isSingleVolume: boolean;
  editionType: EditionType | null;
  coverUrl: string;
}
