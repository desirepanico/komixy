import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
/** Loader che carica le traduzioni dell'app in base alla lingua selezionata. */
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient); //per leggere i file JSON

  getTranslation(lang: string) {
    return this.http.get<Translation>(`./i18n/${lang}.json?cb=${new Date().getTime()}`);
  }
}
