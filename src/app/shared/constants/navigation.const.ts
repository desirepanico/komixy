import { UserRole } from '../models/user-role.model';
import { AppRoutes } from '../models/app-routes.model';
import { NavItem } from '../models/nav-item.model';

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

/** Link e bottoni non sono qui: le card sono link e coprono quasi tutta la pagina. */
export const IGNORED_TARGETS = [
  'input',
  'textarea',
  'select',
  '[role="slider"]',
  '[data-no-swipe]',
].join(',');
