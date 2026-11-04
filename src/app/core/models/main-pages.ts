import { AppRoutes } from '@shared/constants/app-routes';
import { UserRole } from '@features/auth/models/auth.model';
import { NavItem } from './nav-item.model';

/**
 * Pagine principali nell'ordine della navigazione mobile.
 * Usata dalla nav in basso, dallo swipe e dalla direzione delle transizioni.
 */
export const MAIN_PAGES: readonly NavItem[] = [
  {
    icon: 'matExploreOutline',
    label: 'menu.discover',
    route: AppRoutes.Discover,
    roles: [UserRole.User, UserRole.Admin],
  },
  {
    icon: 'matCalendarTodayOutline',
    label: 'menu.releases',
    route: AppRoutes.Releases,
    roles: [UserRole.User, UserRole.Admin],
  },
  {
    icon: 'matCollectionsBookmarkOutline',
    label: 'menu.library',
    route: AppRoutes.Library,
    roles: [UserRole.User, UserRole.Admin],
  },
  {
    icon: 'matPersonOutline',
    label: 'menu.profile',
    route: AppRoutes.Profile,
    roles: [UserRole.User, UserRole.Admin],
  },
];

/** Posizione di un URL tra le pagine principali, -1 se non è una di esse. */
export function mainPageIndex(url: string): number {
  const path = url.split(/[?#]/)[0].replace(/^\/+/, '');
  return MAIN_PAGES.findIndex((page) => page.route === path);
}
