import { UserRole } from '../../features/auth/models/auth.model';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  roles: UserRole[];
}
export interface NavGroup {
  title: string;
  items: NavItem[];
  expandable: boolean;
}
