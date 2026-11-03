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

/** Due soli stili: edizione limitata in viola (primary), deluxe e varianti neutre (secondary). */
export function editionSeverity(type: EditionType | null): 'primary' | 'secondary' {
  switch (type) {
    case 'limited':
      return 'primary';
    default:
      return 'secondary';
  }
}
