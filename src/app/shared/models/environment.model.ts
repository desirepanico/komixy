/** Le impostazioni che cambiano tra locale, dev e produzione (file in `src/environments/`) */
export interface Environment {
  production: boolean;
  /** Indirizzo del backend, senza barra finale: gli indirizzi relativi delle chiamate (`/auth/login`) partono da qui */
  apiUrl: string;
}
