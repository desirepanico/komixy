import { UserRole } from '../models/user-role.model';
import { AppRoutes } from '../models/app-routes.model';
import { NavItem } from '../models/nav-item.model';

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

/**
 * Elementi su cui un gesto non deve essere considerato uno swipe di pagina.
 * Link e bottoni non sono qui: le card sono link e coprono quasi tutta la pagina.
 */
export const IGNORED_TARGETS = [
  'input',
  'textarea',
  'select',
  '[role="slider"]',
  '[data-no-swipe]',
].join(',');

/** Parametro dell'indirizzo che dice quale vista della classifica mostrare (`?view=cards`; l'elenco è il default e non compare) */
export const RANKING_VIEW_QUERY_PARAM = 'view';
