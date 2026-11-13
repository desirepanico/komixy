import { Environment } from '@shared/models/environment.model';

/** Locale: il backend avviato sulla propria macchina (`npm start`, `npm run start:local`) */
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
