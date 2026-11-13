import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { baseUrlInterceptor } from '../../interceptors/base-url/base-url.interceptor';
import { bearerTokenInterceptor } from '../../interceptors/bearer-token/bearer-token.interceptor';
import { timezoneInterceptor } from '../../interceptors/timezone/timezone.interceptor';
import { tokenExpiredInterceptor } from '../../interceptors/token-expired/token-expired.interceptor';

/**
 * `HttpClient` con gli interceptor, nell'ordine in cui si applicano: prima l'indirizzo completo
 * (gli altri guardano se la richiesta è del backend), poi fuso e token; l'ultimo guarda gli errori che tornano.
 */
export function provideHttp(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        timezoneInterceptor,
        bearerTokenInterceptor,
        tokenExpiredInterceptor,
      ]),
    ),
  ]);
}
