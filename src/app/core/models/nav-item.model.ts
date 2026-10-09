import { UserRole } from '../../features/auth/models/user.model';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  roles: UserRole[];
  children?: NavItem[];
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}
