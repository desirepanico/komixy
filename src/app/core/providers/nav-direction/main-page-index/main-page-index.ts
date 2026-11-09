import { MAIN_PAGES } from '@shared/constants/navigation.const';

export function mainPageIndex(url: string): number {
  const path = url.split(/[?#]/)[0].replace(/^\/+/, '');
  return MAIN_PAGES.findIndex((page) => page.route === path);
}
