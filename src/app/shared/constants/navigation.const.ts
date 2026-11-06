import { UserRole } from '../models/user-role.model';
import { NavItem } from '../models/nav-item.model';

/** Percorsi delle rotte dell'app (un solo posto, usato da rotte, guard e template). */
export enum AppRoutes {
  Releases = 'releases',
  Scan = 'scan',
  Library = 'library',
  Profile = 'profile',
  Discover = 'discover',
  Login = 'login',
  Comic = 'comic',
  Ranking = 'ranking',
  NotFound = 'not-found',
}

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
    label: 'common.releases',
    route: AppRoutes.Releases,
    roles: [UserRole.User, UserRole.Admin],
  },
  {
    icon: 'matCollectionsBookmarkOutline',
    label: 'common.library',
    route: AppRoutes.Library,
    roles: [UserRole.User, UserRole.Admin],
  },
  {
    icon: 'matPersonOutline',
    label: 'common.profile',
    route: AppRoutes.Profile,
    roles: [UserRole.User, UserRole.Admin],
  },
];
