import { Provider } from '@angular/core';
import { provideTransloco, Translation, TRANSLOCO_LOADER } from '@jsverse/transloco';
import { of } from 'rxjs';

/** Traduzioni vuote: nei test i testi che si leggono sono le chiavi (`'menu.main'`). */
export function provideTranslocoTesting(
  langs: Record<string, Translation> = { it: {} },
): Provider[] {
  return [
    provideTransloco({
      config: {
        availableLangs: Object.keys(langs),
        defaultLang: 'it',
        prodMode: true,
        missingHandler: { logMissingKey: false },
      },
    }) as Provider,
    {
      provide: TRANSLOCO_LOADER,
      useValue: { getTranslation: (lang: string) => of(langs[lang] ?? {}) },
    },
  ];
}

/** Provider caricati in ogni TestBed (vedi `providersFile` in `angular.json`). */
export default provideTranslocoTesting();
