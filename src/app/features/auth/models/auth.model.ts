import { UserRole } from '@shared/models/user-role.model';

export interface LoggedUser {
  id: string;
  email: string;
  userRole: UserRole;
}

/** Risultato di `POST /auth/login` (il `result` di `ApiResponse`) */
export type LoginResponse = LoggedUser;

export interface LoginRequest {
  email: string;
  password: string;
}

export type SocialProvider = 'google' | 'apple';
