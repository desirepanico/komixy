import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
      // Gli screen reader scelgono la voce dall'attributo lang: deve seguire la lingua dell'app
      translateService.langChanges$
        .pipe(takeUntilDestroyed(inject(DestroyRef)))
        .subscribe((active) => (document.documentElement.lang = active));
      return lastValueFrom(translateService.load(lang));
    }),
  ]);
}
