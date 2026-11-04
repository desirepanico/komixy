import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideCore } from '@core/providers/core.provider';
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
    provideCore(),
  ],
};
