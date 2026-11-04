import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideI18n } from '@core/i18n/provide-i18n';
import { provideNavDirection } from '@core/navigation/nav-direction';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      // Ogni pagina nuova parte dall'alto; tornando indietro si ritrova la posizione
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideNavDirection(),
    provideI18n(),
  ],
};
