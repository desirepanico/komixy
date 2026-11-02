import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { lastValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { provideNavDirection } from './core/navigation/nav-direction';
import { TranslocoHttpLoader } from './core/interceptors/transloco-loader.interceptor';
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
    provideRouter(routes, withViewTransitions()),
    provideNavDirection(),
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
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(initializeApp),
  ],
};
