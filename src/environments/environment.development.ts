import { Environment } from '@shared/models/environment.model';

/** Dev: il backend di sviluppo pubblicato (`npm run start:dev`, `npm run build:dev`) */
export const environment: Environment = {
  production: false,
  apiUrl: 'https://INSERIRE_URL_API_DEV',
};
