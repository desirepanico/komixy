import { environment } from '@env/environment';
import { joinUrl } from '../join-url/join-url';

/** Una richiesta è del backend se l'indirizzo (già completato dal base-url interceptor) parte dal suo: così token e fuso non arrivano a terzi */
export function isApiRequest(url: string): boolean {
  return url.startsWith(joinUrl(environment.apiUrl, ''));
}
