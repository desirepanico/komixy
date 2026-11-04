import {
  EnvironmentProviders,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { lastValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from './transloco-loader';

/** Configura Transloco e carica le traduzioni prima dell'avvio dell'app. */
export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTransloco({
      config: {
        availableLangs: ['it'],
        reRenderOnLangChange: false,
        fallbackLang: 'it', // lingua di riserva quando una chiave non esiste nella lingua attiva
        defaultLang: 'it',
        prodMode: !isDevMode(), // warning in sviluppo, nessuno in produzione
        scopes: { autoPrefixKeys: false }, // niente prefissi di lingua nelle chiavi
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const transloco = inject(TranslocoService);
      const lang = transloco.getDefaultLang();
      transloco.setActiveLang(lang);
      return lastValueFrom(transloco.load(lang));
    }),
  ]);
}
