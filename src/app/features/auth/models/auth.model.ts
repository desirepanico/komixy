export enum UserRole {
  Admin,
  User,
}
export interface LoggedUser {
  id: string;
  email: string;
  userRole: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
