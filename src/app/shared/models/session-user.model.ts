import { UserRole } from './user-role.model';

export interface SessionUser {
  id: string;
  role: UserRole;
}
