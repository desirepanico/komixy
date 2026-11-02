import { TagSeverity } from '../../../shared/components/tag/tag';

export type EditionType = 'variant' | 'deluxe' | 'limited' | 'collector' | 'exclusive';

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

/** Due soli stili: edizioni speciali/rare in viola (primary), standard e varianti neutre (secondary). */
export function editionSeverity(type: EditionType | null): TagSeverity {
  switch (type) {
    case 'collector':
    case 'limited':
    case 'exclusive':
      return 'primary';
    default:
      return 'secondary';
  }
}
