import { stringify } from 'qs';

/** Indirizzo di una chiamata API: i filtri, se ci sono, diventano la query string (`?a=1&b=2`) */
export function apiUrl(path: string, filters?: object): string {
  return `${path}${filters ? stringify(filters, { addQueryPrefix: true }) : ''}`;
}
