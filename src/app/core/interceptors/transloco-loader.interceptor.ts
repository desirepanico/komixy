import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { PrimeNG } from 'primeng/config';
import { combineLatestWith, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
/** Loader che carica le traduzioni dell'app e di PrimeNG in base alla lingua selezionata. */
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient); //per leggere i file JSON
  private primeNGConfig = inject(PrimeNG);

  getTranslation(lang: string) {
    const translocoUrl = `./i18n/${lang}.json?cb=${new Date().getTime()}`;
    const primeNgUrl = `./i18n/primeng/${lang}.json?cb=${new Date().getTime()}`;

    return this.http.get<Translation>(primeNgUrl).pipe(
      tap((response) => this.primeNGConfig.setTranslation(response[lang])), //impostare le traduzioni di PrimeNG
      combineLatestWith(this.http.get<Translation>(translocoUrl)), // Contemporaneamente carica le traduzioni di Transloco
      map(([primeNG, transloco]) => transloco), // Restituisce solo le traduzioni di Transloco
    );
  }
}
