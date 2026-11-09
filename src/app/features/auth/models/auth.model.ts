import { UserRole } from '@shared/models/user-role.model';

export interface LoggedUser {
  id: string;
  email: string;
  userRole: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type SocialProvider = 'google' | 'apple';
