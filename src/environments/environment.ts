import { Environment } from '@shared/models/environment.model';

/** Produzione: è il file di base, gli altri lo sostituiscono in `angular.json` (`fileReplacements`) */
export const environment: Environment = {
  production: true,
  apiUrl: 'https://INSERIRE_URL_API_PRODUZIONE',
};
