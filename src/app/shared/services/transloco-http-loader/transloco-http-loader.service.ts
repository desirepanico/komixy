import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

@Service()
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly _http = inject(HttpClient);

  public getTranslation(lang: string) {
    return this._http.get<Translation>(`./i18n/${lang}.json`);
  }
}
