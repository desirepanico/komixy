import { MAIN_PAGES } from '@shared/constants/navigation.const';

/** Posizione di un URL tra le pagine principali, -1 se non è una di esse. */
export function mainPageIndex(url: string): number {
  const path = url.split(/[?#]/)[0].replace(/^\/+/, '');
  return MAIN_PAGES.findIndex((page) => page.route === path);
}
