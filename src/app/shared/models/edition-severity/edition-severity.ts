import { EditionType } from '../comic.model';

/** Due soli stili: edizione limitata in viola (primary), deluxe e varianti neutre (secondary). */
export function editionSeverity(type: EditionType | null): 'primary' | 'secondary' {
  switch (type) {
    case 'limited':
      return 'primary';
    default:
      return 'secondary';
  }
}
