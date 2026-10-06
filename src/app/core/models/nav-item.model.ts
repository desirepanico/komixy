export interface NavItem {
  icon: string;
  label: string;
  route: string;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}
