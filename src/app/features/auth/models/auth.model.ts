import { UserRole } from '@shared/models/user-role.model';

export interface LoggedUser {
  id: string;
  email: string;
  userRole: UserRole;
}

/** Risultato di `POST /auth/login` (il `result` di `ApiResponse`): l'utente e il token di accesso */
export interface LoginResponse extends LoggedUser {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type SocialProvider = 'google' | 'apple';
