import { EditionType } from '../../models/comic.model';

/** Due soli stili: edizione limitata in viola (primary), deluxe e varianti neutre (secondary). */
export function editionSeverity(type: EditionType | null): 'primary' | 'secondary' {
  return type === 'limited' ? 'primary' : 'secondary';
}
