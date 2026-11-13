import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { baseUrlInterceptor } from '../../interceptors/base-url/base-url.interceptor';
import { bearerTokenInterceptor } from '../../interceptors/bearer-token/bearer-token.interceptor';
import { guestIdInterceptor } from '../../interceptors/guest-id/guest-id.interceptor';
import { timezoneInterceptor } from '../../interceptors/timezone/timezone.interceptor';
import { tokenExpiredInterceptor } from '../../interceptors/token-expired/token-expired.interceptor';

/**
 * `HttpClient` con gli interceptor, nell'ordine in cui si applicano: prima l'indirizzo completo, che segna le
 * richieste del backend (`IS_API_REQUEST`), poi fuso, token (iscritto) o identificativo (ospite); l'ultimo guarda gli errori che tornano.
 */
export function provideHttp(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        timezoneInterceptor,
        bearerTokenInterceptor,
        guestIdInterceptor,
        tokenExpiredInterceptor,
      ]),
    ),
  ]);
}
