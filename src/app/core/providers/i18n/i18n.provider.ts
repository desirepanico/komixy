import {
  EnvironmentProviders,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { lastValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from '@shared/services/transloco-http-loader/transloco-http-loader.service';

export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTransloco({
      config: {
        availableLangs: ['it'],
        reRenderOnLangChange: false,
        fallbackLang: 'it',
        defaultLang: 'it',
        prodMode: !isDevMode(),
        scopes: { autoPrefixKeys: false }, // niente prefissi di lingua nelle chiavi
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const translateService = inject(TranslocoService);
      const lang = translateService.getDefaultLang();
      translateService.setActiveLang(lang);
      return lastValueFrom(translateService.load(lang));
    }),
  ]);
}
