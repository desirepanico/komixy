import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { providePrimeNG } from 'primeng/config';
import { lastValueFrom } from 'rxjs';
import { KomixyPreset } from './app.primeng-preset';
import { routes } from './app.routes';
// carica le traduzioni prima dell'avvio dell'app
function initializeApp(): Promise<any> {
  const translateService = inject(TranslocoService);
  const defaultLang = translateService.getDefaultLang();
  translateService.setActiveLang(defaultLang);
  translateService.getTranslation(defaultLang);

  return lastValueFrom(translateService.load(defaultLang));
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    //PRIMENG CONFIG
    providePrimeNG({
      theme: {
        preset: KomixyPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    //TRADUZIONI
    provideTransloco({
      config: {
        availableLangs: ['it'],
        reRenderOnLangChange: false,
        fallbackLang: 'it', //lingua di riserva quando una chiave non esiste nella lingua attiva
        defaultLang: 'it', //lingua di default
        prodMode: !isDevMode(), // warning in sviluppo, nessuno in produzione
        scopes: { autoPrefixKeys: false }, // aggiungi questa opzione per non usare prefissi di lingua
      },
      // loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(initializeApp),
  ],
};
