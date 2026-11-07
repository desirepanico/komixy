import { UserRole } from './user-role.model';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  roles: readonly UserRole[];
}
export interface NavGroup {
  title: string;
  items: NavItem[];
  expandable: boolean;
}
